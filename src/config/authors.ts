import type { ImageMetadata } from "astro";
import camilleRoux from "@/assets/authors/camille-roux.jpg";
import eliseBoyd from "@/assets/authors/elise-boyd.jpg";
import minaSorensen from "@/assets/authors/mina-sorensen.jpg";
import noorHaddad from "@/assets/authors/noor-haddad.jpg";
import priyaAnand from "@/assets/authors/priya-anand.jpg";
import tessOkonkwo from "@/assets/authors/tess-okonkwo.jpg";

/**
 * Author portraits, keyed by the `author.name` used in post frontmatter.
 * Authors with no entry fall back to a monogram avatar, so this map is
 * optional — add a name here only once you have a photo for it.
 *
 * The bundled portraits are Unsplash and Pexels placeholders of models who have no
 * connection to these fictional bylines. Replace them with photos of your
 * actual contributors before publishing.
 */
export interface AuthorProfile {
  bio: string;
  image: ImageMetadata;
  creditName: string;
  creditUrl: string;
}

export const authorProfiles: Record<string, AuthorProfile> = {
  "Noor Haddad": {
    bio: "Runs the desk and still files reviews. Spent six years as a cosmetic chemist before she started writing about beauty, which is where the house standard came from: name the active, name the concentration, say who it is actually for.",
    image: noorHaddad,
    creditName: "Fleur Kaan",
    creditUrl: "https://unsplash.com/photos/pyrJHb1QTRA",
  },
  "Camille Roux": {
    bio: "Covers skincare and the ingredient claims stacked on top of it. Reads safety dossiers for fun and is the reason this masthead never prints a percentage without saying what it was measured against.",
    image: camilleRoux,
    creditName: "Oliver Dohrn",
    creditUrl:
      "https://www.pexels.com/photo/studio-portrait-of-thoughtful-woman-in-turtleneck-31530222/",
  },
  "Priya Anand": {
    bio: "Reviews editor. Wears a product for a month before writing a word about it, on the grounds that most formulas are pleasant for a week and only some of them survive a season.",
    image: priyaAnand,
    creditName: "Andre Styles",
    creditUrl: "https://unsplash.com/photos/pq9npYMirk8",
  },
  "Elise Boyd": {
    bio: "Colour and technique. Trained as a makeup artist and still works chairs at fashion week, which is why her shade notes read like instructions rather than adjectives.",
    image: eliseBoyd,
    creditName: "Meg Wagener",
    creditUrl: "https://unsplash.com/photos/utnV22onlgA",
  },
  "Tess Okonkwo": {
    bio: "Hair and texture, across every curl pattern the industry keeps forgetting to formulate for. More interested in what a cut can do than in what a bottle promises.",
    image: tessOkonkwo,
    creditName: "Compagnons",
    creditUrl: "https://unsplash.com/photos/MQ2xYBHImKM",
  },
  "Mina Sørensen": {
    bio: "The science desk: sun, sleep, and the studies everyone cites without reading. Writes the paragraph that explains why the trial was too small to mean what the caption said it meant.",
    image: minaSorensen,
    creditName: "Jake Nackos",
    creditUrl: "https://unsplash.com/photos/IF9TK5Uy-KI",
  },
};

export const authorPortrait = (name: string): AuthorProfile | undefined => authorProfiles[name];

/** The standfirst under a contributor's name. Empty for a byline with no entry. */
export const authorBio = (name: string): string => authorProfiles[name]?.bio ?? "";
