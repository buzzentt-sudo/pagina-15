import { categories } from "@/data/categories";

export const siteConfig = {
  name: "La 15 Comunica",
  tagline: "El medio de comunicación de la Escuela N.º 15",
  description:
    "Portal de noticias de la Escuela Secundaria N.º 15 \"Claudio Lepratti\", Concepción del Uruguay, Entre Ríos. Actualidad, deportes, efemérides, eventos especiales y participaciones de nuestra comunidad educativa.",
  institution:
    "Escuela Secundaria N.º 15 \"Claudio Lepratti\" — Concepción del Uruguay, Entre Ríos, Argentina",
  // URL base del sitio en producción. Se puede sobrescribir con la variable
  // de entorno NEXT_PUBLIC_SITE_URL sin tocar código.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://la15comunica.ar",
};

export const mainNav = [
  { label: "Inicio", href: "/" },
  ...categories.map((c) => ({ label: c.name, href: `/categoria/${c.slug}` })),
];
