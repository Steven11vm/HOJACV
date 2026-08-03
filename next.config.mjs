/** @type {import('next').NextConfig} */

// CSP that allows the dev portfolio assets and blocks everything else.
// `unsafe-inline` is needed for Next's runtime scripts. `unsafe-eval` is needed
// by (a) Next's HMR in dev, and (b) react-icon-cloud in production — it wraps
// TagCanvas.js as a string and evaluates it via eval() at runtime. It's a
// small security relaxation acceptable for a personal portfolio (no
// server-side user-input reflection); if this becomes a concern, swap the
// library for a native CSS-3D implementation.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https: ",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://cdn.jsdelivr.net https://raw.githubusercontent.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  // Embedder is intentionally NOT set to require-corp to avoid breaking 3rd-party images
]

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
