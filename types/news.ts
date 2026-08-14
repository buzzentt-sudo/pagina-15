export type CategorySlug =
  | "actualidad"
  | "deportes"
  | "efemerides"
  | "eventos-especiales"
  | "participaciones";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export interface Author {
  id?: string;
  name: string;
  role?: string;
}

export interface NewsImage {
  src: string;
  alt: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: CategorySlug;
  coverImage: NewsImage;
  gallery?: NewsImage[];
  author?: Author;
  publishedAt: string; // ISO date string
  featured?: boolean;
}

export interface SchoolEvent {
  id: string;
  name: string;
  description: string;
  date: string; // ISO date string
}
