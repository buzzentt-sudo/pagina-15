/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Las imágenes de ejemplo del proyecto son SVG locales generadas por
    // nosotros mismos (no provienen de fuentes externas), por eso se habilita
    // su optimización de forma segura.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
