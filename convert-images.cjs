const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToWebP(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await convertToWebP(filePath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

      try {
        await sharp(filePath)
          .webp({ quality: 85 })
          .toFile(webpPath);

        console.log(`Converted: ${file} -> ${path.basename(webpPath)}`);

        // Delete original after successful conversion
        fs.unlinkSync(filePath);
        console.log(`Deleted original: ${file}`);
      } catch (error) {
        console.error(`Error converting ${file}:`, error.message);
      }
    }
  }
}

// Convert images in public and dist directories
const publicPhotos = path.join(__dirname, 'public', 'photos');
const distPhotos = path.join(__dirname, 'dist', 'photos');

Promise.all([
  convertToWebP(publicPhotos),
  convertToWebP(distPhotos)
]).then(() => {
  console.log('All images converted to WebP!');
}).catch(err => {
  console.error('Conversion failed:', err);
});
