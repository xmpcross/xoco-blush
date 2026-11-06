import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { categories, REVIEW_CATEGORY } from "@/config/categories";
import { isRatingStep, RATING_MAX, RATING_STEP } from "@/config/rating";

/** One name on a byline. The lead author and every coauthor take this shape. */
const byline = z.object({
  name: z.string(),
  role: z.string(),
});

/**
 * A published rating. Half-star steps only — see `src/config/rating.ts` for why
 * the scale is deliberately coarse.
 */
const ratingValue = z
  .number()
  .min(0)
  .max(RATING_MAX)
  .refine(isRatingStep, {
    message: `Ratings are published in steps of ${RATING_STEP}, up to ${RATING_MAX}.`,
  });

/**
 * The tested-product block. Present only on posts filed under the review
 * section — the collection refuses it anywhere else — and optional even there,
 * so the section can still carry a first impression or a shade comparison that
 * nobody scored.
 *
 * There is deliberately no price field. Beauty pricing moves with every
 * relaunch, region and sale, and a stale number under a five-star verdict is
 * worse than no number at all — so what a product costs belongs in the body
 * copy, where it can be written as of a date.
 */
const review = z
  .object({
    /** The exact product tested, down to the shade. Printed above the verdict. */
    product: z.object({
      /** "Lumen Atelier Barrier Serum" — the full name, as it would be sold. */
      name: z.string(),
      /** The brand on its own. Becomes the brand in structured data. */
      brand: z.string(),
      /** The range it belongs to, if it belongs to one. */
      line: z.string().optional(),
      /** "Serum", "Cream blush", "Gel polish", "Eau de parfum". */
      type: z.string().optional(),
      /** The shade or variant on the box: "07 Rosewater". */
      shade: z.string().optional(),
      /** "Satin", "Matte", "Balmy". How it sits once it has settled. */
      finish: z.string().optional(),
      /** "30 ml", "4.2 g". Printed as sold, units included. */
      size: z.string().optional(),
    }),

    /** The bottom line in one paragraph, printed in the verdict panel. */
    verdict: z.string(),

    /**
     * The weighted breakdown behind the published rating. Weights default to 1.
     * Leave it empty only if you also set `rating`.
     */
    ratings: z
      .array(
        z.object({
          label: z.string(),
          value: ratingValue,
          weight: z.number().positive().optional(),
          /** One line of justification, printed under the meter. */
          note: z.string().optional(),
        }),
      )
      .default([]),

    /** The overall rating. Only read when `ratings` is empty. */
    rating: ratingValue.optional(),

    highs: z.array(z.string()).min(1),
    /**
     * Never empty, and the schema enforces it: a beauty review with nothing to
     * criticise is a press release.
     */
    lows: z.array(z.string()).min(1),

    /** "Your barrier is intact and you want one lightweight layer under SPF." */
    buyIf: z.string().optional(),
    /** "Fragrance in a leave-on step is a problem for you." The honest disqualifier. */
    avoidIf: z.string().optional(),

    /**
     * Where a reader can buy it, in the order you would recommend: the first
     * entry takes the filled button in the box and the rest take outlined
     * ones, so the row reads as a preference rather than as a price
     * comparison the site cannot keep current.
     *
     * Deliberately no price field here either. Every link is rendered
     * `rel="sponsored nofollow"` and sits above the disclosure configured in
     * `src/config/site.ts`. Leave the array empty and the box does not render.
     */
    retailers: z
      .array(
        z.object({
          name: z.string(),
          url: z.url(),
          /** One line under the name: returns, shade range, size sold. */
          note: z.string().optional(),
        }),
      )
      .default([]),

    /** How it was used: "Four weeks, twice daily, on dehydrated combination skin". */
    testedOn: z.string(),
    /** Where the product came from. Say so plainly — readers can tell. */
    sourcing: z.string().default("Bought at full price. No brand saw this before publication."),
  })
  .refine((data) => data.ratings.length > 0 || typeof data.rating === "number", {
    message: "A review needs either a `ratings` breakdown or an explicit `rating`.",
    path: ["rating"],
  });

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        excerpt: z.string(),
        category: z.enum(categories),
        date: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        author: byline,
        /**
         * Extra names on the byline, read in the order they are listed. The lead
         * `author` still owns the post and always reads first, while every
         * coauthor gets the same avatar, archive page, and author box treatment.
         */
        coauthors: z.array(byline).default([]),
        tags: z.array(z.string()).default([]),
        cover: z.object({
          src: image(),
          alt: z.string(),
          creditName: z.string(),
          creditUrl: z.url(),
          showInPost: z.boolean().optional(),
        }),
        /* Opening treatment for the article page. Every layout uses the same
           cover image; only its placement and scale change. */
        storyLayout: z.enum(["standard", "banner", "cover", "immersive"]).default("standard"),
        trending: z.boolean().default(false),
        /** Promotes the post into the front page "Editor's picks" row. */
        editorsPick: z.boolean().default(false),
        draft: z.boolean().default(false),
        /**
         * Turns the post into a scored review: stars on every card that carries
         * it, and a verdict, a breakdown, and the tested product's details on
         * the article. Review section only — see below.
         */
        review: review.optional(),
      })
      .superRefine((data, ctx) => {
        /* Scores are a section, not a decoration. Letting a rating loose on an
           explainer or a routine piece would put stars on cards that no verdict
           stands behind, so the build stops here instead. */
        if (data.review && data.category !== REVIEW_CATEGORY) {
          ctx.addIssue({
            code: "custom",
            path: ["review"],
            message: `A "review" block is only valid on posts filed under "${REVIEW_CATEGORY}". This post is filed under "${data.category}".`,
          });
        }
      }),
});

export const collections = { posts };
