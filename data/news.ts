import { NewsArticle } from "@/types/news";

// Datos de ejemplo. Están separados del código de los componentes para que
// más adelante puedan reemplazarse por una fuente real (base de datos,
// CMS, API propia) sin modificar la interfaz.
export const newsArticles: NewsArticle[] = [
  {
    slug: "equipo-de-robotica-representa-a-la-escuela-en-la-provincial",
    title:
      "El equipo de Robótica de la Escuela N.º 15 representará a Entre Ríos en la instancia provincial",
    excerpt:
      "Tras un año de trabajo en el taller de robótica, un grupo de estudiantes de 5.º año clasificó a la etapa provincial del certamen con un brazo mecánico clasificador de residuos.",
    content: [
      "Después de meses de diseño, programación y pruebas en el taller de robótica, un grupo de seis estudiantes de 5.º año logró clasificar a la instancia provincial del certamen escolar de robótica, que se realizará el mes próximo en Paraná.",
      "El proyecto consiste en un brazo mecánico capaz de clasificar residuos según su material, pensado para instalarse en el patio central de la escuela como parte de un programa de separación en origen.",
      "\"Empezamos armando el chasis con material reciclado y después fuimos sumando los sensores. Lo más difícil fue calibrar la programación para que el brazo reconociera bien cada tipo de material\", contó uno de los integrantes del equipo.",
      "El profesor a cargo del taller destacó el trabajo interdisciplinario que exigió el proyecto, combinando contenidos de tecnología, física y programación, además de habilidades de trabajo en equipo.",
      "La delegación viajará acompañada por dos docentes y contará con el apoyo de la cooperadora escolar para solventar los gastos de traslado y materiales.",
    ],
    category: "participaciones",
    coverImage: {
      src: "/images/news/robotica-1.svg",
      alt: "Estudiantes trabajando en el brazo robótico en el taller de robótica",
    },
    gallery: [
      {
        src: "/images/news/robotica-2.svg",
        alt: "Detalle del brazo mecánico clasificador de residuos",
      },
    ],
    author: { name: "Redacción La 15 Comunica" },
    publishedAt: "2026-08-10",
    featured: true,
  },
  {
    slug: "taller-de-robotica-abre-inscripciones-2026",
    title: "El taller de robótica abre inscripciones para el segundo cuatrimestre",
    excerpt:
      "Estudiantes de 3.º a 6.º año ya pueden anotarse para sumarse al espacio extracurricular de robótica y programación.",
    content: [
      "El taller de robótica de la Escuela N.º 15 abrió la inscripción para nuevos integrantes de cara al segundo cuatrimestre del ciclo lectivo.",
      "El espacio, que funciona los martes y jueves a contraturno, está destinado a estudiantes de 3.º a 6.º año interesados en electrónica, programación y diseño de proyectos.",
      "No se requieren conocimientos previos: los primeros encuentros están dedicados a nivelar contenidos básicos de electricidad y lógica de programación.",
      "Quienes estén interesados pueden anotarse en preceptoría o hablar directamente con los docentes a cargo del taller.",
    ],
    category: "participaciones",
    coverImage: {
      src: "/images/news/robotica-2.svg",
      alt: "Herramientas y componentes electrónicos sobre una mesa de trabajo",
    },
    author: { name: "Redacción La 15 Comunica" },
    publishedAt: "2026-06-02",
  },
  {
    slug: "torneo-interescolar-de-futbol-femenino",
    title: "La Escuela N.º 15 organizó el torneo interescolar de fútbol femenino",
    excerpt:
      "Seis escuelas de la ciudad participaron de la jornada deportiva realizada en el polideportivo municipal.",
    content: [
      "El polideportivo municipal fue sede este sábado del torneo interescolar de fútbol femenino, organizado por el departamento de educación física de la Escuela N.º 15.",
      "Participaron equipos de seis establecimientos educativos de Concepción del Uruguay, con partidos de veinte minutos por lado y un cuadrangular final.",
      "El equipo local llegó a la final tras ganar sus tres partidos de la fase de grupos, y finalmente se quedó con el segundo puesto del torneo.",
      "La jornada se cerró con una entrega de medallas a todos los equipos participantes y un reconocimiento especial a la organización estudiantil del evento.",
    ],
    category: "deportes",
    coverImage: {
      src: "/images/news/deportes-1.svg",
      alt: "Equipo de fútbol femenino posando con el trofeo del torneo",
    },
    gallery: [
      {
        src: "/images/news/deportes-2.svg",
        alt: "Partido de fútbol femenino en el polideportivo municipal",
      },
    ],
    author: { name: "Departamento de Educación Física" },
    publishedAt: "2026-07-20",
  },
  {
    slug: "seleccionado-de-voley-clasifica-a-la-final-zonal",
    title: "El seleccionado de vóley masculino clasificó a la final zonal",
    excerpt:
      "Con una campaña invicta en la fase clasificatoria, el equipo jugará la final zonal a fines de agosto.",
    content: [
      "El equipo de vóley masculino de la Escuela N.º 15 cerró invicto la fase clasificatoria de los Juegos Escolares y se aseguró un lugar en la final zonal.",
      "El certamen reúne a los mejores equipos de la región y se disputará en el gimnasio del Colegio del Uruguay a fines de agosto.",
      "El entrenador destacó el crecimiento del grupo a lo largo del año y remarcó el compromiso de los jugadores con los entrenamientos.",
      "La comunidad educativa fue invitada a acompañar al equipo en la final, cuya fecha exacta se confirmará en los próximos días.",
    ],
    category: "deportes",
    coverImage: {
      src: "/images/news/deportes-2.svg",
      alt: "Equipo de vóley masculino durante un entrenamiento",
    },
    author: { name: "Departamento de Educación Física" },
    publishedAt: "2026-05-15",
  },
  {
    slug: "acto-por-el-aniversario-de-la-escuela",
    title: "La escuela celebró un nuevo aniversario con un acto cargado de emoción",
    excerpt:
      "Estudiantes, docentes y familias se reunieron para conmemorar un nuevo aniversario de la institución con números musicales y palabras de la dirección.",
    content: [
      "La comunidad educativa de la Escuela N.º 15 \"Claudio Lepratti\" se reunió en el patio central para celebrar un nuevo aniversario de la institución.",
      "El acto incluyó la actuación de la banda de música de la escuela, palabras de la dirección y un video institucional preparado por estudiantes de 6.º año.",
      "También se hizo entrega de reconocimientos a docentes con muchos años de trayectoria en la institución y a exalumnos que acompañaron la celebración.",
      "La jornada cerró con un compartido organizado por la cooperadora escolar en el patio de la escuela.",
    ],
    category: "efemerides",
    coverImage: {
      src: "/images/news/efemerides-1.svg",
      alt: "Acto escolar en el patio central de la institución",
    },
    author: { name: "Redacción La 15 Comunica" },
    publishedAt: "2026-04-28",
  },
  {
    slug: "jornada-por-el-dia-de-la-bandera",
    title: "Jornada especial por el Día de la Bandera con foco en la historia local",
    excerpt:
      "Los cursos de 2.º año prepararon paneles sobre la relación de Manuel Belgrano con la región para compartir con el resto de la escuela.",
    content: [
      "En el marco del Día de la Bandera, los cursos de 2.º año prepararon una muestra de paneles sobre la vida de Manuel Belgrano y su vínculo con la región del litoral.",
      "La actividad se enmarcó en el proyecto anual de ciencias sociales y contó con la participación de todos los cursos de la escuela, que recorrieron la muestra durante la mañana.",
      "Como cierre, se realizó la tradicional promesa de lealtad a la bandera de los estudiantes de 4.º grado de la escuela primaria vecina, invitados especialmente para la ocasión.",
    ],
    category: "efemerides",
    coverImage: {
      src: "/images/news/efemerides-2.svg",
      alt: "Paneles sobre la historia de la bandera argentina expuestos en el pasillo escolar",
    },
    author: { name: "Área de Ciencias Sociales" },
    publishedAt: "2026-06-20",
  },
  {
    slug: "feria-de-ciencias-2026",
    title: "La Feria de Ciencias reunió más de treinta proyectos estudiantiles",
    excerpt:
      "Durante dos días, familias y vecinos recorrieron los stands armados por estudiantes de todos los años con proyectos de ciencias naturales, tecnología y ciencias sociales.",
    content: [
      "La escuela realizó una nueva edición de su Feria de Ciencias, con más de treinta proyectos presentados por estudiantes de 1.º a 6.º año.",
      "Los trabajos abarcaron temas como energías renovables, huertas orgánicas, reciclaje de residuos electrónicos y aplicaciones de la inteligencia artificial en la vida cotidiana.",
      "Un jurado integrado por docentes de distintas áreas recorrió los stands y seleccionó los proyectos que representarán a la escuela en la instancia regional.",
      "La feria estuvo abierta a las familias durante dos jornadas y contó con una gran convocatoria de la comunidad.",
    ],
    category: "eventos-especiales",
    coverImage: {
      src: "/images/news/eventos-2.svg",
      alt: "Estudiantes presentando proyectos en la Feria de Ciencias",
    },
    gallery: [
      {
        src: "/images/news/eventos-1.svg",
        alt: "Familias recorriendo los stands de la Feria de Ciencias",
      },
    ],
    author: { name: "Redacción La 15 Comunica" },
    publishedAt: "2026-07-05",
  },
  {
    slug: "jornada-solidaria-de-invierno",
    title: "Jornada solidaria de invierno: la escuela recolectó ropa y frazadas",
    excerpt:
      "Estudiantes de todos los cursos organizaron una campaña de recolección que se entregó a instituciones de la ciudad.",
    content: [
      "Con el objetivo de acompañar a familias de la ciudad durante los meses más fríos, la escuela organizó una jornada solidaria de recolección de ropa de abrigo y frazadas.",
      "La iniciativa surgió del centro de estudiantes y contó con la participación de todos los cursos, que armaron cajas de recolección en cada aula.",
      "Lo recolectado se entregó a dos instituciones barriales que trabajan con familias en situación de vulnerabilidad.",
      "Los organizadores agradecieron el compromiso de toda la comunidad educativa con la iniciativa.",
    ],
    category: "eventos-especiales",
    coverImage: {
      src: "/images/news/eventos-1.svg",
      alt: "Cajas con ropa de abrigo recolectada en la jornada solidaria",
    },
    author: { name: "Centro de Estudiantes" },
    publishedAt: "2026-06-28",
  },
  {
    slug: "nueva-biblioteca-escolar",
    title: "La escuela renovó su biblioteca con un nuevo espacio de lectura",
    excerpt:
      "El espacio, remodelado con ayuda de la cooperadora escolar, suma nuevos títulos y un rincón de lectura para los recreos.",
    content: [
      "La biblioteca de la Escuela N.º 15 estrenó un espacio renovado, con nuevo mobiliario y un sector de lectura pensado para usarse durante los recreos largos.",
      "La remodelación fue posible gracias al aporte de la cooperadora escolar y a una campaña de donación de libros impulsada por docentes y familias.",
      "La bibliotecaria de la institución destacó que el objetivo es que el espacio se use no solo para estudiar, sino también como un lugar de encuentro y lectura recreativa.",
      "Ya se sumaron más de cien títulos nuevos al catálogo, entre novelas juveniles, cómics y material de consulta.",
    ],
    category: "actualidad",
    coverImage: {
      src: "/images/news/actualidad-2.svg",
      alt: "Nuevo espacio de lectura en la biblioteca escolar",
    },
    author: { name: "Redacción La 15 Comunica" },
    publishedAt: "2026-05-30",
  },
  {
    slug: "visita-educativa-al-palacio-san-jose",
    title: "Estudiantes de 4.º año visitaron el Palacio San José",
    excerpt:
      "La salida educativa formó parte del proyecto anual de historia sobre el período de la Confederación Argentina.",
    content: [
      "Estudiantes de 4.º año realizaron una visita educativa al Palacio San José, en el marco del proyecto anual de historia sobre el período de la Confederación Argentina.",
      "Durante el recorrido, guías del museo explicaron la historia del predio y su relación con la organización nacional en el siglo XIX.",
      "La actividad se complementó con una guía de trabajo elaborada por el área de ciencias sociales, que los estudiantes completaron durante la visita.",
      "Los docentes destacaron el valor de conocer de manera directa un sitio histórico tan cercano a la ciudad.",
    ],
    category: "actualidad",
    coverImage: {
      src: "/images/news/actualidad-1.svg",
      alt: "Estudiantes en la entrada del Palacio San José durante la visita educativa",
    },
    author: { name: "Área de Ciencias Sociales" },
    publishedAt: "2026-08-01",
  },
];

export function getFeaturedArticle(): NewsArticle {
  const featured = newsArticles.find((a) => a.featured);
  return featured ?? sortByDateDesc(newsArticles)[0];
}

export function getLatestArticles(limit?: number, excludeSlug?: string): NewsArticle[] {
  const sorted = sortByDateDesc(newsArticles).filter((a) => a.slug !== excludeSlug);
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export function getArticlesByCategory(categorySlug: string): NewsArticle[] {
  return sortByDateDesc(newsArticles.filter((a) => a.category === categorySlug));
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

export function getRelatedArticles(article: NewsArticle, limit = 3): NewsArticle[] {
  return sortByDateDesc(
    newsArticles.filter(
      (a) => a.category === article.category && a.slug !== article.slug
    )
  ).slice(0, limit);
}

export function searchArticles(query: string): NewsArticle[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return sortByDateDesc(
    newsArticles.filter((a) => {
      const haystack = [
        a.title,
        a.excerpt,
        a.content.join(" "),
        a.category,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
  );
}

function sortByDateDesc(articles: NewsArticle[]): NewsArticle[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
