/**
 * @author STEVEN VILLAMIZAR MENDOZA
 */
import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Steven Villamizar - CV",
  description: "Steven Villamizar Mendoza - Tecnólogo en Análisis y Desarrollo de Software. Proyectos, experiencia y contacto.",
  openGraph: {
    title: "Steven Villamizar - CV | Portafolio",
    description: "Portafolio de Steven Villamizar Mendoza — Tecnólogo en Análisis y Desarrollo de Software.",
    url: "https://stevencv.vercel.app",
    siteName: "StevenCV",
    locale: "es_CO",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}})();`,
          }}
        />
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background text-foreground">Cargando...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
