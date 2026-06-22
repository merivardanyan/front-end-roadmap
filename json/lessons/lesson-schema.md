# Lesson JSON Schema — Front-End Roadmap

This is the contract every `json/lessons/<chapter-id>/<lesson-id>.json` file must follow.
Lock this first, update the renderer to match, then generate content against it.

## File location & naming
- Path: `json/lessons/<chapterId>/<lessonId>.json`
- `<lessonId>` MUST equal both the file name and the `id` inside the file, and must
  match an `id` listed for that chapter in `json/lessons.json`.
- Example: `json/lessons/core-web-foundations/dns-explained.json`

## Top-level shape

```json
{
  "id": "how-the-web-works",          // string, == filename, == id in lessons.json
  "chapterId": "core-web-foundations", // string, == parent folder
  "title": "How the Web Works",        // string
  "order": 1,                          // number, unique within chapter
  "summary": [ ... ],                  // NEW: fast-check TL;DR, array of short strings
  "sections": [ ... ],                 // ordered teaching blocks (see below)
  "questions": [ ... ]                 // 3 recommended; can be []
}
```

### `summary` (NEW — the "fast check" block)
For people who want to scan everything quickly. 3–5 short, self-contained
bullet sentences that capture the whole lesson. No jargon. This renders pinned
at the top in a highlighted box, before the sections.

```json
"summary": [
  "The internet is a worldwide network of connected computers.",
  "The web is the linked pages that live on that network.",
  "Your browser asks a server for a page and the server sends it back.",
  "The whole round trip usually takes a fraction of a second."
]
```

## Sections — allowed `type` values

Keep this fixed set (these are the ones already in use). Recommended order is the
psychological flow: hook → explain → anchor → procedure → reward → recall.

| type          | required fields            | purpose (pedagogy)                          |
|---------------|----------------------------|---------------------------------------------|
| `intro`       | `text`                     | Hook. One short, curiosity-opening paragraph.|
| `explanation` | `title`, `text`            | Core idea, explained like to a 10-year-old. |
| `analogy`     | `title`, `text`            | Anchor the new idea to something familiar.  |
| `steps`       | `title`, `items[]`         | Procedure as an ordered list.               |
| `fun-fact`    | `text`                     | Small dopamine hit; aids memory.            |
| `key-terms`   | `title`, `terms[]`         | Recall list. Each term `{word, definition}`.|

### Optional `media` on ANY section (NEW — image/animation slot)
Lets you drop in a visual later without changing the schema. While `src` is empty
or `placeholder` is true, the renderer shows a labelled placeholder box.

```json
{
  "type": "analogy",
  "title": "Think of it like Ordering Food",
  "text": "...",
  "media": {
    "type": "image",          // "image" | "animation"
    "src": "",                // fill later; empty = show placeholder
    "alt": "Browser ordering a page like ordering pizza",
    "placeholder": true
  }
}
```

### `steps` example
```json
{
  "type": "steps",
  "title": "What Happens When You Visit a Website",
  "items": [
    "You type an address and press enter.",
    "Your browser asks a server for the page.",
    "The server sends the page back.",
    "Your browser shows it on the screen."
  ]
}
```

### `key-terms` example
```json
{
  "type": "key-terms",
  "title": "Words to Remember",
  "terms": [
    { "word": "Server", "definition": "A computer that stores pages and sends them when asked." }
  ]
}
```

## Questions

Easy and reasonable — testing recognition, not tricking. 3 per lesson is the
sweet spot. `answer` is the **zero-based index** into `options`.

```json
{
  "id": "q1",                    // unique within the lesson: q1, q2, q3
  "text": "What is a server?",
  "options": [
    "A computer that stores pages and sends them when asked",
    "A type of internet cable",
    "The screen you look at",
    "A button on your keyboard"
  ],
  "answer": 0,                   // 0-based; here option[0] is correct
  "explanation": "A server stores web pages and sends them to your browser when you ask."
}
```

Rules:
- 4 options per question.
- Wrong options should be plausible-but-clearly-wrong, not absurd, not near-duplicates.
- Always include `explanation` — it's shown after the learner answers.

## Style rules (so 200 lessons feel consistent)
- Reading level: ~10-year-old. Short sentences. Everyday words. No "utilize", no "leverage".
- Every lesson: `summary` + `intro` + at least 2 `explanation` + 1 `analogy` + `key-terms` + 3 `questions`.
- One idea per section. If a section runs long, split it.
- Tone: warm, encouraging, concrete examples over abstractions.

## Validation checklist (run before committing a batch)
- [ ] `id` == filename == entry in `lessons.json`
- [ ] `chapterId` == parent folder name
- [ ] `order` unique within the chapter
- [ ] every `steps` section has non-empty `items`
- [ ] every `key-terms` term has both `word` and `definition`
- [ ] every question: 4 `options`, `answer` is an integer in range, has `explanation`
- [ ] valid JSON (no trailing commas)
