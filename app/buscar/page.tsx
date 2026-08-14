import type { Metadata } from "next";
import { searchArticles } from "@/data/news";
import NewsGrid from "@/components/NewsGrid";
import SearchBar from "@/components/SearchBar";

interface SearchPageProps {
  searchParams: { q?: string };
}

export const metadata: Metadata = {
  title: "Buscar noticias",
  robots: { index: false, follow: true },
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() ?? "";
  const results = query ? searchArticles(query) : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-2xl font-bold text-ink-900 sm:text-3xl">
          Buscar noticias
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Encontrá noticias por título, contenido o categoría.
        </p>
        <div className="mt-6">
          <SearchBar initialQuery={query} size="large" />
        </div>
      </header>

      {query ? (
        <>
          <p className="border-b border-ink-100 pb-4 text-sm text-ink-500">
            {results.length > 0
              ? `Resultados para: "${query}"`
              : `No encontramos noticias relacionadas con tu búsqueda.`}
          </p>
          <NewsGrid articles={results} />
        </>
      ) : (
        <p className="text-center text-sm text-ink-500">
          Escribí una palabra clave para buscar entre todas las noticias de La
          15 Comunica.
        </p>
      )}
    </div>
  );
}
