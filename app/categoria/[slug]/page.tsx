import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getArticlesByCategory } from "@/data/news";
import CategoryNav from "@/components/CategoryNav";
import NewsGrid from "@/components/NewsGrid";
import Pagination from "@/components/Pagination";

const ARTICLES_PER_PAGE = 6;

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { pagina?: string };
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: category.name,
      description: category.description,
    },
  };
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const allArticles = getArticlesByCategory(category.slug);
  const totalPages = Math.max(1, Math.ceil(allArticles.length / ARTICLES_PER_PAGE));
  const requestedPage = Number(searchParams.pagina) || 1;
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (currentPage - 1) * ARTICLES_PER_PAGE;
  const pageArticles = allArticles.slice(start, start + ARTICLES_PER_PAGE);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <CategoryNav activeSlug={category.slug} />

      <header className="max-w-2xl">
        <h1 className="font-serif text-3xl font-bold text-ink-900 sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-500">
          {category.description}
        </p>
      </header>

      <NewsGrid
        articles={pageArticles}
        emptyMessage={`Todavía no hay noticias publicadas en ${category.name}.`}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/categoria/${category.slug}`}
      />
    </div>
  );
}
