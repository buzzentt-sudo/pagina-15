'use client'

import { ChangeEvent, useEffect, useState } from 'react'
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
        .select('*')
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
        setError('El logo se subió, pero no se pudo guardar la configuración.')
        setLogoLoading(false)
        return
      }

      setLogoFile(null)
      setLogoSuccess('¡Logo actualizado correctamente!')
    } catch {
      setError('Ocurrió un error inesperado al cambiar el logo.')
    }

    setLogoLoading(false)
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
          Panel de administración
        </h1>

        <p className="text-gray-600 mb-8">
          Administrá las noticias y la identidad del sitio.
        </p>

        {error && (
          <p className="text-red-600 mb-6">
            {error}
          </p>
        )}

        <section className="border rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-2">
            Cambiar logo
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
            {logoLoading ? "Subiendo..." : "Cambiar logo"}
          </button>

          {logoSuccess && (
            <p className="mt-4 text-green-600">
              {logoSuccess}
            </p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-5">
            Noticias
          </h2>

          {news.length === 0 ? (
            <div className="border rounded-xl p-8 text-center">
              <p>No hay noticias.</p>
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

                  <p className="mt-3 text-sm text-gray-500">
                    Estado: {item.status}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {item.status === "pendiente" && (
                      <>
                        <button
                          onClick={() =>
                            updateNewsStatus(item.id, "aprobada")
                          }
                          disabled={actionLoading === item.id}
                          className="rounded-lg px-4 py-2 bg-green-600 text-white font-semibold disabled:opacity-50"
                        >
                          Aprobar
                        </button>

                        <button
                          onClick={() =>
                            updateNewsStatus(item.id, "rechazada")
                          }
                          disabled={actionLoading === item.id}
                          className="rounded-lg px-4 py-2 bg-red-600 text-white font-semibold disabled:opacity-50"
                        >
                          Rechazar
                        </button>
                      </>
                    )}

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
        </section>
      </div>
    </main>
  )
}
