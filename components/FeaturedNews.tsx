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
    <article className="group overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
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
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

        {category && (
          <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-800 shadow-sm backdrop-blur-sm">
            {category.name}
          </span>
        )}

        <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-6 sm:left-7 sm:right-7">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Noticia destacada
          </p>
        </div>
      </Link>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-400">
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>

          <span
            className="h-1 w-1 rounded-full bg-ink-300"
            aria-hidden="true"
          />

          <span>Escuela N.º 15</span>
        </div>

        <h1 className="mt-4 font-serif text-2xl font-bold leading-tight text-ink-900 sm:text-3xl lg:text-4xl">
          <Link
            href={`/noticia/${article.slug}`}
            className="transition-colors hover:text-brand-700"
          >
            {article.title}
          </Link>
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
          {article.excerpt}
        </p>

        <div className="mt-7">
          <Link
            href={`/noticia/${article.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-md"
          >
            Leer noticia
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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
