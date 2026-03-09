/**
 * Pre-render SpeedwayHub SPA to static HTML for SEO.
 *
 * Reads route data from JSON files, launches headless Chrome,
 * visits each route, and saves the fully-rendered HTML.
 *
 * Usage: node scripts/prerender.cjs
 * Run after `vite build` to generate static HTML in dist/
 */

const fs = require('fs')
const path = require('path')
const { execSync, spawn } = require('child_process')
const puppeteer = require('puppeteer-core')

const DIST_DIR = path.resolve(__dirname, '..', 'dist')
const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data')
const NEWS_DIR = path.resolve(__dirname, '..', 'src', 'news')
const PORT = 4173
const BASE_URL = `http://localhost:${PORT}`

// Find Chrome executable
function findChrome() {
  const paths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.CHROME_PATH,
  ].filter(Boolean)

  for (const p of paths) {
    if (fs.existsSync(p)) return p
  }
  throw new Error('Chrome not found. Set CHROME_PATH env variable.')
}

// Build all routes from data files
function getAllRoutes() {
  const routes = [
    '/',
    '/tracks',
    '/events',
    '/drivers',
    '/classes',
    '/news',
    '/about',
    '/faq',
    '/live-timing',
    '/submit',
    '/sponsors',
    '/drivers/create',
  ]

  // Track pages
  const tracks = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'tracks.json'), 'utf-8'))
  for (const track of tracks) {
    routes.push(`/tracks/${track.slug}`)
  }

  // Event pages
  const events = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'events.json'), 'utf-8'))
  for (const event of events) {
    const slug = event.slug || event.id
    routes.push(`/events/${slug}`)
  }

  // Driver pages
  const drivers = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'drivers.json'), 'utf-8'))
  for (const driver of drivers) {
    routes.push(`/drivers/${driver.slug}`)
  }

  // News pages (parse from newsIndex — read filenames for slugs)
  const newsFiles = fs.readdirSync(NEWS_DIR).filter(f => f.endsWith('.md') && !f.includes('sample'))
  // Map filenames to slugs (same pattern used in newsIndex.ts)
  const newsSlugs = [
    'crushers-stockcar-teams',
    'cowling-third-super-saloon-crown',
    'caleb-ireland-back-to-back',
    'gisborne-giants-teams',
    'hodgson-nz-midget-champs',
    'ethan-rees-world-240s',
    'brad-lane-modifier-champs',
    'glen-eagles-hat-trick',
    'waikaraka-park-reopening',
    'ben-jenkins-tri-series',
    'daniel-thomas-nz-sprintcar',
    '2025-2026-season-results',
    'nz-speedway-intro',
    'full-contact-combat',
    'multi-million-dollar-investment',
    'drivers-age-5-to-75',
    'dirt-track-gone-digital',
    'speedwayhub-launch-preview',
  ]
  for (const slug of newsSlugs) {
    routes.push(`/news/${slug}`)
  }

  return routes
}

// Start a local static file server using Node's built-in http module
function startServer() {
  return new Promise((resolve, reject) => {
    const http = require('http')

    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.xml': 'application/xml',
      '.txt': 'text/plain',
      '.webmanifest': 'application/manifest+json',
    }

    const server = http.createServer((req, res) => {
      let urlPath = req.url.split('?')[0]
      let filePath = path.join(DIST_DIR, urlPath)

      // Try the exact path first
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath)
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
        fs.createReadStream(filePath).pipe(res)
        return
      }

      // Try with /index.html appended (directory)
      const indexPath = path.join(filePath, 'index.html')
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        fs.createReadStream(indexPath).pipe(res)
        return
      }

      // SPA fallback: serve index.html for all unmatched routes
      const spaIndex = path.join(DIST_DIR, 'index.html')
      res.writeHead(200, { 'Content-Type': 'text/html' })
      fs.createReadStream(spaIndex).pipe(res)
    })

    server.listen(PORT, () => {
      resolve(server)
    })

    server.on('error', reject)
  })
}

// Save rendered HTML for a route
function getFilePath(route) {
  if (route === '/') {
    return path.join(DIST_DIR, 'index.html')
  }
  // Create directory structure: /tracks/western-springs -> /tracks/western-springs/index.html
  const dir = path.join(DIST_DIR, route)
  return path.join(dir, 'index.html')
}

