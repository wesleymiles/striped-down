#!/bin/bash
# Bake EXIF orientation into pixels before production builds.
# Uses sharp (same processor as eleventy-img) so results match the site pipeline.
set -euo pipefail
cd "$(dirname "$0")/.."

node <<'NODE'
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const roots = ["blog", "art"];

function findImages(dir) {
  const out = [];
  function walk(d) {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (/\.(jpe?g|png|webp)$/i.test(ent.name)) out.push(p);
    }
  }
  walk(dir);
  return out;
}

async function bakeExif(file) {
  const meta = await sharp(file).metadata();
  if (!meta.orientation || meta.orientation === 1) return false;
  const tmp = `${file}.orient.tmp`;
  await sharp(file).rotate().toFile(tmp);
  fs.renameSync(tmp, file);
  console.log(`EXIF baked: ${file} (was orientation ${meta.orientation})`);
  return true;
}

(async () => {
  let count = 0;
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const file of findImages(root)) {
      if (await bakeExif(file)) count++;
    }
  }
  console.log(`Done. ${count} image(s) updated.`);
})();
NODE
