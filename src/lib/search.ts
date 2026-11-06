import {
  bylineShort,
  formatDate,
  postHref,
  readMinutes,
  visiblePosts,
  type Post,
} from "@/lib/posts";
import { postRating } from "@/lib/reviews";

/**
 * One story as the client-side search sees it. Both entry points — the command
 * palette in the header and the results page — read this shape from
 * `/search-index.json`, so a field added here reaches both at once and neither
 * can drift from the other.
 */
export interface SearchItem {
  title: string;
  excerpt: string;
  href: string;
  category: string;
  author: string;
  tags: string[];
  date: string;
  readTime: string;
  /** The published rating, on scored reviews only. Absent everywhere else. */
  rating?: number;
}

export const searchItem = (post: Post): SearchItem => ({
  title: post.data.title,
  excerpt: post.data.excerpt,
  href: postHref(post),
  category: post.data.category,
  author: bylineShort(post),
  tags: post.data.tags,
  date: formatDate(post.data.date),
  readTime: `${readMinutes(post)} min read`,
  /* Omitted rather than nulled, so the index stays small and the results page
     can test for it the same way every server-rendered row does. */
  ...(postRating(post) === undefined ? {} : { rating: postRating(post) }),
});

export const searchItems = (posts: Post[]): SearchItem[] => visiblePosts(posts).map(searchItem);
