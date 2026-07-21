/**
 * Traducciones ES/EN para la hoja de vida
 * Autor: Steven Villamizar Mendoza
 */
export type Lang = "es" | "en"

export const translations = {
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre Mí",
      experience: "Experiencia",
      skills: "Stack",
      services: "Servicios",
      process: "Proceso",
      projects: "Proyectos",
      contact: "Contacto",
    },
    aria: {
      lightMode: "Activar modo claro",
      darkMode: "Activar modo oscuro",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    },
    hero: {
      status: "Disponible para nuevos proyectos",
      tagline: "Full Stack Engineer · AI Specialist",
      role1: "Full Stack Engineer",
      role2: "AI Integration Specialist",
      role3: "Product-minded Developer",
      role4: "Problem Solver",
      intro:
        "Construyo productos digitales que generan resultados medibles. Especializado en aplicaciones web escalables con integración de Inteligencia Artificial.",
      hireNow: "Contratar Ahora",
      downloadCV: "Descargar CV",
      viewWork: "Ver mi trabajo",
      catCard: "Mi compañero de código",
      scroll: "Scroll",
      currentlyAt: "Actualmente en",
      buildingAt: "Construyendo en",
    },
    stats: {
      years: "Años de Experiencia",
      projects: "Proyectos en Producción",
      tech: "Tecnologías Dominadas",
      clients: "Clientes Satisfechos",
      uptime: "Uptime promedio",
      performance: "Mejora de rendimiento",
    },
    about: {
      title: "Sobre Mí",
      subtitle: "Quién soy y qué me mueve",
      professionalProfile: "Perfil Profesional",
      bio1: "Soy",
      bio1b: ", Tecnólogo en Análisis y Desarrollo de Software con",
      bio1c: "más de 2 años",
      bio1d: "diseñando, construyendo y desplegando soluciones digitales de alto impacto.",
      bio2: "Actualmente lidero iniciativas de desarrollo en",
      bio2b: "ORAL-PLUS (SKY S.A.S),",
      bio2c: "donde combino arquitectura web moderna con integraciones de IA para automatizar procesos y mejorar la experiencia de cliente.",
      bio3:
        "Mi obsesión: código limpio, productos que generan ROI real y experiencias que los usuarios disfrutan usar. Si tu equipo necesita velocidad de ejecución sin sacrificar calidad, hablemos.",
      missionTitle: "Mi Misión",
      missionText:
        "Transformar problemas complejos de negocio en productos digitales elegantes, rápidos y rentables — usando IA como ventaja competitiva.",
      whyWork: "Por qué trabajar conmigo",
      whyItems: [
        "Entrego en tiempo y forma — más de 20 proyectos lanzados",
        "Mentalidad de producto: cada línea persigue un KPI",
        "IA aplicada con criterio, no por moda",
        "Comunicación clara con stakeholders técnicos y no técnicos",
      ],
      info: {
        location: "Medellín, Colombia",
        degree: "Tecnólogo ADSO — SENA",
        availability: "Remoto · Híbrido · Relocación",
        languages: "Español (Nativo) · Inglés (B2)",
      },
    },
    experience: {
      title: "Experiencia",
      subtitle: "Trayectoria profesional",
      achievements: "Logros clave",
      current: "Actual",
    },
    experiences: [
      {
        title: "Desarrollador Full Stack",
        company: "ORAL-PLUS (SKY S.A.S)",
        location: "Medellín, Colombia",
        period: "2024 — Presente",
        current: true,
        description:
          "Lidero el desarrollo de la plataforma web y app móvil de ORAL-PLUS: catálogo de productos, pagos en línea, dashboard administrativo y módulos con IA para automatizar atención al cliente.",
        achievements: [
          "Migré stack legacy PHP a arquitectura moderna React + Node, reduciendo tiempos de carga en 60%",
          "Integré agentes IA (Gemini) que automatizan 40% de las consultas de soporte",
          "Implementé pasarela de pagos y conciliación automática de facturas",
          "Mentoría técnica a desarrolladores junior del equipo",
        ],
        tech: ["React", "Next.js", "Node.js", "TypeScript", "MySQL", "Gemini AI", "PHP", "Android"],
      },
      {
        title: "Desarrollador Full Stack Freelance",
        company: "Proyectos Independientes",
        location: "Remoto",
        period: "2023 — 2024",
        current: false,
        description:
          "Diseñé y entregué soluciones a medida para PyMEs: SaaS de inventario, dashboards empresariales con reportes PDF/Excel y plataformas web con identidad de marca propia.",
        achievements: [
          "Lancé un SaaS de gestión de inventario y ventas en producción",
          "Construí dashboard empresarial con generación de reportes PDF/Excel en backend",
          "Reduje tiempos de operación manual de clientes hasta en un 70%",
          "Mantengo NPS > 9 con todos los clientes atendidos",
        ],
        tech: ["React", "Next.js", "Node.js", "Recharts", "Tailwind CSS", "MySQL"],
      },
      {
        title: "Desarrollador de Software Junior",
        company: "Proyectos Académicos & Personales",
        location: "Medellín, Colombia",
        period: "2022 — 2023",
        current: false,
        description:
          "Etapa formativa de alto rigor: construí 10+ proyectos de portafolio aplicando metodologías ágiles, pair programming y revisión de código profesional.",
        achievements: [
          "Dominio progresivo del stack JavaScript/TypeScript moderno",
          "Primer chatbot con IA generativa (Gemini API + Node.js)",
          "Fundamentos sólidos de algoritmos, estructuras de datos y patrones de diseño",
        ],
        tech: ["JavaScript", "TypeScript", "React", "Python", "Git"],
      },
    ],
    skills: {
      title: "Stack Tecnológico",
      subtitle: "Herramientas con las que construyo diariamente",
      categories: {
        frontend: "Frontend",
        backend: "Backend",
        database: "Bases de Datos",
        ai: "IA & Automatización",
        tools: "Herramientas & DevOps",
      },
    },
    services: {
      label: "Lo que ofrezco",
      title: "Servicios profesionales",
      subtitle:
        "Soluciones end-to-end que combinan diseño, ingeniería y producto. Trabajo con startups y empresas establecidas.",
      items: [
        {
          icon: "Code",
          title: "Aplicaciones Web Full Stack",
          desc: "Desarrollo SaaS, dashboards, e-commerce y landing pages con Next.js, React y Node. Performance, accesibilidad y SEO incluidos por defecto.",
          deliverables: ["Arquitectura escalable", "UI/UX moderna", "Despliegue continuo", "Soporte post-launch"],
        },
        {
          icon: "Sparkles",
          title: "Integración de IA",
          desc: "Implementación de agentes inteligentes, chatbots, búsquedas semánticas y automatizaciones con LLMs (Gemini, OpenAI) directamente en tu producto.",
          deliverables: ["Análisis de caso de uso", "Prompt engineering", "RAG / fine-tuning", "Métricas de impacto"],
        },
        {
          icon: "BarChart3",
          title: "Dashboards & Analytics",
          desc: "Paneles ejecutivos con visualizaciones en tiempo real, exportación a PDF/Excel y reglas de negocio personalizadas para tu operación.",
          deliverables: ["Reportería avanzada", "KPIs en tiempo real", "Roles y permisos", "Export PDF/Excel"],
        },
        {
          icon: "Smartphone",
          title: "Soluciones Móviles",
          desc: "Apps Android nativas e híbridas conectadas a tu backend web. Una sola fuente de verdad para todos tus canales.",
          deliverables: ["App Android", "API REST robusta", "Sincronización offline", "Publicación Play Store"],
        },
      ],
    },
    process: {
      label: "Cómo trabajo",
      title: "Mi proceso de trabajo",
      subtitle: "Un método probado que minimiza riesgos y maximiza valor entregado.",
      steps: [
        {
          number: "01",
          title: "Discovery",
          desc: "Reunión inicial para entender tu negocio, usuarios y objetivos. Identifico riesgos técnicos y oportunidades antes de escribir una sola línea.",
          duration: "1–3 días",
        },
        {
          number: "02",
          title: "Diseño & Arquitectura",
          desc: "Wireframes, modelos de datos y arquitectura técnica documentada. Validamos antes de construir para no desperdiciar esfuerzo.",
          duration: "3–7 días",
        },
        {
          number: "03",
          title: "Desarrollo Iterativo",
          desc: "Sprints semanales con entregables visibles. Tú pruebas, das feedback y ajustamos en caliente. Sin sorpresas al final.",
          duration: "2–8 semanas",
        },
        {
          number: "04",
          title: "QA & Despliegue",
          desc: "Tests automatizados, optimización de performance y despliegue en producción con monitoring. Te entrego documentación y acceso completo.",
          duration: "3–5 días",
        },
        {
          number: "05",
          title: "Soporte & Evolución",
          desc: "Acompañamiento post-lanzamiento, métricas reales de uso y plan de evolución del producto. Estoy disponible cuando me necesites.",
          duration: "Continuo",
        },
      ],
    },
    projects: {
      portfolio: "Portafolio",
      title: "Proyectos destacados",
      subtitle: "Soluciones reales, en producción, generando valor para usuarios y negocios todos los días.",
      featured: "Destacado",
      live: "En vivo",
      projectN: "Proyecto",
      technicalDoc: "Documentación técnica",
      viewProject: "Ver proyecto",
      privateProject: "Proyecto privado",
      moreProjects: "Más proyectos",
      docTech: "Doc. técnica",
      docLabels: {
        architecture: "Arquitectura",
        technicalDecisions: "Decisiones técnicas",
        problemsSolved: "Problemas resueltos",
      },
    },
    projectsData: [
      {
        title: "Tonsorium — Spa for Men",
        subtitle: "Barbería premium con reservas online",
        description:
          "Ecosistema digital para barbería premium en Itagüí: catálogo de servicios, sistema de reservas con validación de disponibilidad, panel administrativo, cuentas de cliente e integración con WhatsApp. Diseñado con estética editorial oscura y dorado clásico para reforzar la marca 'El arte del caballero'.",
        tech: ["React", "PHP", "SQL Server", "Tailwind CSS", "WhatsApp API"],
        link: "https://tonsorium.online/",
        featured: true,
        hero: true,
        accent: "#c9a253",
        image: "/projects/tonsorium.svg",
        imageAlt: "Tonsorium — barbería premium",
        doc: {
          architecture: [
            "SPA en React con vistas: inicio, servicios, galería, testimonios, reservas, login/registro y cuenta.",
            "Backend en PHP con endpoints REST para servicios, disponibilidad, reservas y sesiones (JWT / cookies HttpOnly).",
            "SQL Server como fuente de verdad para servicios, maestros, turnos, clientes y reservas — con constraints para evitar dobles bookings.",
            "Panel administrativo separado (/admin) con autenticación reforzada para gestión de agenda, servicios y clientes.",
            "Integración con WhatsApp para confirmación de reservas y contacto directo con el negocio.",
          ],
          technicalDecisions: [
            "React desacoplado del backend PHP vía API JSON, para escalar frontend y backend por separado.",
            "SQL Server elegido por transacciones ACID sólidas — clave para evitar reservas duplicadas del mismo turno.",
            "Diseño mobile-first con estética editorial (dorado sobre negro cálido) que refuerza el posicionamiento premium.",
            "Zona /admin aislada del bundle público y con rate-limit propio para reducir superficie de ataque.",
            "Envío de notificaciones vía WhatsApp en lugar de SMS por adopción del canal en Colombia y menor fricción.",
          ],
          problemsSolved: [
            "Eliminar el ida-y-vuelta por WhatsApp para agendar: el cliente ve disponibilidad real y cierra la reserva en segundos.",
            "Prevenir dobles reservas de un mismo turno mediante lock optimista en SQL Server + validación en backend.",
            "Panel de administración fácil de operar para el equipo de barberos, sin necesidad de perfil técnico.",
            "Experiencia móvil impecable — el 80%+ del tráfico llega desde el teléfono en horario de cita.",
            "Marca premium consistente en cada pantalla: tipografía serif, dorado clásico y micro-interacciones sobrias.",
          ],
        },
      },
      {
        title: "Alien Style 51",
        subtitle: "Estampados personalizados con Studio 3D",
        description:
          "E-commerce de estampados personalizados en Medellín: catálogo de camisetas, tazas, gorras y llaveros; Studio interactivo para diseñar en vivo sobre el producto (canvas HTML5); flujo de compra, cuenta de cliente y panel administrativo. Producción exprés 48h y envíos a toda Colombia.",
        tech: ["PHP", "JavaScript", "HTML5 Canvas", "MySQL", "Tailwind CSS"],
        link: "https://alyenstyle.online/",
        featured: true,
        image: "/projects/alienstyle.svg",
        imageAlt: "Alien Style 51 — estampados personalizados",
        doc: {
          architecture: [
            "Backend PHP con endpoints REST para catálogo, autenticación, órdenes y administración.",
            "Studio de personalización en cliente: HTML5 Canvas + JS para posicionar, escalar y previsualizar el diseño sobre el producto en tiempo real.",
            "MySQL como fuente de verdad para productos, variantes (colores, tallas), clientes y pedidos.",
            "Panel administrativo aparte para gestionar catálogo, órdenes y estados de producción.",
            "Flujo de checkout con datos de envío nacional y confirmación por correo/WhatsApp.",
          ],
          technicalDecisions: [
            "Studio en el cliente con canvas para que el usuario vea el resultado antes de comprar y baje el porcentaje de devoluciones.",
            "PHP + MySQL por estabilidad, hosting barato y velocidad para iterar promociones/temporada.",
            "Modelo de producto con variantes (tipo de tela, color, talla) para no duplicar SKUs y mantener stock simple.",
            "Endpoints separados para /auth y /catalogo con validación server-side para reducir superficie de ataque.",
            "Producción 48h como promesa central del negocio — refuerza el copy y la conversión.",
          ],
          problemsSolved: [
            "El cliente ya no necesita imaginarse el diseño: lo ve renderizado sobre el producto antes de pagar.",
            "Menor tasa de devoluciones/reclamos gracias a la previsualización + confirmación final del arte.",
            "Un solo panel para gestionar pedidos de sublimado, DTF y láser con estados de producción claros.",
            "Catálogo escalable: productos con múltiples variantes y precios sin duplicar registros.",
            "Marca 'Alien Style 51' consistente en cada pantalla, sin plantillas tipo Shopify genérico.",
          ],
        },
      },
      {
        title: "Beat Generator AI",
        subtitle: "Plataforma de generación musical con IA",
        description:
          "Plataforma conversacional que genera beats y patrones musicales personalizados a partir de prompts del usuario, combinando Gemini API con un pipeline de audio en tiempo real.",
        tech: ["Next.js", "Node.js", "Gemini API", "Python", "AI/ML"],
        link: "https://opiumm-gray.vercel.app/",
        featured: true,
        visual: "shader",
        doc: {
          architecture: [
            "Frontend en React/Next con interfaz de chat y controles de generación.",
            "Backend en Node.js para orquestar llamadas a APIs de IA.",
            "Integración con API Gemini para procesamiento de lenguaje natural y generación de contenido.",
            "Pipeline de audio: generación de beats vía modelos/servicios de IA y reproducción en cliente.",
          ],
          technicalDecisions: [
            "Uso de API Gemini para respuestas conversacionales y contexto de generación musical.",
            "Separación entre capa de chat (NLU) y capa de generación de audio para escalar por partes.",
            "Node.js como puente entre frontend y APIs externas para ocultar claves y manejar rate limits.",
          ],
          problemsSolved: [
            "Unificar chat y generación de beats en una sola experiencia sin cambiar de aplicación.",
            "Manejo de latencia en generación de audio con feedback visual y estados de carga.",
            "Persistencia de preferencias de usuario (estilo, BPM) entre sesiones.",
          ],
        },
      },
      {
        title: "Finanzas Pro",
        subtitle: "Control financiero personal inteligente",
        description:
          "App de finanzas personales con dashboards visuales, presupuestos automáticos, alertas de límite y análisis de tendencias de gasto. Diseñada para uso diario.",
        tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        link: "https://finanzaspro-nine.vercel.app/",
        featured: true,
        doc: {
          architecture: [
            "Next.js App Router con React para una SPA de alto rendimiento.",
            "Componentes de dashboard con gráficos y tablas de movimientos financieros.",
            "Persistencia de datos en localStorage o base de datos para historial de gastos e ingresos.",
            "UI construida con Tailwind CSS para diseño responsivo y moderno.",
          ],
          technicalDecisions: [
            "Next.js para renderizado optimizado y enrutamiento sin configuración adicional.",
            "React para componentes reutilizables (tarjetas de resumen, gráficos, formularios de transacciones).",
            "TypeScript para tipado estricto y mayor robustez en el manejo de datos financieros.",
            "Tailwind CSS para estilos consistentes y desarrollo ágil de la interfaz.",
          ],
          problemsSolved: [
            "Visualización clara de gastos e ingresos por categorías y períodos de tiempo.",
            "Control de presupuesto con alertas cuando se supera el límite establecido.",
            "Historial de transacciones con filtros y búsqueda para fácil seguimiento del dinero.",
          ],
        },
      },
      {
        title: "Inventory SaaS",
        subtitle: "Sistema de inventario y ventas para PyMEs",
        description:
          "Plataforma multi-tenant para gestión de inventario, ventas y reportes. Control de stock en tiempo real con validaciones que previenen sobreventa.",
        tech: ["React", "Node.js", "REST API", "MySQL", "JavaScript"],
        link: "https://saas-beta-peach.vercel.app/",
        featured: true,
        doc: {
          architecture: [
            "SPA en React con vistas: inventario, ventas, reportes y configuración.",
            "API REST en Node.js para CRUD de productos, movimientos y ventas.",
            "Base de datos (SQL o NoSQL según despliegue) para productos, stock y transacciones.",
          ],
          technicalDecisions: [
            "React para reutilización de componentes (tablas, formularios, modales) en todas las secciones.",
            "API REST stateless para permitir futura app móvil o integraciones.",
            "Validación en backend y frontend para evitar datos inconsistentes en stock.",
          ],
          problemsSolved: [
            "Sincronización de stock en tiempo real al registrar ventas o entradas/salidas.",
            "Evitar ventas por encima del stock disponible con validaciones y mensajes claros.",
            "Reportes de ventas e inventario exportables o visualizables en dashboard.",
          ],
        },
      },
      {
        title: "Enterprise Dashboard",
        subtitle: "Analytics de RRHH con reportes PDF/Excel",
        description:
          "Dashboard ejecutivo con KPIs de empleados, generación de Excel/PDF en servidor y control granular de permisos por rol. Listo para auditorías.",
        tech: ["React", "Node.js", "Recharts", "xlsx", "pdf-lib"],
        link: "https://empresarial-omega.vercel.app/",
        featured: true,
        visual: "orb",
        doc: {
          architecture: [
            "Frontend React con dashboards, tablas y gráficos (ej. Recharts).",
            "Backend Node.js con endpoints para empleados, reportes y generación de archivos.",
            "Generación de Excel y PDF en servidor (librerías como xlsx, pdf-lib o puppeteer) y descarga por el cliente.",
          ],
          technicalDecisions: [
            "Generación de Excel/PDF en backend para no sobrecargar el navegador y garantizar formato uniforme.",
            "Gráficos en el cliente con datos agregados desde la API para mejor tiempo de respuesta.",
            "Autenticación y roles para restringir acceso a reportes sensibles.",
          ],
          problemsSolved: [
            "Reportes pesados (muchos empleados/datos) sin bloquear la UI mediante jobs o streaming.",
            "Formato consistente de Excel y PDF para auditorías y presentaciones.",
            "Análisis de datos de empleados (KPIs, tendencias) con visualizaciones claras.",
          ],
        },
      },
      {
        title: "ORAL-PLUS Ecosystem",
        subtitle: "Web + App Android + Pasarela de pagos",
        description:
          "Ecosistema completo de venta de productos bucales: portal web, app Android, pasarela de pagos y conciliación automática de facturas. En producción nacional.",
        tech: ["JavaScript", "PHP", "MySQL", "Android", "HTML/CSS"],
        link: "https://oral-plus.com/index.html",
        featured: true,
        doc: {
          architecture: [
            "Sitio web con PHP en el servidor, HTML/CSS/JS en el frontend.",
            "App Android nativa o híbrida para catálogo y pagos.",
            "Base de datos SQL compartida para productos, usuarios y facturas.",
          ],
          technicalDecisions: [
            "PHP para backend web y lógica de negocio en el servidor.",
            "App móvil para llegar a clientes que prefieren comprar desde el teléfono.",
            "Un solo modelo de datos para facturas en web y app para consistencia.",
          ],
          problemsSolved: [
            "Pago de facturas y compra de productos desde web y app con el mismo usuario.",
            "Sincronización de inventario y precios entre canal web y móvil.",
            "Experiencia de compra segura y clara para productos bucales.",
          ],
        },
      },
      {
        title: "Barbería Orion",
        subtitle: "Sistema de reservas para barbería",
        description:
          "Plataforma de gestión de citas con experiencia mobile-first y micro-interacciones que refuerzan la marca premium del negocio.",
        tech: ["React", "Tailwind CSS", "Framer Motion"],
        link: "#",
        featured: false,
        doc: {
          architecture: [
            "Aplicación React con vistas de servicios, disponibilidad y reservas.",
            "Estilos con Tailwind y animaciones con Framer Motion para UX fluida.",
          ],
          technicalDecisions: [
            "Framer Motion para transiciones y micro-interacciones que refuercen la marca.",
            "Diseño responsivo primero para uso en móvil en punto de venta o por clientes.",
          ],
          problemsSolved: [
            "Visualización clara de horarios y servicios para reducir no-shows.",
            "Experiencia de reserva rápida y accesible desde cualquier dispositivo.",
          ],
        },
      },
      {
        title: "Digital CV",
        subtitle: "Portafolio interactivo (este sitio)",
        description:
          "Portafolio bilingüe con asistente IA integrado, modo oscuro, animaciones cinematográficas y documentación técnica por proyecto. Performance 95+ en Lighthouse.",
        tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion"],
        link: "https://cv-steven.vercel.app/",
        featured: true,
        visual: "particles",
        doc: {
          architecture: [
            "Next.js App Router con una página principal (page.tsx) y componentes reutilizables.",
            "UI con Radix UI + Tailwind CSS; tema claro/oscuro persistido en localStorage.",
            "Secciones: Hero, Sobre mí, Experiencia, Habilidades, Proyectos (con documentación técnica), Contacto.",
          ],
          technicalDecisions: [
            "Single Page con scroll y navegación por anclas para evitar recargas y mejor UX.",
            "Intersection Observer para animaciones al scroll (experiencia, proyectos) sin librerías pesadas.",
            "Documentación técnica por proyecto en modal (Dialog) para no saturar la vista.",
          ],
          problemsSolved: [
            "Mostrar muchos proyectos sin saturar: destacados + grid secundario y doc técnica bajo demanda.",
            "Rendimiento en móvil: animaciones con CSS/RAF y lazy de imágenes con Next/Image.",
            "Accesibilidad: tema claro/oscuro, menú móvil y botones con labels.",
          ],
        },
      },
      {
        title: "Enterprise Private Projects",
        subtitle: "Sistemas a medida bajo NDA",
        description:
          "Sistemas empresariales con visualización en tiempo real, integraciones internas y procesamiento de datos a escala. Cubiertos por acuerdos de confidencialidad.",
        tech: ["Python", "JavaScript", "MySQL", "WebSockets"],
        link: undefined,
        featured: false,
        doc: {
          architecture: [
            "Backend en Python (Flask/Django o similar) para lógica y APIs.",
            "Frontend en JavaScript para dashboards y visualización en tiempo real.",
            "MySQL como almacenamiento transaccional y para reportes.",
          ],
          technicalDecisions: [
            "Python para integraciones, scripts y procesamiento de datos empresariales.",
            "Visualización en tiempo real mediante WebSockets o polling según requisitos.",
          ],
          problemsSolved: [
            "Datos en tiempo real para monitoreo y toma de decisiones.",
            "Sistemas a medida que se integran con procesos internos del cliente.",
          ],
        },
      },
    ],
    contact: {
      title: "Hablemos",
      subtitle: "¿Tienes un proyecto en mente? Respondo en menos de 24 horas. La primera reunión es gratuita.",
      email: "Email",
      phone: "Teléfono",
      location: "Ubicación",
      startConversation: "Iniciar conversación",
      scheduleCall: "Agendar llamada",
      sendEmail: "Enviar email",
      whatsapp: "WhatsApp",
      available: "Disponible",
      responseTime: "Respondo en < 24h",
    },
    footer: {
      copyright: "© 2025 Steven Villamizar Mendoza",
      built: "Diseñado y desarrollado por Steven Villamizar · Hecho con Next.js + IA",
      tagline: "Construyendo el futuro, un commit a la vez.",
    },
    langModal: {
      title: "Elige el idioma de tu hoja de vida",
      titleEn: "Choose your resume language",
      subtitle: "Selecciona en qué idioma deseas ver todo el contenido",
      subtitleEn: "Select which language you want to view all content in",
      spanish: "Español",
      english: "English",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      experience: "Experience",
      skills: "Stack",
      services: "Services",
      process: "Process",
      projects: "Work",
      contact: "Contact",
    },
    aria: {
      lightMode: "Enable light mode",
      darkMode: "Enable dark mode",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      status: "Available for new projects",
      tagline: "Full Stack Engineer · AI Specialist",
      role1: "Full Stack Engineer",
      role2: "AI Integration Specialist",
      role3: "Product-minded Developer",
      role4: "Problem Solver",
      intro:
        "I build digital products that deliver measurable outcomes. Specialized in scalable web apps with AI integration built-in.",
      hireNow: "Hire Me",
      downloadCV: "Download CV",
      viewWork: "View my work",
      catCard: "My coding buddy",
      scroll: "Scroll",
      currentlyAt: "Currently at",
      buildingAt: "Building at",
    },
    stats: {
      years: "Years of Experience",
      projects: "Projects in Production",
      tech: "Technologies Mastered",
      clients: "Happy Clients",
      uptime: "Average uptime",
      performance: "Performance gain",
    },
    about: {
      title: "About Me",
      subtitle: "Who I am and what drives me",
      professionalProfile: "Professional Profile",
      bio1: "I'm",
      bio1b: ", a Software Analysis & Development technologist with",
      bio1c: "2+ years",
      bio1d: "designing, building and shipping high-impact digital products.",
      bio2: "Currently leading development initiatives at",
      bio2b: "ORAL-PLUS (SKY S.A.S),",
      bio2c: "combining modern web architecture with AI integrations to automate operations and elevate customer experience.",
      bio3:
        "My obsession: clean code, products that deliver real ROI, and experiences users actually enjoy. If your team needs speed without sacrificing quality, let's talk.",
      missionTitle: "My Mission",
      missionText:
        "Turn complex business problems into elegant, fast and profitable digital products — using AI as a competitive edge.",
      whyWork: "Why work with me",
      whyItems: [
        "I ship on time — 20+ projects in production",
        "Product mindset: every line chases a KPI",
        "AI applied with purpose, not because it's trendy",
        "Clear communication with technical and non-technical stakeholders",
      ],
      info: {
        location: "Medellín, Colombia",
        degree: "Software Tech — SENA",
        availability: "Remote · Hybrid · Relocation",
        languages: "Spanish (Native) · English (B2)",
      },
    },
    experience: {
      title: "Experience",
      subtitle: "Career timeline",
      achievements: "Key wins",
      current: "Current",
    },
    experiences: [
      {
        title: "Full Stack Developer",
        company: "ORAL-PLUS (SKY S.A.S)",
        location: "Medellín, Colombia",
        period: "2024 — Present",
        current: true,
        description:
          "Leading development of ORAL-PLUS web platform and mobile app: product catalog, online payments, admin dashboard and AI-powered modules to automate customer service.",
        achievements: [
          "Migrated legacy PHP stack to modern React + Node architecture, cutting load times by 60%",
          "Integrated AI agents (Gemini) automating 40% of support tickets",
          "Built payment gateway and automatic invoice reconciliation",
          "Technical mentorship to junior developers on the team",
        ],
        tech: ["React", "Next.js", "Node.js", "TypeScript", "MySQL", "Gemini AI", "PHP", "Android"],
      },
      {
        title: "Freelance Full Stack Developer",
        company: "Independent Projects",
        location: "Remote",
        period: "2023 — 2024",
        current: false,
        description:
          "Designed and delivered tailor-made solutions for SMBs: inventory SaaS, enterprise dashboards with PDF/Excel reporting and branded web platforms.",
        achievements: [
          "Shipped a multi-tenant inventory & sales SaaS to production",
          "Built enterprise dashboard with server-side PDF/Excel report generation",
          "Reduced manual operations time for clients by up to 70%",
          "Maintain NPS > 9 across all clients served",
        ],
        tech: ["React", "Next.js", "Node.js", "Recharts", "Tailwind CSS", "MySQL"],
      },
      {
        title: "Junior Software Developer",
        company: "Academic & Personal Projects",
        location: "Medellín, Colombia",
        period: "2022 — 2023",
        current: false,
        description:
          "High-rigor learning phase: built 10+ portfolio projects applying agile methodologies, pair programming and professional code review.",
        achievements: [
          "Progressive mastery of the modern JavaScript/TypeScript stack",
          "First generative AI chatbot (Gemini API + Node.js)",
          "Solid foundations in algorithms, data structures and design patterns",
        ],
        tech: ["JavaScript", "TypeScript", "React", "Python", "Git"],
      },
    ],
    skills: {
      title: "Tech Stack",
      subtitle: "Tools I build with daily",
      categories: {
        frontend: "Frontend",
        backend: "Backend",
        database: "Databases",
        ai: "AI & Automation",
        tools: "Tools & DevOps",
      },
    },
    services: {
      label: "What I offer",
      title: "Professional services",
      subtitle: "End-to-end solutions combining design, engineering and product thinking. I work with startups and established companies.",
      items: [
        {
          icon: "Code",
          title: "Full Stack Web Apps",
          desc: "SaaS, dashboards, e-commerce and landing pages built with Next.js, React and Node. Performance, accessibility and SEO baked in.",
          deliverables: ["Scalable architecture", "Modern UI/UX", "CI/CD setup", "Post-launch support"],
        },
        {
          icon: "Sparkles",
          title: "AI Integration",
          desc: "Smart agents, chatbots, semantic search and automation with LLMs (Gemini, OpenAI) embedded directly into your product.",
          deliverables: ["Use-case analysis", "Prompt engineering", "RAG / fine-tuning", "Impact metrics"],
        },
        {
          icon: "BarChart3",
          title: "Dashboards & Analytics",
          desc: "Executive panels with real-time visualizations, PDF/Excel export and custom business rules for your operation.",
          deliverables: ["Advanced reporting", "Real-time KPIs", "Roles & permissions", "PDF/Excel export"],
        },
        {
          icon: "Smartphone",
          title: "Mobile Solutions",
          desc: "Native and hybrid Android apps connected to your web backend. One source of truth across all your channels.",
          deliverables: ["Android app", "Robust REST API", "Offline sync", "Play Store release"],
        },
      ],
    },
    process: {
      label: "How I work",
      title: "My delivery process",
      subtitle: "A proven method that minimizes risk and maximizes value delivered.",
      steps: [
        {
          number: "01",
          title: "Discovery",
          desc: "Kickoff to understand your business, users and goals. I identify technical risks and opportunities before writing a single line.",
          duration: "1–3 days",
        },
        {
          number: "02",
          title: "Design & Architecture",
          desc: "Wireframes, data models and documented technical architecture. We validate before building, so no effort is wasted.",
          duration: "3–7 days",
        },
        {
          number: "03",
          title: "Iterative Build",
          desc: "Weekly sprints with visible deliverables. You test, give feedback, and we adjust on the fly. No surprises at the end.",
          duration: "2–8 weeks",
        },
        {
          number: "04",
          title: "QA & Launch",
          desc: "Automated tests, performance optimization and production deployment with monitoring. You get full docs and access.",
          duration: "3–5 days",
        },
        {
          number: "05",
          title: "Support & Evolution",
          desc: "Post-launch handholding, real usage metrics and a roadmap for product evolution. I'm there when you need me.",
          duration: "Ongoing",
        },
      ],
    },
    projects: {
      portfolio: "Portfolio",
      title: "Featured work",
      subtitle: "Real solutions, in production, delivering value to users and businesses every single day.",
      featured: "Featured",
      live: "Live",
      projectN: "Project",
      technicalDoc: "Technical documentation",
      viewProject: "View project",
      privateProject: "Private project",
      moreProjects: "More projects",
      docTech: "Tech doc",
      docLabels: {
        architecture: "Architecture",
        technicalDecisions: "Technical decisions",
        problemsSolved: "Problems solved",
      },
    },
    projectsData: [
      {
        title: "Tonsorium — Spa for Men",
        subtitle: "Premium barbershop with online booking",
        description:
          "Digital ecosystem for a premium barbershop in Itagüí: service catalog, booking system with real-time availability, admin panel, client accounts and WhatsApp integration. Built with an editorial dark aesthetic and classic gold to reinforce the 'The Art of the Gentleman' brand.",
        tech: ["React", "PHP", "SQL Server", "Tailwind CSS", "WhatsApp API"],
        link: "https://tonsorium.online/",
        featured: true,
        hero: true,
        accent: "#c9a253",
        image: "/projects/tonsorium.svg",
        imageAlt: "Tonsorium — premium barbershop",
        doc: {
          architecture: [
            "React SPA with views: home, services, gallery, testimonials, booking, login/register and account.",
            "PHP backend with REST endpoints for services, availability, reservations and sessions (JWT / HttpOnly cookies).",
            "SQL Server as source of truth for services, barbers, time slots, clients and bookings — with constraints preventing double-booking.",
            "Separate admin panel (/admin) with hardened authentication to manage schedule, services and clients.",
            "WhatsApp integration for booking confirmations and direct customer contact.",
          ],
          technicalDecisions: [
            "React decoupled from the PHP backend via a JSON API, so frontend and backend scale independently.",
            "SQL Server chosen for solid ACID transactions — critical to prevent double-booking the same slot.",
            "Mobile-first editorial design (gold on warm black) to reinforce the premium positioning.",
            "The /admin surface is isolated from the public bundle and has its own rate-limit to shrink the attack surface.",
            "Notifications go through WhatsApp instead of SMS — better adoption in Colombia and lower friction.",
          ],
          problemsSolved: [
            "Killed the back-and-forth on WhatsApp: clients see real availability and close a booking in seconds.",
            "Prevent double bookings of the same slot via optimistic locking in SQL Server + backend validation.",
            "Admin panel easy to operate for the barber team — no technical profile required.",
            "Flawless mobile experience — 80%+ of traffic comes from phones at appointment time.",
            "Consistent premium brand on every screen: serif typography, classic gold and restrained micro-interactions.",
          ],
        },
      },
      {
        title: "Alien Style 51",
        subtitle: "Custom apparel printing with 3D Studio",
        description:
          "Custom print-on-demand e-commerce based in Medellín: catalog of t-shirts, mugs, caps and keychains; interactive Studio to design live on the product (HTML5 Canvas); checkout flow, customer accounts and admin panel. 48h express production, nationwide shipping across Colombia.",
        tech: ["PHP", "JavaScript", "HTML5 Canvas", "MySQL", "Tailwind CSS"],
        link: "https://alyenstyle.online/",
        featured: true,
        image: "/projects/alienstyle.svg",
        imageAlt: "Alien Style 51 — custom apparel printing",
        doc: {
          architecture: [
            "PHP backend with REST endpoints for catalog, authentication, orders and administration.",
            "Client-side customization Studio: HTML5 Canvas + JS to position, scale and live-preview the design on the product.",
            "MySQL as source of truth for products, variants (colors, sizes), customers and orders.",
            "Separate admin panel to manage catalog, orders and production statuses.",
            "Checkout flow with domestic shipping data and email/WhatsApp confirmation.",
          ],
          technicalDecisions: [
            "Client-side Studio with canvas so the user sees the result before buying — cuts the return rate.",
            "PHP + MySQL for stability, cheap hosting and speed to iterate promos and seasonal collections.",
            "Product model with variants (fabric, color, size) to avoid duplicating SKUs and keep stock simple.",
            "Separate /auth and /catalogo endpoints with server-side validation to shrink the attack surface.",
            "48h production as the core brand promise — reinforced in copy and conversion.",
          ],
          problemsSolved: [
            "The customer no longer has to imagine the design: they see it rendered on the product before paying.",
            "Lower return/complaint rate thanks to live preview + final artwork confirmation.",
            "A single admin panel to handle sublimation, DTF and laser orders with clear production states.",
            "Scalable catalog: products with multiple variants and prices without duplicating records.",
            "Consistent 'Alien Style 51' brand on every screen — not a generic Shopify template.",
          ],
        },
      },
      {
        title: "Beat Generator AI",
        subtitle: "AI-powered music generation platform",
        description:
          "Conversational platform that generates personalized beats and musical patterns from user prompts, combining Gemini API with a real-time audio pipeline.",
        tech: ["Next.js", "Node.js", "Gemini API", "Python", "AI/ML"],
        link: "https://opiumm-gray.vercel.app/",
        featured: true,
        visual: "shader",
        doc: {
          architecture: [
            "React/Next frontend with chat interface and generation controls.",
            "Node.js backend to orchestrate AI API calls.",
            "Integration with Gemini API for natural language processing and content generation.",
            "Audio pipeline: beat generation via AI models/services and client playback.",
          ],
          technicalDecisions: [
            "Use of Gemini API for conversational responses and musical generation context.",
            "Separation between chat layer (NLU) and audio generation layer to scale independently.",
            "Node.js as bridge between frontend and external APIs to hide keys and handle rate limits.",
          ],
          problemsSolved: [
            "Unify chat and beat generation in a single experience without switching applications.",
            "Handling audio generation latency with visual feedback and loading states.",
            "User preference persistence (style, BPM) between sessions.",
          ],
        },
      },
      {
        title: "Finanzas Pro",
        subtitle: "Smart personal finance manager",
        description:
          "Personal finance app with visual dashboards, automated budgets, limit alerts and spending trend analysis. Designed for daily use.",
        tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        link: "https://finanzaspro-nine.vercel.app/",
        featured: true,
        doc: {
          architecture: [
            "Next.js App Router with React for a high-performance SPA.",
            "Dashboard components with charts and financial movement tables.",
            "Data persistence in localStorage or database for expense and income history.",
            "UI built with Tailwind CSS for responsive and modern design.",
          ],
          technicalDecisions: [
            "Next.js for optimized rendering and routing without additional configuration.",
            "React for reusable components (summary cards, charts, transaction forms).",
            "TypeScript for strict typing and greater robustness in financial data handling.",
            "Tailwind CSS for consistent styles and agile UI development.",
          ],
          problemsSolved: [
            "Clear visualization of expenses and income by categories and time periods.",
            "Budget control with alerts when the set limit is exceeded.",
            "Transaction history with filters and search for easy money tracking.",
          ],
        },
      },
      {
        title: "Inventory SaaS",
        subtitle: "Inventory & sales system for SMBs",
        description:
          "Multi-tenant platform for inventory, sales and reports management. Real-time stock control with validations to prevent overselling.",
        tech: ["React", "Node.js", "REST API", "MySQL", "JavaScript"],
        link: "https://saas-beta-peach.vercel.app/",
        featured: true,
        doc: {
          architecture: [
            "React SPA with views: inventory, sales, reports and configuration.",
            "Node.js REST API for product, movement and sales CRUD.",
            "Database (SQL or NoSQL depending on deployment) for products, stock and transactions.",
          ],
          technicalDecisions: [
            "React for component reuse (tables, forms, modals) across all sections.",
            "Stateless REST API to allow future mobile app or integrations.",
            "Backend and frontend validation to prevent inconsistent stock data.",
          ],
          problemsSolved: [
            "Real-time stock synchronization when recording sales or entries/exits.",
            "Prevent sales above available stock with validations and clear messages.",
            "Exportable or dashboard-viewable sales and inventory reports.",
          ],
        },
      },
      {
        title: "Enterprise Dashboard",
        subtitle: "HR analytics with PDF/Excel exports",
        description:
          "Executive dashboard with employee KPIs, server-side Excel/PDF generation and granular role-based permissions. Audit-ready.",
        tech: ["React", "Node.js", "Recharts", "xlsx", "pdf-lib"],
        link: "https://empresarial-omega.vercel.app/",
        featured: true,
        visual: "orb",
        doc: {
          architecture: [
            "React frontend with dashboards, tables and charts (e.g. Recharts).",
            "Node.js backend with endpoints for employees, reports and file generation.",
            "Excel and PDF generation on server (libraries like xlsx, pdf-lib or puppeteer) and client download.",
          ],
          technicalDecisions: [
            "Excel/PDF generation on backend to avoid overloading browser and ensure uniform format.",
            "Client-side charts with aggregated data from API for better response time.",
            "Authentication and roles to restrict access to sensitive reports.",
          ],
          problemsSolved: [
            "Heavy reports (many employees/data) without blocking UI via jobs or streaming.",
            "Consistent Excel and PDF format for audits and presentations.",
            "Employee data analysis (KPIs, trends) with clear visualizations.",
          ],
        },
      },
      {
        title: "ORAL-PLUS Ecosystem",
        subtitle: "Web + Android app + payment gateway",
        description:
          "Complete oral care commerce ecosystem: web portal, Android app, payment gateway and automatic invoice reconciliation. Live nationwide.",
        tech: ["JavaScript", "PHP", "MySQL", "Android", "HTML/CSS"],
        link: "https://oral-plus.com/index.html",
        featured: true,
        doc: {
          architecture: [
            "Website with PHP on server, HTML/CSS/JS on frontend.",
            "Native or hybrid Android app for catalog and payments.",
            "Shared SQL database for products, users and invoices.",
          ],
          technicalDecisions: [
            "PHP for web backend and business logic on server.",
            "Mobile app to reach customers who prefer to buy from their phone.",
            "Single data model for invoices on web and app for consistency.",
          ],
          problemsSolved: [
            "Bill payment and product purchase from web and app with same user.",
            "Inventory and price synchronization between web and mobile channel.",
            "Secure and clear shopping experience for oral products.",
          ],
        },
      },
      {
        title: "Barbería Orion",
        subtitle: "Barbershop booking system",
        description:
          "Appointment management platform with mobile-first experience and micro-interactions that reinforce the premium brand.",
        tech: ["React", "Tailwind CSS", "Framer Motion"],
        link: "#",
        featured: false,
        doc: {
          architecture: [
            "React application with service, availability and booking views.",
            "Tailwind styles and Framer Motion animations for fluid UX.",
          ],
          technicalDecisions: [
            "Framer Motion for transitions and micro-interactions that reinforce the brand.",
            "Mobile-first responsive design for point-of-sale or customer use.",
          ],
          problemsSolved: [
            "Clear display of schedules and services to reduce no-shows.",
            "Fast and accessible booking experience from any device.",
          ],
        },
      },
      {
        title: "Digital CV",
        subtitle: "Interactive portfolio (this site)",
        description:
          "Bilingual portfolio with built-in AI assistant, dark mode, cinematic animations and per-project technical docs. 95+ Lighthouse score.",
        tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion"],
        link: "https://cv-steven.vercel.app/",
        featured: true,
        visual: "particles",
        doc: {
          architecture: [
            "Next.js App Router with main page (page.tsx) and reusable components.",
            "UI with Radix UI + Tailwind CSS; light/dark theme persisted in localStorage.",
            "Sections: Hero, About Me, Experience, Skills, Projects (with technical documentation), Contact.",
          ],
          technicalDecisions: [
            "Single Page with scroll and anchor navigation to avoid reloads and better UX.",
            "Intersection Observer for scroll animations (experience, projects) without heavy libraries.",
            "Per-project technical documentation in modal (Dialog) to avoid cluttering the view.",
          ],
          problemsSolved: [
            "Display many projects without clutter: featured + secondary grid and tech doc on demand.",
            "Mobile performance: CSS/RAF animations and lazy images with Next/Image.",
            "Accessibility: light/dark theme, mobile menu and buttons with labels.",
          ],
        },
      },
      {
        title: "Enterprise Private Projects",
        subtitle: "Custom systems under NDA",
        description:
          "Enterprise systems with real-time visualization, internal integrations and large-scale data processing. Covered by confidentiality agreements.",
        tech: ["Python", "JavaScript", "MySQL", "WebSockets"],
        link: undefined,
        featured: false,
        doc: {
          architecture: [
            "Python backend (Flask/Django or similar) for logic and APIs.",
            "JavaScript frontend for dashboards and real-time visualization.",
            "MySQL as transactional storage and for reports.",
          ],
          technicalDecisions: [
            "Python for integrations, scripts and enterprise data processing.",
            "Real-time visualization via WebSockets or polling depending on requirements.",
          ],
          problemsSolved: [
            "Real-time data for monitoring and decision making.",
            "Custom systems that integrate with client internal processes.",
          ],
        },
      },
    ],
    contact: {
      title: "Let's talk",
      subtitle: "Got a project in mind? I reply within 24 hours. First call is on me.",
      email: "Email",
      phone: "Phone",
      location: "Location",
      startConversation: "Start a conversation",
      scheduleCall: "Schedule a call",
      sendEmail: "Send email",
      whatsapp: "WhatsApp",
      available: "Available",
      responseTime: "I reply in < 24h",
    },
    footer: {
      copyright: "© 2025 Steven Villamizar Mendoza",
      built: "Designed and built by Steven Villamizar · Crafted with Next.js + AI",
      tagline: "Building the future, one commit at a time.",
    },
    langModal: {
      title: "Choose your resume language",
      titleEn: "Elige el idioma de tu hoja de vida",
      subtitle: "Select which language you want to view all content in",
      subtitleEn: "Selecciona en qué idioma deseas ver todo el contenido",
      spanish: "Español",
      english: "English",
    },
  },
} as const

export const LANG_KEY = "cv-lang"
