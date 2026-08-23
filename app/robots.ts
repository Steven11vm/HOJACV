import type { MetadataRoute } from "next"

/**
 * robots.txt — bloquea el crawl del panel privado y de las APIs internas.
 * También bloquea rutas legacy que quedaron como 404 (defense-in-depth
 * contra scanners que buscan /admin, /wp-admin, /dashboard, etc).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/estudio",
          "/estudio/",
          "/admin",
          "/admin/",
          "/api/",
        ],
      },
    ],
    host: "https://cv-steven.vercel.app",
  }
}
