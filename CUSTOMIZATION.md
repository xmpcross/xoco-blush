# Customization Guide

Use this guide when adapting Blush for a real publication.

## Site Settings

Edit [src/config/site.ts](./src/config/site.ts) first. It controls the site name, default metadata, canonical domain, language and date locale, default colour mode, contact details, social links, feed settings, newsletter form settings, the affiliate disclosure, the front page's "How we test" figures, and every navigation list.

Update `siteConfig.siteUrl` before building for production. Canonical URLs, social image URLs, RSS, robots, sitemap, and JSON-LD all depend on it.

## Sections

Sections (the content model still calls them categories) live in one place: [src/config/categories.ts](./src/config/categories.ts). Add, remove, or rename them there, then update demo posts so every `category` frontmatter value still matches the allowed list.

The `categoryLayouts` map in the same file controls how each section archive presents its posts. Every section must use one of three layouts:

- `featured` opens with the newest post as a cover story, followed by a card grid.
- `grid` uses the standard image-card grid.
- `list` uses the dated archive ledger, one row per post.

Change a section's value in the map to switch its layout; no route or component duplication is required.

`categorySlug` derives URLs from the section name, lowercasing it and turning spaces and ampersands into hyphens — so `Road Trips` becomes `/category/road-trips/`.

The section panel in the header, the drawer, the footer, the section browser on the front page, and the scrolling filter bar on archive pages are all generated from that same list. You do not edit navigation labels or URLs separately unless you customize the layout components.

## Front Page Blocks

The front page is assembled in [src/pages/index.astro](./src/pages/index.astro) from independent blocks, each of which takes the next slice of the archive so nothing above the fold repeats:

| Block             | Component          | Draws from                                     |
| ----------------- | ------------------ | ---------------------------------------------- |
| Lede and banner   | `HomeHero`         | the newest three as slides, next four as cards |
| Most popular      | `PopularRail`      | `trending: true` over the whole archive        |
| Editor's picks    | `EditorSpotlight`  | next four, `editorsPick: true` first           |
| The verdicts      | `ReviewSpotlight`  | the five newest scored reviews, dealt first    |
| How we test       | `StandardsBand`    | `siteConfig.standards` — no posts              |
| Latest posts      | `PostCard`         | next eight posts                               |
| Highlights        | `HighlightColumns` | next nine, dealt across three columns          |
| Browse by section | `SectionPanels`    | the newest cover in each section               |
| Closing panel     | `CtaPanel`         | the newsletter config, or the archive          |

Only the popular rail draws from the whole archive again, so a story can place there while also running further up the page — a ranking that skipped the lead story would be a worse ranking.

Reorder, drop, or duplicate blocks freely — each one hides itself when it has no posts to show. The verdicts block only ever shows posts carrying a `review` block, so a publication that does not score products loses the block and nothing else.

The "How we test" band carries no story. Its eyebrow, title, intro, link, and figures are set in `siteConfig.standards`; leave `items` empty and the band does not render.

The default arrangement asks for up to thirty-two stories before it starts repeating, and the bundled demo archive holds thirty. A smaller archive simply drops the blocks it cannot fill; a larger one gets deeper `slice()` calls at the top of `index.astro`.

`HighlightColumns` deals its posts column by column, so the first three in the list become the three picture cards at the top of the block and everything after them runs as a text-only brief. `perColumn` and `columns` change the shape of the block without changing its markup.

## Newsletter

The newsletter form is provider-neutral. Configure it in `siteConfig.newsletter`:

```ts
newsletter: {
  enabled: true,
  action: "https://example.com/newsletter",
  method: "post",
  emailFieldName: "email",
}
```

The form submits only when `enabled` is `true` and `action` is non-empty. Otherwise the theme renders a clearly disabled preview. The signup lives in the footer of every page: [src/components/SubscribeForm.astro](./src/components/SubscribeForm.astro) rendered inside [src/components/SiteFooter.astro](./src/components/SiteFooter.astro). For production, connect the form to your email provider or replace `SubscribeForm.astro` with provider-specific markup.

## Contact Form

The contact form follows the same safe-default pattern. Configure `siteConfig.contact` with `enabled: true`, a form endpoint in `action`, and the appropriate method. Until then, every control is disabled and no visitor data can be submitted. Contact email, office lines, and response time also live in `siteConfig`.

