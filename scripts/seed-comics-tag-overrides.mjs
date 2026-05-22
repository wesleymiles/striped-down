#!/usr/bin/env node
/**
 * Merge live-page data-tags into _data/comicsLtTagOverrides.json (ISBN keys).
 * Keeps existing entries; only adds/updates fuzzy matches from non-fiction-comics/index.html.
 *   node scripts/seed-comics-tag-overrides.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIVE = path.join(ROOT, "blog", "non-fiction-comics", "index.html");
const LT = path.join(ROOT, "_data", "librarything_wesmess.json");
const OUT = path.join(ROOT, "_data", "comicsLtTagOverrides.json");

function norm(s) {
  return s.toLowerCase().replace(/[^0-9X]+/gi, " ").trim();
}
function words(s) {
  return new Set(norm(s).split(" ").filter((w) => w.length > 2));
}
function score(a, b) {
  const wa = words(a);
  const wb = words(b);
  let n = 0;
  for (const w of wa) if (wb.has(w)) n++;
  return n / Math.max(wa.size, wb.size, 1);
}

const html = fs.readFileSync(LIVE, "utf8");
const live = [...html.matchAll(/<article[^>]*data-tags="([^"]*)"[^>]*>([\s\S]*?)<\/article>/gi)]
  .map((m) => {
    const t = m[2].match(/itemprop="name"[^>]*>([^<]+)/);
    return {
      tags: m[1].replace(/\s+/g, "").split(",").filter(Boolean),
      title: (t && t[1].trim()) || ""
    };
  })
  .filter((x) => x.title);

const books = Object.values(JSON.parse(fs.readFileSync(LT, "utf8"))).filter(
  (b) => b.rating === 5 && b.tags?.includes("comics")
);

const out = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
let added = 0;
for (const b of books) {
  const rawIsbn = Array.isArray(b.isbn)
    ? b.isbn.find((x) => /^978/.test(String(x))) || b.isbn[0]
    : b.isbn?.["2"] || b.isbn?.["0"] || b.originalisbn;
  const isbn = String(rawIsbn || "").replace(
    /[^0-9X]/gi,
    ""
  );
  if (!isbn || out[isbn]?.tags?.length) continue;
  let best = null;
  let bestScore = 0.35;
  for (const l of live) {
    const s = Math.max(score(b.title, l.title), score(b.title, l.title.split(":")[0]));
    if (s > bestScore) {
      bestScore = s;
      best = l;
    }
  }
  if (best) {
    out[isbn] = { tags: best.tags };
    added++;
  }
}
for (const b of books) {
  if (!b.books_id || out[b.books_id]?.tags?.length) continue;
  const rawIsbn = Array.isArray(b.isbn)
    ? b.isbn.find((x) => /^978/.test(String(x))) || b.isbn[0]
    : b.isbn?.["2"] || b.isbn?.["0"] || b.originalisbn;
  const isbn = String(rawIsbn || "").replace(
    /[^0-9X]/gi,
    ""
  );
  if (isbn && out[isbn]) continue;
  let best = null;
  let bestScore = 0.35;
  for (const l of live) {
    const s = Math.max(score(b.title, l.title), score(b.title, l.title.split(":")[0]));
    if (s > bestScore) {
      bestScore = s;
      best = l;
    }
  }
  if (best) {
    out[b.books_id] = { tags: best.tags };
    added++;
  }
}

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`${Object.keys(out).length} entries total, ${added} new from live page`);
