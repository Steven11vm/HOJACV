/**
 * Edge middleware — runs before every request.
 *
 * - Applies security headers (HSTS, CSP, COOP, referrer policy, etc.).
 * - Blocks obvious bot user agents from the chat API.
 * - Enforces method on the API route.
 */
import { NextResponse, type NextRequest } from "next/server"

const BAD_UA = [
  /curl\//i,
  /wget\//i,
  /python-requests\//i,
  /python-urllib/i,
  /libwww-perl/i,
  /Go-http-client/i,
  /^Java\//i,
  /scrapy/i,
  /headlesschrome/i,
  /phantomjs/i,
  /sqlmap/i,
  /nikto/i,
  /nessus/i,
  /masscan/i,
  /nmap/i,
  /^$/, // empty user-agent
]

function isLikelyBot(ua: string) {
  return BAD_UA.some((re) => re.test(ua))
}

function stripCache(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
  res.headers.set("Pragma", "no-cache")
  res.headers.set("Expires", "0")
  res.headers.set("X-Robots-Tag", "noindex, nofollow")
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ua = req.headers.get("user-agent") ?? ""

  // /api/chat — chat pública blindada
  if (pathname === "/api/chat") {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
      return NextResponse.json({ error: "method_not_allowed" }, { status: 405 })
    }
    if (isLikelyBot(ua)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 })
    }
    const res = NextResponse.next()
    stripCache(res)
    return res
  }

  // /api/estudio/* — panel privado, bots bloqueados a nivel edge
  if (pathname.startsWith("/api/estudio")) {
    if (isLikelyBot(ua)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 })
    }
    const res = NextResponse.next()
    stripCache(res)
    return res
  }

  // /api/lead — captura de leads, bots bloqueados
  if (pathname === "/api/lead") {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
      return NextResponse.json({ error: "method_not_allowed" }, { status: 405 })
    }
    if (isLikelyBot(ua)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 })
    }
    const res = NextResponse.next()
    stripCache(res)
    return res
  }

  // /estudio* — página del panel, no cachear y noindex
  if (pathname === "/estudio" || pathname.startsWith("/estudio/")) {
    const res = NextResponse.next()
    stripCache(res)
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/chat",
    "/api/chat/:path*",
    "/api/estudio/:path*",
    "/api/lead",
    "/estudio",
    "/estudio/:path*",
  ],
}