The default email, office, and social links are presentation-friendly examples. Replace them with real publication details before production; contact and newsletter form submission remain disabled until real endpoints are explicitly enabled.

## Post Frontmatter

Every post is validated by the schema in [src/content.config.ts](./src/content.config.ts). Beyond the obvious fields, a few are worth knowing about:

- Read time is not a frontmatter field. It is counted from the post body at build time, ignoring code blocks and Markdown syntax, at the reading speed set by `siteConfig.wordsPerMinute` (225 by default).
- `trending: true` promotes a post into the front page "Most popular" rail. Falls back to newest-first when too few posts are flagged.
- `editorsPick: true` promotes a post into the front page "Editor's picks" row, with the same newest-first fallback.
- `draft: true` hides a post from every listing, feed, search index, and route.
- `cover.showInPost: false` keeps the cover for cards, ledger thumbnails, and social images but omits it from the article itself, so a post can run as a text-only document.
- `updatedDate` renders an "Updated" line under the article body and drives `dateModified` in the article's JSON-LD.
- `storyLayout` picks the opening treatment for the article page. See [Story Layouts](#story-layouts).
- `review` turns a post into a scored product review. Reviews section only. See [Reviews](#reviews).

## Reviews

A post filed under the review section can carry a `review` block. When it does, the article grows three blocks — the verdict, the highs and lows, and the scoring breakdown — and the post carries a star rating everywhere it appears: the front page banner, cards, briefs, ledger rows, the popular rail, search results, and the article's own header.

The block is only valid on posts in the section named by `REVIEW_CATEGORY` in [src/config/categories.ts](./src/config/categories.ts), which is `"Reviews"` out of the box. A `review` on any other post fails the build with a message saying so. It is optional even inside that section, so a first drive or a comparison can run there unscored.

```yaml
category: "Reviews"
review:
  product:
    name: "Lumen Atelier Barrier Serum" # the exact product tested, shade included
    brand: "Lumen Atelier" # becomes the brand in structured data
    line: "Atelier Essentials" # optional
    type: "Serum" # optional
    shade: "07 Rosewater" # optional
    finish: "Satin" # optional
    size: "30 ml" # optional
  verdict: "The bottom line, in one paragraph."
  ratings: # the weighted breakdown behind the published rating
    - label: "Formula"
      value: 5
      weight: 1.5 # optional, defaults to 1
      note: "One line of justification." # optional
    - label: "Packaging"
      value: 2
  highs: ["At least one"]
  lows: ["At least one — the schema enforces it"]
  buyIf: "Your barrier is compromised and you want one lightweight layer." # optional
  avoidIf: "Fragrance in a leave-on step is a problem for you." # optional
  retailers: # optional; the box does not render when this is empty
    - name: "Lumen Atelier"
      url: "https://example.com/lumen-atelier/barrier-serum"
      note: "Direct from the brand. 60-day return." # optional
    - name: "Halverson & Co"
      url: "https://example.com/halverson/lumen-barrier-serum"
  testedOn: "four weeks, twice daily, on dehydrated combination skin"
  sourcing: "Bought at full price." # optional, has a default
```

Two behaviours to know:

**The rating is derived, not typed.** The published number is the weighted average of `ratings`, rounded to the nearest half star. A flat `rating: 4` is read only when `ratings` is empty.

**Ratings are published in half-star steps.** The schema rejects a `4.3`. Change `RATING_STEP` in [src/config/rating.ts](./src/config/rating.ts) for a finer step.

The scale, the bands, and the wording that appears beside a rating all live in [src/config/rating.ts](./src/config/rating.ts):

```ts
export const RATING_MAX = 5;
export const RATING_STEP = 0.5;

export const ratingBands: RatingBand[] = [
  { min: 4.5, label: "Exceptional", meaning: "As good as this category currently gets…" },
  // …highest first, and the last entry must start at 0
];
```

The star row draws one mark per point on the scale. To move to a larger scale (say, ten points), change [src/components/ui/RatingStars.astro](./src/components/ui/RatingStars.astro) to print a number rather than draw ten stars.

In the scoring breakdown each criterion is drawn as a segmented meter — one cell per point of the scale — with its score in a grey chip beside the label, and the overall closes the block with the star row and the figure. All of it is drawn from the same derived number and styled by the site accent — see [Colour](#colour) to change it.

Full-content feeds open a review with the product, the rating, and the verdict paragraph, since none of that is in the article body — see [src/lib/feeds.ts](./src/lib/feeds.ts).

### Where to buy

A review that lists `retailers` grows a buy box after the scoring breakdown — a tinted panel with one row per seller, each carrying an optional line of detail and a button out. It is the only block in the theme on an accent ground, so a reader can see where the review stops and the shopping starts.

List retailers in the order you would recommend them. The first takes the filled button and the rest take outlined ones, which reads as a preference rather than as a price-comparison table the site cannot keep current. There is no price field, for the same reason the review carries none.

Every link is rendered `target="_blank" rel="sponsored nofollow noopener"` — `sponsored` is what search engines expect of a paid link, and it is not optional in the component.

The wording around the box is set once in `siteConfig.affiliate`, so it cannot drift between articles:

```ts
affiliate: {
  ctaLabel: "Check price",
  disclosure: "We earn a commission when you buy through these links. …",
  disclosureLabel: "How we stay independent",
  disclosureHref: "/about/",
},
```

The disclosure prints under every box and is not switchable. A reader is owed the same information the `rel` attribute already gives a crawler; if your arrangement is different, rewrite the sentence rather than removing it.

## Story Layouts

Every article opens with one of four treatments, set per post in frontmatter:

```yaml
storyLayout: "immersive"
```

| Value       | Opening                                                                    |
| ----------- | -------------------------------------------------------------------------- |
| `standard`  | Headline first, then the cover inside the reading column. The default.     |
| `banner`    | An edge-to-edge cover strip, then the headline block beneath it.           |
| `cover`     | The headline set over the cover photograph, at a fixed height.             |
| `immersive` | The headline centred on a full-height cover, with the header laid over it. |

All four are rendered by [src/components/PostHero.astro](./src/components/PostHero.astro) and share one title block — [src/components/PostHeroHead.astro](./src/components/PostHeroHead.astro) — so the tag, headline, standfirst, and byline never move to a different place between them. Only the picture does.

`cover` and `immersive` both set the type on the photograph, and they differ in how much of the page the picture takes: `cover` runs edge to edge at a fixed height and leaves the top of the page to the header, while `immersive` fills the viewport and centres the title block in it.

Immersive does one thing more: `BaseLayout` puts `has-overlay-header` on `<body>`, which lifts the header onto the artwork and stops it being sticky, so it scrolls away with the photograph.

A post with `cover.showInPost: false` cannot use a layout built around a picture, so `storyLayoutFor()` quietly falls it back to `standard`.

The Layouts dropdown in the header and the drawer both list one live example per layout, derived from the posts themselves rather than hand-listed — see [Navigation](#navigation).

## Navigation

The bar carries the wordmark, a short nav on its centre line, and three controls: search, the colour-mode toggle, and — below the nav breakpoint — the menu button. The nav is `primaryNavigation` in [src/config/site.ts](./src/config/site.ts): four items by default, and it is meant to stay short.

The item marked `layouts` is a plain dropdown listing one live example per story layout — the newest post using each — derived from the posts by `storyLayoutExamples` in [src/lib/posts.ts](./src/lib/posts.ts). It exists to show the theme off; remove the item for a real publication. It opens on hover and on focus in CSS alone, and a tap toggles it.

The item marked `mega` opens the section panel, rendered by [src/components/SiteHeader.astro](./src/components/SiteHeader.astro): every section on the cover of its newest story, with its blurb from `categoryMeta` and a story count, and a lead column beside them carrying the archive link and the rest of `secondaryNavigation`. A section with nothing published is left out. The panel opens on hover and on focus, closes on Escape, on scroll, or when focus leaves it, and on a touch screen the first tap opens it while the second follows the link. With scripting off the item is an ordinary link to its `href`.

Below 64rem the bar hides its nav and the menu button opens the drawer, rendered by [src/components/SiteDrawer.astro](./src/components/SiteDrawer.astro). It slides in from the right and is built from three lists: sections, each with the same thumbnail the panel uses, the story-layout examples derived from the posts, and everything else from `secondaryNavigation`. Add a route there and it appears in both the panel's lead column and the drawer's "More" list without touching a component.

While the drawer is open everything behind it is set `inert`, so the tab key and a screen reader both stay inside it, and Escape closes it.

## Images

Posts keep images next to each Markdown file. Each cover needs useful alt text and a credit URL. Astro optimizes theme-controlled images during build, but source images should still be reasonably sized before shipping a production site — supply covers at least 1200px wide, since each one is also cropped into that post's share card. See [Social Cards](#social-cards).

Covers are cropped by the frame they land in rather than by their own proportions: `4 / 3` for grid cards, media rows, ledger thumbnails (which widen to `3 / 2` from `48rem` up), and the tiles in the header's section panel, and `4 / 5` for the section browser on the front page. The front-page banner and the cover story that opens a `featured` section are sized by `min-height` instead of a ratio, so a long headline lengthens the block rather than spilling out of it. The ratios live on the `.media--*` classes and the `__media` blocks in [src/styles/global.css](./src/styles/global.css), so a publication that prefers taller art changes them in one place. Because the crop is centred, avoid covers whose subject sits hard against the top or bottom edge — and on a cover story, remember the scrim darkens the bottom third, so a subject down there will be lost behind the headline.

## Code Blocks

Fenced code blocks are highlighted at build time by Shiki using the light and dark theme pair in [src/config/code.ts](./src/config/code.ts). Both themes are emitted into the same markup and swapped by CSS, so code follows the reader's colour mode with no flash and no client-side highlighter. Change `codeThemes` to any [Shiki theme](https://shiki.style/themes) name to restyle code without touching a component.

A copy button is added to each block by a small script in [src/pages/post/\[slug\].astro](./src/pages/post/[slug].astro).

## Icons

Social and share icons are hosted locally in [src/icons/bootstrap](./src/icons/bootstrap) and rendered through [src/components/LocalIcon.astro](./src/components/LocalIcon.astro). To add a new social network, add its SVG to that folder, register it in the `icons` map in `LocalIcon.astro`, then map the `siteConfig.socials` label to that icon name in [src/lib/socials.ts](./src/lib/socials.ts). Labels with no mapping fall back to a generic link glyph.

The bundled SVGs come from Bootstrap Icons and include their MIT license notice in the icon folder.

Editorial UI icons — arrows, chevron, search, theme toggle, menu, close, calendar, clock — are drawn inline by [src/components/ui/Icon.astro](./src/components/ui/Icon.astro) instead, so no icon font or sprite is requested.

## Pages

Core static pages live in [src/pages](./src/pages):

- `about.astro`
- `contact.astro`
- `privacy.astro`

Replace the starter copy with publication-specific masthead, advertising, privacy, and legal information. The "How we work" principles on the About page are written directly in that file rather than in config, and so is the photograph under its header: swap `src/assets/about-banner.jpg` and the credit at the top of `about.astro`. That photograph doubles as the page's share card.

## Search

Blush includes static, client-side search with no database or hosted search service. The search control in [src/components/SiteHeader.astro](./src/components/SiteHeader.astro) opens a command palette, while [src/pages/search.astro](./src/pages/search.astro) provides the full `/search/?q=...` results page, rendered as archive ledger rows.

The palette stays empty until something is typed; the search page opens on the whole archive, newest first, and filters down as the query narrows.

Both read the same index and rank it with the same function, so a story cannot place differently depending on where it was searched from. The index shape is defined once in [src/lib/search.ts](./src/lib/search.ts) and served by [src/pages/search-index.json.ts](./src/pages/search-index.json.ts) as `/search-index.json`; it carries the post title, excerpt, section, byline, tags, date, read time, and URL, but not the article body. Add a field there and both surfaces receive it.

The client half — loading the index, matching, ranking — lives in [src/components/SearchRuntime.astro](./src/components/SearchRuntime.astro), which the header renders once per page. Ranking runs in tiers: a headline that starts with the query, then a headline whose words all start with the query's words, then a headline containing it, then a section or tag match, then a mention in the excerpt or byline. Every word typed has to land somewhere, so adding a word narrows the results rather than widening them, and matching on word starts means a half-typed "cream blu" still reaches "Cream Blush Won Because It Forgives Everything". Ties keep archive order, newest first.

The index is fetched the first time someone opens search rather than on page load, and a failed fetch falls back to a small seed of the newest stories already in the page. The search page's resting list is server-rendered, so it works with JavaScript off; clearing the field restores it.

Search can be opened from the header or with `Ctrl + K` on Windows and Linux, `Command + K` on macOS, or `/` while focus is outside a form control. Use the arrow keys to move through command-palette results and `Escape` to close it.

This approach is a good fit for publications with a few hundred posts and should remain comfortable around 1,000 posts. Filtering that amount of metadata in the browser is inexpensive, and the command palette limits the number of rendered results. For a large archive, consider limiting or paginating the full search page because a broad query can otherwise render many result rows at once.

For several thousand pages, full-body search, multilingual search, or richer filtering, consider replacing the built-in index with [Pagefind](https://pagefind.app/). Pagefind indexes the generated `dist` HTML after `astro build`, splits its static index into chunks, and does not require a search server. It is intentionally not included as a default dependency; adopting it requires adding Pagefind to the build and deployment pipeline and connecting its API to the existing search interface.

Because the built-in index is generated statically, newly published or edited posts become searchable after the next site build.

## Saved Stories

Readers can save an article from the save control beside Share — in the article header and again at the foot of the article — and read the list back at `/saved/`, linked from the section panel's lead column and from "More" in the drawer. The list lives in that reader's browser (`localStorage`), so there are no accounts and nothing reaches a server; a saved story that is later unpublished simply drops off the list.

The store is `src/components/SavedRuntime.astro`, the button is `src/components/SaveButton.astro`, and the page is `src/pages/saved.astro`, which renders rows from the same `/search-index.json` the search surfaces use. The buttons render hidden and are revealed by script, so a browser without JavaScript never sees a control that cannot work. To drop the feature, remove the two `SaveButton` usages, the `/saved/` page, and its entry in `secondaryNavigation`.

## Feeds

Every feed is built from [src/lib/feeds.ts](./src/lib/feeds.ts), so they all carry the same item shape:

- `/rss.xml` — everything
- `/category/<section>/rss.xml` — one per section
- `/author/<contributor>/rss.xml` — one per contributor

The section and contributor feeds are advertised two ways: a `<link rel="alternate">` in the head of the page they belong to, so a reader's browser extension finds them, and a visible "Follow" control on the page itself.

Two settings in `siteConfig.rss`:

- `fullContent` puts the rendered article in the feed, so it can be read without leaving the reader app. Set it `false` to ship excerpts only.
- `limit` caps items per feed, newest first.

Full content is rendered through Astro's container, so an MDX post with `<Figure>` and `<Gallery>` in it reaches a reader as real markup instead of component syntax printed literally. On the way out, root-relative image and link paths are lifted onto `siteConfig.siteUrl`, and the lightbox buttons are unwrapped.

If a post cannot be rendered, it ships as its excerpt and the build prints a warning naming it. That warning is the only signal, so do not ignore it.

## Social Cards

Share cards are generated at build time from the images the site already has — there is no separate card image to draw per post. [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) takes an imported image, crops it to the 1200x630 that Facebook, X, LinkedIn, and Slack all expect, and emits it as JPEG alongside `og:image:width`, `og:image:height`, and alt text.

- Articles use their own cover.
- Section, tag, and contributor pages use the newest cover on the page. A contributor shares as their latest cover rather than as their portrait.
- Everything else falls back to `siteConfig.socialImage`, the one static card in `public/`.

Both dimensions are clamped to the source image, because Astro will not enlarge one — supply covers at least 1200px wide to get a full-size card.

Because the crop is centred, the same advice as the rest of the site applies: avoid covers whose subject sits hard against the top or bottom edge.

## Structured Data

Every JSON-LD graph the site emits is built in [src/lib/schema.ts](./src/lib/schema.ts).

- Ordinary pages carry `WebSite`, including a `SearchAction` for `/search/` and the publication as an `Organization`.
- Articles carry `Article`, with the byline as `Person` nodes linked to their contributor archives, the section, tags, language, word count, and read time as `timeRequired`.
- A scored review carries `Review` instead, with `itemReviewed` as a `Product`, `reviewRating` on the same scale the page prints, and the highs and lows as `positiveNotes` and `negativeNotes`. This is what earns a star rating in a search result; the rating in the markup is the same derived number the page prints.
- Every article is followed by a `BreadcrumbList` of home, section, and headline. Each crumb is a link the page itself renders: the wordmark and the section tag under the headline.

`siteConfig.publisherLogo` is the logo in the `Organization` node. It has to be a raster file in `public/`, so the SVG favicon cannot stand in for it — point it at a real wordmark before launch.

## Theme Tokens

Global colors, typography, rules, focus styles, dark mode, and motion rules live in [src/styles/global.css](./src/styles/global.css). Prefer editing tokens near the top of that file before changing individual components.

A few tokens carry more of the design than their names suggest:

- `--background` is a light grey and `--surface` is white. That one-step difference is what lets a photograph or a panel read as an object placed on the page. Setting them equal flattens the whole theme.
- `--accent` is the only saturated colour in the interface. See [Colour](#colour).
- `--border` and `--border-strong` draw every rule in the layout — `--border` is the one the highlight columns and the editor's spotlight use between entries. Raising their contrast makes the design louder; lowering it makes it quieter.
- `--star-track` is the unearned half of a rating row — heavier than `--border`, well short of `--accent`.
- `--ls-label` and `--fs-label` control the tracked capitals used for eyebrows, section names, bylines, and dates. They set the texture of every block on the front page.
- `--scrim` is the gradient behind type laid over a cover photograph. It is a gradient rather than a flat wash so the top of the picture stays untouched; darken its first stop if your covers are bright at the bottom.
- The `--r-*` scale carries every corner: `--r-full` for pills (buttons, chips, the drawer's search field), `--r-xs` for section tags, `--r-md` for cards and images, `--r-lg` for cover stories and the section panels. Set them all to `0` for a hard-edged variant without touching a component.

Two layout helpers are worth knowing before writing new blocks:

- `.grid-hairline` draws perfect 1px rules between cells at any wrap point by letting a 1px gap show the grid's own background through. Use it for cell grids (the contributors grid).
- `.grid-columns` gives each child its own left rule and matching padding, for newspaper-style column sets. Set the desktop track count with `--cols`.

## Fonts

Blush self-hosts two variable typefaces, both OFL-licensed, with no external font requests:

- **[Manrope](https://github.com/sharanda/manrope)** (`public/fonts/manrope`) sets every headline and section title through `--font-display`. It is a geometric grotesque that holds up at 13px and turns handsome at 40, which is what lets one face carry both a card headline and a section announcement.
- **[Mulish](https://github.com/googlefonts/mulish)** (`public/fonts/mulish`) sets prose, metadata, and controls through `--font-sans`, in upright and italic.

`--font-mono` is a system stack used only by code blocks and inline code; there is no monospaced UI, so no third file ships.

Sizes come from the `--fs-*` scale in `:root`, which steps up at the `48rem` and `64rem` breakpoints — change the scale there rather than per component. `--fs-d` is sized for the lead story's own column, not the full page width, so raising it much past `4.5rem` will start breaking the front-page headline across too many lines.

To swap typefaces, replace the `@font-face` rules and the `--font-display` / `--font-sans` tokens at the top of [src/styles/global.css](./src/styles/global.css), drop your files in `public/fonts`, and update the two `<link rel="preload">` tags in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro).

## Colour

There is one accent and no section palette. Every section tag is the same pale rose chip, and links, focus rings, star fills, the scoring meters, and primary buttons all take the same `--accent`.

That leaves four tokens doing nearly all the work:

- `--accent` and `--accent-strong` — links, focus, stars and meters, primary buttons, and their hover state.
- `--tag-background` and `--tag-foreground` — the section chip on cards, rows, and cover stories.

Changing `--accent` re-skins the theme. If you change it to something far from rose, set the tag pair to match: the chip is meant to read as a pale tint of the accent, not as a second colour.

Adding a section to [src/config/categories.ts](./src/config/categories.ts) needs no styling work at all — every section is drawn the same way.

## Motion

Motion runs in two layers, and they do not overlap.

Blocks at the top of a page are on screen before a scroll can happen, so they animate once on load: add the `opener` class to a wrapper and its direct children rise in with a short stagger, while any cover image inside settles from a slight oversize. It is already on the front-page lead, page headers, and article heads.

Everything below the fold is scroll-driven through CSS view timelines: cards, highlight columns, the editor's spotlight, the verdicts, the "How we test" figures, section tiles, the popular rail, ledger rows, the closing panel, the footer columns, and section titles rise as they enter, siblings in a row lag their neighbour a little, and the picture inside a rising card settles from a slight oversize. There is no observer and no hidden state. A browser without view timelines gets the same list through a small IntersectionObserver in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro), which also watches for rows the search and saved pages draw later. The fallback stays off wherever view timelines exist, so the two never both run. To add a block to the reveal, add its selector to the list in `global.css` — it appears twice, once for each layer — and to the matching list in `BaseLayout.astro`.

`prefers-reduced-motion: reduce` flattens all of it.
