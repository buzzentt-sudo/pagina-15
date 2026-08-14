import { SchoolEvent } from "@/types/news";

// Lista de próximos eventos. Vacía por defecto salvo por los ejemplos:
// dejar el arreglo vacío ([]) es suficiente para que la sección de agenda
// muestre automáticamente su estado vacío.
export const upcomingEvents: SchoolEvent[] = [
  {
    id: "final-zonal-voley",
    name: "Final zonal de vóley masculino",
    description: "El seleccionado de la escuela juega la final en el Colegio del Uruguay.",
    date: "2026-08-29",
  },
  {
    id: "instancia-provincial-robotica",
    name: "Instancia provincial de Robótica",
    description: "El equipo de robótica presenta su proyecto en Paraná.",
    date: "2026-09-12",
  },
  {
    id: "jornada-puertas-abiertas",
    name: "Jornada de puertas abiertas",
    description: "Visita guiada para familias interesadas en inscribir a sus hijos e hijas para el próximo ciclo lectivo.",
    date: "2026-09-25",
  },
];

export function getUpcomingEvents(): SchoolEvent[] {
  return [...upcomingEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
