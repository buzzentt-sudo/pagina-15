import Link from "next/link";
import { Category, NewsArticle } from "@/types/news";
import NewsCard from "./NewsCard";

interface CategorySectionProps {
  category: Category;
  articles: NewsArticle[];
}

export default function CategorySection({ category, articles }: CategorySectionProps) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby={`section-${category.slug}`} className="scroll-mt-20">
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-ink-100 pb-4">
        <h2
          id={`section-${category.slug}`}
          className="font-serif text-xl font-bold text-ink-900 sm:text-2xl"
        >
          {category.name}
        </h2>
        <Link
          href={`/categoria/${category.slug}`}
          className="shrink-0 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
        >
          Ver todas →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
