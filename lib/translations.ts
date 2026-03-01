/**
 * Traducciones ES/EN para la hoja de vida
 */
export type Lang = "es" | "en"

export const translations = {
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre Mí",
      experience: "Experiencia",
      skills: "Habilidades",
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
      tagline: "Innovación & Tecnología",
      intro: "Desarrollador apasionado por crear soluciones tecnológicas innovadoras.",
      hireNow: "Contratar Ahora",
      downloadCV: "Descargar CV",
      catCard: "¡Hola! Mi compañero de código",
      scroll: "Scroll",
    },
    stats: {
      years: "Años de Experiencia",
      projects: "Proyectos Completados",
      tech: "Tecnologías Dominadas",
    },
    about: {
      title: "Sobre Mí",
      professionalProfile: "Perfil Profesional",
      bio1: "Soy",
      bio1b: ", tecnólogo en Análisis y Desarrollo de Software con más de",
      bio1c: "1 año de experiencia",
      bio1d: "creando soluciones tecnológicas innovadoras.",
      bio2: "Soy tecnólogo en análisis y desarrollo de software",
      bio2b: "Trabajando actualmente en la empresa ORAL-PLUS(SKY S.A.S)",
      bio2c: "y trabajo como desarrollador profesional.",
      bio3: "Mi enfoque: código limpio, escalable y soluciones que generen valor real para las empresas, la innovación y la creatividad de siempre querer hacer las cosas nuevas y diferentes.",
      missionTitle: "Mi Misión",
      missionText: "Transformar ideas complejas en soluciones tecnológicas elegantes que impulsen el crecimiento empresarial.",
      whyWork: "Por qué trabajar conmigo",
      whyItems: [
        "Experiencia probada en proyectos reales",
        "Compromiso con la calidad y excelencia",
        "Aprendizaje continuo y adaptabilidad",
        "Enfoque en resultados y valor empresarial",
      ],
      info: {
        location: "Medellín, Colombia",
        degree: "Tecnólogo ADSO",
      },
    },
    experience: {
      title: "Experiencia",
      achievements: "Logros",
    },
    experiences: [
      {
        title: "Desarrollador Full Stack Senior",
        company: "Empresa Actual",
        period: "2025 - Presente",
        description: "Liderazgo técnico en desarrollo de aplicaciones web escalables, arquitectura de sistemas y mentoría de equipos.",
        achievements: ["Arquitectura de sistemas", "Mentoría técnica", "Optimización de rendimiento"],
        tech: ["React", "Node.js", "TypeScript", "AI Integration"],
      },
      {
        title: "Desarrollador de Software",
        company: "Empresa Actual",
        period: "2025 - Presente",
        description: "Desarrollo y mantenimiento de aplicaciones web con integración de Inteligencia Artificial.",
        achievements: ["Integración de IA", "Optimización de procesos", "Nuevas funcionalidades"],
        tech: ["JavaScript", "Python", "AI/ML", "Web Development"],
      },
      {
        title: "Desarrollador Frontend",
        company: "",
        period: "2020 - 2025",
        description: "Desarrollo de interfaces modernas y responsivas con enfoque en UX/UI.",
        achievements: ["Interfaces responsivas", "Optimización UX", "Mejora de rendimiento"],
        tech: ["React", "Tailwind CSS", "TypeScript"],
      },
      {
        title: "Desarrollador Junior",
        company: "",
        period: "2019 - 2025",
        description: "Desarrollo de funcionalidades web y colaboración en proyectos ágiles.",
        achievements: ["Aprendizaje continuo", "Colaboración en equipo", "Desarrollo ágil"],
        tech: ["JavaScript", "HTML", "CSS", "Git"],
      },
    ],
    skills: {
      title: "Habilidades",
    },
    projects: {
      portfolio: "Portafolio",
      title: "Proyectos destacados",
      subtitle: "Soluciones reales desarrolladas con las mejores prácticas y tecnologías actuales.",
      featured: "Destacado",
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
        title: "CHAT BOT CON IA-GENERADOR DE BEATS",
        description: "Plataforma innovadora con inteligencia artificial para generación de música y beats personalizados",
        tech: ["Python", "Node.js", "App.js", "Api-gemini", "AI/ML"],
        link: "https://opiumm-gray.vercel.app/",
        featured: true,
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
        title: "FINANZAS PRO - Control Financiero Personal",
        description: "Aplicación web de control financiero personal para gestionar gastos, ingresos y presupuestos. Desarrollada con React y Next.js.",
        tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
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
        title: "SaaS sistemas de inventario y ventas",
        description: "Aplicación web para gestión de inventario, control de stock y ventas. Desarrollada con React, Node.js y HTML.",
        tech: ["HTML", "React", "Node.js", "CSS", "JavaScript"],
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
        title: "Dashboard profesional tipo empresarial",
        description: "Sistema empresarial con análisis de empleados, reportes, generación de Excel y PDF. Desarrollado con React, Node.js y HTML.",
        tech: ["HTML", "React", "Node.js", "CSS", "JavaScript", "Excel", "PDF"],
        link: "https://empresarial-omega.vercel.app/",
        featured: true,
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
        title: "BARBERIA-ORION",
        description: "Plataforma web moderna para gestión de citas y servicios de barbería",
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
        title: "ORAL-PLUS Y APP ORAL-PLUS",
        description: "Solución completa web y móvil para la venta de productos bucales y pago de facturas",
        tech: ["JavaScript", "HTML", "Php", "Css", "SQL", "Android"],
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
        title: "HOJA DE VIDA DIGITAL",
        description: "Página web donde se muestran mis habilidades y proyectos",
        tech: ["React", "Tailwind CSS", "Framer Motion"],
        link: "https://cv-steven.vercel.app/",
        featured: true,
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
        title: "PROYECTOS EMPRESARIALES PRIVADOS",
        description: "Sistemas empresariales personalizados con visualización de datos en tiempo real",
        tech: ["Python", "JavaScript", "MySQL"],
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
      title: "Contacto",
      subtitle: "¿Listo para llevar tu proyecto al siguiente nivel? Hablemos.",
      email: "Email",
      phone: "Teléfono",
      startConversation: "Iniciar Conversación",
    },
    footer: {
      copyright: "© 2025 Steven Villamizar Mendoza",
      built: "Desarrollado con Next.js y React · Autor: STEVEN VILLAMIZAR MENDOZA",
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
      about: "About Me",
      experience: "Experience",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
    },
    aria: {
      lightMode: "Enable light mode",
      darkMode: "Enable dark mode",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      tagline: "Innovation & Technology",
      intro: "Developer passionate about creating innovative technological solutions.",
      hireNow: "Hire Me",
      downloadCV: "Download CV",
      catCard: "Hi! My coding buddy",
      scroll: "Scroll",
    },
    stats: {
      years: "Years of Experience",
      projects: "Projects Completed",
      tech: "Technologies Mastered",
    },
    about: {
      title: "About Me",
      professionalProfile: "Professional Profile",
      bio1: "I am",
      bio1b: ", a technologist in Software Analysis and Development with more than",
      bio1c: "1 year of experience",
      bio1d: "creating innovative technological solutions.",
      bio2: "I am a technologist in software analysis and development",
      bio2b: "Currently working at ORAL-PLUS (SKY S.A.S)",
      bio2c: "as a professional developer.",
      bio3: "My focus: clean, scalable code and solutions that generate real value for companies, innovation and creativity to always want to do things in new and different ways.",
      missionTitle: "My Mission",
      missionText: "Transform complex ideas into elegant technological solutions that drive business growth.",
      whyWork: "Why work with me",
      whyItems: [
        "Proven experience in real projects",
        "Commitment to quality and excellence",
        "Continuous learning and adaptability",
        "Focus on results and business value",
      ],
      info: {
        location: "Medellín, Colombia",
        degree: "Technologist ADSO",
      },
    },
    experience: {
      title: "Experience",
      achievements: "Achievements",
    },
    experiences: [
      {
        title: "Senior Full Stack Developer",
        company: "Current Company",
        period: "2025 - Present",
        description: "Technical leadership in developing scalable web applications, system architecture and team mentorship.",
        achievements: ["System architecture", "Technical mentorship", "Performance optimization"],
        tech: ["React", "Node.js", "TypeScript", "AI Integration"],
      },
      {
        title: "Software Developer",
        company: "Current Company",
        period: "2025 - Present",
        description: "Development and maintenance of web applications with Artificial Intelligence integration.",
        achievements: ["AI integration", "Process optimization", "New features"],
        tech: ["JavaScript", "Python", "AI/ML", "Web Development"],
      },
      {
        title: "Frontend Developer",
        company: "",
        period: "2020 - 2025",
        description: "Development of modern and responsive interfaces with focus on UX/UI.",
        achievements: ["Responsive interfaces", "UX optimization", "Performance improvement"],
        tech: ["React", "Tailwind CSS", "TypeScript"],
      },
      {
        title: "Junior Developer",
        company: "",
        period: "2019 - 2025",
        description: "Web feature development and collaboration in agile projects.",
        achievements: ["Continuous learning", "Team collaboration", "Agile development"],
        tech: ["JavaScript", "HTML", "CSS", "Git"],
      },
    ],
    skills: {
      title: "Skills",
    },
    projects: {
      portfolio: "Portfolio",
      title: "Featured projects",
      subtitle: "Real solutions developed with best practices and current technologies.",
      featured: "Featured",
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
        title: "AI CHAT BOT - BEAT GENERATOR",
        description: "Innovative platform with artificial intelligence for personalized music and beat generation",
        tech: ["Python", "Node.js", "App.js", "Api-gemini", "AI/ML"],
        link: "https://opiumm-gray.vercel.app/",
        featured: true,
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
        title: "FINANZAS PRO - Personal Finance Control",
        description: "Personal financial control web app to manage expenses, income and budgets. Built with React and Next.js.",
        tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
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
        title: "SaaS inventory and sales system",
        description: "Web application for inventory management, stock control and sales. Developed with React, Node.js and HTML.",
        tech: ["HTML", "React", "Node.js", "CSS", "JavaScript"],
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
        title: "Professional enterprise dashboard",
        description: "Enterprise system with employee analysis, reports, Excel and PDF generation. Developed with React, Node.js and HTML.",
        tech: ["HTML", "React", "Node.js", "CSS", "JavaScript", "Excel", "PDF"],
        link: "https://empresarial-omega.vercel.app/",
        featured: true,
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
        title: "BARBERIA-ORION",
        description: "Modern web platform for barbershop appointment and service management",
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
        title: "ORAL-PLUS AND ORAL-PLUS APP",
        description: "Complete web and mobile solution for oral product sales and bill payment",
        tech: ["JavaScript", "HTML", "Php", "Css", "SQL", "Android"],
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
        title: "DIGITAL RESUME",
        description: "Web page showcasing my skills and projects",
        tech: ["React", "Tailwind CSS", "Framer Motion"],
        link: "https://cv-steven.vercel.app/",
        featured: true,
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
        title: "PRIVATE ENTERPRISE PROJECTS",
        description: "Customized enterprise systems with real-time data visualization",
        tech: ["Python", "JavaScript", "MySQL"],
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
      title: "Contact",
      subtitle: "Ready to take your project to the next level? Let's talk.",
      email: "Email",
      phone: "Phone",
      startConversation: "Start Conversation",
    },
    footer: {
      copyright: "© 2025 Steven Villamizar Mendoza",
      built: "Built with Next.js and React · Author: STEVEN VILLAMIZAR MENDOZA",
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
