const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const publicDir = path.join(__dirname, '../public')

async function generateLogoAssets() {
  console.log('🎨 Generating logo assets...\n')

  // Main logo - square (for social media, app icons)
  const mainLogoSvg = fs.readFileSync(path.join(publicDir, 'logo.svg'))

  // Generate PNG versions of main logo
  await sharp(mainLogoSvg)
    .resize(1200, 1200)
    .png()
    .toFile(path.join(publicDir, 'logo-1200.png'))
  console.log('✓ Generated logo-1200.png (1200x1200) - Social media')

  await sharp(mainLogoSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo-512.png'))
  console.log('✓ Generated logo-512.png (512x512) - PWA icon')

  await sharp(mainLogoSvg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'logo-192.png'))
  console.log('✓ Generated logo-192.png (192x192) - PWA icon')

  await sharp(mainLogoSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))
  console.log('✓ Generated apple-touch-icon.png (180x180) - iOS')

  // Generate WebP version
  await sharp(mainLogoSvg)
    .resize(1200, 1200)
    .webp({ quality: 90 })
    .toFile(path.join(publicDir, 'logo-1200.webp'))
  console.log('✓ Generated logo-1200.webp (1200x1200)')

  // Favicon PNG versions
  const faviconSvg = fs.readFileSync(path.join(publicDir, 'favicon.svg'))

  await sharp(faviconSvg)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'))
  console.log('✓ Generated favicon-32x32.png')

  await sharp(faviconSvg)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'))
  console.log('✓ Generated favicon-16x16.png')

  console.log('\n✨ All logo assets generated successfully!')
  console.log('\nGenerated files:')
  console.log('  - logo-1200.png (for Facebook OG image)')
  console.log('  - logo-1200.webp (for site use)')
  console.log('  - logo-512.png (PWA icon)')
  console.log('  - logo-192.png (PWA icon)')
  console.log('  - apple-touch-icon.png (iOS)')
  console.log('  - favicon-32x32.png')
  console.log('  - favicon-16x16.png')
}

generateLogoAssets().catch(console.error)
