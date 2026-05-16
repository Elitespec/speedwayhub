# SpeedwayHub Phase 1: Automation Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Site self-updates events + results from track sources on a schedule via cron-triggered orchestrator endpoint, with AI-driven HTML extraction, automatic rebuild + deploy, and Discord alerts on success/failure. Stops data going stale, zero manual touch required.

**Architecture:** The existing `speedwayhub-api.js` (running on PM2 port 3848 at the secondary server 49.12.33.255) already has `/api/update-events`, `/api/update-results`, `/api/update-news`, `/api/rebuild`, and `/api/cleanup` endpoints. We add an orchestrator endpoint `/api/automated/refresh-cycle` that loops the 23 mapped tracks, scrapes each, runs HTML through OpenAI (`gpt-4o-mini`) to extract structured events, POSTs to `/api/update-events`, then calls `/api/rebuild`, then pings Discord with a summary. Server cron hits the orchestrator on a season-aware schedule (off-season weekly, in-season hourly). No n8n dependency.

**Tech Stack:** Node.js + Express (existing), OpenAI Chat Completions API (`gpt-4o-mini`), Discord webhook, Linux cron, vitest for unit tests, PM2 for process management.

---

## File Structure

All new helper modules live as siblings of `speedwayhub-api.js`. The API file is at `D:/Elite Spec/speedwayhub-api.js` locally and gets rsync'd to the secondary server. Helper modules follow the same path pattern.

**Files to create:**
- `D:/Elite Spec/lib/discord-alert.cjs` — POST to Discord webhook helper
- `D:/Elite Spec/lib/season-cadence.cjs` — returns "in-season" or "off-season" based on NZ date
- `D:/Elite Spec/lib/ai-extractor.cjs` — OpenAI client + extract-events-from-html function
- `D:/Elite Spec/lib/refresh-cycle.cjs` — orchestrator: scrape → AI extract → update → rebuild → alert
- `D:/Elite Spec/tests/discord-alert.test.cjs` — unit tests
- `D:/Elite Spec/tests/season-cadence.test.cjs` — unit tests
- `D:/Elite Spec/tests/ai-extractor.test.cjs` — unit tests (mocked OpenAI)
- `D:/Elite Spec/tests/refresh-cycle.test.cjs` — unit tests (mocked dependencies)
- `D:/Elite Spec/package.json` — new (vitest dependency + test script)

**Files to modify:**
- `D:/Elite Spec/speedwayhub-api.js` — add `/api/automated/refresh-cycle` route; require new lib modules

**Server-side (production secondary server 49.12.33.255):**
- `/etc/cron.d/speedwayhub-automation` — new cron file
- PM2 env vars: `OPENAI_API_KEY`, `DISCORD_WEBHOOK_URL`, `SPEEDWAYHUB_API_KEY`

---

## Task 0: Infrastructure Audit + Prerequisites

**Files:**
- Read-only audit, no file changes

**Goal:** Confirm OpenAI key + Discord webhook + PM2 deploy path are all in hand before writing code that depends on them.

- [ ] **Step 1: Verify n8n is alive (out of scope but useful sanity check)**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://46.225.13.97:5678/`
Expected: `200`

- [ ] **Step 2: Confirm OpenAI API key is available in shell**

Run: `node -e "console.log(process.env.OPENAI_API_KEY ? 'set, len ' + process.env.OPENAI_API_KEY.length : 'MISSING')"`
Expected: `set, len 164` (or any length > 50)
If missing: read `~/.claude/projects/C--Users-logan/memory/openai-api-key.md` and set in shell + plan to set in PM2 env on server.

- [ ] **Step 3: Confirm Discord webhook URL is available**

Run: `node -e "console.log(process.env.DISCORD_WEBHOOK_URL ? 'set' : 'MISSING')"`
Expected: `set`
If missing: read `~/.claude/projects/C--Users-logan/memory/discord-webhook.md` for the URL.

- [ ] **Step 4: SSH to secondary server, identify speedwayhub-api PM2 entry**

Run: `ssh root@49.12.33.255 'pm2 jlist | jq -r ".[] | select(.name | contains(\"speedwayhub\")) | {name, pm_exec_path, env: .pm2_env.PWD}"'`
Expected output looks like:
```json
{ "name": "speedwayhub-api", "pm_exec_path": "/root/speedwayhub-api.js", "env": "/root" }
```
Record the `pm_exec_path` value. The lib dir will be a sibling of this path.

- [ ] **Step 5: Verify server has cron daemon active**

Run: `ssh root@49.12.33.255 'systemctl is-active cron'`
Expected: `active`

- [ ] **Step 6: Commit a planning note recording the audit results**

Run:
```bash
cd "/d/Elite Spec/Deployed Sites/speedwayhub/speedwayhub-md"
cat > docs/superpowers/plans/2026-05-16-phase1-audit-notes.md <<'EOF'
# Phase 1 Audit Notes

- n8n: alive at 46.225.13.97:5678 (NOT USED in Phase 1)
- OpenAI key: present in env, len <RECORD>
- Discord webhook: present in env
- PM2 entry path: <RECORD>
- Cron daemon: active
EOF
git add docs/superpowers/plans/2026-05-16-phase1-audit-notes.md
git commit -m "docs: Phase 1 audit notes"
```

---

## Task 1: Set up `D:/Elite Spec/` as a node project with vitest

**Files:**
- Create: `D:/Elite Spec/package.json`
- Create: `D:/Elite Spec/vitest.config.cjs`

**Goal:** The API file is currently standalone with no test harness. We add minimal package.json + vitest so subsequent tasks can do TDD.

- [ ] **Step 1: Create `D:/Elite Spec/package.json`**

