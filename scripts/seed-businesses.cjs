#!/usr/bin/env node
/**
 * Seed the SpeedwayHub businesses directory by scraping all track websites
 * and using OpenAI gpt-4o-mini to extract sponsor/supplier business mentions.
 *
 * Run locally:   OPENAI_API_KEY=sk-... node scripts/seed-businesses.cjs
 * Run cron-style:                       node scripts/seed-businesses.cjs --quiet
 *
 * Dedupes by slug against existing businesses.json. Appends new entries with
 * addedAt = today. Prints summary. Exits 0 on success, 1 on hard error.
 *
 * Designed to be safely re-runnable. Daily cron will keep the directory growing.
 */

const fs = require('fs')
const path = require('path')

const TRACKS_FILE = path.join(__dirname, '..', 'src', 'data', 'tracks.json')
const BUSINESSES_FILE = path.join(__dirname, '..', 'src', 'data', 'businesses.json')

const args = new Set(process.argv.slice(2))
const QUIET = args.has('--quiet')
const DRY_RUN = args.has('--dry-run')
const ONLY_TRACK = process.argv.find((a) => a.startsWith('--track='))?.split('=')[1]

const log = (...a) => { if (!QUIET) console.log(...a) }
const err = (...a) => console.error(...a)

const SUPPLIER_CATEGORY_HINTS = {
  'engine-builders': ['engine', 'motor builder', 'machinist', 'machinists'],
  fabricators: ['fabric', 'sheetmetal', 'metalwork', 'welding', 'engineering'],
  'fuel-and-lubes': ['fuel', 'oil', 'lube', 'petroleum'],
  transport: ['transport', 'freight', 'logistics', 'carrier'],
  'race-wear': ['race wear', 'race-wear', 'racewear', 'suits', 'helmets'],
  'decals-signage': ['decal', 'sign', 'signage', 'graphics', 'wraps'],
  trailers: ['trailer'],
  photographers: ['photo', 'photography', 'photographer'],
  'panel-and-paint': ['panel', 'paint', 'panelbeater', 'body shop'],
  parts: ['parts', 'spares', 'partsworld'],
  'tyres-and-wheels': ['tyre', 'tire', 'wheel'],
  'electronics-and-comms': ['electric', 'electrical', 'electronic', 'comms', 'telecom'],
  'safety-gear': ['safety', 'helmet', 'fire suit'],
}

