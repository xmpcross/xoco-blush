# Blush - Astro Beauty Magazine Theme

[![Blush theme preview](./preview.webp)](https://blush.xocoweb.workers.dev/)

[![Astro 7](https://img.shields.io/badge/Astro-7-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Configured-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: Commercial](https://img.shields.io/badge/License-Commercial-84cc16?style=for-the-badge)](./LICENSE)

**Live preview:** https://blush.xocoweb.workers.dev/

Blush is an Astro magazine theme for beauty publications: skincare, makeup, hair, fragrance, and the product reviews that go with them. A warm porcelain ground, one rose accent, and soft-cornered covers are built for pale beauty photography, and the front page is dealt from the archive so no story repeats and empty blocks hide themselves. A post in the review section can carry a `review` block and become a scored product review, with a rating derived from a weighted breakdown so the stars can never disagree with the reasoning beneath them. Content is Markdown or MDX validated by Astro content collections, search runs on a static index with no service behind it, and the output is static with no framework islands to hydrate.

## Features

- A front page dealt from the archive with no repeats: a banner slideshow over a lede strip, a scrolling "most popular" rail, an editor's spotlight, a verdicts panel that prints the newest scored review's bottom line, a "How we test" band on ink, a card grid, highlight columns, and a section browser — every block hiding itself when it has nothing to show
- Scored product reviews from an optional `review` block in frontmatter — the product down to the shade, a verdict, a weighted breakdown of criteria, highs and lows, buy-it-if and look-elsewhere-if, retailers, and how it was tested and paid for — refused outside the review section
- A published rating derived from the breakdown and rounded to the nearest half star, so the stars can never disagree with the reasoning under them; scale, step, and verdict bands in one config file
- Star ratings on every surface a review reaches, and a "where to buy" box with `rel="sponsored nofollow"` links over a disclosure written once in config
- Four article openings set per post — `standard`, `banner`, `cover`, `immersive` — sharing one title block
- A short centred nav: Sections opens a full-width panel showing every section on the cover of its newest story, Layouts is a dropdown of one live example per opening, and a focus-trapped drawer takes over below the nav breakpoint
- Archive, section, tag, and contributor pages built from one ledger row, with a scrolling section filter bar and featured, grid, or list layouts per section
- Client-side search with a keyboard palette (`/` or `⌘K`) and a results page that works without JavaScript, both reading one build-time index ranked in tiers and matched on word starts
- Saved stories: a per-browser reading list from any article, read back at `/saved/`, with no accounts or backend
- A feed for everything, one per section, and one per contributor, carrying full article content by default
- Markdown and MDX content collections with a validated frontmatter schema, read time counted from the body at build time, and drafts excluded from every listing, feed, and index
- Sections, navigation, authors, the rating scale, and SEO defaults in a handful of config files, so the site can be renamed and re-scoped without touching a component
- Per-post share cards cropped from each cover at build time, plus canonical URLs, sitemap, RSS, `robots.txt`, Open Graph, Twitter/X cards, and JSON-LD for `Article`, `Review`, `BreadcrumbList`, and `WebSite`
- Two self-hosted variable fonts (Manrope, Mulish), a warm porcelain palette with one rose accent in light and dark, and a radius scale that can be set to `0` in one place
- CSS-only scroll-driven motion with an observer fallback, flattened under `prefers-reduced-motion`
- Provider-neutral newsletter and contact forms — point them at any endpoint that accepts a POST, or leave them off
- Static output with no framework islands; JavaScript only for search, the header menus, the drawer, saving, theme switching, and the progress bar
- Skip link, landmarks, labelled controls, visible focus states, and one tab stop per story row

## Tech Stack

- Astro 7
- Tailwind CSS 4 via the Vite plugin
- Vite 8
- TypeScript
- Astro content collections
- `@astrojs/sitemap` and `@astrojs/rss`
- Sharp for image processing

## Requirements

- Node.js `22.12.0` or newer
- npm

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Customization

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for site settings, sections, the front page, navigation, newsletter and contact forms, frontmatter, reviews, images, code blocks, icons, pages, search, feeds, fonts, and theme tokens. The default colour mode is `siteConfig.defaultColorMode` in [src/config/site.ts](./src/config/site.ts).

## Content

Posts live in [src/content/posts](./src/content/posts). Each post is a folder with an `index.md` and a `cover.jpg`. Frontmatter is validated by the schema in [src/content.config.ts](./src/content.config.ts).

Reviews are ordinary posts filed under Reviews with a `review` block added — the five bundled reviews are written that way, and they land in different verdict bands. See [Reviews](./CUSTOMIZATION.md#reviews) for the full field list.

The bundled demo covers come from [Unsplash](https://unsplash.com/) and [Pexels](https://www.pexels.com/) under their free licenses; each post credits its photographer in frontmatter. Replace them with your own imagery before publishing.

Author portraits live in [src/config/authors.ts](./src/config/authors.ts), keyed by the `author.name` used in post frontmatter, with the images in `src/assets/authors`. Names with no entry fall back to a monogram avatar. The bundled portraits are Unsplash and Pexels placeholders — the people photographed have no connection to these fictional bylines, so swap in photos of your real contributors before publishing.

## Support

See [SUPPORT.md](./SUPPORT.md) for what is included with a license.

## License

Commercial license. See [LICENSE](./LICENSE) for complete terms.