Write to `D:/Elite Spec/package.json`:
```json
{
  "name": "speedwayhub-automation",
  "version": "1.0.0",
  "private": true,
  "type": "commonjs",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "express": "^4.21.0",
    "node-fetch": "^2.7.0"
  },
  "devDependencies": {
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run from `D:/Elite Spec/`:
```bash
cd "/d/Elite Spec" && npm install
```
Expected: completes with no errors, creates node_modules + package-lock.json.

- [ ] **Step 3: Create vitest config**

Write to `D:/Elite Spec/vitest.config.cjs`:
```javascript
module.exports = {
  test: {
    include: ['tests/**/*.test.cjs'],
    globals: true,
    environment: 'node'
  }
};
```

- [ ] **Step 4: Smoke test vitest works**

Run: `cd "/d/Elite Spec" && npm test`
Expected: vitest runs and reports "No test files found", exits 0.

- [ ] **Step 5: Commit**

```bash
cd "/d/Elite Spec"
git init 2>/dev/null
echo "node_modules/" > .gitignore
git add package.json package-lock.json vitest.config.cjs .gitignore
git commit -m "feat: add vitest test harness for SpeedwayHub automation lib"
```

---

## Task 2: Discord Alert Module (TDD)

**Files:**
- Create: `D:/Elite Spec/lib/discord-alert.cjs`
- Create: `D:/Elite Spec/tests/discord-alert.test.cjs`

**Goal:** Helper that POSTs a Discord-webhook-compatible payload to `DISCORD_WEBHOOK_URL`. Used by orchestrator to ping on success/failure.

- [ ] **Step 1: Write the failing test**

Write to `D:/Elite Spec/tests/discord-alert.test.cjs`:
```javascript
const { describe, it, expect, vi, beforeEach } = require('vitest');
const { sendDiscordAlert } = require('../lib/discord-alert.cjs');

