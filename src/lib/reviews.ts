import { overallRating, type RatingCriterion } from "@/config/rating";
import type { Post } from "@/lib/posts";

/**
 * Reviews, as the rest of the theme sees them. A review is an ordinary post
 * carrying a `review` block, so every listing, feed, tag page, and search
 * result keeps working without knowing reviews exist — the blocks that do care
 * ask `isReview` first and get a narrowed type back.
 */
export type ReviewData = NonNullable<Post["data"]["review"]>;

export type ReviewPost = Post & { data: { review: ReviewData } };

export const isReview = (post: Post): post is ReviewPost => Boolean(post.data.review);

/** The criteria as the scoring helpers want them. */
export const reviewCriteria = (review: ReviewData): RatingCriterion[] => review.ratings;

/** The published rating: the weighted average of the criteria, rounded. */
export const reviewRating = (review: ReviewData) =>
  overallRating(reviewCriteria(review), review.rating);

/**
 * The rating to print beside a post, or `undefined` when there is nothing to
 * print. Every card, row, and column calls this rather than reaching into
 * frontmatter, so an unscored post in the review section stays unscored
 * everywhere instead of picking up a zero-star row.
 */
export const postRating = (post: Post) =>
  isReview(post) ? reviewRating(post.data.review) : undefined;
