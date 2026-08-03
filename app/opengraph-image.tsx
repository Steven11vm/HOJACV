import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Steven Villamizar — Full Stack Engineer & AI Specialist"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background:
            "radial-gradient(1200px 700px at 85% -10%, rgba(120,120,140,0.18), transparent 60%), radial-gradient(900px 600px at -10% 110%, rgba(80,90,110,0.22), transparent 55%), linear-gradient(180deg, #0a0a0b 0%, #111114 100%)",
          color: "#f5f5f5",
          fontFamily: "'Inter', system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, transparent 0%, transparent 92%, rgba(255,255,255,0.04) 100%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                background: "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid #2d2d2d",
                fontSize: 34,
                fontWeight: 800,
                color: "#111",
                letterSpacing: "-0.02em",
              }}
            >
              S
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.1,
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#e5e5e5",
                  letterSpacing: "0.02em",
                }}
              >
                Steven Villamizar
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "#8a8a92",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                Portfolio · 2026
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.04)",
              fontSize: 14,
              color: "#c9c9d1",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: "#22c55e",
                boxShadow: "0 0 10px rgba(34,197,94,0.6)",
                display: "flex",
              }}
            />
            Disponible para proyectos
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            marginTop: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              color: "#8a8a92",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 32,
                height: 1,
                background: "#8a8a92",
                display: "flex",
              }}
            />
            Full Stack Engineer · AI Specialist
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "#fafafa",
              maxWidth: 1000,
            }}
          >
            Construyo productos digitales con IA integrada.
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#b8b8c0",
              lineHeight: 1.4,
              maxWidth: 900,
              marginTop: 4,
            }}
          >
            Web apps escalables · Next.js · Node.js · TypeScript · Python
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 32,
              fontSize: 15,
              color: "#c9c9d1",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "#6b6b74", fontSize: 11, letterSpacing: "0.14em" }}>PROYECTOS</span>
              <span style={{ fontSize: 20, color: "#fafafa", fontWeight: 600 }}>20+</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "#6b6b74", fontSize: 11, letterSpacing: "0.14em" }}>BASE</span>
              <span style={{ fontSize: 20, color: "#fafafa", fontWeight: 600 }}>Medellín · CO</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "#6b6b74", fontSize: 11, letterSpacing: "0.14em" }}>STACK</span>
              <span style={{ fontSize: 20, color: "#fafafa", fontWeight: 600 }}>Next · AI · Cloud</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 16,
              color: "#e5e5e5",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.02em",
            }}
          >
            cv-steven.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
