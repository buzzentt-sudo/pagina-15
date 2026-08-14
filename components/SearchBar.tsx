"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface SearchBarProps {
  initialQuery?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  /** "default": tamaño para el header. "large": campo grande para la página de búsqueda. */
  size?: "default" | "large";
}

export default function SearchBar({
  initialQuery = "",
  autoFocus = false,
  onSubmitted,
  size = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const isLarge = size === "large";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
    onSubmitted?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Buscar noticias"
      className="flex w-full items-center gap-2"
    >
      <label htmlFor="site-search" className="sr-only">
        Buscar noticias
      </label>
      <input
        id="site-search"
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar noticias..."
        autoFocus={autoFocus}
        className={`w-full rounded-xl border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 ${
          isLarge ? "px-5 py-4 text-base" : "px-4 py-2.5 text-sm"
        }`}
      />
      <button
        type="submit"
        className={`flex shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white transition-colors hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-300 ${
          isLarge ? "p-4" : "p-2.5"
        }`}
        aria-label="Buscar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={isLarge ? "h-6 w-6" : "h-5 w-5"}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </form>
  );
}
