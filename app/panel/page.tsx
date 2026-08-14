'use client'

import { ChangeEvent, useEffect, useMemo, useState } from 'react'
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
  author_id: string | null
  category_id: string | null
  author?: {
    full_name: string | null
    course: string | null
  } | null
  category?: {
    name: string
  } | null
}

type Filter = 'todas' | 'pendiente' | 'aprobada' | 'rechazada'

export default function PanelPage() {
  const router = useRouter()
  const supabase = createClient()

  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('todas')

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoLoading, setLogoLoading] = useState(false)
  const [logoSuccess, setLogoSuccess] = useState('')

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

      if (roleData !== 'admin') {
        router.push('/')
        return
      }

      setAuthorized(true)

      const { data, error: newsError } = await supabase
        .from('news')
        .select(`
          id,
          author_id,
          title,
          content,
          excerpt,
          image_url,
          category_id,
          status,
          created_at,
          profiles:author_id (
            full_name,
            course
          ),
          categories:category_id (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (newsError) {
        console.error(newsError)
        setError('No se pudieron cargar las noticias.')
      } else {
        const formattedNews = (data ?? []).map((item: any) => ({
          ...item,
          author: Array.isArray(item.profiles)
            ? item.profiles[0] ?? null
            : item.profiles ?? null,
          category: Array.isArray(item.categories)
            ? item.categories[0] ?? null
            : item.categories ?? null,
        }))

        setNews(formattedNews)
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
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error(error)
      setError('No se pudo actualizar la noticia.')
      setActionLoading(null)
      return
    }

    setNews((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    )

    setActionLoading(null)
  }

  async function deleteNews(id: string) {
    const confirmar = window.confirm(
      '¿Seguro que querés eliminar esta noticia? Esta acción no se puede deshacer.'
    )

    if (!confirmar) return

    setError('')
    setActionLoading(id)

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      setError('No se pudo eliminar la noticia.')
      setActionLoading(null)
      return
    }

    setNews((current) =>
      current.filter((item) => item.id !== id)
    )

    setActionLoading(null)
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    setLogoFile(e.target.files?.[0] ?? null)
    setLogoSuccess('')
    setError('')
  }

  async function uploadLogo() {
    if (!logoFile) {
      setError('Seleccioná una imagen para el logo.')
      return
    }

    setError('')
    setLogoSuccess('')
    setLogoLoading(true)

    try {
      const extension =
        logoFile.name.split('.').pop()?.toLowerCase() || 'png'

      const fileName = `logo-${Date.now()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, logoFile, {
          upsert: true,
          contentType: logoFile.type,
        })

      if (uploadError) {
        console.error(uploadError)
        setError('No se pudo subir el logo.')
        setLogoLoading(false)
        return
      }

      const { data } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName)

      const logoUrl = data.publicUrl

      const { error: settingsError } = await supabase
        .from('site_settings')
        .update({
          logo_url: logoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1)

      if (settingsError) {
        console.error(settingsError)
        setError(
          'El logo se subió, pero no se pudo guardar la configuración.'
        )
        setLogoLoading(false)
        return
      }

      setLogoFile(null)
      setLogoSuccess('¡Logo actualizado correctamente!')
    } catch (error) {
      console.error(error)
      setError('Ocurrió un error inesperado al cambiar el logo.')
    }

    setLogoLoading(false)
  }

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
    if (status === 'pendiente') return 'Pendiente'
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Panel de administración
          </h1>

          <p className="text-gray-600 mt-2">
            Administrá las noticias y la identidad del sitio.
          </p>
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
              Pendientes
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

        {/* LOGO */}
        <section className="border rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-2">
            Identidad del sitio
          </h2>

          <p className="text-gray-600 mb-5">
            Subí una nueva imagen para reemplazar el logo actual.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full border rounded-lg px-4 py-3 mb-4"
          />

          {logoFile && (
            <p className="text-sm text-gray-600 mb-4">
              Archivo seleccionado: {logoFile.name}
            </p>
          )}

          <button
            type="button"
            onClick={uploadLogo}
            disabled={logoLoading || !logoFile}
            className="rounded-lg px-5 py-3 bg-black text-white font-semibold disabled:opacity-50"
          >
            {logoLoading ? 'Subiendo...' : 'Cambiar logo'}
          </button>

          {logoSuccess && (
            <p className="mt-4 text-green-600">
              {logoSuccess}
            </p>
          )}
        </section>

        {/* NOTICIAS */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-bold">
                Noticias
              </h2>

              <p className="text-gray-600 mt-1">
                {filteredNews.length} noticia
                {filteredNews.length === 1 ? '' : 's'} mostrada
                {filteredNews.length === 1 ? '' : 's'}.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                ['todas', 'Todas'],
                ['pendiente', 'Pendientes'],
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
          </div>

          {filteredNews.length === 0 ? (
            <div className="border rounded-xl p-8 text-center">
              <p>
                No hay noticias en esta sección.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
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

                      <h3 className="text-2xl font-bold mb-2">
                        {item.title}
                      </h3>

                      <div className="text-sm text-gray-500 mb-4 space-y-1">
                        <p>
                          👤{' '}
                          {item.author?.full_name ||
                            'Autor desconocido'}
                          {item.author?.course
                            ? ` — ${item.author.course}`
                            : ''}
                        </p>

                        <p>
                          📅{' '}
                          {new Date(
                            item.created_at
                          ).toLocaleDateString('es-AR')}
                        </p>
                      </div>

                      {item.excerpt && (
                        <p className="text-gray-600 mb-4">
                          {item.excerpt}
                        </p>
                      )}

                      <p className="whitespace-pre-wrap text-gray-800">
                        {item.content}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3">
                        {item.status === 'pendiente' && (
                          <>
                            <button
                              onClick={() =>
                                updateNewsStatus(
                                  item.id,
                                  'aprobada'
                                )
                              }
                              disabled={
                                actionLoading === item.id
                              }
                              className="rounded-lg px-4 py-2 bg-green-600 text-white font-semibold disabled:opacity-50"
                            >
                              Aprobar
                            </button>

                            <button
                              onClick={() =>
                                updateNewsStatus(
                                  item.id,
                                  'rechazada'
                                )
                              }
                              disabled={
                                actionLoading === item.id
                              }
                              className="rounded-lg px-4 py-2 bg-red-600 text-white font-semibold disabled:opacity-50"
                            >
                              Rechazar
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => deleteNews(item.id)}
                          disabled={
                            actionLoading === item.id
                          }
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
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

