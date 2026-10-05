import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function placeholder({ width, height, lines, from, to, out }) {
  const fontSize = Math.round(height / 11);
  const gap = Math.round(fontSize * 1.6);
  const text = lines
    .map(
      (line, i) =>
        `<text x="50%" y="${50 + (i - (lines.length - 1) / 2) * gap}%" fill="rgba(255,255,255,0.88)" font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="600" text-anchor="middle" dominant-baseline="middle">${line}</text>`
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  ${text}
</svg>`;
  return sharp(Buffer.from(svg)).png().toFile(out);
}

async function main() {
  const out = (p) => path.join(root, p);
  fs.mkdirSync(path.join(root, 'public'), { recursive: true });
  fs.mkdirSync(out('src/blog/es/primer-viaje'), { recursive: true });

  await sharp(out('public/logoBlog.svg'), { density: 96 })
    .resize(64, 64, { fit: 'cover' })
    .png()
    .toFile(out('public/favicon.png'));

  await placeholder({
    width: 1200, height: 630,
    lines: ["Nerf's World", "Escritos, viajes y pensamientos de TRIP"],
    from: "#141519", to: "#2a2340", out: out('public/og-default.png'),
  });

  await placeholder({ width: 1600, height: 900, lines: ["TRIP — viaje de ejemplo"], from: "#23283b", to: "#43406e", out: out('src/blog/es/primer-viaje/cover.png') });
  await placeholder({ width: 1600, height: 1000, lines: ["Foto 1"], from: "#31404f", to: "#5c6b73", out: out('src/blog/es/primer-viaje/foto-1.png') });
  await placeholder({ width: 1600, height: 1000, lines: ["Foto 2"], from: "#403a45", to: "#6b5d6f", out: out('src/blog/es/primer-viaje/foto-2.png') });

  console.log('images generated');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});