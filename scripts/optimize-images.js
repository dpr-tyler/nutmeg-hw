import sharp from 'sharp';
import { readdirSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';

const dir = 'public/images';
const files = readdirSync(dir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

for (const file of files) {
  const input = join(dir, file);
  const output = join(dir, basename(file, extname(file)) + '.webp');
  await sharp(input)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output);
  unlinkSync(input);
  console.log(`✓ ${file} → ${basename(output)}`);
}

console.log(`\nDone! Converted ${files.length} images.`);
