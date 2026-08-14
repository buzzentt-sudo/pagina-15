import { NewsArticle } from "@/types/news";
import NewsCard from "./NewsCard";

interface NewsGridProps {
  articles: NewsArticle[];
  emptyMessage?: string;
}

export default function NewsGrid({
  articles,
  emptyMessage = "No hay noticias para mostrar por el momento.",
}: NewsGridProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
          📰
        </div>

        <p className="mt-4 text-sm font-medium text-ink-500">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-7 lg:grid-cols-3 lg:gap-8">
      {articles.map((article, index) => (
        <div
          key={article.slug}
          className="animate-fade-in-up"
          style={{
            animationDelay: `${index * 70}ms`,
            animationFillMode: "both",
          }}
        >
          <NewsCard
            article={article}
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
