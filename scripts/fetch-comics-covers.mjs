#!/usr/bin/env node
/**
 * Download covers into blog/non-fiction-comics/img/covers/{ISBN}.jpg
 * 1) StoryGraph URL from live non-fiction-comics page (title match)
 * 2) Open Library by ISBN
 *   npm run fetch-comics-covers
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "_data", "librarything_wesmess.json");
const LIVE = path.join(ROOT, "blog", "non-fiction-comics", "index.html");
const IMG = path.join(ROOT, "blog", "non-fiction-comics", "img", "covers");

function pickIsbn(b) {
  if (Array.isArray(b.isbn)) {
    const thirteen = b.isbn.find((x) => /^978/.test(String(x)));
    return thirteen || b.isbn[0] || b.originalisbn;
  }
  if (b.isbn && typeof b.isbn === "object") {
    return b.isbn["2"] || b.isbn["1"] || b.isbn["0"] || b.originalisbn;
  }
  return b.originalisbn;
}

function words(s) {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(" ")
      .filter((w) => w.length > 2)
  );
}
function titleScore(a, b) {
  const wa = words(a);
  const wb = words(b);
  let n = 0;
  for (const w of wa) if (wb.has(w)) n++;
  return n / Math.max(wa.size, wb.size, 1);
}

function liveCovers() {
  const html = fs.readFileSync(LIVE, "utf8");
  return [...html.matchAll(/<article[^>]*data-tags="([^"]*)"[^>]*>([\s\S]*?)<\/article>/gi)]
    .map((m) => {
      const t = m[2].match(/itemprop="name"[^>]*>([^<]+)/);
      const img = m[2].match(
        /(?:src|srcset)="(https:\/\/(?:cdn\.thestorygraph\.com|i\.cbc\.ca|images-na\.ssl-images-amazon\.com)\/[^"?]+)/
      );
      return { title: (t && t[1].trim()) || "", url: img && img[1] };
    })
    .filter((x) => x.title && x.url);
}

function hasCover(key) {
  return [".jpg", ".jpeg", ".png", ".webp"].some((ext) =>
    fs.existsSync(path.join(IMG, key + ext))
  );
}

async function download(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "wescarr-comics-cover-fetch/1.0" },
    signal: AbortSignal.timeout(20000),
    redirect: "follow"
  });
  if (!res.ok) return null;
  const type = res.headers.get("content-type") || "";
  if (!type.includes("image")) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.length >= 500 ? buf : null;
}

function storygraphUrlFor(book, live) {
  let best = null;
  let bestScore = 0.28;
  for (const l of live) {
    const s = Math.max(titleScore(book.title, l.title), titleScore(book.title, l.title.split(":")[0]));
    if (s > bestScore) {
      bestScore = s;
      best = l;
    }
  }
  return best?.url || null;
}

function loadCoverSources() {
  const p = path.join(ROOT, "_data", "comicsCoverSources.json");
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : {};
}

fs.mkdirSync(IMG, { recursive: true });
const live = liveCovers();
const manual = loadCoverSources();
const books = Object.values(JSON.parse(fs.readFileSync(DATA, "utf8"))).filter(
  (b) => b.rating === 5 && b.tags?.includes("comics")
);

let ok = 0;
let skip = 0;
for (const b of books) {
  const isbn = pickIsbn(b);
  const key = isbn
    ? String(isbn).replace(/[^0-9X]/gi, "")
    : String(b.books_id);
  if (!key || hasCover(key)) {
    skip++;
    continue;
  }
  const dest = path.join(IMG, key + ".jpg");
  const isbnKey = isbn ? String(isbn).replace(/[^0-9X]/gi, "") : null;
  const sources = [
    (isbnKey && manual[isbnKey]) || manual[b.books_id],
    storygraphUrlFor(b, live),
    isbnKey
      ? `https://covers.openlibrary.org/b/isbn/${isbnKey}-L.jpg?default=false`
      : null
  ].filter(Boolean);

  process.stdout.write(`${key}.jpg … `);
  let saved = false;
  for (const url of sources) {
    try {
      const buf = await download(url);
      if (buf) {
        fs.writeFileSync(dest, buf);
        console.log(
          manual[isbnKey] && url === manual[isbnKey]
            ? "manual"
            : url.includes("storygraph")
              ? "storygraph"
              : url.includes("openlibrary")
                ? "openlibrary"
                : "url"
        );
        ok++;
        saved = true;
        break;
      }
    } catch {
      /* try next source */
    }
  }
  if (!saved) console.log("miss");
  await new Promise((r) => setTimeout(r, 200));
}
console.log(`\n${ok} saved, ${skip} skipped, ${books.length - ok - skip} failed`);
