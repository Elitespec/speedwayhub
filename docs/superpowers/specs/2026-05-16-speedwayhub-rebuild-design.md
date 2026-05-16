# SpeedwayHub.nz Rebuild + Automation — Design

**Date:** 2026-05-16
**Status:** Design lock, awaiting user spec review before writing-plans
**Author:** Rhys + Claude (co-founder mode)
**Project type:** Background side-project, aligned to $5k/m goal via Forge funnel

---

## 1. Strategy lock

### The political peace treaty (non-negotiable)

NZ speedway is politically tight. Tracks fight back hard on anything they read as competing for ticket revenue or sponsor money. Drivers + teams already pay through the nose to race. SpeedwayHub must be a complement, not a competitor.

| Audience | Pays? | Why |
|---|---|---|
| Fans | Never | Free always |
| Drivers | Never | Already pay an arm + leg to race |
| Teams | Never | Same |
| Tracks | Never | Get free pages + free embed widget. We send traffic to their site, socials, gate. Never compete. |
| **Suppliers** | **$29/mo** | Sell to the sport (engine builders, fabs, fuel, transport, race-wear, decals, trailers, photographers, panel + paint, parts) |
| **Sponsors** | **$29/mo** | Advertise via the sport (any business sponsoring a driver, team, event) |

### Track-friendly mechanics
- Track pages never sell tickets. Primary CTA is "Buy tickets at [track-official-site]" pointing OUT.
- Free embeddable "this weekend at our track" widget tracks can drop on their own site. Free for them, backlinks for us.
- No sponsor competition with tracks. Our sponsor listings are about *who they sponsor* (drivers/teams) not *what races they sponsor* (track events).

### Forge funnel
Every paying supplier/sponsor gets a welcome-email upsell: "want a real website too? here's a demo we built you, $29/mo to claim." Reuses proven Forge claim flow (Junk Masters validated 2026-05-12). SpeedwayHub becomes a vertical-niche prospecting engine for the primary $5k/m goal.

### Revenue projection (rough)
- TAM: ~1500-2500 NZ businesses across suppliers + sponsors
- Conversion target: 3-7% to paid SpeedwayHub listing = 45-175 paying listings = $1305-5075/mo
- Forge upsell on top: 10-20% of paid listings also take Forge site = 5-35 additional Forge subs = $145-1015/mo
- **Combined ceiling: $1450-6090/mo, fully aligned with $5k/m anchor**

---

## 2. Site IA

### Keep (already exist, content refresh only)
`/tracks`, `/track/[slug]`, `/drivers`, `/driver/[slug]`, `/teams`, `/team/[slug]`, `/classes`, `/faq`, `/about`

### Upgrade (existing, automated content + UX overhaul)
- `/` (home): hero + this-weekend events + last-night results + featured supplier + featured sponsor + latest news
- `/events`, `/event/[slug]`: auto-fed by n8n events scraper (every 6h in-season, weekly off-season)
- `/calendar`: region filter, auto-fed
- `/results`: auto-fed by n8n results scraper (nightly Sat/Sun in-season)
- `/news`, `/news/[slug]`: AI-generated race reports auto-published after results scrape (OpenAI key already in hand)
- `/live-timing`: existing
- `/submit`: single intake for driver / event / supplier / sponsor / result submissions

### New
- `/suppliers` (paid directory landing): list by category
- `/supplier/[category]`: engine builders, fabricators, fuel + lubes, transport, race-wear, decals, trailers, photographers, panel + paint, parts
- `/supplier/[slug]`: individual supplier page (free stub or claimed full profile)
- `/sponsors`: paid sponsor directory, by who-they-sponsor (drivers / teams / events) AND by business type
- `/sponsor/[slug]`: individual sponsor page with cross-links to sponsored drivers/teams
- `/newsletter`: weekly digest signup, one supplier/sponsor slot per send
- `/widget`: documentation + embed code for tracks to add the free "this weekend" widget to their site

