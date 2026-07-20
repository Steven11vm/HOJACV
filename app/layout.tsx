/**
 * @author STEVEN VILLAMIZAR MENDOZA
 */
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap" })
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" })

export const metadata: Metadata = {
  title: "Steven Villamizar — Full Stack Engineer & AI Specialist",
  description:
    "Portafolio de Steven Villamizar Mendoza — Full Stack Engineer especializado en aplicaciones web escalables con integración de Inteligencia Artificial. Disponible para nuevos proyectos.",
  keywords: ["Full Stack Developer", "AI Engineer", "React", "Next.js", "Node.js", "TypeScript", "Steven Villamizar", "Medellín", "Colombia"],
  authors: [{ name: "Steven Villamizar Mendoza" }],
  creator: "Steven Villamizar Mendoza",
  openGraph: {
    title: "Steven Villamizar — Full Stack Engineer & AI Specialist",
    description:
      "Construyo productos digitales que generan resultados medibles. Especializado en web apps escalables con IA.",
    url: "https://stevencv.vercel.app",
    siteName: "Steven Villamizar — Portfolio",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Steven Villamizar — Full Stack Engineer & AI Specialist",
    description: "Construyo productos digitales con IA integrada. 20+ proyectos en producción.",
  },
  icons: {
    icon: "/icon.svg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} font-sans`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){document.documentElement.classList.remove('dark')}})();`,
          }}
        />
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
              <span className="text-sm font-mono text-muted-foreground">Loading…</span>
            </div>
          }
        >
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