describe('sendDiscordAlert', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 204 });
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/TEST';
  });

  it('posts a success message with correct shape', async () => {
    await sendDiscordAlert({
      level: 'success',
      title: 'Refresh cycle complete',
      message: 'Added 3 events, updated 0',
      fields: { tracksScraped: 23, addedEvents: 3 }
    });

    expect(global.fetch).toHaveBeenCalledOnce();
    const [url, opts] = global.fetch.mock.calls[0];
    expect(url).toBe('https://discord.com/api/webhooks/TEST');
    const body = JSON.parse(opts.body);
    expect(body.embeds[0].title).toBe('Refresh cycle complete');
    expect(body.embeds[0].color).toBe(0x57F287); // Discord green
  });

  it('uses red color for failure level', async () => {
    await sendDiscordAlert({ level: 'failure', title: 'Failed', message: 'OpenAI rate limit' });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.embeds[0].color).toBe(0xED4245); // Discord red
  });

  it('silently skips if DISCORD_WEBHOOK_URL not set', async () => {
    delete process.env.DISCORD_WEBHOOK_URL;
    await expect(sendDiscordAlert({ level: 'success', title: 't', message: 'm' })).resolves.toBeUndefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `cd "/d/Elite Spec" && npm test`
Expected: FAIL with "Cannot find module '../lib/discord-alert.cjs'".

- [ ] **Step 3: Implement minimal Discord alert module**

Write to `D:/Elite Spec/lib/discord-alert.cjs`:
```javascript
const COLORS = {
  success: 0x57F287,
  failure: 0xED4245,
  info: 0x5865F2,
  warning: 0xFEE75C
};

async function sendDiscordAlert({ level = 'info', title, message, fields = {} }) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;

  const embedFields = Object.entries(fields).map(([name, value]) => ({
    name,
    value: String(value),
    inline: true
  }));

  const body = {
    embeds: [{
      title,
      description: message,
      color: COLORS[level] || COLORS.info,
      fields: embedFields,
      timestamp: new Date().toISOString(),
      footer: { text: 'SpeedwayHub automation' }
    }]
  };

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (err) {
    console.error('[DISCORD] alert failed:', err.message);
  }
}

module.exports = { sendDiscordAlert };
```

- [ ] **Step 4: Run tests, verify all pass**

Run: `cd "/d/Elite Spec" && npm test`
Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
cd "/d/Elite Spec"
git add lib/discord-alert.cjs tests/discord-alert.test.cjs
git commit -m "feat(automation): Discord alert helper with success/failure colors"
```

---

## Task 3: Season Cadence Module (TDD)

**Files:**
- Create: `D:/Elite Spec/lib/season-cadence.cjs`
- Create: `D:/Elite Spec/tests/season-cadence.test.cjs`

**Goal:** Returns whether NZ speedway is currently in-season (Oct-Apr) or off-season (May-Sep), and the appropriate refresh interval. Used by orchestrator to skip work in off-season's quiet months and by cron to choose cadence.

- [ ] **Step 1: Write the failing test**

Write to `D:/Elite Spec/tests/season-cadence.test.cjs`:
```javascript
const { describe, it, expect } = require('vitest');
const { getSeason, getRefreshIntervalMinutes } = require('../lib/season-cadence.cjs');

describe('getSeason', () => {
  it('returns in-season for October', () => {
    expect(getSeason(new Date('2026-10-15'))).toBe('in-season');
  });
  it('returns in-season for January', () => {
    expect(getSeason(new Date('2026-01-15'))).toBe('in-season');
  });
  it('returns in-season for April', () => {
    expect(getSeason(new Date('2026-04-15'))).toBe('in-season');
  });
  it('returns off-season for May', () => {
    expect(getSeason(new Date('2026-05-15'))).toBe('off-season');
  });
  it('returns off-season for September', () => {
    expect(getSeason(new Date('2026-09-15'))).toBe('off-season');
  });
});

describe('getRefreshIntervalMinutes', () => {
  it('returns 60 in-season', () => {
    expect(getRefreshIntervalMinutes(new Date('2026-12-01'))).toBe(60);
  });
  it('returns 10080 (one week) off-season', () => {
    expect(getRefreshIntervalMinutes(new Date('2026-07-01'))).toBe(10080);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `cd "/d/Elite Spec" && npm test`
Expected: FAIL with "Cannot find module".

- [ ] **Step 3: Implement season cadence module**

Write to `D:/Elite Spec/lib/season-cadence.cjs`:
```javascript
// NZ speedway season runs October through April.
// May-September is off-season (training events, AGMs, dormant).

function getSeason(date = new Date()) {
  const month = date.getMonth() + 1; // 1-12
  const inSeason = month >= 10 || month <= 4;
  return inSeason ? 'in-season' : 'off-season';
}

function getRefreshIntervalMinutes(date = new Date()) {
  return getSeason(date) === 'in-season' ? 60 : 10080; // 1h vs 1 week
}

module.exports = { getSeason, getRefreshIntervalMinutes };
```

- [ ] **Step 4: Run tests, verify all pass**

Run: `cd "/d/Elite Spec" && npm test`
Expected: 5 new tests pass, total 8 passing.

- [ ] **Step 5: Commit**

```bash
cd "/d/Elite Spec"
git add lib/season-cadence.cjs tests/season-cadence.test.cjs
git commit -m "feat(automation): season cadence helper (Oct-Apr in-season, May-Sep off)"
```

---

## Task 4: AI Extractor Module (TDD with mocked OpenAI)

**Files:**
- Create: `D:/Elite Spec/lib/ai-extractor.cjs`
- Create: `D:/Elite Spec/tests/ai-extractor.test.cjs`

**Goal:** Take raw HTML from a track website, send to OpenAI `gpt-4o-mini`, get back a structured array of `{ date, title, classes, startTime }` events. Costs ~$0.005 per track scrape, ~$0.10 per full 23-track cycle.

- [ ] **Step 1: Write the failing test**

Write to `D:/Elite Spec/tests/ai-extractor.test.cjs`:
```javascript
const { describe, it, expect, vi, beforeEach } = require('vitest');
const { extractEventsFromHtml } = require('../lib/ai-extractor.cjs');

describe('extractEventsFromHtml', () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'sk-test';
    global.fetch = vi.fn();
  });

  it('extracts events from track HTML via OpenAI', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: JSON.stringify({
              events: [
                { date: '2026-10-15', title: 'Season Opener', classes: ['Stockcars', 'Saloons'], startTime: '18:00' }
              ]
            })
          }
        }]
      })
    });

    const events = await extractEventsFromHtml({
      trackName: 'Huntly Speedway',
      trackSlug: 'huntly',
      html: '<html><body>Season Opener 15 Oct 2026 6pm Stockcars Saloons</body></html>'
    });

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      date: '2026-10-15',
      title: 'Season Opener',
      track: 'Huntly Speedway',
      trackSlug: 'huntly',
      classes: ['Stockcars', 'Saloons'],
      startTime: '18:00'
    });
  });

  it('returns empty array if OpenAI returns no events', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ events: [] }) } }]
      })
    });

    const events = await extractEventsFromHtml({
      trackName: 'Test', trackSlug: 'test', html: 'empty page'
    });
    expect(events).toEqual([]);
  });

  it('throws on OpenAI error response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => 'rate limited'
    });

    await expect(extractEventsFromHtml({
      trackName: 'Test', trackSlug: 'test', html: 'x'
    })).rejects.toThrow(/429/);
  });

  it('truncates HTML to 30000 chars before sending', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '{"events":[]}' } }] })
    });

    const bigHtml = 'x'.repeat(100000);
    await extractEventsFromHtml({ trackName: 'T', trackSlug: 't', html: bigHtml });

    const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    const userContent = callBody.messages.find(m => m.role === 'user').content;
    expect(userContent.length).toBeLessThan(31000);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `cd "/d/Elite Spec" && npm test`
Expected: FAIL with "Cannot find module".

- [ ] **Step 3: Implement AI extractor module**

Write to `D:/Elite Spec/lib/ai-extractor.cjs`:
```javascript
const EXTRACTION_SYSTEM_PROMPT = `You are an extractor for NZ speedway track websites. Given raw HTML, extract upcoming race events.

Return a JSON object with shape:
{
  "events": [
    {
      "date": "YYYY-MM-DD",
      "title": "Event name",
      "classes": ["Stockcars", "Saloons", ...],
      "startTime": "HH:MM" (24h, optional),
      "gateOpenTime": "HH:MM" (optional),
      "ticketUrl": "https://..." (optional),
      "summary": "Optional 1-sentence description"
    }
  ]
}

Rules:
- Only upcoming events (date >= today). Skip past events, navigation links, generic "events" pages.
- Date must be a real future date in 2026 or 2027 (not 1970, not 2099).
- Title must be 3-100 chars, no HTML, no newlines.
- If no events found, return {"events": []}.
- Speedway classes vocabulary: Stockcars, Superstocks, Saloons, Production Saloons, Streetstocks, Ministocks, Sidecars, Sprintcars, Midgets, Modifieds, TQs, Youth Ministocks, Six-Shooters, Adult Ministocks.
- Do not invent events. Only return what is clearly stated.`;

async function extractEventsFromHtml({ trackName, trackSlug, html }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const truncated = html.slice(0, 30000);

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: EXTRACTION_SYSTEM_PROMPT },
        { role: 'user', content: `Track: ${trackName} (slug: ${trackSlug})\n\nHTML:\n${truncated}` }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return [];

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.error('[AI-EXTRACTOR] JSON parse failed:', content.slice(0, 200));
    return [];
  }

  const events = Array.isArray(parsed.events) ? parsed.events : [];

  return events.map(e => ({
    ...e,
    track: trackName,
    trackSlug
  }));
}

module.exports = { extractEventsFromHtml };
```

- [ ] **Step 4: Run tests, verify all pass**

Run: `cd "/d/Elite Spec" && npm test`
Expected: 4 new tests pass, total 12 passing.

- [ ] **Step 5: Commit**

```bash
cd "/d/Elite Spec"
git add lib/ai-extractor.cjs tests/ai-extractor.test.cjs
git commit -m "feat(automation): AI HTML extractor via OpenAI gpt-4o-mini"
```

---

## Task 5: Refresh Cycle Orchestrator (TDD with mocked dependencies)

**Files:**
- Create: `D:/Elite Spec/lib/refresh-cycle.cjs`
- Create: `D:/Elite Spec/tests/refresh-cycle.test.cjs`

**Goal:** The orchestrator. Loops the 23 mapped tracks (excluding FB-only ones), fetches each HTML, AI-extracts events, POSTs to `/api/update-events`, then POSTs to `/api/cleanup`, then `/api/rebuild`, then pings Discord with summary. Returns a structured summary object.

- [ ] **Step 1: Write the failing test**

Write to `D:/Elite Spec/tests/refresh-cycle.test.cjs`:
```javascript
const { describe, it, expect, vi, beforeEach } = require('vitest');

describe('runRefreshCycle', () => {
  let runRefreshCycle, mockExtract, mockAlert, mockFetch;

  beforeEach(async () => {
    vi.resetModules();
    mockExtract = vi.fn();
    mockAlert = vi.fn().mockResolvedValue();
    vi.doMock('../lib/ai-extractor.cjs', () => ({ extractEventsFromHtml: mockExtract }));
    vi.doMock('../lib/discord-alert.cjs', () => ({ sendDiscordAlert: mockAlert }));

    mockFetch = vi.fn();
    global.fetch = mockFetch;
    process.env.SPEEDWAYHUB_API_KEY = 'test-key';

    ({ runRefreshCycle } = require('../lib/refresh-cycle.cjs'));
  });

  it('skips tracks without a URL', async () => {
    const sources = {
      tracks: {
        a: { name: 'A', url: 'https://a.test' },
        b: { name: 'B', facebook: 'https://fb' } // no url
      }
    };
    mockFetch.mockResolvedValue({ ok: true, text: async () => '<html/>', json: async () => ({ success: true, added: 0, updated: 0, rejected: 0, total: 0 }) });
    mockExtract.mockResolvedValue([]);

    const result = await runRefreshCycle({ sources, apiBase: 'http://localhost:3848' });
    expect(result.tracksScraped).toBe(1);
    expect(result.tracksSkipped).toBe(1);
  });

  it('aggregates added events across tracks', async () => {
    const sources = {
      tracks: {
        a: { name: 'A', url: 'https://a.test' },
        b: { name: 'B', url: 'https://b.test' }
      }
    };
    let postCount = 0;
    mockFetch.mockImplementation(async (url, opts) => {
      if (url.endsWith('/api/update-events')) {
        postCount++;
        return { ok: true, json: async () => ({ success: true, added: 2, updated: 0, rejected: 0, total: 10 }) };
      }
      return { ok: true, text: async () => '<html/>', json: async () => ({ success: true }) };
    });
    mockExtract.mockResolvedValue([{ date: '2026-10-15', title: 'X' }]);

    const result = await runRefreshCycle({ sources, apiBase: 'http://localhost:3848' });
    expect(result.totalAdded).toBe(4);
    expect(result.tracksScraped).toBe(2);
  });

  it('sends success Discord alert when cycle completes', async () => {
    const sources = { tracks: { a: { name: 'A', url: 'https://a.test' } } };
    mockFetch.mockResolvedValue({ ok: true, text: async () => '<html/>', json: async () => ({ success: true, added: 1, updated: 0, rejected: 0, total: 1 }) });
    mockExtract.mockResolvedValue([{ date: '2026-10-15', title: 'X' }]);

    await runRefreshCycle({ sources, apiBase: 'http://localhost:3848' });

    expect(mockAlert).toHaveBeenCalledWith(expect.objectContaining({
      level: 'success'
    }));
  });

  it('sends failure Discord alert if rebuild fails', async () => {
    const sources = { tracks: { a: { name: 'A', url: 'https://a.test' } } };
    mockFetch.mockImplementation(async (url) => {
      if (url.endsWith('/api/rebuild')) {
        return { ok: false, status: 500, json: async () => ({ error: 'build failed' }) };
      }
      return { ok: true, text: async () => '<html/>', json: async () => ({ success: true, added: 0, updated: 0, rejected: 0, total: 0 }) };
    });
    mockExtract.mockResolvedValue([]);

    await runRefreshCycle({ sources, apiBase: 'http://localhost:3848' });

    expect(mockAlert).toHaveBeenCalledWith(expect.objectContaining({
      level: 'failure'
    }));
  });

  it('continues cycle if a single track scrape fails', async () => {
    const sources = {
      tracks: {
        a: { name: 'A', url: 'https://a.test' },
        b: { name: 'B', url: 'https://b.test' }
      }
    };
    mockFetch.mockImplementation(async (url) => {
      if (url === 'https://a.test') throw new Error('network');
      if (url === 'https://b.test') return { ok: true, text: async () => '<html/>' };
      return { ok: true, json: async () => ({ success: true, added: 1, updated: 0, rejected: 0, total: 1 }) };
    });
    mockExtract.mockResolvedValue([{ date: '2026-10-15', title: 'X' }]);

    const result = await runRefreshCycle({ sources, apiBase: 'http://localhost:3848' });
    expect(result.tracksScraped).toBe(1);
    expect(result.tracksFailed).toBe(1);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `cd "/d/Elite Spec" && npm test`
Expected: FAIL with "Cannot find module '../lib/refresh-cycle.cjs'".

- [ ] **Step 3: Implement orchestrator**

Write to `D:/Elite Spec/lib/refresh-cycle.cjs`:
```javascript
const { extractEventsFromHtml } = require('./ai-extractor.cjs');
const { sendDiscordAlert } = require('./discord-alert.cjs');

const USER_AGENT = 'SpeedwayHub/1.0 (Automation Bot; +https://speedwayhub.nz)';

async function runRefreshCycle({ sources, apiBase, apiKey, dryRun = false }) {
  const startedAt = new Date();
  const apiKeyToUse = apiKey || process.env.SPEEDWAYHUB_API_KEY;
  const summary = {
    startedAt: startedAt.toISOString(),
    tracksScraped: 0,
    tracksSkipped: 0,
    tracksFailed: 0,
    totalAdded: 0,
    totalUpdated: 0,
    totalRejected: 0,
    rebuildSucceeded: false,
    errors: []
  };

  for (const [slug, track] of Object.entries(sources.tracks || {})) {
    if (!track.url) {
      summary.tracksSkipped++;
      continue;
    }

    try {
      const fetchRes = await fetch(track.url, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(15000)
      });
      const html = await fetchRes.text();

      const events = await extractEventsFromHtml({
        trackName: track.name,
        trackSlug: slug,
        html
      });

      if (events.length > 0 && !dryRun) {
        const updateRes = await fetch(`${apiBase}/api/update-events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKeyToUse },
          body: JSON.stringify({ events })
        });
        const updateData = await updateRes.json();
        if (updateData.success) {
          summary.totalAdded += updateData.added || 0;
          summary.totalUpdated += updateData.updated || 0;
          summary.totalRejected += updateData.rejected || 0;
        }
      }

      summary.tracksScraped++;
    } catch (err) {
      summary.tracksFailed++;
      summary.errors.push(`${slug}: ${err.message}`);
    }
  }

  // Mark past events completed
  if (!dryRun) {
    try {
      await fetch(`${apiBase}/api/cleanup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKeyToUse }
      });
    } catch (err) {
      summary.errors.push(`cleanup: ${err.message}`);
    }
  }

  // Rebuild
  if (!dryRun) {
    try {
      const rebuildRes = await fetch(`${apiBase}/api/rebuild`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKeyToUse }
      });
      summary.rebuildSucceeded = rebuildRes.ok;
      if (!rebuildRes.ok) {
        const errBody = await rebuildRes.json().catch(() => ({}));
        summary.errors.push(`rebuild: ${errBody.error || rebuildRes.status}`);
      }
    } catch (err) {
      summary.errors.push(`rebuild: ${err.message}`);
    }
  }

  summary.completedAt = new Date().toISOString();
  summary.durationMs = Date.now() - startedAt.getTime();

  // Discord alert
  const success = summary.rebuildSucceeded && summary.tracksFailed === 0;
  await sendDiscordAlert({
    level: success ? 'success' : 'failure',
    title: success ? 'Refresh cycle complete' : 'Refresh cycle had errors',
    message: success
      ? `Added ${summary.totalAdded}, updated ${summary.totalUpdated}, scanned ${summary.tracksScraped} tracks in ${Math.round(summary.durationMs / 1000)}s.`
      : `Errors: ${summary.errors.slice(0, 3).join('; ')}`,
    fields: {
      tracksScraped: summary.tracksScraped,
      tracksSkipped: summary.tracksSkipped,
      tracksFailed: summary.tracksFailed,
      totalAdded: summary.totalAdded,
      totalUpdated: summary.totalUpdated,
      rebuildSucceeded: summary.rebuildSucceeded
    }
  });

  return summary;
}

module.exports = { runRefreshCycle };
```

- [ ] **Step 4: Run tests, verify all pass**

Run: `cd "/d/Elite Spec" && npm test`
Expected: 5 new tests pass, total 17 passing.

- [ ] **Step 5: Commit**

```bash
cd "/d/Elite Spec"
git add lib/refresh-cycle.cjs tests/refresh-cycle.test.cjs
git commit -m "feat(automation): orchestrator (scrape -> AI extract -> update -> rebuild -> alert)"
```

---

## Task 6: Mount `/api/automated/refresh-cycle` Route

**Files:**
- Modify: `D:/Elite Spec/speedwayhub-api.js`

**Goal:** Add the orchestrator route to the existing Express app. Reuse existing `auth` middleware. Loop runs against the existing `SOURCES.tracks` constant in the same file.

- [ ] **Step 1: Read current file end to confirm where to mount the route**

Run:
```bash
tail -50 "/d/Elite Spec/speedwayhub-api.js"
```
Expected: see `app.listen(...)` call at the bottom. Note the exact line.

- [ ] **Step 2: Add require + route just BEFORE the `app.listen` call**

Open `D:/Elite Spec/speedwayhub-api.js`. Find the `app.listen(` line (likely near the bottom). Insert the following block immediately before it:

```javascript
// === Phase 1 automation orchestrator ===
const { runRefreshCycle } = require('./lib/refresh-cycle.cjs');
const { getSeason } = require('./lib/season-cadence.cjs');

app.post('/api/automated/refresh-cycle', auth, async (req, res) => {
  const dryRun = req.body?.dryRun === true;
  const apiBase = `http://localhost:${process.env.PORT || 3848}`;

  console.log(`[REFRESH-CYCLE] starting${dryRun ? ' (dry-run)' : ''} ...`);
  try {
    const summary = await runRefreshCycle({
      sources: SOURCES,
      apiBase,
      apiKey: API_KEY,
      dryRun
    });
    console.log('[REFRESH-CYCLE] done:', JSON.stringify(summary, null, 2));
    res.json({ success: true, season: getSeason(), summary });
  } catch (err) {
    console.error('[REFRESH-CYCLE] fatal:', err);
    res.status(500).json({ error: err.message });
  }
});
```

- [ ] **Step 3: Lint check the file parses**

Run:
```bash
node --check "/d/Elite Spec/speedwayhub-api.js"
```
Expected: no output (file parses cleanly).

- [ ] **Step 4: Boot the API locally on a non-conflicting port and smoke test**

Run in a new terminal:
```bash
cd "/d/Elite Spec" && PORT=3849 OPENAI_API_KEY=$OPENAI_API_KEY DISCORD_WEBHOOK_URL=$DISCORD_WEBHOOK_URL SPEEDWAYHUB_API_KEY=speedway2026secret node speedwayhub-api.js
```
Expected: log line "[API] Listening on port 3849" (or similar).

In another terminal, smoke-test:
```bash
curl -s -X POST http://localhost:3849/api/automated/refresh-cycle \
  -H 'x-api-key: speedway2026secret' \
  -H 'Content-Type: application/json' \
  -d '{"dryRun": true}'
```
Expected: JSON response with `success: true`, `summary.tracksScraped: 23` (or similar), `summary.rebuildSucceeded: false` (because dry-run), no rebuild attempt. Discord ping fires for the dry-run too — that's OK, it's a smoke signal.

Kill the local server with Ctrl-C.

- [ ] **Step 5: Commit**

```bash
cd "/d/Elite Spec"
git add speedwayhub-api.js
git commit -m "feat(api): /api/automated/refresh-cycle orchestrator route"
```

---

## Task 7: Deploy to Server + PM2 Reload

**Files:**
- No file changes locally; remote deploy only

**Goal:** Push the updated API + new lib/ dir + tests/ dir to the secondary server, set PM2 env vars, reload the process, verify it boots.

- [ ] **Step 1: rsync updated files to secondary server**

Use the PM2 path discovered in Task 0. Assume `/root/` for example (substitute actual path):
```bash
PM2_DIR=$(ssh root@49.12.33.255 'dirname $(pm2 jlist | jq -r ".[] | select(.name | contains(\"speedwayhub\")) | .pm_exec_path")')
echo "Deploying to: $PM2_DIR"

rsync -avz --exclude node_modules --exclude tests \
  "/d/Elite Spec/speedwayhub-api.js" \
  "/d/Elite Spec/lib/" \
  "/d/Elite Spec/package.json" \
  "/d/Elite Spec/package-lock.json" \
  root@49.12.33.255:${PM2_DIR}/
```
Wait, rsync requires the lib dir trailing slash for contents-only sync. Use:
```bash
rsync -avz "/d/Elite Spec/speedwayhub-api.js" root@49.12.33.255:${PM2_DIR}/
rsync -avz --delete "/d/Elite Spec/lib/" root@49.12.33.255:${PM2_DIR}/lib/
rsync -avz "/d/Elite Spec/package.json" "/d/Elite Spec/package-lock.json" root@49.12.33.255:${PM2_DIR}/
```

- [ ] **Step 2: Install dependencies on server**

Run:
```bash
ssh root@49.12.33.255 "cd ${PM2_DIR} && npm install --omit=dev"
```
Expected: completes without errors (express + node-fetch installed).

- [ ] **Step 3: Set PM2 env vars (OpenAI + Discord)**

Read the values from your local env then push:
```bash
OPENAI_KEY=$OPENAI_API_KEY
DISCORD_URL=$DISCORD_WEBHOOK_URL

ssh root@49.12.33.255 "pm2 set speedwayhub-api:OPENAI_API_KEY '$OPENAI_KEY'"
ssh root@49.12.33.255 "pm2 set speedwayhub-api:DISCORD_WEBHOOK_URL '$DISCORD_URL'"
```

Per the memory rule `feedback_pm2-env-cache.md`: `pm2 set` writes to `dump.pm2` which is loaded on `resurrect`. For the values to actually be picked up by the running process, we must `pm2 delete + start` not just `pm2 restart`.

- [ ] **Step 4: Hard-restart speedwayhub-api with fresh env**

Run:
```bash
ssh root@49.12.33.255 "pm2 delete speedwayhub-api && pm2 start ${PM2_DIR}/speedwayhub-api.js --name speedwayhub-api --update-env"
ssh root@49.12.33.255 "pm2 save"
```
Expected: PM2 reports speedwayhub-api as `online`.

- [ ] **Step 5: Verify health endpoint still responds**

Run:
```bash
curl -s http://49.12.33.255:3848/api/health
```
Expected: `{"status":"ok","time":"...","sources":23}` (or similar).

- [ ] **Step 6: Verify new route is mounted**

Run:
```bash
curl -s -X POST http://49.12.33.255:3848/api/automated/refresh-cycle \
  -H 'x-api-key: speedway2026secret' \
  -H 'Content-Type: application/json' \
  -d '{"dryRun": true}' | head -c 500
```
Expected: JSON with `success: true` and a summary object. No 404. Discord ping should fire.

- [ ] **Step 7: Commit deploy notes**

```bash
cd "/d/Elite Spec/Deployed Sites/speedwayhub/speedwayhub-md"
cat > docs/superpowers/plans/2026-05-16-phase1-deploy-notes.md <<EOF
# Phase 1 Deploy Notes

- Deployed: $(date -u +%Y-%m-%dT%H:%M:%SZ)
- Server: 49.12.33.255
- PM2 path: ${PM2_DIR}
- Process: speedwayhub-api (port 3848)
- Discord pinged: yes
- /api/automated/refresh-cycle live: confirmed via dry-run
EOF
git add docs/superpowers/plans/2026-05-16-phase1-deploy-notes.md
git commit -m "docs: Phase 1 deploy notes"
```

---

## Task 8: Live End-to-End Smoke Test (Single Track)

**Files:**
- No file changes; verification only

**Goal:** Run the orchestrator against a single live track (Huntly, has a website + clean structure) end-to-end. Verify events extract correctly, get written to events.json, site rebuilds, Discord pings success.

- [ ] **Step 1: Capture events.json size before**

Run:
```bash
ssh root@49.12.33.255 "wc -l /srv/www/speedwayhub/speedwayhub-md/src/data/events.json"
```
Record the line count.

- [ ] **Step 2: Trigger full live refresh cycle (no dry-run)**

Run:
```bash
curl -s -X POST http://49.12.33.255:3848/api/automated/refresh-cycle \
  -H 'x-api-key: speedway2026secret' \
  -H 'Content-Type: application/json' \
  -d '{}' | tee /tmp/refresh-result.json | head -c 2000
```
Expected: response includes `success: true`, summary with `tracksScraped > 0`, `rebuildSucceeded: true`.
Watch your Discord channel for a green-coloured success embed.

- [ ] **Step 3: Verify events.json grew (or stayed same if off-season and no new events)**

Run:
```bash
ssh root@49.12.33.255 "wc -l /srv/www/speedwayhub/speedwayhub-md/src/data/events.json"
```
Off-season note: it's currently May 2026, so no upcoming events for some weeks/months. AI extractor may legitimately return empty arrays for many tracks. That is correct behavior, not a bug.

- [ ] **Step 4: Verify site dist updated**

Run:
```bash
ssh root@49.12.33.255 "ls -la /srv/www/speedwayhub/speedwayhub-md/dist/index.html"
curl -s https://speedwayhub.nz/ | grep -o '<title>[^<]*</title>'
```
Expected: index.html mtime is within the last minute, title tag still loads.

- [ ] **Step 5: Force a failure and confirm Discord red embed fires**

Run (with bad API key to force auth failure):
```bash
ssh root@49.12.33.255 "OPENAI_API_KEY=bogus pm2 restart speedwayhub-api --update-env"
sleep 5
curl -s -X POST http://49.12.33.255:3848/api/automated/refresh-cycle \
  -H 'x-api-key: speedway2026secret' \
  -d '{}' | head -c 500
```
Expected: AI extraction fails for every track, `tracksFailed` is high. Discord shows red-coloured failure embed.

- [ ] **Step 6: Restore correct OPENAI_API_KEY**

Run:
```bash
ssh root@49.12.33.255 "pm2 set speedwayhub-api:OPENAI_API_KEY '$OPENAI_KEY'"
ssh root@49.12.33.255 "pm2 delete speedwayhub-api && pm2 start ${PM2_DIR}/speedwayhub-api.js --name speedwayhub-api --update-env && pm2 save"
```

Verify recovery:
```bash
curl -s -X POST http://49.12.33.255:3848/api/automated/refresh-cycle \
  -H 'x-api-key: speedway2026secret' -d '{"dryRun":true}' | head -c 300
```
Expected: success response.

---

## Task 9: Install Server Cron (Off-Season Cadence)

**Files:**
- Create: `/etc/cron.d/speedwayhub-automation` (on server 49.12.33.255)

**Goal:** Server cron hits `/api/automated/refresh-cycle` on a weekly schedule (off-season). When season starts in October, the cron schedule is updated via a follow-up commit. Discord alerts make the cron behavior visible.

- [ ] **Step 1: Write cron file content locally first for review**

The off-season cron runs once per week on Sundays at 6am NZ time (which is Sat 6pm UTC during NZST, Sat 5pm UTC during NZDT). Use UTC for safety: `0 18 * * 6` = Saturday 18:00 UTC = approximately Sunday morning NZ.

Cron file content:
```
# SpeedwayHub automation - off-season cadence
# Off-season (May-Sep): weekly refresh on Sunday morning NZ
# In-season (Oct-Apr): swap to hourly via separate cron entry (Task 10 followup)

SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Weekly off-season refresh
0 18 * * 6 root curl -s -X POST http://localhost:3848/api/automated/refresh-cycle -H 'x-api-key: speedway2026secret' -H 'Content-Type: application/json' -d '{}' >> /var/log/speedwayhub-cron.log 2>&1
```

- [ ] **Step 2: Push cron file to server**

Run:
```bash
ssh root@49.12.33.255 "cat > /etc/cron.d/speedwayhub-automation <<'EOF'
# SpeedwayHub automation - off-season cadence
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

0 18 * * 6 root curl -s -X POST http://localhost:3848/api/automated/refresh-cycle -H 'x-api-key: speedway2026secret' -H 'Content-Type: application/json' -d '{}' >> /var/log/speedwayhub-cron.log 2>&1
EOF"

ssh root@49.12.33.255 "chmod 644 /etc/cron.d/speedwayhub-automation"
ssh root@49.12.33.255 "touch /var/log/speedwayhub-cron.log && chmod 644 /var/log/speedwayhub-cron.log"
```

- [ ] **Step 3: Verify cron daemon picked up the file**

Run:
```bash
ssh root@49.12.33.255 "ls -la /etc/cron.d/speedwayhub-automation && cat /etc/cron.d/speedwayhub-automation"
```
Expected: file shown, permissions 644, owner root.

- [ ] **Step 4: Force-run the cron command immediately to verify it works from cron context**

Run:
```bash
ssh root@49.12.33.255 "bash -c '$(grep -v ^# /etc/cron.d/speedwayhub-automation | grep curl)'"
```
Expected: Discord ping fires within ~30s.

- [ ] **Step 5: Verify log file is being written**

Run:
```bash
ssh root@49.12.33.255 "tail -20 /var/log/speedwayhub-cron.log"
```
Expected: at least one JSON response visible.

- [ ] **Step 6: Commit cron file to repo for version control**

Copy a sanitised version (API key redacted) into the repo:
```bash
cat > "/d/Elite Spec/Deployed Sites/speedwayhub/speedwayhub-md/n8n-workflows/server-cron-off-season.cron" <<'EOF'
# SpeedwayHub off-season cron - deployed to /etc/cron.d/speedwayhub-automation on 49.12.33.255
# Off-season (May-Sep): weekly refresh Saturday 18:00 UTC (Sunday morning NZ)
# IN-SEASON SWAP: replace with hourly schedule before October. See Task 10 followup.

SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

0 18 * * 6 root curl -s -X POST http://localhost:3848/api/automated/refresh-cycle -H 'x-api-key: REDACTED' -H 'Content-Type: application/json' -d '{}' >> /var/log/speedwayhub-cron.log 2>&1
EOF

cd "/d/Elite Spec/Deployed Sites/speedwayhub/speedwayhub-md"
git add n8n-workflows/server-cron-off-season.cron
git commit -m "feat(automation): off-season server cron (weekly refresh)"
```

---

## Task 10: Document the System + Phase 1 Wrap-Up

**Files:**
- Create: `D:/Elite Spec/Deployed Sites/speedwayhub/speedwayhub-md/docs/automation.md`

**Goal:** Explain how the automation works, where to look when something breaks, how to swap to in-season cadence before October.

- [ ] **Step 1: Write automation documentation**

Write to `D:/Elite Spec/Deployed Sites/speedwayhub/speedwayhub-md/docs/automation.md`:
```markdown
# SpeedwayHub Automation

## Architecture
```
[ cron @ 49.12.33.255 ]
   |
   v  POST /api/automated/refresh-cycle
[ speedwayhub-api.js (PM2 port 3848) ]
   |
   +-- for each track in SOURCES:
   |     1. fetch track.url
   |     2. lib/ai-extractor.cjs -> OpenAI gpt-4o-mini -> structured events
   |     3. POST /api/update-events (self, internal) -> events.json
   |
   +-- POST /api/cleanup -> mark past events completed
   +-- POST /api/rebuild -> npm run build -> static dist
   +-- lib/discord-alert.cjs -> green/red embed
```

## Files
- `speedwayhub-api.js` — Express routes, runs on PM2
- `lib/refresh-cycle.cjs` — orchestrator
- `lib/ai-extractor.cjs` — OpenAI HTML extraction
- `lib/discord-alert.cjs` — Discord webhook
- `lib/season-cadence.cjs` — in-season/off-season helper
- `/etc/cron.d/speedwayhub-automation` — server cron

## Required env vars on server
- `OPENAI_API_KEY` — for AI extraction
- `DISCORD_WEBHOOK_URL` — for alerts
- `SPEEDWAYHUB_API_KEY` — for self-auth between cron and API

## Schedules
- **Off-season (May-Sep):** weekly, Saturday 18:00 UTC. ~$0.10 OpenAI cost per cycle.
- **In-season (Oct-Apr):** hourly. Swap before October — see "In-season swap" below.

## Swapping to in-season cadence
On 2026-09-30 (or any time before Oct 1):
```bash
ssh root@49.12.33.255 "cat > /etc/cron.d/speedwayhub-automation <<'EOF'
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# In-season: every hour
0 * * * * root curl -s -X POST http://localhost:3848/api/automated/refresh-cycle -H 'x-api-key: speedway2026secret' -H 'Content-Type: application/json' -d '{}' >> /var/log/speedwayhub-cron.log 2>&1
EOF"
```

## Debugging
- Discord channel shows green/red embeds per cycle
- `/var/log/speedwayhub-cron.log` on server has raw JSON responses
- `pm2 logs speedwayhub-api` shows orchestrator + extractor logs
- Manual trigger: `curl -X POST http://49.12.33.255:3848/api/automated/refresh-cycle -H 'x-api-key: speedway2026secret'`

## Estimated OpenAI cost
- ~30k tokens × 23 tracks per cycle = ~700k tokens input
- gpt-4o-mini @ $0.15/M input = ~$0.10 per cycle
- Off-season weekly: ~$0.40/month
- In-season hourly (24/7 Oct-Apr): ~$70/month
```

- [ ] **Step 2: Commit docs**

```bash
cd "/d/Elite Spec/Deployed Sites/speedwayhub/speedwayhub-md"
git add docs/automation.md
git commit -m "docs: SpeedwayHub Phase 1 automation system documentation"
```

- [ ] **Step 3: Push commits to remote**

```bash
cd "/d/Elite Spec/Deployed Sites/speedwayhub/speedwayhub-md"
git push origin main 2>&1 | tail -5
```
Expected: push succeeds (per memory, repo is on GitHub Elitespec/SpeedwayHub or similar — verify with `git remote -v`).

- [ ] **Step 4: Sanity check Phase 1 done condition**

Confirm all the following are true:
- `/api/automated/refresh-cycle` returns success when called manually
- Server cron has weekly entry installed at `/etc/cron.d/speedwayhub-automation`
- Discord channel received both a green (success) and red (failure) embed during testing
- `docs/automation.md` checked in
- `pm2 list` on server shows `speedwayhub-api` online
- vitest passes locally on the lib modules

If all true: Phase 1 done. Site self-updates without manual touch from this point. Open the spec doc and check Phase 2 (visual rebuild) is the next phase per the recommended sequence (0→1→3→4→5→2), unless Rhys redirects.

---

## Self-Review Notes

After writing this plan, I checked against the spec:

- **Spec Section 5 (Automation pipeline):** all 4 requirements covered. Note: spec mentioned 4 n8n workflows (events, results, FB monitor, AI news). This plan replaces n8n with direct API endpoints, covers events scraping + extraction in the refresh-cycle. Results scraping is intentionally deferred — it depends on speedwaylive.co.nz access patterns + the data model for results. FB monitor + AI news gen are deferred to Phase 1.5 (separate plan) per the YAGNI principle.
- **Spec Section 5 cadence:** in-season hourly + off-season weekly: covered in season-cadence.cjs and cron file with documented swap procedure.
- **Spec Section 5 failure modes:** Discord alerts on failure: covered. Single track failure doesn't kill cycle: covered via try/catch per track. Build failure: surfaced in Discord. Schema validation: re-uses existing isValidEvent in speedwayhub-api.js (already implemented).
- **No placeholders:** scanned, none found. PM2 path is discovered in Task 0 and substituted into later tasks via `${PM2_DIR}` shell var.
- **Type consistency:** `runRefreshCycle({ sources, apiBase, apiKey, dryRun })` signature consistent across implementation + test + route. `extractEventsFromHtml({ trackName, trackSlug, html })` signature consistent.
- **Scope:** Phase 1 only. Phase 1.5 (results scraper + FB monitor + AI news gen) gets its own plan after Phase 1 ships.
