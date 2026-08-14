import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/data/categories";
import { getArticleBySlug, getRelatedArticles, newsArticles } from "@/data/news";
import RelatedNews from "@/components/RelatedNews";
import ShareButtons from "@/components/ShareButtons";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

interface NewsPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: NewsPageProps): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    authors: article.author ? [{ name: article.author.name }] : undefined,
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
      ? { "@type": "Person", name: article.author.name }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: `${siteConfig.url}/noticia/${article.slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Migas de pan" className="mb-6 text-sm text-ink-400">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-brand-700">
              Inicio
            </Link>
          </li>
          {category && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/categoria/${category.slug}`} className="hover:text-brand-700">
                  {category.name}
                </Link>
              </li>
            </>
          )}
        </ol>
      </nav>

      {category && (
        <Link
          href={`/categoria/${category.slug}`}
          className="eyebrow inline-block w-fit rounded-full bg-brand-50 px-3 py-1.5 text-brand-700 transition-colors hover:bg-brand-100"
        >
          {category.name}
        </Link>
      )}

      <h1 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
        {article.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-500">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        {article.author && (
          <>
            <span aria-hidden="true">·</span>
            <span>{article.author.name}</span>
          </>
        )}
      </div>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-ink-100 shadow-sm">
        <Image
          src={article.coverImage.src}
          alt={article.coverImage.alt}
          fill
          priority
          sizes="(min-width: 1024px) 768px, 100vw"
          className="object-cover"
        />
      </div>

      <p className="mt-6 max-w-prose font-serif text-xl font-medium leading-relaxed text-ink-700">
        {article.excerpt}
      </p>

      <div className="prose-content mt-6 max-w-prose space-y-5 text-[17px] leading-[1.75] text-ink-700">
        {article.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {article.gallery && article.gallery.length > 0 && (
        <section aria-labelledby="gallery-heading" className="mt-10">
          <h2 id="gallery-heading" className="mb-4 font-serif text-lg font-bold text-ink-900">
            Galería de imágenes
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {article.gallery.map((image, index) => (
              <div
                key={index}
                className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-ink-100"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink-100 pt-6">
        <ShareButtons slug={article.slug} title={article.title} />
        {category && (
          <Link
            href={`/categoria/${category.slug}`}
            className="text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
          >
            ← Volver a {category.name}
          </Link>
        )}
      </div>

      <RelatedNews articles={related} />
    </article>
  );
}
