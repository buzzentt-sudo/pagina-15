'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type News = {
  id: string
  title: string
  excerpt: string | null
  image_url: string
  category?: {
    name: string
  } | null
  status: string
  created_at: string
}

type Filter = 'todas' | 'pendiente' | 'aprobada' | 'rechazada'

export default function MisNoticiasPage() {
  const router = useRouter()
  const supabase = createClient()

  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<Filter>('todas')

  useEffect(() => {
    async function loadNews() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error: newsError } = await supabase
        .from('news')
        .select(`
          id,
          title,
          excerpt,
          image_url,
          status,
          created_at,
          categories:category_id (
            name
          )
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })

      if (newsError) {
        console.error(newsError)
        setError('No se pudieron cargar tus noticias.')
      } else {
        const formattedNews = (data ?? []).map((item: any) => ({
          ...item,
          category: Array.isArray(item.categories)
            ? item.categories[0] ?? null
            : item.categories ?? null,
        }))

        setNews(formattedNews)
      }

      setLoading(false)
    }

    loadNews()
  }, [router, supabase])

  const pendingCount = useMemo(
    () => news.filter((item) => item.status === 'pendiente').length,
    [news]
  )

  const approvedCount = useMemo(
    () => news.filter((item) => item.status === 'aprobada').length,
    [news]
  )

  const rejectedCount = useMemo(
    () => news.filter((item) => item.status === 'rechazada').length,
    [news]
  )

  const filteredNews = useMemo(() => {
    if (filter === 'todas') return news

    return news.filter((item) => item.status === filter)
  }, [news, filter])

  function getStatusLabel(status: string) {
    if (status === 'pendiente') return 'En revisión'
    if (status === 'aprobada') return 'Publicada'
    if (status === 'rechazada') return 'Rechazada'
    return status
  }

  function getStatusClass(status: string) {
    if (status === 'pendiente') {
      return 'bg-yellow-100 text-yellow-800'
    }

    if (status === 'aprobada') {
      return 'bg-green-100 text-green-800'
    }

    if (status === 'rechazada') {
      return 'bg-red-100 text-red-800'
    }

    return 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Cargando tus noticias...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Mis noticias
            </h1>

            <p className="text-gray-600 mt-2">
              Acá podés consultar el estado de las noticias que enviaste.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/nueva-noticia')}
            className="rounded-lg px-5 py-3 bg-black text-white font-semibold"
          >
            + Nueva noticia
          </button>
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* RESUMEN */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <button
            type="button"
            onClick={() => setFilter('todas')}
            className="border rounded-xl p-5 text-left hover:shadow-sm transition"
          >
            <p className="text-sm text-gray-500">
              Total
            </p>

            <p className="text-3xl font-bold mt-1">
              {news.length}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setFilter('pendiente')}
            className="border rounded-xl p-5 text-left hover:shadow-sm transition"
          >
            <p className="text-sm text-gray-500">
              En revisión
            </p>

            <p className="text-3xl font-bold mt-1">
              {pendingCount}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setFilter('aprobada')}
            className="border rounded-xl p-5 text-left hover:shadow-sm transition"
          >
            <p className="text-sm text-gray-500">
              Publicadas
            </p>

            <p className="text-3xl font-bold mt-1">
              {approvedCount}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setFilter('rechazada')}
            className="border rounded-xl p-5 text-left hover:shadow-sm transition"
          >
            <p className="text-sm text-gray-500">
              Rechazadas
            </p>

            <p className="text-3xl font-bold mt-1">
              {rejectedCount}
            </p>
          </button>
        </section>

        {/* FILTROS */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            ['todas', 'Todas'],
            ['pendiente', 'En revisión'],
            ['aprobada', 'Publicadas'],
            ['rechazada', 'Rechazadas'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value as Filter)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
                filter === value
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* NOTICIAS */}
        {filteredNews.length === 0 ? (
          <div className="border rounded-xl p-10 text-center">
            <h2 className="text-xl font-bold mb-2">
              No hay noticias todavía
            </h2>

            <p className="text-gray-600 mb-5">
              Cuando envíes una noticia, vas a poder ver acá su estado.
            </p>

            <button
              type="button"
              onClick={() => router.push('/nueva-noticia')}
              className="rounded-lg px-5 py-3 bg-black text-white font-semibold"
            >
              Enviar mi primera noticia
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                className="border rounded-xl p-5"
              >
                <div className="grid md:grid-cols-[220px_1fr] gap-5">

                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-44 object-cover rounded-lg"
                  />

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>

                      {item.category?.name && (
                        <span className="rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700">
                          {item.category.name}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold mb-2">
                      {item.title}
                    </h2>

                    {item.excerpt && (
                      <p className="text-gray-600 mb-4">
                        {item.excerpt}
                      </p>
                    )}

                    <p className="text-sm text-gray-500">
                      Enviada el{' '}
                      {new Date(
                        item.created_at
                      ).toLocaleDateString('es-AR')}
                    </p>

                    {item.status === 'aprobada' && (
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/noticia/${item.id}`)
                        }
                        className="mt-4 rounded-lg px-4 py-2 border font-semibold"
                      >
                        Ver noticia
                      </button>
                    )}

                    {item.status === 'rechazada' && (
                      <div className="mt-4 rounded-lg bg-red-50 border border-red-100 p-4">
                        <p className="text-sm text-red-700 mb-3">
                          Esta noticia fue rechazada. Podés corregirla y
                          volver a enviarla para revisión.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/editar-noticia/${item.id}`)
                          }
                          className="rounded-lg px-4 py-2 bg-black text-white font-semibold"
                        >
                          Editar y corregir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
