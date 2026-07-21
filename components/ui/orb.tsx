"use client"
import { useEffect, useRef, useMemo } from "react"
import * as THREE from "three"

/**
 * Muji-adapted Orb: la esfera con desplazamiento por ruido y fresnel del template
 * original, pero con paleta de grises (sin cyan/violet/mint), pensada para vivir
 * dentro de la fila de un proyecto expandido (Enterprise Dashboard, analytics).
 * Rota en respuesta al mouse dentro de su contenedor.
 */
export function Orb() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const startTime = useRef<number>(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAccentA: { value: new THREE.Color("#f4f4f2") },
      uAccentB: { value: new THREE.Color("#a3a3a0") },
      uAccentC: { value: new THREE.Color("#5c5c58") },
    }),
    [],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    startTime.current = performance.now()

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
    camera.position.set(0, 0, 6.2)

    const geometry = new THREE.IcosahedronGeometry(1.45, 5)

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec3 vPos;
        varying vec3 vNormal;
        varying vec2 vUv;
        uniform float uTime;

        vec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        float snoise(vec3 v){
          const vec2  C = vec2(1.0/6.0, 1.0/3.0);
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a1.xy, h.y);
          vec3 p2 = vec3(a1.zw, h.z);
          vec3 p3 = vec3(a0.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vUv = uv;
          vNormal = normalMatrix * normalize(normal);
          float t = uTime * 0.22;
          float n = snoise(normalize(position) * 1.6 + vec3(0.0, t, t*0.7));
          float d = n * 0.18;
          vec3 displaced = position + normal * d;
          vPos = (modelMatrix * vec4(displaced, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vPos;
        varying vec3 vNormal;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uAccentA;
        uniform vec3 uAccentB;
        uniform vec3 uAccentC;

        float fresnel(vec3 n, vec3 v, float p) {
          return pow(1.0 - max(dot(normalize(n), normalize(v)), 0.0), p);
        }
        vec3 tonemap(vec3 c) {
          c = max(vec3(0.0), c - 0.004);
          return (c * (6.2 * c + 0.5)) / (c * (6.2 * c + 1.7) + 0.06);
        }
        vec3 palette(float k) {
          float e = smoothstep(0.0, 1.0, 0.5 + 0.5 * sin(k));
          float f = smoothstep(0.0, 1.0, 0.5 + 0.5 * cos(k * 0.7));
          return mix(mix(uAccentC, uAccentB, e), uAccentA, f * 0.6);
        }

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(cameraPosition - vPos);
          float t = uTime * 0.35;

          vec3 L1 = normalize(vec3(sin(t*0.9), 0.6, cos(t*0.7)));
          vec3 L2 = normalize(vec3(-cos(t*0.6), 0.2 + 0.3*sin(t*0.8), -sin(t*0.9)));
          vec3 L3 = normalize(vec3(0.0, 1.0, 0.2));

          float diff1 = max(dot(N, L1), 0.0);
          float diff2 = max(dot(N, L2), 0.0);
          float diff3 = max(dot(N, L3), 0.0);
          float spec1 = pow(max(dot(reflect(-L1, N), V), 0.0), 64.0);
          float spec2 = pow(max(dot(reflect(-L2, N), V), 0.0), 48.0);

          vec3 col = palette(t + N.x * 2.0 + N.y);
          vec3 base = col * (0.20 + 0.85 * (diff1 * 0.6 + diff2 * 0.3 + diff3 * 0.2));
          base += vec3(0.95) * (spec1 * 0.9 + spec2 * 0.6);

          float f = fresnel(N, V, 2.2);
          vec3 rim = mix(vec3(0.0), palette(t*1.3 + N.z*3.0), f);
          base += rim * 0.85;

          float trans = pow(1.0 - max(dot(N, V), 0.0), 3.0);
          base += palette(t*0.8) * trans * 0.25;
          base += vec3(0.03);

          gl_FragColor = vec4(tonemap(base), 0.95);
        }
      `,
      transparent: true,
      depthWrite: true,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
      uniforms.uResolution.value.set(w, h)
    }
    resize()

    const onMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      mouse.current.x = x * 2 - 1
      mouse.current.y = -(y * 2 - 1)
      uniforms.uMouse.value.set(mouse.current.x, mouse.current.y)
    }
    window.addEventListener("mousemove", onMouse, { passive: true })

    const animate = () => {
      const now = performance.now()
      const t = (now - startTime.current) / 1000
      uniforms.uTime.value = t

      const targetRotX = mouse.current.y * 0.35
      const targetRotY = mouse.current.x * 0.55 + t * 0.15
      mesh.rotation.x += (targetRotX - mesh.rotation.x) * 0.06
      mesh.rotation.y += (targetRotY - mesh.rotation.y) * 0.06

      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => resize()
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMouse)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
      scene.clear()
    }
  }, [uniforms])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{
        WebkitMaskImage: "radial-gradient(100% 140% at 50% 50%, black 60%, transparent 100%)",
      }}
    />
  )
}
