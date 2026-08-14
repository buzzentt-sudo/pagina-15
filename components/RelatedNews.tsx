import { NewsArticle } from "@/types/news";
import NewsCard from "./NewsCard";

interface RelatedNewsProps {
  articles: NewsArticle[];
}

export default function RelatedNews({ articles }: RelatedNewsProps) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="related-news-heading" className="mt-14">
      <h2
        id="related-news-heading"
        className="mb-6 font-serif text-xl font-bold text-ink-900"
      >
        Noticias relacionadas
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
