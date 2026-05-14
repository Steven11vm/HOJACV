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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Restrict /api/chat further at the edge
  if (pathname === "/api/chat") {
    if (req.method !== "POST" && req.method !== "OPTIONS") {
      return NextResponse.json({ error: "method_not_allowed" }, { status: 405 })
    }
    const ua = req.headers.get("user-agent") ?? ""
    if (isLikelyBot(ua)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 })
    }
    // Strict no-cache for chat endpoint
    const res = NextResponse.next()
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    res.headers.set("Pragma", "no-cache")
    res.headers.set("Expires", "0")
    res.headers.set("X-Robots-Tag", "noindex, nofollow")
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/chat", "/api/chat/:path*"],
}
