"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"

/**
 * Muji-adapted WebGL shader.
 * - Salida en escala de grises (una sola acumulacion), no RGB por canal.
 * - Sin fondo azul del template original.
 * - Invert en light mode para leer como tinta negra sobre blanco.
 */
export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.0018;

        float gray = 0.0;
        for (int i = 0; i < 5; i++) {
          gray += lineWidth * float(i * i) /
            abs(fract(t + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
        }
        gray = clamp(gray, 0.0, 1.0);
        gl_FragColor = vec4(vec3(gray), 1.0);
      }
    `

    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    container.appendChild(renderer.domElement)

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height)
    }
    onResize()
    window.addEventListener("resize", onResize)

    let rafId = 0
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", onResize)
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full invert dark:invert-0"
    />
  )
}
