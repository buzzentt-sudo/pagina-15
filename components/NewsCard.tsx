import Image from "next/image";
import Link from "next/link";
import { getCategoryBySlug } from "@/data/categories";
import { NewsArticle } from "@/types/news";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  article: NewsArticle;
  priority?: boolean;
  /**
   * "grid" (por defecto): la tarjeta estándar usada en grillas de noticias.
   * "compact": versión horizontal, pensada para listas angostas como las
   * noticias secundarias de la portada.
   */
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
          className="relative block aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-ink-100 sm:w-24"
        >
          <Image
            src={article.coverImage.src}
            alt={article.coverImage.alt}
            fill
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            sizes="96px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          {category && (
            <Link
              href={`/categoria/${category.slug}`}
              className="eyebrow w-fit text-brand-700 hover:text-brand-800"
            >
              {category.name}
            </Link>
          )}
          <h3 className="mt-1 line-clamp-2 font-serif text-base font-bold leading-snug text-ink-900">
            <Link href={`/noticia/${article.slug}`} className="hover:text-brand-700">
              {article.title}
            </Link>
          </h3>
          <time dateTime={article.publishedAt} className="mt-1.5 text-xs text-ink-400">
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5">
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
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {category && (
          <Link
            href={`/categoria/${category.slug}`}
            className="eyebrow w-fit rounded-full bg-brand-50 px-2.5 py-1 text-brand-700 hover:bg-brand-100"
          >
            {category.name}
          </Link>
        )}
        <h3 className="mt-3 line-clamp-2 font-serif text-lg font-bold leading-snug text-ink-900">
          <Link href={`/noticia/${article.slug}`} className="hover:text-brand-700">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-ink-50 pt-3 text-xs text-ink-400">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <Link
            href={`/noticia/${article.slug}`}
            className="font-semibold text-brand-700 transition-colors hover:text-brand-800"
          >
            Leer más →
          </Link>
        </div>
      </div>
    </article>
  );
}
