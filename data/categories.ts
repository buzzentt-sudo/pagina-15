import { Category, CategorySlug } from "@/types/news";

export const categories: Category[] = [
  {
    slug: "actualidad",
    name: "Actualidad",
    description:
      "Lo que pasa día a día en la Escuela N.º 15: novedades institucionales, proyectos de aula y vida cotidiana escolar.",
  },
  {
    slug: "deportes",
    name: "Deportes",
    description:
      "Resultados, torneos internos e interescolares, y las actividades de educación física de nuestra escuela.",
  },
  {
    slug: "efemerides",
    name: "Efemérides",
    description:
      "Actos, conmemoraciones y fechas patrias vividas por la comunidad educativa a lo largo del año.",
  },
  {
    slug: "eventos-especiales",
    name: "Eventos Especiales",
    description:
      "Ferias, jornadas, muestras y celebraciones que salen de la rutina habitual de la escuela.",
  },
  {
    slug: "participaciones",
    name: "Participaciones",
    description:
      "Concursos, olimpíadas, visitas educativas y representaciones de la Escuela N.º 15 fuera de sus aulas.",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function isValidCategorySlug(slug: string): slug is CategorySlug {
  return categories.some((c) => c.slug === slug);
}
