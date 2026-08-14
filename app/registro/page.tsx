'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const cursos = [
  '4° A',
  '4° B',
  '4° C',
  '5° A',
  '5° B',
  '5° C',
  '6° A',
  '6° B',
  '6° C',
]

export default function RegistroPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [curso, setCurso] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    setMensaje('')
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (!curso) {
      setError('Seleccioná tu curso.')
      return
    }

    setCargando(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nombre,
          course: curso,
        },
      },
    })

    setCargando(false)

    if (error) {
      setError(error.message)
      return
    }

    setMensaje(
      'Cuenta creada. Revisá tu correo electrónico para confirmar tu cuenta.'
    )

    setNombre('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setCurso('')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">
          Crear cuenta
        </h1>

        <p className="text-gray-600 mb-8">
          Registrate para poder enviar noticias.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">
              Nombre y apellido *
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Correo electrónico *
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-3"
              placeholder="ejemplo@gmail.com"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Contraseña *
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Confirmar contraseña *
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Curso *
            </label>

            <select
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-3 bg-white"
            >
              <option value="">Seleccioná tu curso</option>

              {cursos.map((curso) => (
                <option key={curso} value={curso}>
                  {curso}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          {mensaje && (
            <p className="text-green-600 text-sm">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg px-4 py-3 font-semibold bg-black text-white disabled:opacity-50"
          >
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          ¿Ya tenés una cuenta?{' '}
          <Link
            href="/login"
            className="font-semibold underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  )
}
