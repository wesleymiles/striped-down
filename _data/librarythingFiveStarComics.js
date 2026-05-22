const fs = require("fs");
const path = require("path");

const IMG_REL = path.join("blog", "non-fiction-comics", "img");
const COVERS_DIR = "covers";
const NOTES_DIR = "notes";
const COVERS_PUBLIC = "/blog/non-fiction-comics/img/covers/";
const COVER_EXT = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * 5★ + comics tag from _data/librarything_wesmess.json.
 * Covers: blog/non-fiction-comics/img/covers/{ISBN}.jpg
 * Notes: blog/non-fiction-comics/img/notes/ (see comicsLtBookNotes.json + _includes/comics-book-notes/)
 */
function pickIsbn(book) {
  if (Array.isArray(book.isbn)) {
    const thirteen = book.isbn.find((x) => /^978/.test(String(x)));
    return thirteen || book.isbn[0] || book.originalisbn || null;
  }
  if (book.isbn && typeof book.isbn === "object") {
    return book.isbn["2"] || book.isbn["1"] || book.isbn["0"] || book.originalisbn || null;
  }
  return book.originalisbn || null;
}

function localCoverUrl(book, override, imgRoot) {
  const coversDir = path.join(imgRoot, COVERS_DIR);
  const notesDir = path.join(imgRoot, NOTES_DIR);

  if (override.coverFile) {
    const name = path.basename(String(override.coverFile));
    if (name && fs.existsSync(path.join(coversDir, name))) {
      return COVERS_PUBLIC + name;
    }
    if (name && fs.existsSync(path.join(notesDir, name))) {
      return `/blog/non-fiction-comics/img/notes/${name}`;
    }
  }

  const keys = [];
  const isbn = String(pickIsbn(book) || "").replace(/[^0-9X]/gi, "");
  if (isbn) keys.push(isbn);
  if (book.books_id) keys.push(String(book.books_id));

  for (const key of keys) {
    for (const ext of COVER_EXT) {
      const file = key + ext;
      if (fs.existsSync(path.join(coversDir, file))) {
        return COVERS_PUBLIC + file;
      }
    }
  }
  return null;
}

function loadJson(name) {
  const p = path.join(__dirname, name);
  if (!fs.existsSync(p)) return name.endsWith("Overrides.json") ? {} : null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function loadComicsTagVocabulary() {
  const j = loadJson("nfcComicsTagVocabulary.json") || { tags: [] };
  const tags = Array.isArray(j.tags) ? j.tags : [];
  const order = tags.map((t) => t.id).filter(Boolean);
  return { order, valid: new Set(order), tags };
}

function normalizeDisplayTags(raw, vocabulary, booksId) {
  if (!Array.isArray(raw)) return [];
  const { order, valid } = vocabulary;
  const seen = new Set();
  const out = [];
  for (const r of raw) {
    const id = String(r).trim().toLowerCase();
    if (!id || seen.has(id)) continue;
    if (!valid.has(id)) {
      console.warn(
        `[librarythingFiveStarComics] Unknown tag "${r}" for books_id ${booksId}`
      );
      continue;
    }
    seen.add(id);
    out.push(id);
  }
  out.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return out;
}

function lastFirstToDisplay(lf) {
  const m = String(lf).match(/^(.+),\s*(.+)$/);
  return m ? `${m[2]} ${m[1]}` : lf;
}

function uniqueAuthorNames(book) {
  if (!book.authors?.length) {
    return book.primaryauthor ? lastFirstToDisplay(book.primaryauthor) : "";
  }
  const seen = new Set();
  const out = [];
  for (const a of book.authors) {
    const name = (a.fl || "").trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    out.push(name);
  }
  return out.join(", ");
}

function dateReadYear(book) {
  const m = String(book.dateread || "").match(/(\d{4})/);
  return m ? m[1] : null;
}

function normalize(book, tagOverrides, vocabulary, imgRoot, bookNotes) {
  const isbn = pickIsbn(book);
  const isbnKey = isbn ? String(isbn).replace(/[^0-9X]/gi, "") : "";
  const override =
    (isbnKey && tagOverrides[isbnKey]) || tagOverrides[book.books_id] || {};
  const displayTags = normalizeDisplayTags(override.tags, vocabulary, book.books_id);
  const notesInclude =
    (isbnKey && bookNotes[isbnKey]) || bookNotes[book.books_id] || null;

  return {
    books_id: book.books_id,
    title: book.title,
    authorsDisplay: uniqueAuthorNames(book),
    year: book.date || null,
    dateReadYear: dateReadYear(book),
    displayTags,
    coverUrl: localCoverUrl(book, override, imgRoot),
    notesInclude,
    isbn: isbnKey || null
  };
}

module.exports = function librarythingFiveStarComics() {
  const rootDir = path.join(__dirname, "..");
  const raw = loadJson("librarything_wesmess.json");
  const tagOverrides = loadJson("comicsLtTagOverrides.json");
  const bookNotes = loadJson("comicsLtBookNotes.json") || {};
  const vocabulary = loadComicsTagVocabulary();
  const imgRoot = path.join(rootDir, IMG_REL);

  return Object.values(raw)
    .filter(
      (b) =>
        b.rating === 5 &&
        Array.isArray(b.tags) &&
        b.tags.includes("comics")
    )
    .map((b) => normalize(b, tagOverrides, vocabulary, imgRoot, bookNotes))
    .sort((a, b) =>
      (a.title || "").localeCompare(b.title || "", undefined, {
        sensitivity: "base"
      })
    );
};
