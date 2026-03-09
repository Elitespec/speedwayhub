const fs = require('fs')
const path = require('path')

// Import data
const tracks = require('../src/data/tracks.json')
const events = require('../src/data/events.json')
const drivers = require('../src/data/drivers.json')

const baseUrl = 'https://speedwayhub.nz'
const today = new Date().toISOString().split('T')[0]

// Generate XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}/tracks</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/events</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/news</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/live-timing</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/drivers</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/classes</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

`

// Add all track pages
tracks.forEach((track) => {
  sitemap += `  <!-- Track: ${track.name} -->
  <url>
    <loc>${baseUrl}/tracks/${track.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

`
})

// Add all event pages
events.forEach((event) => {
  const eventDate = event.date || today
  sitemap += `  <!-- Event: ${event.title} -->
  <url>
    <loc>${baseUrl}/events/${event.slug || event.id}</loc>
    <lastmod>${eventDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

`
})

// Add all driver pages
drivers.forEach((driver) => {
  if (driver.slug) {
    sitemap += `  <!-- Driver: ${driver.name} -->
  <url>
    <loc>${baseUrl}/drivers/${driver.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

`
  }
})

// News posts - we'll add these based on the newsIndex
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

newsSlugs.forEach((slug) => {
  sitemap += `  <!-- News: ${slug} -->
  <url>
    <loc>${baseUrl}/news/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

`
})

sitemap += `</urlset>`

// Write sitemap
const publicDir = path.join(__dirname, '../public')
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap)
console.log('✓ Sitemap generated at public/sitemap.xml')
const driverCount = drivers.filter(d => d.slug).length
console.log(`✓ Total URLs: ${tracks.length + events.length + driverCount + newsSlugs.length + 7}`)
