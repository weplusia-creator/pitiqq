import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function makeSvg(size) {
  const fontSize = Math.round(size * 0.6);
  const dy = Math.round(fontSize * 0.36);
  const rx = Math.round(size * 0.15);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" rx="${rx}" fill="#0a0a0a"/>` +
    `<text x="50%" y="50%" dy="${dy}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="${fontSize}" fill="#ec4899">P</text>` +
    `</svg>`
  );
}

const dir = path.join(__dirname, "public");
await sharp(makeSvg(192)).resize(192, 192).png().toFile(path.join(dir, "icon-192.png"));
console.log("Created icon-192.png");
await sharp(makeSvg(512)).resize(512, 512).png().toFile(path.join(dir, "icon-512.png"));
console.log("Created icon-512.png");
