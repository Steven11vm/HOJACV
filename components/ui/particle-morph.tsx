"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"

/**
 * Muji-adapted particle morph:
 * - Torus knot poblado por particulas que reaccionan al mouse (empujan y vuelven).
 * - Sin HSL rainbow — todas las particulas en gris/blanco.
 * - 15k particulas (vs 50k del template original) para no matar el CPU.
 * - Vive dentro del contenedor de una fila de proyecto, no full-screen.
 */
export function ParticleMorph() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener("resize", resize)

    const mouse = new THREE.Vector2(0, 0)
    const clock = new THREE.Clock()

    const particleCount = 15000
    const positions = new Float32Array(particleCount * 3)
    const originalPositions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    const geometry = new THREE.BufferGeometry()
    const torusKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32)
    const posAttr = torusKnot.attributes.position as THREE.BufferAttribute

    for (let i = 0; i < particleCount; i++) {
      const vertexIndex = i % posAttr.count
      const x = posAttr.getX(vertexIndex)
      const y = posAttr.getY(vertexIndex)
      const z = posAttr.getZ(vertexIndex)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      originalPositions[i * 3] = x
      originalPositions[i * 3 + 1] = y
      originalPositions[i * 3 + 2] = z

      // Gris con leve variacion — mono, sin rainbow
      const g = 0.55 + Math.random() * 0.4
      colors[i * 3] = g
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = g

      velocities[i * 3] = 0
      velocities[i * 3 + 1] = 0
      velocities[i * 3 + 2] = 0
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.024,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.NormalBlending,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)
    torusKnot.dispose()

    const onMouse = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    window.addEventListener("mousemove", onMouse)

    let rafId = 0
    const currentPos = new THREE.Vector3()
    const originalPos = new THREE.Vector3()
    const velocity = new THREE.Vector3()
    const direction = new THREE.Vector3()
    const returnForce = new THREE.Vector3()

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      const mouseWorld = new THREE.Vector3(mouse.x * 3, mouse.y * 3, 0)

      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3
        const iy = ix + 1
        const iz = ix + 2

        currentPos.set(positions[ix], positions[iy], positions[iz])
        originalPos.set(originalPositions[ix], originalPositions[iy], originalPositions[iz])
        velocity.set(velocities[ix], velocities[iy], velocities[iz])

        const dist = currentPos.distanceTo(mouseWorld)
        if (dist < 1.5) {
          const force = (1.5 - dist) * 0.01
          direction.subVectors(currentPos, mouseWorld).normalize()
          velocity.add(direction.multiplyScalar(force))
        }

        returnForce.subVectors(originalPos, currentPos).multiplyScalar(0.001)
        velocity.add(returnForce)
        velocity.multiplyScalar(0.95)

        positions[ix] += velocity.x
        positions[iy] += velocity.y
        positions[iz] += velocity.z
        velocities[ix] = velocity.x
        velocities[iy] = velocity.y
        velocities[iz] = velocity.z
      }
      geometry.attributes.position.needsUpdate = true
      points.rotation.y = elapsed * 0.05
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouse)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{
        WebkitMaskImage: "radial-gradient(100% 140% at 50% 50%, black 60%, transparent 100%)",
      }}
    />
  )
}
