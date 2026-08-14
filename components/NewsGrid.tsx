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
      <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50 px-6 py-14 text-center">
        <p className="text-sm text-ink-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <NewsCard key={article.slug} article={article} priority={index === 0} />
      ))}
    </div>
  );
}
