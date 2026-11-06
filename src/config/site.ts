import { categories, categorySlug, REVIEW_CATEGORY } from "./categories";

export const siteConfig = {
  name: "Blush",
  tagline: "Beauty, tested honestly",
  title: "Blush - An editorial Astro blog theme for beauty publications",
  description:
    "An Astro blog theme for beauty publications: product reviews, skincare, makeup, hair, fragrance, and the routines around them.",
  siteUrl: "https://blush.xocoweb.workers.dev",
  authorName: "Andrei Alba",
  email: "hello@example.com",
  language: "en",
  dateLocale: "en-US",
  /**
   * Reading speed used to estimate the "min read" line on cards and articles.
   * Read time is counted from the post body at build time, so no post carries
   * it in frontmatter. Lower it for denser, more technical writing.
   */
  wordsPerMinute: 225,
  /**
   * The mode a first-time visitor gets. "system" follows the operating system;
   * "light" or "dark" pins it. A reader who uses the toggle overrides this, and
   * their choice is remembered.
   */
  defaultColorMode: "light",
  locale: "en_US",
  socialImage: "/og-image.png",
  /**
   * The publication's logo in structured data. It has to be a raster file in
   * `public/`, so the favicon cannot stand in for it — point this at a real
   * wordmark before launch. The share card is the default only because it is
   * the one raster asset the theme ships.
   */
  publisherLogo: "/og-image.png",
  /** Short bio shown in the footer and under the About page header. */
  bio: "A magazine about beauty that reads the ingredient list — what a product does on real skin, who formulated it that way, and whether the claim on the box survives four weeks of use.",
  /**
   * The "How we test" band on the front page: a few figures that say how the
   * publication works, set on a dark ground between the story blocks. `unit`
   * and `note` are optional on each item. Empty `items` and the band does not
   * render.
   */
  standards: {
    eyebrow: "How we test",
    title: "Worn for weeks, bought at full price, scored in half stars.",
    intro:
      "A review here is the record of a product used the way a reader would use it, for long enough to see what it does and what it undoes.",
    href: "/about/",
    linkLabel: "How we work",
    items: [
      {
        figure: "4",
        unit: "wks",
        label: "The shortest test we publish",
        note: "Most formulas take a month to show what they do, and what they undo.",
      },
      {
        figure: "100",
        unit: "%",
        label: "Bought at full price",
        note: "Every product is paid for by the desk. Nothing arrives as a sample.",
      },
      {
        figure: "0",
        unit: "",
        label: "Brands that read a review first",
        note: "No draft leaves the building before it is published.",
      },
      {
        figure: "½",
        unit: "star",
        label: "The finest step we score in",
        note: "A 4.3 invites you to measure the artwork. We round, and say why.",
      },
    ],
  },
  /**
   * Feeds. Alongside `/rss.xml` for everything, every section and every
   * contributor gets their own feed at `<their page>rss.xml`, linked from the
   * page it belongs to.
   *
   * `fullContent` puts the rendered article in the feed, so it can be read
   * without leaving the reader app. Set it false to ship excerpts only, which
   * is the usual choice when the site is funded by traffic to it.
   */
  rss: {
    fullContent: true,
    /** Items per feed, newest first. */
    limit: 20,
  },
  /**
   * The "where to buy" box on a review. Retailers are listed per post in
   * frontmatter — see `review.retailers` in `src/content.config.ts` — and
   * everything a reader is told about the arrangement is set here, in one
   * place, so the wording cannot drift from article to article.
   *
   * The disclosure is not optional in the theme, and it should not be in your
   * publication either: every link the box draws is marked
   * `rel="sponsored nofollow"`, and a reader is owed the same information the
   * markup already gives a search engine.
   */
  affiliate: {
    /** The label on every button in the box. */
    ctaLabel: "Check price",
    disclosure:
      "We earn a commission when you buy through these links. It never changes what we recommend, and we buy every product we test.",
    /** The linked words that close the disclosure sentence. */
    disclosureLabel: "How we stay independent",
    disclosureHref: "/about/",
  },
  newsletter: {
    enabled: false,
    action: "",
    method: "post",
    emailFieldName: "email",
    title: "The good stuff, once a fortnight.",
    description:
      "New reviews, ingredient explainers, and the shade notes that never fit in a caption. No spam, unsubscribe anytime.",
    terms: "By subscribing you agree to our Terms of Use and Privacy Policy.",
  },
  contact: {
    enabled: false,
    action: "",
    method: "post",
    office: ["18 Bellwether Lane", "London E2 7DP"],
    responseTime: "Usually within two business days.",
  },
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "TikTok", href: "https://www.tiktok.com" },
    { label: "Pinterest", href: "https://www.pinterest.com" },
    { label: "RSS", href: "/rss.xml" },
  ],
};

export const categoryNavigation = categories.map((category) => ({
  label: category,
  href: `/category/${categorySlug(category)}/`,
}));

/**
 * The routes spelled out in the bar. Keep it short. The sections hang off the
 * item marked `mega`, which opens the full-width panel on a desktop bar and
 * shows every section on the cover of its newest story; its `href` is where a
 * click lands without a panel. The item marked `layouts` is a plain dropdown
 * listing one live example per story layout, derived from the posts — see
 * `storyLayoutExamples` in `src/lib/posts.ts`. Drop it for a real publication.
 */
export const primaryNavigation: {
  label: string;
  href?: string;
  mega?: boolean;
  layouts?: boolean;
}[] = [
  { label: "Sections", href: "/posts/", mega: true },
  { label: "Layouts", layouts: true },
  { label: "Reviews", href: `/category/${categorySlug(REVIEW_CATEGORY)}/` },
  { label: "About", href: "/about/" },
];

/**
 * The non-section routes: the lead column of the section panel, and "More" in
 * the drawer. Sections come from `categoryNavigation` above, and the
 * story-layout examples are derived from the posts themselves — see
 * `SiteDrawer.astro`.
 */
export const secondaryNavigation = [
  { label: "Archive", href: "/posts/" },
  { label: "Contributors", href: "/author/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
  { label: "Search", href: "/search/" },
  { label: "Saved", href: "/saved/" },
];

export const footerNavigation = [
  {
    title: "Sections",
    links: categoryNavigation,
  },
  {
    title: "Browse",
    links: [
      { label: "Archive", href: "/posts/" },
      { label: "Contributors", href: "/author/" },
      { label: "Search", href: "/search/" },
      { label: "Saved", href: "/saved/" },
      { label: "RSS", href: "/rss.xml" },
    ],
  },
  {
    title: "Publication",
    links: [
      { label: "About", href: "/about/" },
      { label: "Contact", href: "/contact/" },
      { label: "Privacy", href: "/privacy/" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];
