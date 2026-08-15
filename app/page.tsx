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
      <section aria-labelledby="actualidad-heading" className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
            Escuela N.º 15 · Claudio Lepratti
          </p>

          <h1
            id="actualidad-heading"
            className="mt-2 font-serif text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl"
          >
            Actualidad de la escuela
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500 sm:text-base">
            Noticias, actividades y momentos que forman parte de nuestra
            comunidad educativa.
          </p>
        </div>

        <CategoryNav />
      </section>

      <section aria-label="Noticias destacadas">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">
            Lo más destacado
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-ink-900">
            En portada
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FeaturedNews article={featured} />
          </div>

          {secondary.length > 0 && (
            <aside
              aria-label="Noticias recientes"
              className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm"
            >
              <div className="border-b border-ink-100 pb-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-400">
                  Para seguir leyendo
                </p>
                <h2 className="mt-1 font-serif text-xl font-bold text-ink-900">
                  También te puede interesar
                </h2>
              </div>

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
            </aside>
          )}
        </div>
      </section>

      {latest.length > 0 && (
        <section
          aria-labelledby="latest-news-heading"
          className="border-t border-ink-100 pt-12"
        >
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
              Actualidad
            </p>

            <h2
              id="latest-news-heading"
              className="mt-1 font-serif text-2xl font-bold text-ink-900 sm:text-3xl"
            >
              Últimas noticias
            </h2>
          </div>

          <NewsGrid articles={latest} />
        </section>
      )}

      <div className="space-y-16">
        {categories.map((category) => {
          const articles = getArticlesByCategory(category.slug).slice(0, 3);

          if (articles.length === 0) return null;

          return (
            <CategorySection
              key={category.slug}
              category={category}
              articles={articles}
            />
          );
        })}
      </div>

      <section
        aria-labelledby="agenda-heading"
        className="border-t border-ink-100 pt-12"
      >
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">
            Para tener en cuenta
          </p>

          <h2
            id="agenda-heading"
            className="mt-1 font-serif text-2xl font-bold text-ink-900 sm:text-3xl"
          >
            Agenda escolar
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-ink-500">
            Próximas actividades y eventos de nuestra comunidad.
          </p>
        </div>

        {events.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 px-6 py-14 text-center">
            <p className="text-sm leading-relaxed text-ink-500">
              Por el momento no hay eventos programados. Muy pronto vamos a
              anunciar las próximas actividades de la escuela.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
