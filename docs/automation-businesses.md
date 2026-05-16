# SpeedwayHub Business Directory Auto-Seed

## What it does
`scripts/seed-businesses.cjs` scrapes every NZ speedway track website with a known URL, asks OpenAI gpt-4o-mini to extract sponsor and supplier business mentions, normalises + dedupes against the existing `src/data/businesses.json`, and appends new entries with `addedAt` set to today. The `New` badge on `BusinessCard` lights up for entries added in the last 7 days.

This is the volume engine. The 86 stubs that shipped in the first commit came from a one-time WebFetch pass. From here forward, this script is the recurring source.

## Run locally
```bash
cd "/d/Elite Spec/Deployed Sites/speedwayhub/speedwayhub-md"
OPENAI_API_KEY=sk-... node scripts/seed-businesses.cjs
```

Flags:
- `--quiet` — suppress per-track logging (use in cron)
- `--dry-run` — extract + classify but do not write businesses.json
- `--track=huntly-speedway` — restrict to a single track slug

Cost per full sweep: ~$0.03 OpenAI (22 tracks × ~15k tokens × gpt-4o-mini input rate).

## After a seed run
```bash
npm run build:spa
node scripts/generate-sitemap.cjs
cp public/sitemap.xml dist/sitemap.xml
node scripts/prerender.cjs              # ~10 min for 280+ routes
# tar + scp dist/ to /srv/www/speedwayhub/speedwayhub-md/dist/ on 49.12.33.255
```

## Daily cron (deploy on secondary server, not local)

Suggested `/etc/cron.d/speedwayhub-seed` on 49.12.33.255:
```
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
OPENAI_API_KEY=sk-proj-...   # paste real key

# Daily at 04:00 UTC (~16:00 NZ)
0 4 * * * root cd /srv/www/speedwayhub/speedwayhub-md && node scripts/seed-businesses.cjs --quiet >> /var/log/speedwayhub-seed.log 2>&1 && npm run build:spa >> /var/log/speedwayhub-seed.log 2>&1 && node scripts/generate-sitemap.cjs >> /var/log/speedwayhub-seed.log 2>&1 && cp public/sitemap.xml dist/sitemap.xml && node scripts/prerender.cjs >> /var/log/speedwayhub-seed.log 2>&1
```

To actually install: tested manually first, deploy via SSH + cron file write. Discord alert wrap-up is the Phase 1 plan's `lib/discord-alert.cjs` once that lands.

## Why this matters
Directory volume = the reason people return daily. Auto-seed runs nightly, picks up new sponsor mentions as tracks update their pages mid-season, ages out nothing. The `New` badge surfaces fresh additions on every visit. Goal is ~1-5 new entries per day on average across the season.

## Manual additions
The `/submit` page exists for businesses that want to add themselves. Submissions go to elitespec2019@gmail.com and need manual review + JSON append. Future polish: auto-ingest verified submissions via API endpoint.

## Diagnosing dedupe collisions
Dedupe is by slug. Slug = lowercase + dashed business name (capped 60 chars). Edge cases:
- "MTF Finance Blenheim" → `mtf-finance-blenheim`
- "MTF Finance" appearing somewhere else → `mtf-finance` → would create a separate stub (acceptable; manual merge later)
- "The Rock" / "The Rock 95.4" / "The Rock - Canterbury" → currently separate stubs, can be merged manually

## Future enhancements (Phase 4.5+)
- Scrape track Facebook pages for sponsor logos in pinned posts + headers
- Scrape driver profile pages for their personal sponsor stacks
- Cross-reference with the Companies Register for verified NZ trading names
- Auto-fetch logo from each business's website + cache locally
- Discord alert wrapper around the cron job (success: N added, failure: error)
