export const categories = [
  "Reviews",
  "Skincare",
  "Makeup",
  "Hair",
  "Fragrance",
  "Wellness",
] as const;

export type Category = (typeof categories)[number];

/**
 * The one section that carries scored product tests. A `review` block in
 * frontmatter is only valid on a post filed here — see `src/content.config.ts`
 * — so moving reviews to a differently named section is a one-line change,
 * as long as the name stays in `categories` above.
 */
export const REVIEW_CATEGORY: Category = "Reviews";

/**
 * Controls how each category page presents its posts:
 * - "featured": a large lead story followed by a card grid
 * - "grid": the standard card grid
 * - "list": one image-led editorial row per post
 */
export type CategoryLayout = "featured" | "grid" | "list";

export const categoryLayouts: Record<Category, CategoryLayout> = {
  Reviews: "featured",
  Skincare: "grid",
  Makeup: "featured",
  Hair: "list",
  Fragrance: "grid",
  Wellness: "list",
};

export const categorySlug = (category: Category) =>
  category
    .toLowerCase()
    .replace(/\s*&\s*/g, "-")
    .replace(/\s+/g, "-");

export const categoryMeta: Record<Category, { description: string; blurb: string }> = {
  Reviews: {
    description:
      "Products used for weeks rather than photographed once — what a formula actually does on skin, hair and nails, and where it gives up.",
    blurb: "Worn in, then judged",
  },
  Skincare: {
    description:
      "Ingredients, barriers and sunscreen: what the research supports, what the packaging implies, and the difference between the two.",
    blurb: "Evidence, not promises",
  },
  Makeup: {
    description:
      "Colour, coverage and technique — shade ranges, undertones, and the products that flatter more faces than they market to.",
    blurb: "Colour, examined",
  },
  Hair: {
    description:
      "Texture, cut and care across hair types, with an honest account of what a product can change and what a stylist has to.",
    blurb: "Cut, colour, condition",
  },
  Fragrance: {
    description:
      "How scent behaves on skin rather than on a card: longevity, accords, and why the note list on the box is a sales document.",
    blurb: "How it wears",
  },
  Wellness: {
    description:
      "Sleep, sun, stress and the routines around them — the unglamorous inputs that outperform most of what sits on a shelf.",
    blurb: "The unglamorous half",
  },
};
