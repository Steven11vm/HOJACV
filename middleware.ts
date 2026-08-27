/**
 * Edge middleware — WAF-lite.
 *
 * Corre antes de cualquier ruta, en el edge (barato y rápido). Bloquea:
 *  - Paths de scanners conocidos (/wp-admin, /.env, /phpmyadmin, etc.).
 *  - User-agents de bots agresivos (curl, wget, sqlmap, nikto, nmap, etc.).
 *  - Métodos no permitidos en APIs críticas.
 *  - CACHE-CONTROL forzado y X-Robots-Tag noindex en /estudio* y /api/estudio/*.
 *
 * NO hace auth (eso vive en los handlers Node runtime).
 * NO hace rate-limit (edge no puede compartir estado con Node fácilmente).
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
  /gobuster/i,
  /dirbuster/i,
  /wfuzz/i,
  /nuclei/i,
  /^$/,
]

/**
 * Paths de scanners comunes. Devolver 404 en lugar de 403 para que el
 * atacante crea que la ruta simplemente no existe (fingerprinting harder).
 */
const SCANNER_PATHS = [
  /^\/wp-/i,
  /^\/wordpress/i,
  /^\/phpmyadmin/i,
  /^\/pma/i,
  /^\/xmlrpc\.php/i,
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/\.aws/i,
  /^\/\.ssh/i,
  /^\/\.htaccess/i,
  /^\/\.htpasswd/i,
  /^\/config\.(php|json|yml|yaml)$/i,
  /^\/backup/i,
  /^\/database\./i,
  /^\/db\.(sql|dump|bak)$/i,
  /^\/adminer/i,
  /^\/webdav/i,
  /^\/manager\/html/i,
  /^\/actuator/i,
  /^\/console/i,
  /^\/hudson/i,
  /^\/jenkins/i,
  /^\/solr/i,
  /^\/struts/i,
  /^\/cgi-bin/i,
  /^\/shell\./i,
  /^\/eval\./i,
  /^\/wp-config\./i,
  /^\/admin\.php$/i,
  /^\/login\.php$/i,
  // /admin, /login sin .php son válidos en apps modernas — no bloquear.
]

function isLikelyBot(ua: string) {
  return BAD_UA.some((re) => re.test(ua))
}

function isScannerPath(pathname: string) {
  return SCANNER_PATHS.some((re) => re.test(pathname))
}

function stripCache(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
  res.headers.set("Pragma", "no-cache")
  res.headers.set("Expires", "0")
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive")
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ua = req.headers.get("user-agent") ?? ""

  // WAF-lite: paths de scanners → 404 silencioso.
  if (isScannerPath(pathname)) {
    return new NextResponse(null, { status: 404 })
  }

  // /api/chat público
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

  // /api/estudio/* — panel privado
  if (pathname.startsWith("/api/estudio")) {
    if (isLikelyBot(ua)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 })
    }
    const res = NextResponse.next()
    stripCache(res)
    return res
  }

  // /api/lead — captura de leads del funnel
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

  // /estudio* — página del panel
  if (pathname === "/estudio" || pathname.startsWith("/estudio/")) {
    const res = NextResponse.next()
    stripCache(res)
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except Next assets — el WAF necesita ver rutas ajenas
    // para bloquear scanners (/wp-admin, /.env, etc.).
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|ico)$).*)",
  ],
}
