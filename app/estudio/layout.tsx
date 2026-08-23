import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Estudio",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function EstudioLayout({ children }: { children: React.ReactNode }) {
  return children
}
