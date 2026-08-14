'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Notification = {
  id: string
  news_id: string | null
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
}

export default function NotificacionesPage() {
  const router = useRouter()
  const supabase = createClient()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadNotifications() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('notifications')
        .select(
          'id, news_id, type, title, message, read, created_at'
        )
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        setError('No se pudieron cargar las notificaciones.')
      } else {
        setNotifications(data ?? [])
      }

      setLoading(false)
    }

    loadNotifications()
  }, [router, supabase])

  async function markAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    )
  }

  async function markAllAsRead() {
    const unreadIds = notifications
      .filter((item) => !item.read)
      .map((item) => item.id)

    if (unreadIds.length === 0) return

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', unreadIds)

    if (error) {
      console.error(error)
      return
    }

    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      }))
    )
  }

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Cargando notificaciones...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Notificaciones
            </h1>

            <p className="text-gray-600 mt-2">
              {unreadCount > 0
                ? `Tenés ${unreadCount} notificación${
                    unreadCount === 1 ? '' : 'es'
                  } sin leer.`
                : 'No tenés notificaciones sin leer.'}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="rounded-lg border px-4 py-2 font-semibold hover:bg-gray-50"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="border rounded-xl p-8 text-center">
            <p className="text-gray-600">
              Todavía no tenés notificaciones.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id)
                  }

                  if (notification.news_id) {
                    router.push(
                      `/editar-noticia/${notification.news_id}`
                    )
                  }
                }}
                className={`border rounded-xl p-5 transition ${
                  notification.news_id
                    ? 'cursor-pointer hover:shadow-sm'
                    : ''
                } ${
                  notification.read
                    ? 'bg-white'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">
                    {notification.type === 'aprobada'
                      ? '✅'
                      : '❌'}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-lg">
                        {notification.title}
                      </h2>

                      {!notification.read && (
                        <span className="rounded-full bg-blue-600 text-white px-2 py-1 text-xs font-semibold">
                          Nueva
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                      {notification.message}
                    </p>

                    <p className="text-sm text-gray-500 mt-3">
                      {new Date(
                        notification.created_at
                      ).toLocaleString('es-AR')}
                    </p>

                    {notification.news_id && (
                      <p className="text-sm font-semibold text-brand-700 mt-3">
                        Ver mi noticia →
                      </p>
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
