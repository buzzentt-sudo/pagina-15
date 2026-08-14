import Image from "next/image";
import Link from "next/link";
import { getCategoryBySlug } from "@/data/categories";
import { NewsArticle } from "@/types/news";
import { formatDate } from "@/lib/utils";

interface FeaturedNewsProps {
  article: NewsArticle;
}

export default function FeaturedNews({ article }: FeaturedNewsProps) {
  const category = getCategoryBySlug(article.category);

  return (
    <article className="animate-fade-in-up overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
      <Link
        href={`/noticia/${article.slug}`}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-ink-100 sm:aspect-[2/1]"
      >
        <Image
          src={article.coverImage.src}
          alt={article.coverImage.alt}
          fill
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </Link>
      <div className="p-6 sm:p-8">
        {category && (
          <Link
            href={`/categoria/${category.slug}`}
            className="eyebrow w-fit rounded-full bg-accent-100 px-3 py-1 text-accent-800 hover:bg-accent-200"
          >
            {category.name}
          </Link>
        )}
        <h1 className="mt-4 font-serif text-2xl font-bold leading-tight text-ink-900 sm:text-3xl lg:text-4xl">
          <Link href={`/noticia/${article.slug}`} className="transition-colors hover:text-brand-700">
            {article.title}
          </Link>
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-600">
          {article.excerpt}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <time dateTime={article.publishedAt} className="text-sm text-ink-400">
            {formatDate(article.publishedAt)}
          </time>
          <Link
            href={`/noticia/${article.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Leer noticia
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06L12.19 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
