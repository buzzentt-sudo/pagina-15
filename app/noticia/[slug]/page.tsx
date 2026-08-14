import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/data/categories";
import {
  getArticleBySlug,
  getRelatedArticles,
  newsArticles,
} from "@/data/news";
import RelatedNews from "@/components/RelatedNews";
import ShareButtons from "@/components/ShareButtons";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

interface NewsPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }));
}

export function generateMetadata({
  params,
}: NewsPageProps): Metadata {
  const article = getArticleBySlug(params.slug);

  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    authors: article.author
      ? [{ name: article.author.name }]
      : undefined,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      images: [{ url: article.coverImage.src }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage.src],
    },
  };
}

export default function NewsPage({ params }: NewsPageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) notFound();

  const category = getCategoryBySlug(article.category);
  const related = getRelatedArticles(article);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    image: [`${siteConfig.url}${article.coverImage.src}`],
    author: article.author
      ? {
          "@type": "Person",
          name: article.author.name,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: `${siteConfig.url}/noticia/${article.slug}`,
  };

  return (
    <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <nav
        aria-label="Migas de pan"
        className="mb-8 text-sm text-ink-400"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-brand-700"
            >
              Inicio
            </Link>
          </li>

          {category && (
            <>
              <li aria-hidden="true" className="text-ink-300">
                /
              </li>

              <li>
                <Link
                  href={`/categoria/${category.slug}`}
                  className="transition-colors hover:text-brand-700"
                >
                  {category.name}
                </Link>
              </li>
            </>
          )}
        </ol>
      </nav>

      <div className="mx-auto max-w-4xl">
        {category && (
          <Link
            href={`/categoria/${category.slug}`}
            className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-700 transition-colors hover:bg-brand-100"
          >
            {category.name}
          </Link>
        )}

        <h1 className="mt-5 font-serif text-3xl font-bold leading-[1.08] tracking-tight text-ink-900 sm:text-4xl lg:text-6xl">
          {article.title}
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-600 sm:text-xl">
          {article.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-400">
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>

          {article.author && (
            <>
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-ink-300"
              />
              <span className="font-medium text-ink-500">
                {article.author.name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="relative mx-auto mt-8 aspect-[16/9] max-w-5xl overflow-hidden rounded-3xl bg-ink-100 shadow-lg sm:mt-10">
        <Image
          src={article.coverImage.src}
          alt={article.coverImage.alt}
          fill
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <div className="prose-content space-y-6 text-[17px] leading-[1.8] text-ink-700 sm:text-lg">
          {article.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {article.gallery && article.gallery.length > 0 && (
          <section
            aria-labelledby="gallery-heading"
            className="mt-12 border-t border-ink-100 pt-10"
          >
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">
                Multimedia
              </p>

              <h2
                id="gallery-heading"
                className="mt-1 font-serif text-2xl font-bold text-ink-900"
              >
                Galería de imágenes
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {article.gallery.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-[16/9] overflow-hidden rounded-2xl bg-ink-100"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 flex flex-col gap-5 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <ShareButtons
            slug={article.slug}
            title={article.title}
          />

          {category && (
            <Link
              href={`/categoria/${category.slug}`}
              className="inline-flex items-center text-sm font-bold text-brand-700 transition-colors hover:text-brand-900"
            >
              ← Volver a {category.name}
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-5xl border-t border-ink-100 pt-10">
        <RelatedNews articles={related} />
      </div>
    </article>
  );
}
