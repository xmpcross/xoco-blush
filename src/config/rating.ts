/**
 * The rating system. Every number the theme prints — the stars on a card, the
 * verdict panel, the breakdown — reads from this file, so a
 * publication can rewrite the bands or move the scale without touching a
 * component.
 *
 * Ratings belong to reviews only. The schema in `src/content.config.ts`
 * refuses a `review` block on any post outside the section named by
 * `REVIEW_CATEGORY` in `src/config/categories.ts`.
 */

/**
 * Highest rating a review can award. The star row draws one mark per point,
 * so a scale much larger than this wants a printed number instead of stars —
 * change `RatingStars.astro` if you move it.
 */
export const RATING_MAX = 5;

/**
 * Ratings are published in half-star steps, because on this site the star row
 * *is* the number: a 4.3 drawn as four stars and a fragment invites a reader to
 * measure the artwork instead of reading the verdict. The schema rejects
 * anything finer, and a weighted average is rounded to the nearest step before
 * it is printed — so the badge can never disagree with the stars beside it.
 */
export const RATING_STEP = 0.5;

export const isRatingStep = (value: number) => Number.isInteger(value / RATING_STEP);

export const clampRating = (value: number) => Math.min(Math.max(value, 0), RATING_MAX);

export const roundRating = (value: number) =>
  clampRating(Math.round(value / RATING_STEP) * RATING_STEP);

/** `4.5`, and `4` rather than `4.0`. */
export const formatRating = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

/** 0–1, for star fills. */
export const ratingFraction = (value: number) => clampRating(value) / RATING_MAX;

/**
 * Verdict bands, highest first. The first band whose `min` a rating reaches
 * wins, so the list must stay sorted downwards and the last entry must start
 * at 0.
 *
 * There is deliberately no colour here. Blush runs on one accent, so a
 * five-hue score palette would teach readers a second colour language for the
 * sake of one block — the band name and the length of a meter carry the
 * judgement instead.
 */
export interface RatingBand {
  min: number;
  label: string;
  /** One line printed under the band name in the verdict panel. */
  meaning: string;
}

export const ratingBands: RatingBand[] = [
  {
    min: 4.5,
    label: "Exceptional",
    meaning: "As good as this category currently gets. We would spend our own money.",
  },
  {
    min: 4,
    label: "Recommended",
    meaning: "Buy it without reservation unless one of the lows below is a deal-breaker.",
  },
  {
    min: 3,
    label: "Good, with caveats",
    meaning: "Worth the shelf space if the compromises below happen to suit you.",
  },
  {
    min: 2,
    label: "Flawed",
    meaning: "Hard to recommend while better formulas ask for the same money.",
  },
  {
    min: 0,
    label: "Avoid",
    meaning: "Something else does this properly. Buy that instead.",
  },
];

export const ratingBandFor = (value: number): RatingBand =>
  ratingBands.find((band) => value >= band.min) ?? ratingBands[ratingBands.length - 1];

/** One criterion on a review — "Formula", "Wear", "Value". */
export interface RatingCriterion {
  label: string;
  value: number;
  weight?: number;
  note?: string;
}

/**
 * The number a review actually publishes: the weighted average of its
 * criteria, rounded to the nearest half star. Weights default to 1, so an
 * unweighted list is a plain average.
 *
 * Deriving it rather than letting an editor type it is the point — a headline
 * rating the breakdown underneath does not support is the oldest trick in
 * beauty journalism. A review with no criteria falls back to the explicit
 * `rating` in its frontmatter.
 */
export const overallRating = (criteria: RatingCriterion[], explicit?: number) => {
  if (criteria.length === 0) return roundRating(explicit ?? 0);

  const totalWeight = criteria.reduce((sum, item) => sum + (item.weight ?? 1), 0);
  if (totalWeight === 0) return roundRating(explicit ?? 0);

  const weighted = criteria.reduce((sum, item) => sum + item.value * (item.weight ?? 1), 0);
  return roundRating(weighted / totalWeight);
};
