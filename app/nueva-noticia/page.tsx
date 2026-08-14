'use client'

import { FormEvent, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Category = {
  id: string
  name: string
}

export default function NuevaNoticiaPage() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

      if (data) {
        setCategories(data)
      }
    }

    loadCategories()
  }, [supabase])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!title.trim()) {
      setError('El título es obligatorio.')
      return
    }

    if (!content.trim()) {
      setError('El contenido es obligatorio.')
      return
    }

    if (!image) {
      setError('La imagen es obligatoria.')
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Tenés que iniciar sesión para enviar una noticia.')
        setLoading(false)
        return
      }

      const extension = image.name.split('.').pop()
      const fileName = `${user.id}/${crypto.randomUUID()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(fileName, image)

      if (uploadError) {
        setError('No se pudo subir la imagen.')
        setLoading(false)
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('news-images')
        .getPublicUrl(fileName)

      const { error: newsError } = await supabase
        .from('news')
        .insert({
          author_id: user.id,
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || null,
          image_url: publicUrl,
          category_id: categoryId || null,
          status: 'pendiente',
        })

      if (newsError) {
        setError('No se pudo guardar la noticia.')
        setLoading(false)
        return
      }

      setSuccess(
        '¡Noticia enviada! Quedará pendiente hasta que un editor o administrador la revise.'
      )

      setTitle('')
      setExcerpt('')
      setContent('')
      setImage(null)
      setCategoryId('')

      const fileInput = document.getElementById(
        'image'
      ) as HTMLInputElement | null

      if (fileInput) {
        fileInput.value = ''
      }
    } catch {
      setError('Ocurrió un error inesperado.')
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Nueva noticia
        </h1>

        <p className="text-gray-600 mb-8">
          Tu noticia será revisada antes de aparecer publicada.
        </p>

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
              placeholder="Título de la noticia"
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
              placeholder="Breve resumen de la noticia (opcional)"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Imagen *
            </label>

            <input
              id="image"
              type="file"
              accept="image/*"
              required
              onChange={(e) =>
                setImage(e.target.files?.[0] ?? null)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Contenido *
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Escribí el contenido completo de la noticia..."
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
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-600">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg px-4 py-3 font-semibold disabled:opacity-50"
          >
            {loading
              ? 'Enviando...'
              : 'Enviar noticia para revisión'}
          </button>
        </form>
      </div>
    </main>
  )
}
