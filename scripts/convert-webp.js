const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targets = [
  path.join(__dirname, '..', 'public'),
  path.join(__dirname, '..', '..', 'speedwayhub', 'assets'),
];

const allowed = new Set(['.png', '.jpg', '.jpeg']);

function findImages(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules or build outputs
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      files.push(...findImages(full));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (allowed.has(ext)) files.push(full);
    }
  }
  return files;
}

async function convertImage(src) {
  const dest = src.replace(/\.[^.]+$/, '.webp');
  await sharp(src).webp({ quality: 82 }).toFile(dest);
  // Remove original to avoid serving mixed formats
  fs.unlinkSync(src);
  console.log('Converted ->', path.relative(path.join(__dirname, '..'), dest));
}

async function main() {
  const images = targets.flatMap(findImages);
  if (!images.length) {
    console.log('No images found to convert.');
    return;
  }
  for (const img of images) {
    await convertImage(img);
  }
  console.log('Done. All images converted to WebP.');
}

main().catch((err) => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
