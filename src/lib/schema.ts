import { categorySlug } from "@/config/categories";
import { RATING_MAX } from "@/config/rating";
import { siteConfig } from "@/config/site";
import {
  authorSlug,
  postHref,
  postBylines,
  readMinutes,
  wordCount,
  type Byline,
  type Post,
} from "@/lib/posts";
import { isReview, reviewRating } from "@/lib/reviews";

/**
 * Every piece of structured data the site emits, in one place.
 *
 * Two rules hold the file together. Nothing is asserted here that a reader
 * cannot also see on the page — a rating in markup that is missing from the
 * text is the fastest way to lose a rich result, and deservedly so. And every
 * URL is absolute, built from `siteConfig.siteUrl`, because a crawler has no
 * page to resolve a relative path against.
 */

export type Schema = Record<string, unknown>;

export const absoluteUrl = (path: string) => new URL(path, siteConfig.siteUrl).toString();

/** The publication. Referenced by `@id` so it is described once per page. */
const publisherId = absoluteUrl("/#publication");

export const organizationSchema = (): Schema => ({
  "@type": "Organization",
  "@id": publisherId,
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  description: siteConfig.description,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl(siteConfig.publisherLogo),
  },
  sameAs: siteConfig.socials
    .filter((social) => /^https?:\/\//.test(social.href))
    .map((social) => social.href),
});

const personSchema = (byline: Byline): Schema => ({
  "@type": "Person",
  name: byline.name,
  jobTitle: byline.role,
  url: absoluteUrl(`/author/${authorSlug(byline.name)}/`),
});

/**
 * The site itself, on any page that is not an article. The search action is
 * only claimed because `/search/` genuinely answers a `q` parameter.
 */
export const websiteSchema = (): Schema => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  name: siteConfig.name,
  alternateName: siteConfig.tagline,
  url: siteConfig.siteUrl,
  description: siteConfig.description,
  inLanguage: siteConfig.language,
  publisher: organizationSchema(),
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl("/search/?q={search_term_string}"),
    },
    "query-input": "required name=search_term_string",
  },
});

/**
 * The trail a reader can actually retrace: every crumb below is a link the page
 * itself renders — the wordmark, and the section tag under the headline.
 */
export const breadcrumbSchema = (trail: { name: string; href: string }[]): Schema => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.href),
  })),
});

export const postBreadcrumbSchema = (post: Post): Schema =>
  breadcrumbSchema([
    { name: siteConfig.name, href: "/" },
    { name: post.data.category, href: `/category/${categorySlug(post.data.category)}/` },
    { name: post.data.title, href: postHref(post) },
  ]);

/**
 * An article, or — when the post carries a review — the review it published.
 *
 * A scored review is described as a `Review` rather than an `Article`,
 * because the rating is the thing worth declaring and a `Review` is where a
 * search engine expects to find one. Everything an article node would carry is
 * still on it: a review is a creative work like any other.
 */
export const postSchema = (post: Post, imageUrl: string): Schema => {
  const data = post.data;
  const url = absoluteUrl(postHref(post));
  const minutes = readMinutes(post);

  const base: Schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.excerpt,
    image: imageUrl,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: data.date.toISOString(),
    dateModified: (data.updatedDate ?? data.date).toISOString(),
    author: postBylines(post).map(personSchema),
    publisher: organizationSchema(),
    articleSection: data.category,
    keywords: data.tags,
    inLanguage: siteConfig.language,
    wordCount: wordCount(post),
    timeRequired: `PT${minutes}M`,
    isAccessibleForFree: true,
  };

  if (!isReview(post)) return base;

  const review = post.data.review;
  const product = review.product;

  return {
    ...base,
    "@type": "Review",
    reviewBody: review.verdict,
    itemReviewed: {
      "@type": "Product",
      name: product.name,
      brand: { "@type": "Brand", name: product.brand },
      ...(product.line ? { model: product.line } : {}),
      ...(product.type ? { category: product.type } : {}),
      ...(product.shade ? { color: product.shade } : {}),
      ...(product.size ? { size: product.size } : {}),
      ...(product.finish
        ? {
            additionalProperty: {
              "@type": "PropertyValue",
              name: "Finish",
              value: product.finish,
            },
          }
        : {}),
      image: imageUrl,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: reviewRating(review),
      bestRating: RATING_MAX,
      worstRating: 0,
    },
    positiveNotes: {
      "@type": "ItemList",
      itemListElement: review.highs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item,
      })),
    },
    negativeNotes: {
      "@type": "ItemList",
      itemListElement: review.lows.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item,
      })),
    },
  };
};