const SPONSOR_CATEGORY_HINTS = {
  'trades-and-construction': ['build', 'construction', 'concrete', 'roofing', 'joinery', 'plumb', 'painter', 'paint', 'cranes', 'metal', 'fab', 'sheetmetal', 'engineer', 'electrical', 'plaster'],
  'transport-and-logistics': ['transport', 'freight', 'logistics', 'carrier', 'haulage', 'trucking'],
  hospitality: ['pizza', 'restaurant', 'cafe', 'pub', 'tavern', 'hotel', 'motel', 'accommodation', 'venue', 'arena', 'mcdonald', 'food', 'meat', 'butcher'],
  retail: ['retail', 'store', 'shop', 'meats', 'placemakers', 'addis', 'big barrel', 'dry clean'],
  'automotive-retail': ['auto', 'automotive', 'motors', 'motorcycles', 'parts', 'tyre', 'nissan', 'ford', 'toyota', 'holden', 'repco', 'spares'],
  'real-estate': ['real estate', 'realty', 'property', 'lj hooker', 'harcourts', 'bayleys'],
  'farming-and-rural': ['farm', 'rural', 'agri', 'transag', 'vineyard'],
  'professional-services': ['account', 'lawyer', 'legal', 'finance', 'mtf', 'insurance', 'consult', 'business', 'office'],
  'media-and-marketing': ['media', 'marketing', 'digital', 'creative', 'fm', 'radio', 'tv', 'rock', 'magazine', 'weekly', 'news', 'design', 'photo'],
  'fuel-and-energy': ['fuel', 'energy', 'gas', 'oil', 'lube', 'tank'],
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function classifySponsor(name, hint) {
  const n = (name + ' ' + (hint || '')).toLowerCase()
  const cats = []
  for (const [cat, kws] of Object.entries(SPONSOR_CATEGORY_HINTS)) {
    if (kws.some((k) => n.includes(k))) cats.push(cat)
  }
  return cats.length > 0 ? cats : ['other']
}

function classifySupplier(name, hint) {
  const n = (name + ' ' + (hint || '')).toLowerCase()
  const cats = []
  for (const [cat, kws] of Object.entries(SUPPLIER_CATEGORY_HINTS)) {
    if (kws.some((k) => n.includes(k))) cats.push(cat)
  }
  return cats
}

const SYSTEM_PROMPT = `You are extracting sponsor and supplier business mentions from a NZ speedway track website.

Return JSON with shape:
{
  "businesses": [
    {
      "name": "Business name (no marketing fluff)",
      "website": "https://... (only if explicitly linked in the page)",
      "category": "short category description, e.g. 'engine builder', 'fabricator', 'hospitality', 'automotive retail'",
      "town": "NZ town name if mentioned"
    }
  ]
}

Rules:
- ONLY real business names from the page. Do not invent.
- Skip the speedway track itself, Speedway NZ governing body, Sporty.co.nz platform, Sporty platform credits.
- Skip generic CMS / web platform credits.
- Skip individual people unless they ARE the business name (e.g. "Mike Murphy Auto Electrical").
- Maximum 50 businesses per response. Quality over quantity.
- If no businesses found, return {"businesses": []}.`

async function extractFromTrack(track) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')

  log(`  fetching ${track.website}`)
  let html
  try {
    const res = await fetch(track.website, {
      headers: { 'User-Agent': 'SpeedwayHub/1.0 (Directory Bot; +https://speedwayhub.nz)' },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) {
      log(`  ! HTTP ${res.status} from ${track.website}, skipping`)
      return []
    }
    html = await res.text()
  } catch (e) {
    log(`  ! fetch failed for ${track.website}: ${e.message}`)
    return []
  }

  const truncated = html.slice(0, 40000)

  log(`  asking OpenAI to extract businesses...`)
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Track: ${track.name} (${track.city}, ${track.region})\n\nHTML:\n${truncated}` },
      ],
    }),
  })

  if (!res.ok) {
    const t = await res.text()
    log(`  ! OpenAI ${res.status}: ${t.slice(0, 200)}`)
    return []
  }
  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) return []
  try {
    const parsed = JSON.parse(content)
    return Array.isArray(parsed.businesses) ? parsed.businesses : []
  } catch (e) {
    log(`  ! JSON parse failed: ${e.message}`)
    return []
  }
}

function normaliseBusiness(raw, trackSlug, nextId) {
  const name = (raw.name || '').trim()
  if (!name || name.length < 2 || name.length > 80) return null

  const slug = slugify(name)
  if (!slug) return null

  const sponsorCats = classifySponsor(name, raw.category)
  const supplierCats = classifySupplier(name, raw.category)
  const roles = supplierCats.length > 0 ? ['sponsor', 'supplier'] : ['sponsor']

  const town = raw.town && !/^new zealand$/i.test(raw.town) ? raw.town : undefined

  return {
    id: nextId,
    slug,
    name,
    roles,
    sponsorCategories: sponsorCats,
    ...(supplierCats.length > 0 && { supplierCategories: supplierCats }),
    ...(town && { town }),
    ...(raw.website && /^https?:\/\//.test(raw.website) && { website: raw.website }),
    activeAtTracks: [trackSlug],
    claimed: false,
    source: `auto-seed-${new Date().toISOString().slice(0, 10)}`,
    addedAt: new Date().toISOString().slice(0, 10),
  }
}

async function main() {
  const tracks = JSON.parse(fs.readFileSync(TRACKS_FILE, 'utf-8'))
  const existing = JSON.parse(fs.readFileSync(BUSINESSES_FILE, 'utf-8'))

  log(`Loaded ${tracks.length} tracks, ${existing.length} existing businesses.`)

  const trackList = tracks.filter((t) => {
    if (!t.website) return false
    if (ONLY_TRACK && t.slug !== ONLY_TRACK) return false
    return true
  })

  log(`Will scrape ${trackList.length} tracks.${DRY_RUN ? ' (dry run, no writes)' : ''}`)

  const bySlug = new Map(existing.map((b) => [b.slug, b]))
  let nextId = Math.max(...existing.map((b) => b.id || 0), 0) + 1
  let added = 0
  let updated = 0
  let scraped = 0

  for (const track of trackList) {
    log(`\n[${track.name}] (${track.slug})`)
    let raw
    try {
      raw = await extractFromTrack(track)
    } catch (e) {
      err(`  ! hard error for ${track.slug}: ${e.message}`)
      continue
    }
    scraped++
    log(`  extracted ${raw.length} candidate businesses`)

    for (const r of raw) {
      const candidate = normaliseBusiness(r, track.slug, nextId)
      if (!candidate) continue

      if (bySlug.has(candidate.slug)) {
        const exist = bySlug.get(candidate.slug)
        const tracks = new Set(exist.activeAtTracks || [])
        const before = tracks.size
        tracks.add(track.slug)
        if (tracks.size > before) {
          exist.activeAtTracks = Array.from(tracks)
          updated++
        }
      } else {
        bySlug.set(candidate.slug, candidate)
        nextId++
        added++
      }
    }
  }

  log(`\nDone. Scraped ${scraped} tracks. Added ${added} new businesses. Updated ${updated} existing.`)
  log(`Total now: ${bySlug.size}`)

  if (DRY_RUN) {
    log('Dry run, not writing.')
    return
  }

  if (added > 0 || updated > 0) {
    const out = Array.from(bySlug.values()).sort((a, b) => a.id - b.id)
    fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(out, null, 2) + '\n')
    log(`Wrote ${BUSINESSES_FILE}`)
  } else {
    log('No changes, nothing written.')
  }
}

main().catch((e) => {
  err('FATAL:', e.stack || e.message)
  process.exit(1)
})