### Cross-linking (the moat)
- Driver page shows their current sponsors (with logo + link to sponsor's SpeedwayHub page).
- Sponsor page shows the drivers/teams they sponsor (with link to driver SpeedwayHub page).
- Supplier page shows track + driver testimonials (where available).
- Track page shows local suppliers/sponsors active at that venue.

---

## 3. Visual direction

### Aesthetic targets
- NZ speedway is floodlit, working-class, family + hardcore mixed audience, dirt + sparks + motion. Honour that, do not impose corporate-sports-website or Awwwards-editorial onto it.
- Per match-brand-not-Awwwards rule: the design must read as authentic to the sport. Locals notice fake.

### Concrete choices
- Palette: deep blacks, sodium-orange floodlight glow, hi-vis race-stripe accent (yellow or red), white text
- Typography: aggressive sans for headings (racing-decal feel), readable sans for body
- Hero: full-bleed dirt-track video (webm + mp4 + poster pattern per video-as-hero rule) where available, hi-res still fallback
- Information density above the fold (race fans want data, not whitespace)
- Mobile-first non-negotiable (fans pull phones at the track to check times, results, drivers)
- Custom SVG iconography (no emoji-as-icon per the hard rule)
- Motion: subtle parallax + dirt-particle textures, not gratuitous

### What we are NOT doing
- Generic Tailwind-bootstrap look (the current site's weakness)
- Affected art-direction or editorial-magazine layouts (sport's audience won't relate)
- Heavy hero animation that hurts mobile FCP

---

## 4. Tech stack

**Decision: stay on React 18 + Vite + Tailwind + Puppeteer prerender.**

Reasons:
- Already deployed, 184 prerendered pages, SEO already working
- No framework thrash burns rebuild time
- speedwayhub-api.js is up on PM2 port 3848, 22+ days uptime
- Build pipeline (`npm run build` → `vite build && node scripts/prerender.cjs`) works

Rejected:
- speedwayhub-astro folder (older pivot attempt, not deployed)
- Next.js (no SSR needs justify the rewrite cost)

---

## 5. Automation pipeline

### Components
1. **n8n host:** existing instance at `46.225.13.97:5678` (verify alive in Phase 1)
2. **Workflows to import + activate** (JSON exists in repo, never imported):
   - `scrape-speedway-events.json` — every 6h in-season, weekly off-season. Sources: speedway.co.nz + individual track sites.
   - `scrape-results.json` — Sunday morning. Source: speedwaylive.co.nz.
   - `facebook-monitor.json` — every 2h in-season. Source: track FB pages via Graph API.
   - `auto-news-generator.json` — triggered post-results. Uses OpenAI key (already in hand). Output: markdown news articles.
3. **Rebuild webhook:** new endpoint on speedwayhub-api.js (`POST /rebuild`) that:
   - Receives payload from n8n
   - Writes to `src/data/*.json` and/or `src/news/*.md`
   - Triggers `npm run build`
   - Rsyncs `dist/` to `/srv/www/speedwayhub/speedwayhub-md/dist` on 49.12.33.255
   - Logs to PM2 + posts status to Discord webhook on failure

### Cadence
- **In-season (Oct-Apr):** events 6h, results nightly Sun morning, FB monitor 2h, news auto-after-results
- **Off-season (May-Sep):** events weekly, results disabled, FB monitor weekly, news monthly roundup

### Failure modes + handling
- Track site offline: log warning, skip, alert if >3 consecutive failures
- Scrape format change: schema validation in webhook, reject malformed payload, alert Discord
- Build failure: keep previous dist, alert Discord, do not deploy broken build
- AI news gen failure: log + skip, next cycle retries

---

## 6. Supplier + sponsor directory mechanic

### Auto-seed (Phase 4)
1. Scrape NZ speedway sponsor logos from track sites + track Facebook page headers / posts
2. OCR + dedupe to extract business names
3. Geocode + categorise (manual review + AI categorisation)
4. Build stub listings: name, category, town, "unclaimed" badge

### Claim flow (reuse Forge claim flow proven by Junk Masters)
1. Cold email: "We listed [business] in NZ Speedway Directory, claim it free / paid upgrade"
2. Free verification: business owner verifies via email link, gets free basic listing
3. $29/mo paid upgrade: full profile, photos, products, contact form, link out, featured slots
4. Stripe checkout reuses existing claim webhook flow
5. Welcome email layers Forge upsell: "want a real website too?"

### Listing tiers

| Tier | Price | What they get |
|---|---|---|
| Stub | Free, no claim | Name + category + town only. "Unclaimed" badge. |
| Verified Free | Free, claimed | Logo + contact + 1-line description + link out |
| Paid | $29/mo | Full profile, photos, products, multiple categories, featured slot eligibility, cross-link from sponsored drivers/teams |

### Free verification is intentional
- Lowers friction to claim
- Once they're in the system, upsell is in-context, not cold
- Verified-free listings are the warm-pipeline for Paid + Forge

---

## 7. Phased delivery

Background pacing. No phase blocks Forge work. Each phase is independent + shippable.

| Phase | Output | Effort | Blocks next? |
|---|---|---|---|
| **0** | Design doc committed (this) | 0.5h | Yes |
| **1** | Automation skeleton: n8n imports + rebuild webhook + cron. Site self-updates. | 6-8h | No, can ship while Phase 2 in flight |
| **2** | Visual rebuild: home + track + driver + team page redesigns. Mobile-first. | 8-12h | No |
| **3** | Suppliers + sponsors directory: pages, claim flow, Stripe wired | 6-8h | No |
| **4** | Auto-seed: scrape sponsor logos, build stub listings, fire cold outreach | 4-6h | Depends on Phase 3 |
| **5** | Forge upsell automation in claim welcome email | 2-3h | Depends on Phase 3 |
| **Total** | | 26-37h | |

### Order of value
1. Phase 1 stops the bleeding (data stops going stale). Highest leverage per hour.
2. Phase 3 + 4 + 5 unlock revenue. Highest dollar per hour.
3. Phase 2 polish. Highest brand per hour. Can ship in parallel with 3.

### Recommended sequence
0 → 1 → 3 → 4 → 5 → 2 (revenue path before visual polish)

---

## 8. Open questions / parking lot

- **n8n credentials:** Facebook Graph API token, speedwaylive.co.nz scraping permission (terms of service check needed)
- **Sponsor matchmaking (YAGNI for now):** drivers can list "seeking sponsors", sponsors can list "available to sponsor". Phase 6+ feature, do not build in scope of this design.
- **Premium driver/team profiles:** explicitly rejected per Rhys feedback 2026-05-16 ("drivers/teams already pay an arm + leg"). Will not revisit.
- **Track relationship management:** keep an explicit do-not-cross list per track if politics get hot. Track-friendly framing in every page.
- **Speedway NZ governing body:** courtesy outreach before launch to avoid surprises.
- **Photographer category special-case:** photographers are both suppliers AND can monetise via gallery sales. Keep simple at first (paid listing only). Gallery sales = Phase 6+.

---

## 9. Success criteria

- Phase 1: data freshness < 7 days year-round, no manual deploys needed for content updates
- Phase 2: mobile FCP < 2.5s, Lighthouse perf > 85, visual rebuild signed off in browser
- Phase 3: claim flow E2E test passes (free claim + paid claim + Stripe webhook + welcome email)
- Phase 4: ≥ 100 stub listings auto-seeded
- Phase 5: Forge upsell email click-through ≥ 5% on paid claims

At 12 months post-launch: ≥ 30 paid listings ($870/mo recurring) and/or ≥ 10 Forge subs sourced from SpeedwayHub funnel ($290/mo recurring).
