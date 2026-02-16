# Hoja de vida digital — Portafolio Steven Villamizar

Portafolio profesional en formato de hoja de vida digital, con sección de proyectos y **documentación técnica** por proyecto (arquitectura, decisiones técnicas y problemas resueltos).

- **Autor:** Steven Villamizar Mendoza  
- **Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Radix UI, Lucide Icons

---

## Arquitectura

- **Next.js App Router**  
  Una única ruta principal (`app/page.tsx`) que concentra la experiencia de la hoja de vida: hero, sobre mí, experiencia, habilidades, proyectos y contacto. No se usa enrutado adicional; la navegación es por anclas y scroll.

- **Componentes UI**  
  Uso de **Radix UI** (Dialog, ScrollArea, Card, Button, Badge, etc.) para accesibilidad y comportamiento consistente. Estilos con **Tailwind CSS** y utilidades de **tailwind-merge** + **class-variance-authority** donde aplica.

- **Estado y efectos**  
  Estado local con `useState` (tema, menú móvil, sección activa, proyecto seleccionado para documentación, visibilidad de tarjetas). Refs (`useRef`) para secciones, tarjetas de experiencia y la sección de proyectos. **Intersection Observer** para animaciones al entrar en vista (experiencia y proyectos) sin librerías de animación pesadas.

- **Tema claro/oscuro**  
  Sin `next-themes` en esta página: el tema se lee y escribe en `document.documentElement` y en `localStorage` para persistencia entre visitas.

- **Imágenes**  
  `next/image` para la foto formal y la imagen del hero con tamaños responsivos y prioridad en el LCP.

- **Portafolio con documentación técnica**  
  Cada proyecto puede tener un objeto opcional `doc` con `architecture`, `technicalDecisions` y `problemsSolved`. Un botón "Documentación técnica" abre un **Dialog** (Radix) con **ScrollArea** que muestra esas tres secciones en listas.

---

## Decisiones técnicas

1. **Single Page con anclas**  
   Evitar recargas y mantener una sola carga inicial. Navegación por `scrollIntoView` y actualización de la sección activa según scroll para resaltar el ítem del menú.

2. **Animaciones al scroll con Intersection Observer**  
   En lugar de una librería de scroll (Framer Motion scroll, AOS, etc.), se usa solo el API nativo para mostrar/ocultar o animar tarjetas de experiencia y el bloque de proyectos (efecto “cohetes”). Menor dependencia y buen rendimiento en móvil.

3. **Documentación técnica en modal**  
   La documentación (arquitectura, decisiones, problemas resueltos) no va inline en cada tarjeta para no saturar la vista. Se muestra bajo demanda en un Dialog, con ScrollArea para textos largos.

4. **Tipado de proyectos**  
   Los proyectos se tipan con una interfaz que incluye `doc?: ProjectDoc` para que solo los proyectos con documentación muestren el botón y el modal type-safe.

5. **CDN para iconos de tecnologías**  
   Logos de habilidades (JavaScript, React, etc.) desde jsDelivr/devicons para no aumentar el peso del repo y mantener actualizaciones sencillas.

6. **Efecto “cohetes” con CSS**  
   La entrada de los proyectos se hace con `transform` 3D (scale, translateZ, rotateX) y transiciones CSS, sin dependencias extra de animación.

---

## Problemas que resolviste

1. **Mostrar muchos proyectos sin saturar la UI**  
   Sección de “Proyectos destacados” (featured) con tarjetas grandes y un bloque “Más proyectos” en grid más compacto. La documentación técnica se abre solo al hacer clic, manteniendo la página limpia.

2. **Rendimiento y fluidez en móvil**  
   Animaciones basadas en CSS y `requestAnimationFrame` (orbs de habilidades). Uso de `next/image` con `sizes` adecuados. Intersection Observer con `rootMargin` y `threshold` razonables para no disparar demasiados re-renders.

3. **Tema claro/oscuro persistente**  
   Sin depender de un provider global en esta página: lectura/escritura directa en `document.documentElement` y `localStorage` para que la preferencia se mantenga entre sesiones.

4. **Menú móvil accesible**  
   Menú hamburguesa que muestra/oculta el nav con estados controlados y botones con `aria-label`. Al elegir una sección, el menú se cierra y se hace scroll al ancla.

5. **Documentación técnica reutilizable**  
   Cualquier proyecto puede tener `doc` con los tres bloques (arquitectura, decisiones técnicas, problemas resueltos). Un solo modal sirve para todos; el contenido se cambia según el proyecto seleccionado.

6. **Corrección de texto en la hoja de vida**  
   En el proyecto “HOJA DE VIDA DIGITAL” se corrigió la descripción (“Pagian web donde se mueestra”) a “Página web donde se muestran mis habilidades y proyectos” y se alineó con la documentación técnica de este mismo sitio.

---

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Para producción:

```bash
npm run build
npm start
```

---

## Estructura relevante

- `app/page.tsx` — Página principal (hero, sobre mí, experiencia, habilidades, proyectos con doc técnica, contacto).
- `components/ui/*` — Componentes de Radix + Tailwind (Dialog, ScrollArea, Card, Button, Badge, etc.).
- `app/globals.css` — Variables CSS y tema (claro/oscuro).
