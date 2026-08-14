'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'

type Category = {
  id: string
  name: string
}

type News = {
  id: string
  author_id: string
  title: string
  excerpt: string | null
  content: string
  image_url: string
  category_id: string | null
  status: string
  rejection_reason: string | null
}

export default function EditarNoticiaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()

  const [news, setNews] = useState<News | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select(`
          id,
          author_id,
          title,
          excerpt,
          content,
          image_url,
          category_id,
          status,
          rejection_reason
        `)
        .eq('id', id)
        .eq('author_id', user.id)
        .single()

      if (newsError || !newsData) {
        setError('No se encontró la noticia o no tenés permiso para editarla.')
        setLoading(false)
        return
      }

      if (newsData.status !== 'rechazada') {
        setError('Solo podés editar noticias rechazadas.')
        setLoading(false)
        return
      }

      setNews(newsData)
      setTitle(newsData.title)
      setExcerpt(newsData.excerpt ?? '')
      setContent(newsData.content)
      setCategoryId(newsData.category_id ?? '')

      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

      setCategories(categoriesData ?? [])
      setLoading(false)
    }

    loadData()
  }, [id, router, supabase])

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    setImage(e.target.files?.[0] ?? null)
    setError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    setError('')

    if (!title.trim()) {
      setError('El título es obligatorio.')
      return
    }

    if (!content.trim()) {
      setError('El contenido es obligatorio.')
      return
    }

    setSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || !news) {
        setError('No se pudo comprobar tu usuario.')
        setSaving(false)
        return
      }

      let imageUrl = news.image_url

      if (image) {
        const extension =
          image.name.split('.').pop()?.toLowerCase() || 'jpg'

        const fileName = `${user.id}/${crypto.randomUUID()}.${extension}`

        const { error: uploadError } = await supabase.storage
          .from('news-images')
          .upload(fileName, image, {
            contentType: image.type,
          })

        if (uploadError) {
          console.error(uploadError)
          setError('No se pudo subir la nueva imagen.')
          setSaving(false)
          return
        }

        const { data } = supabase.storage
          .from('news-images')
          .getPublicUrl(fileName)

        imageUrl = data.publicUrl
      }

      const { error: updateError } = await supabase
        .from('news')
        .update({
          title: title.trim(),
          excerpt: excerpt.trim() || null,
          content: content.trim(),
          image_url: imageUrl,
          category_id: categoryId || null,
          status: 'pendiente',
          rejection_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', news.id)
        .eq('author_id', user.id)

      if (updateError) {
        console.error(updateError)
        setError('No se pudo actualizar la noticia.')
        setSaving(false)
        return
      }

      router.push('/mis-noticias')
    } catch (error) {
      console.error(error)
      setError('Ocurrió un error inesperado.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Cargando noticia...</p>
      </main>
    )
  }

  if (!news) {
    return (
      <main className="min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl p-5">
            {error || 'No se pudo cargar la noticia.'}
          </div>

          <button
            type="button"
            onClick={() => router.push('/mis-noticias')}
            className="mt-5 rounded-lg px-5 py-3 border font-semibold"
          >
            Volver a mis noticias
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">

        <button
          type="button"
          onClick={() => router.push('/mis-noticias')}
          className="mb-6 text-sm font-semibold underline"
        >
          ← Volver a mis noticias
        </button>

        <h1 className="text-3xl font-bold mb-2">
          Corregir noticia
        </h1>

        <p className="text-gray-600 mb-6">
          Corregí los datos indicados y volvé a enviarla para revisión.
        </p>

        {news.rejection_reason && (
          <div className="border border-red-200 bg-red-50 rounded-xl p-5 mb-8">
            <p className="font-bold text-red-800 mb-2">
              Motivo del rechazo
            </p>

            <p className="text-red-700 whitespace-pre-wrap">
              {news.rejection_reason}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block font-medium mb-2">
              Título *
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Copete
            </label>

            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Breve resumen de la noticia"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Imagen
            </label>

            <img
              src={news.image_url}
              alt={news.title}
              className="w-full max-h-72 object-cover rounded-lg mb-4"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            {image && (
              <p className="text-sm text-gray-600 mt-2">
                Nueva imagen: {image.name}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-2">
              Contenido *
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Categoría
            </label>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 bg-white"
            >
              <option value="">
                Sin categoría
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg px-4 py-3 bg-black text-white font-semibold disabled:opacity-50"
          >
            {saving
              ? 'Reenviando...'
              : 'Corregir y reenviar para revisión'}
          </button>

        </form>
      </div>
    </main>
  )
}
