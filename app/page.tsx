import { categories } from "@/data/categories";
import { getUpcomingEvents } from "@/data/events";
import {
  getArticlesByCategory,
  getFeaturedArticle,
  getLatestArticles,
} from "@/data/news";
import CategoryNav from "@/components/CategoryNav";
import CategorySection from "@/components/CategorySection";
import EventCard from "@/components/EventCard";
import FeaturedNews from "@/components/FeaturedNews";
import NewsCard from "@/components/NewsCard";
import NewsGrid from "@/components/NewsGrid";

const SECONDARY_COUNT = 3;

export default function HomePage() {
  const featured = getFeaturedArticle();
  const secondary = getLatestArticles(SECONDARY_COUNT, featured.slug);
  const latest = getLatestArticles(6, featured.slug).slice(SECONDARY_COUNT);
  const events = getUpcomingEvents();

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div>
        <CategoryNav />
      </div>

      {/* Portada: noticia principal grande + noticias secundarias.
          En celular se convierte automáticamente en una sola columna. */}
      <section aria-label="Noticias destacadas" className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FeaturedNews article={featured} />
        </div>
        {secondary.length > 0 && (
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <h2 className="eyebrow text-ink-400">También te puede interesar</h2>
            <div className="mt-2">
              {secondary.map((article, index) => (
                <NewsCard
                  key={article.slug}
                  article={article}
                  variant="compact"
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {latest.length > 0 && (
        <section aria-labelledby="latest-news-heading">
          <h2
            id="latest-news-heading"
            className="mb-6 font-serif text-2xl font-bold text-ink-900"
          >
            Últimas noticias
          </h2>
          <NewsGrid articles={latest} />
        </section>
      )}

      {categories.map((category) => (
        <CategorySection
          key={category.slug}
          category={category}
          articles={getArticlesByCategory(category.slug).slice(0, 3)}
        />
      ))}

      <section aria-labelledby="agenda-heading">
        <h2
          id="agenda-heading"
          className="mb-6 font-serif text-2xl font-bold text-ink-900"
        >
          Agenda / Próximos eventos
        </h2>
        {events.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 px-6 py-14 text-center">
            <p className="text-sm text-ink-500">
              Por el momento no hay eventos programados. Muy pronto vamos a
              anunciar las próximas actividades de la escuela.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
