# Changelog

All notable changes to Blush are documented here.

## 1.0.1 - 2026-10-21

- Updated Astro to 7.4.1 and other dependencies.
- Updated `AGENTS.md` for Astro 7.
- Files check out with LF line endings on every platform.

## 1.0.0 - 2026-09-04

- Initial commercial release.
- Markdown and MDX content collections with a validated frontmatter schema: title, excerpt, section, dates, bylines, tags, cover with credit, story layout, trending and editor's pick flags, and a draft flag. A bad field fails the build.
- Scored product reviews: an optional `review` block carrying the product down to the shade, a verdict, a weighted breakdown of criteria, highs and lows, buy-it-if and look-elsewhere-if lines, retailers, and how the product was tested and paid for. Review section only, and optional inside it.
- The published rating is the weighted average of the criteria, rounded to the nearest half star. Scale, step, and verdict bands live in `src/config/rating.ts`.
- Four blocks on a scored review — the verdict panel, highs and lows, the scoring breakdown, and a "where to buy" box with sponsored links and a disclosure set once in config — and a star rating on every surface the review appears.
- Four article layouts set per post in frontmatter — `standard`, `banner`, `cover`, and `immersive` — sharing one title block.
- Article pages with a reading column, a reading-progress bar, share, copy-link, and save controls, an author box, and a "keep reading" set.
- Front page dealt from the archive with no story repeated: a banner slideshow with a lede strip, a "most popular" rail, editor's picks, a verdicts panel for the newest scored reviews, a "How we test" band, a card grid, highlight columns, a section browser, and a closing panel. Any block with nothing to show hides itself.
- Header with a centred three-part nav: a Sections panel showing every section on the cover of its newest story, a Layouts dropdown of one live example per story layout, and plain links; search and colour mode as icons; a focus-trapped drawer below the nav breakpoint.
- Paginated archive, section, tag, and contributor pages with a scrolling section filter bar, per-section archive layouts, and one shared ledger row.
- Saved stories: a per-browser reading list in `localStorage`, read back at `/saved/`.
- Client-side search over a statically generated index, shared by a keyboard command palette and a results page that works without JavaScript.
- Feeds for the whole site, each section, and each contributor, carrying full article content by default.
- Read time counted from the post body at build time; drafts excluded from every listing, feed, and search index.
- Canonical URLs, sitemap, `robots.txt`, Open Graph, Twitter/X cards, and JSON-LD for articles, reviews, breadcrumbs, and the site, with share cards cropped from each cover at build time.
- Scroll-driven CSS motion with an IntersectionObserver fallback, load entrances above the fold, and full `prefers-reduced-motion` support.
- System-aware light and dark modes with a saved reader preference.
- Manrope and Mulish self-hosted as variable fonts, and a local Bootstrap icon set — no external font or icon requests.
- Provider-neutral newsletter and contact forms that ship disabled and say so.
- Site identity, SEO defaults, navigation, the "How we test" figures, sections, author portraits, rating scale, and code themes in `src/config`.
- Static output with no framework islands; JavaScript only for search, the header menus, the drawer, saving, theme switching, and the progress bar.
