'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type News = {
  id: string
  title: string
  excerpt: string | null
  image_url: string
  content: string
  status: string
  created_at: string
}

export default function PanelPage() {
  const router = useRouter()
  const supabase = createClient()

  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    async function loadPanel() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: roleData, error: roleError } =
        await supabase.rpc('get_my_role')

      if (roleError) {
        setError('No se pudo comprobar tu rol.')
        setLoading(false)
        return
      }

      if (roleData !== 'editor' && roleData !== 'admin') {
        router.push('/')
        return
      }

      setAuthorized(true)
      const { data, error: newsError } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'pendiente')
        .order('created_at', { ascending: false })

      if (newsError) {
        setError('No se pudieron cargar las noticias.')
      } else {
        setNews(data ?? [])
      }

      setLoading(false)
    }

    loadPanel()
  }, [router, supabase])

  async function updateNewsStatus(
    id: string,
    status: 'aprobada' | 'rechazada'
  ) {
    setError('')
    setActionLoading(id)

    const { error } = await supabase
      .from('news')
      .update({ status })
      .eq('id', id)

    if (error) {
      setError('No se pudo actualizar la noticia.')
      setActionLoading(null)
      return
    }

    setNews((current) =>
      current.filter((item) => item.id !== id)
    )

    setActionLoading(null)
  }

  async function deleteNews(id: string) {
    const confirmar = window.confirm(
      '¿Seguro que querés eliminar esta noticia?'
    )

    if (!confirmar) {
      return
    }

    setError('')
    setActionLoading(id)

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)

    if (error) {
      setError('No se pudo eliminar la noticia.')
      setActionLoading(null)
      return
    }

    setNews((current) =>
      current.filter((item) => item.id !== id)
    )

    setActionLoading(null)
  }
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Cargando panel...</p>
      </main>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Panel de revisión
        </h1>

        <p className="text-gray-600 mb-8">
          Noticias pendientes de aprobación
        </p>

        {error && (
          <p className="text-red-600 mb-6">
            {error}
          </p>
        )}

        {news.length === 0 ? (
          <div className="border rounded-xl p-8 text-center">
            <p>No hay noticias pendientes.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item) => (
              <article
                key={item.id}
                className="border rounded-xl p-5"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full max-h-80 object-cover rounded-lg mb-5"
                />

                <h2 className="text-2xl font-bold mb-2">
                  {item.title}
                </h2>

                {item.excerpt && (
                  <p className="text-gray-600 mb-4">
                    {item.excerpt}
                  </p>
                )}

                <p className="whitespace-pre-wrap">
                  {item.content}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updateNewsStatus(item.id, 'aprobada')
                    }
                    disabled={actionLoading === item.id}
                    className="rounded-lg px-4 py-2 bg-green-600 text-white font-semibold disabled:opacity-50"
                  >
                    Aprobar
                  </button>

                  <button
                    onClick={() =>
                      updateNewsStatus(item.id, 'rechazada')
                    }
                    disabled={actionLoading === item.id}
                    className="rounded-lg px-4 py-2 bg-red-600 text-white font-semibold disabled:opacity-50"
                  >
                    Rechazar
                  </button>

                  <button
                    onClick={() => deleteNews(item.id)}
                    disabled={actionLoading === item.id}
                    className="rounded-lg px-4 py-2 bg-gray-800 text-white font-semibold disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>

                {actionLoading === item.id && (
                  <p className="mt-3 text-sm text-gray-500">
                    Procesando...
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}	