async function prerenderRoute(page, route) {
  const url = `${BASE_URL}${route}`
  const filePath = getFilePath(route)
  const dir = path.dirname(filePath)

  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })

    // Wait a bit for React to render and SEO component to set meta tags
    await page.waitForFunction(() => {
      const root = document.getElementById('root')
      return root && root.children.length > 0
    }, { timeout: 10000 })

    // Small extra delay for useEffect SEO updates
    await new Promise(r => setTimeout(r, 500))

    // Get the full HTML
    let html = await page.content()

    // Clean up: remove any development-only scripts, fix paths
    // Ensure the HTML is self-contained with all meta tags

    // Create directory and write file
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(filePath, html, 'utf-8')

    return true
  } catch (err) {
    console.error(`  FAILED: ${route} - ${err.message}`)
    return false
  }
}

async function main() {
  console.log('SpeedwayHub Pre-renderer')
  console.log('========================\n')

  // Check dist exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error('dist/ folder not found. Run `npm run build` first.')
    process.exit(1)
  }

  // Backup original index.html (SPA shell)
  const spaShell = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8')

  const routes = getAllRoutes()
  console.log(`Found ${routes.length} routes to pre-render\n`)

  // Start local server
  console.log('Starting local server...')
  const server = await startServer()
  console.log(`Server running on port ${PORT}\n`)

  // Launch browser
  const chromePath = findChrome()
  console.log(`Using Chrome: ${chromePath}\n`)

  const tmpUserDataDir = path.join(require('os').tmpdir(), 'speedwayhub-prerender-' + Date.now())
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    userDataDir: tmpUserDataDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  })

  const page = await browser.newPage()

  // Set a reasonable viewport
  await page.setViewport({ width: 1280, height: 800 })

  // Disable images/fonts to speed up rendering
  await page.setRequestInterception(true)
  page.on('request', (req) => {
    const type = req.resourceType()
    if (['image', 'font', 'media'].includes(type)) {
      req.abort()
    } else {
      req.continue()
    }
  })

  let success = 0
  let failed = 0

  // Process routes in batches for speed
  const BATCH_SIZE = 5
  for (let i = 0; i < routes.length; i += BATCH_SIZE) {
    const batch = routes.slice(i, i + BATCH_SIZE)

    for (const route of batch) {
      process.stdout.write(`  [${success + failed + 1}/${routes.length}] ${route}...`)
      const ok = await prerenderRoute(page, route)
      if (ok) {
        success++
        console.log(' OK')
      } else {
        failed++
      }
    }
  }

  // Restore the home page (prerenderRoute overwrites it)
  // Actually we WANT the pre-rendered version, so don't restore

  // Generate 404.html by visiting a non-existent route
  process.stdout.write(`  Generating 404.html...`)
  try {
    await page.goto(`${BASE_URL}/this-page-does-not-exist`, { waitUntil: 'networkidle0', timeout: 15000 })
    await page.waitForFunction(() => {
      const root = document.getElementById('root')
      return root && root.children.length > 0
    }, { timeout: 10000 })
    await new Promise(r => setTimeout(r, 500))
    const notFoundHtml = await page.content()
    fs.writeFileSync(path.join(DIST_DIR, '404.html'), notFoundHtml, 'utf-8')
    console.log(' OK')
  } catch (err) {
    console.log(` FAILED: ${err.message}`)
  }

  await browser.close()

  // Close the server
  server.close()

  console.log(`\nDone! ${success} pages pre-rendered, ${failed} failed.`)
  console.log(`Output: ${DIST_DIR}`)

  // Show some stats
  const totalFiles = countHtmlFiles(DIST_DIR)
  console.log(`Total HTML files in dist: ${totalFiles}`)
}

function countHtmlFiles(dir) {
  let count = 0
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      count += countHtmlFiles(fullPath)
    } else if (entry.name.endsWith('.html')) {
      count++
    }
  }
  return count
}

main().catch((err) => {
  console.error('Pre-render failed:', err)
  process.exit(1)
})
