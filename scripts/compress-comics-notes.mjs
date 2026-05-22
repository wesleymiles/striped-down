#!/usr/bin/env node
/**
 * Resize/compress blog/non-fiction-comics/img/notes for web.
 *   npm run compress-comics-notes
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const NOTES = path.join(ROOT, "blog", "non-fiction-comics", "img", "notes");
const MAX_WIDTH = 1400;
const JPEG_QUALITY = 82;

const SKIP = new Set([".mp4", ".mov", ".webm"]);

async function compressFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (SKIP.has(ext)) return { skipped: true };

  const before = fs.statSync(filePath).size;
  const img = sharp(filePath);
  const meta = await img.metadata();
  const pipeline = sharp(filePath).rotate();

  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (ext === ".png") {
    await pipeline.png({ compressionLevel: 9 }).toFile(filePath + ".tmp");
  } else if (ext === ".jpg" || ext === ".jpeg") {
    await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(filePath + ".tmp");
  } else {
    return { skipped: true };
  }

  fs.renameSync(filePath + ".tmp", filePath);
  const after = fs.statSync(filePath).size;
  return { before, after };
}

if (!fs.existsSync(NOTES)) {
  console.error("Notes folder not found:", NOTES);
  process.exit(1);
}

const files = fs.readdirSync(NOTES).filter((f) => !f.startsWith("."));
let saved = 0;

for (const name of files) {
  const filePath = path.join(NOTES, name);
  if (!fs.statSync(filePath).isFile()) continue;
  process.stdout.write(`${name} … `);
  try {
    const result = await compressFile(filePath);
    if (result.skipped) {
      console.log("skip");
      continue;
    }
    const delta = result.before - result.after;
    saved += delta;
    console.log(
      `${(result.before / 1024).toFixed(0)}KB → ${(result.after / 1024).toFixed(0)}KB`
    );
  } catch (err) {
    console.log("err", err.message);
  }
}

console.log(`\nSaved ~${(saved / 1024 / 1024).toFixed(1)} MB total`);
