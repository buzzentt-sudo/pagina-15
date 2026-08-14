# La 15 Comunica — Portal de noticias

Rediseño del portal de noticias de la **Escuela Secundaria N.º 15 "Claudio
Lepratti"** (Concepción del Uruguay, Entre Ríos, Argentina). Mantiene el
formato de medio de comunicación escolar de La 15 Comunica, con un diseño
moderno, ordenado y profesional.

## Arquitectura

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- Datos de ejemplo locales, completamente separados del código de los
  componentes (`/data`), listos para reemplazarse en el futuro por una base
  de datos real sin tocar la interfaz visual.
- Componentes reutilizables en `/components` (`NewsCard`, `FeaturedNews`,
  `CategorySection`, `SearchBar`, `EventCard`, `NewsGrid`, `Pagination`,
  `RelatedNews`, `ShareButtons`, `Header`, `Footer`).
- SEO: metadata por página, Open Graph, datos estructurados (`NewsArticle`)
  en cada noticia, `sitemap.xml` y `robots.txt` generados dinámicamente.
- Imágenes de ejemplo en formato SVG generadas localmente (sin depender de
  ninguna API externa), usadas con `next/image` (lazy loading automático).

### Estructura de carpetas

```
app/                    Rutas (App Router)
  page.tsx               Inicio
  categoria/[slug]/       Página de categoría (con paginación)
  noticia/[slug]/         Página individual de noticia
  buscar/                 Resultados de búsqueda
  layout.tsx, globals.css, sitemap.ts, robots.ts, not-found.tsx
components/             Componentes reutilizables de UI
data/                   Datos de ejemplo (noticias, categorías, eventos)
types/                  Tipos de TypeScript compartidos
lib/                    Utilidades y configuración del sitio
public/images/          Imágenes estáticas (logo y coberturas de ejemplo)
```

## Cómo ejecutar el proyecto localmente

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Levantar el entorno de desarrollo:

   ```bash
   npm run dev
   ```

   El sitio queda disponible en `http://localhost:3000`.

3. Verificar que el proyecto compila correctamente (build de producción +
   chequeo de tipos de TypeScript):

   ```bash
   npm run build
   ```

## Reemplazar los datos de ejemplo

Todo el contenido de ejemplo vive en `/data`:

- `data/news.ts` — artículos de noticias
- `data/categories.ts` — categorías del sitio
- `data/events.ts` — próximos eventos de la agenda

Cuando haya una fuente de datos real (base de datos, panel de
administración), basta con reemplazar las funciones exportadas de estos
archivos (`getArticleBySlug`, `getArticlesByCategory`, `searchArticles`,
etc.) por llamadas a esa fuente, manteniendo la misma forma de los datos
definida en `types/news.ts`. Los componentes y páginas no necesitan
cambios.

## Despliegue en Vercel

El proyecto no requiere ninguna configuración especial:

- **Framework preset:** Next.js (detectado automáticamente).
- **Build command:** `next build` (por defecto).
- **Output directory:** gestionado automáticamente por Vercel.
- No se necesita ninguna variable de entorno obligatoria para que el sitio
  funcione.

### Variable de entorno opcional

| Variable               | Uso                                                                 | Obligatoria |
| ----------------------- | -------------------------------------------------------------------- | ----------- |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio, usada para SEO (Open Graph, sitemap, JSON-LD). Si no se define, se usa `https://la15comunica.ar` por defecto. | No |

## Próximos pasos sugeridos (fuera del alcance de esta entrega)

- Conectar una base de datos (por ejemplo PostgreSQL o Supabase) y un panel
  de administración para que docentes/estudiantes autorizados puedan crear
  y publicar noticias reales.
- Sumar autenticación y roles (administrador, editor, alumno) para el flujo
  de creación → revisión → aprobación → publicación.
- Reemplazar las imágenes de ejemplo por fotografías reales de la escuela.
