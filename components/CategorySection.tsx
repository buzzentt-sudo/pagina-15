import Link from "next/link";
import { Category, NewsArticle } from "@/types/news";
import NewsCard from "./NewsCard";

interface CategorySectionProps {
  category: Category;
  articles: NewsArticle[];
}

export default function CategorySection({
  category,
  articles,
}: CategorySectionProps) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby={`section-${category.slug}`}
      className="scroll-mt-24"
    >
      <div className="mb-7 flex items-end justify-between gap-4 border-b border-ink-100 pb-4">
        <div className="flex items-center gap-3">
          <span
            className="h-8 w-1.5 rounded-full bg-accent-500"
            aria-hidden="true"
          />

          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">
              Sección
            </p>

            <h2
              id={`section-${category.slug}`}
              className="font-serif text-xl font-bold text-ink-900 sm:text-2xl"
            >
              {category.name}
            </h2>
          </div>
        </div>

        <Link
          href={`/categoria/${category.slug}`}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900"
        >
          Ver todas
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
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
