import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  function pageHref(page: number) {
    return page === 1 ? basePath : `${basePath}?pagina=${page}`;
  }

  return (
    <nav aria-label="Paginación de noticias" className="flex items-center justify-center gap-2">
      <Link
        href={pageHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`rounded-md px-3 py-2 text-sm font-medium ${
          currentPage === 1
            ? "pointer-events-none text-ink-300"
            : "text-brand-700 hover:bg-brand-50"
        }`}
      >
        ← Anterior
      </Link>

      <ul className="flex items-center gap-1">
        {pages.map((page) => (
          <li key={page}>
            <Link
              href={pageHref(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium ${
                page === currentPage
                  ? "bg-brand-700 text-white"
                  : "text-ink-600 hover:bg-ink-100"
              }`}
            >
              {page}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={pageHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`rounded-md px-3 py-2 text-sm font-medium ${
          currentPage === totalPages
            ? "pointer-events-none text-ink-300"
            : "text-brand-700 hover:bg-brand-50"
        }`}
      >
        Siguiente →
      </Link>
    </nav>
  );
}
