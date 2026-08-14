import Image from "next/image";
import Link from "next/link";
import { getCategoryBySlug } from "@/data/categories";
import { NewsArticle } from "@/types/news";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  article: NewsArticle;
  priority?: boolean;
  variant?: "grid" | "compact";
}

export default function NewsCard({
  article,
  priority = false,
  variant = "grid",
}: NewsCardProps) {
  const category = getCategoryBySlug(article.category);

  if (variant === "compact") {
    return (
      <article className="group flex gap-4 border-b border-ink-100 py-4 first:pt-0 last:border-b-0 last:pb-0">
        <Link
          href={`/noticia/${article.slug}`}
          className="relative block aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-ink-100 sm:w-24"
        >
          <Image
            src={article.coverImage.src}
            alt={article.coverImage.alt}
            fill
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            sizes="96px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          {category && (
            <Link
              href={`/categoria/${category.slug}`}
              className="text-[11px] font-bold uppercase tracking-wider text-brand-700 transition-colors hover:text-brand-900"
            >
              {category.name}
            </Link>
          )}

          <h3 className="mt-1 line-clamp-2 font-serif text-base font-bold leading-snug text-ink-900">
            <Link
              href={`/noticia/${article.slug}`}
              className="transition-colors hover:text-brand-700"
            >
              {article.title}
            </Link>
          </h3>

          <time
            dateTime={article.publishedAt}
            className="mt-2 text-xs text-ink-400"
          >
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/noticia/${article.slug}`}
        className="relative block aspect-[16/9] w-full overflow-hidden bg-ink-100"
      >
        <Image
          src={article.coverImage.src}
          alt={article.coverImage.alt}
          fill
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {category && (
          <Link
            href={`/categoria/${category.slug}`}
            className="w-fit rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-700 transition-colors hover:bg-brand-100"
          >
            {category.name}
          </Link>
        )}

        <h3 className="mt-3 line-clamp-2 font-serif text-lg font-bold leading-snug text-ink-900 sm:text-xl">
          <Link
            href={`/noticia/${article.slug}`}
            className="transition-colors hover:text-brand-700"
          >
            {article.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">
          {article.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4">
          <time
            dateTime={article.publishedAt}
            className="text-xs text-ink-400"
          >
            {formatDate(article.publishedAt)}
          </time>

          <Link
            href={`/noticia/${article.slug}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition-all hover:gap-2 hover:text-brand-900"
          >
            Leer más
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
