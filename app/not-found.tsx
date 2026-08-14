import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-serif text-6xl font-bold text-brand-700">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-ink-900">
        No encontramos esta página
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-500">
        Puede que la noticia haya sido movida o que el enlace esté mal
        escrito. Volvé al inicio para seguir explorando las novedades de la
        escuela.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
