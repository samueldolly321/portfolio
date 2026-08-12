import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'hariniainasamuelandrianirina@gmail.com';
  const rawPassword = process.env.ADMIN_PASSWORD || 'admin_password_123!';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Samuel Andrianirina',
        role: 'ADMIN',
      },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  }

  // 2. Profile
  // Photo & CV are committed as static assets in /public so they survive
  // redeploys on ephemeral (free-tier) hosting. They can still be overridden
  // by uploading new files through the admin panel.
  const avatarUrl = "/samuel-andrianirina.png";

  const profileCount = await prisma.profile.count();
  if (profileCount === 0) {
    await prisma.profile.create({
      data: {
        firstName: 'Samuel',
        lastName: 'Andrianirina',
        title: 'Développeur Web',
        email: 'hariniainasamuelandrianirina@gmail.com',
        phone: '+261 34 21 890 51',
        location: 'Antananarivo, Madagascar',
        bio: "Développeur web avec plus de 6 ans d'expérience, je pars d'une idée, d'un besoin ou d'un problème pour le transformer en une solution web fonctionnelle.\n\nJ'aime comprendre le métier derrière un projet autant que la technologie qui le fait vivre.",
        avatarUrl,
        githubUrl: 'https://github.com/samueldolly321/',
        linkedinUrl: 'https://www.linkedin.com/in/hariniaina-samuel-andrianirina-8922b92b8/',
        websiteUrl: 'https://samuel.dev',
      },
    });
    console.log('✅ Profile seeded');
  }

  // 3. Hero
  const heroCount = await prisma.hero.count();
  if (heroCount === 0) {
    await prisma.hero.create({
      data: {
        badge: 'DÉVELOPPEUR WEB FULL-STACK',
        title: 'JE TRANSFORME LES IDÉES EN SOLUTIONS WEB.',
        subtitle: "Développeur web avec plus de 8 ans d'expérience",
        description: "Développeur web avec plus de 8 ans d'expérience, je pars d'une idée, d'un besoin ou d'un problème pour le transformer en une solution web fonctionnelle.",
        primaryCtaText: 'VOIR MES PROJETS',
        primaryCtaUrl: '#projects',
        secondaryCtaText: 'ME CONTACTER',
        secondaryCtaUrl: '#contact',
        technologies: JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Php']),
        imageUrl: avatarUrl,
      },
    });
    console.log('✅ Hero section seeded');
  }

  // 4. About
  const aboutCount = await prisma.about.count();
  if (aboutCount === 0) {
    await prisma.about.create({
      data: {
        title: 'À propos',
        tagline: 'Comprendre le métier, bâtir la technique',
        description: "Fort de plus de 6 ans d'expérience dans le développement web, je suis passionné par la création de solutions digitales performantes et intuitives. Mon parcours m'a permis de développer une expertise solide couvrant l'ensemble du cycle de vie d'un projet web, de la conception initiale au déploiement.\n\nSpécialisé dans les technologies front-end et back-end modernes, j'accorde une importance particulière à la qualité du code, aux performances et à l'expérience utilisateur. Mon approche combine rigueur technique et créativité pour répondre aux besoins spécifiques de chaque projet.",
        imageUrl: avatarUrl,
        cvUrl: '/cv-andrianirina-hariniaina-samuel.pdf',
      },
    });
    console.log('✅ About section seeded');
  }

  // 5. Statistics
  const statCount = await prisma.statistic.count();
  if (statCount === 0) {
    await prisma.statistic.createMany({
      data: [
        { label: "Années d'expérience", value: "6+", subtext: "Projets livrés sur-mesure", sortOrder: 1 },
        { label: "Full-Stack", value: "360°", subtext: "Frontend → Backend → Database", sortOrder: 2 },
        { label: "Applications métier", value: "15+", subtext: "ERP · RH · Restauration · Agences", sortOrder: 3 },
      ],
    });
    console.log('✅ Statistics seeded');
  }

  // 6. Skills
  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    const skillsList = [
      // FRONT-END
      { name: 'React', category: 'FRONT-END', icon: 'Code', level: 95, sortOrder: 1 },
      { name: 'TypeScript', category: 'FRONT-END', icon: 'FileCode', level: 90, sortOrder: 2 },
      { name: 'JavaScript', category: 'FRONT-END', icon: 'Js', level: 95, sortOrder: 3 },
      { name: 'Tailwind CSS', category: 'FRONT-END', icon: 'Palette', level: 95, sortOrder: 4 },
      { name: 'Vite', category: 'FRONT-END', icon: 'Zap', level: 90, sortOrder: 5 },

      // BACK-END
      { name: 'Node.js', category: 'BACK-END', icon: 'Server', level: 90, sortOrder: 6 },
      { name: 'Express', category: 'BACK-END', icon: 'Cpu', level: 90, sortOrder: 7 },
      { name: 'PHP', category: 'BACK-END', icon: 'Code2', level: 85, sortOrder: 8 },
      { name: 'Symfony', category: 'BACK-END', icon: 'Layers', level: 80, sortOrder: 9 },

      // DATABASE & ORM
      { name: 'PostgreSQL', category: 'DATABASE & ORM', icon: 'Database', level: 88, sortOrder: 10 },
      { name: 'MySQL', category: 'DATABASE & ORM', icon: 'Database', level: 85, sortOrder: 11 },
      { name: 'SQL', category: 'DATABASE & ORM', icon: 'Table', level: 90, sortOrder: 12 },
      { name: 'Prisma', category: 'DATABASE & ORM', icon: 'Workflow', level: 88, sortOrder: 13 },
      { name: 'Drizzle ORM', category: 'DATABASE & ORM', icon: 'Activity', level: 82, sortOrder: 14 },

      // CMS & WEB
      { name: 'WordPress', category: 'CMS & WEB', icon: 'Globe', level: 92, sortOrder: 15 },
      { name: 'ACF', category: 'CMS & WEB', icon: 'Layout', level: 90, sortOrder: 16 },
      { name: 'SEO', category: 'CMS & WEB', icon: 'Search', level: 85, sortOrder: 17 },

      // API & SECURITY
      { name: 'REST API', category: 'API & SECURITY', icon: 'Network', level: 92, sortOrder: 18 },
      { name: 'JWT', category: 'API & SECURITY', icon: 'Key', level: 90, sortOrder: 19 },
      { name: 'RBAC', category: 'API & SECURITY', icon: 'Shield', level: 88, sortOrder: 20 },

      // DESKTOP
      { name: 'Electron', category: 'DESKTOP', icon: 'Monitor', level: 80, sortOrder: 21 },

      // TOOLS
      { name: 'Git', category: 'TOOLS', icon: 'GitBranch', level: 90, sortOrder: 22 },
      { name: 'GitHub', category: 'TOOLS', icon: 'Github', level: 90, sortOrder: 23 },

      // AI & AUTOMATION
      { name: 'Generative AI', category: 'AI & AUTOMATION', icon: 'Sparkles', level: 85, sortOrder: 24 },
      { name: 'Prompt Engineering', category: 'AI & AUTOMATION', icon: 'Terminal', level: 88, sortOrder: 25 },
      { name: 'Claude', category: 'AI & AUTOMATION', icon: 'Bot', level: 88, sortOrder: 26 },
      { name: 'ChatGPT', category: 'AI & AUTOMATION', icon: 'MessageSquare', level: 88, sortOrder: 27 },
    ];

    for (const skill of skillsList) {
      await prisma.skill.create({ data: skill });
    }
    console.log('✅ Skills seeded');
  }

  // 7. Experiences
  const expCount = await prisma.experience.count();
  if (expCount === 0) {
    await prisma.experience.create({
      data: {
        company: 'Salathys',
        position: 'Développeur Web',
        startDate: '2016',
        endDate: 'Aujourd\'hui',
        current: true,
        description: "Développement et livraison de sites et d'applications web pour des clients à l'étranger (Europe / France), en partenariat avec Cliken-web.",
        responsibilities: JSON.stringify([
          "Développement full-stack de solutions web sur mesure",
          "Mise en place d'architectures scalables et sécurisées",
          "Collaboration directe avec les clients et équipes projet en France",
        ]),
        technologies: JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'PHP', 'WordPress']),
        location: 'Europe / France (à distance)',
        sortOrder: 1,
      },
    });

    await prisma.experience.create({
      data: {
        company: 'Softibox',
        position: 'Intégrateur Web',
        startDate: '2015',
        endDate: '2016',
        current: false,
        description: "Création d'interfaces utilisateurs interactives et responsives. Optimisation des performances front-end.",
        responsibilities: JSON.stringify([
          "Intégration responsive HTML/CSS/JS",
          "Optimisation UX/UI pour terminaux mobiles",
        ]),
        technologies: JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'jQuery']),
        location: 'Antananarivo',
        sortOrder: 2,
      },
    });

    await prisma.experience.create({
      data: {
        company: 'Prestatics',
        position: 'Stagiaire Développeur Web',
        startDate: '2015',
        endDate: '2015',
        current: false,
        description: "Intégration de maquettes PSD en HTML/CSS. Maintenance de sites existants et corrections de bugs.",
        responsibilities: JSON.stringify([
          "Intégration de maquettes web",
          "Débogage cross-browser",
        ]),
        technologies: JSON.stringify(['HTML', 'CSS', 'PHP']),
        location: 'Antananarivo',
        sortOrder: 3,
      },
    });
    console.log('✅ Experiences seeded');
  }

  // 8. Education
  const eduCount = await prisma.education.count();
  if (eduCount === 0) {
    await prisma.education.createMany({
      data: [
        {
          year: '2019',
          title: 'Formation Executive Management',
          institution: 'Executive Institute',
          description: 'Acquisition de compétences en gestion de projet et leadership.',
          sortOrder: 1,
        },
        {
          year: '2015',
          title: 'Licence en Webdesign',
          institution: 'Université',
          description: "Spécialisation en UI/UX et conception d'interfaces modernes.",
          sortOrder: 2,
        },
        {
          year: '2012 — 2015',
          startYear: '2012',
          endYear: '2015',
          title: 'Licence en Informatique',
          institution: 'IT University',
          description: 'Développement web, programmation, algorithmes et génie logiciel.',
          sortOrder: 3,
        },
        {
          year: '2010 — 2012',
          startYear: '2010',
          endYear: '2012',
          title: 'Informatique de Gestion & Génie Logiciel',
          institution: 'ISPM',
          description: 'Bases fondamentales en algorithmique et génie logiciel.',
          sortOrder: 4,
        },
        {
          year: '2009',
          title: 'Baccalauréat série C',
          institution: 'Lycée Saint François Xavier',
          description: 'Baccalauréat Scientifique.',
          sortOrder: 5,
        },
      ],
    });
    console.log('✅ Education seeded');
  }

  // 9. Projects
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.create({
      data: {
        title: 'Vokatra-ko',
        slug: 'vokatra-ko',
        category: 'Application Métier / ERP',
        shortDescription: 'ERP complet de gestion de stock, ventes, achats et comptabilité',
        description: "ERP complet de gestion de stock, ventes, achats et comptabilité (contexte\nMadagascar) : multi-entrepôts, caisse avec scan de code-barres, facturation\nnumérotée & TVA, authentification JWT et contrôle d'accès par rôles, temps réel\n(SSE). Décliné en version cloud (Render) et en version bureau hors-ligne\n(Electron). Dépôt GitHub.",
        featuredImage: '/project-vokatra-ko.jpg',
        gallery: JSON.stringify([]),
        technologies: JSON.stringify(['React', 'NodeJS', 'PostgreSql', 'Prisma']),
        projectUrl: 'https://vokatra-ko.onrender.com/',
        githubUrl: '',
        year: '2024',
        featured: false,
        sortOrder: 1,
      },
    });

    await prisma.project.create({
      data: {
        title: 'Portail MNDPT',
        slug: 'portail-mndpt',
        category: 'Site institutionnel',
        shortDescription: 'Thème et extension WordPress sur mesure sans page builder avec filtrage AJAX.',
        description: 'Thème et extension WordPress développés sur mesure, sans page builder : filtrage AJAX, SEO avancé, données structurées schema.org, formulaire de contact sécurisé et e-mail transactionnel.',
        featuredImage: '/project-portail-mndpt.jpg',
        gallery: JSON.stringify([]),
        technologies: JSON.stringify(['WordPress', 'PHP', 'ACF', 'Tailwind CSS']),
        projectUrl: 'https://mndpt.gov.mg',
        githubUrl: '',
        year: '2025',
        featured: true,
        sortOrder: 2,
      },
    });

    await prisma.project.create({
      data: {
        title: 'Nexus Talent System',
        slug: 'nexus-talent-system',
        category: 'RH / Recruitment',
        shortDescription: 'Système de gestion des talents et du processus de recrutement.',
        description: 'Système de gestion des talents et du processus de recrutement permettant de suivre les candidats et les différentes étapes du recrutement.',
        featuredImage: '/project-nexus-talent.jpg',
        gallery: JSON.stringify([]),
        technologies: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Express']),
        projectUrl: 'https://nexus-talent-zk0a.onrender.com/',
        githubUrl: 'https://github.com/samueldolly321/nexus-talent',
        year: '2023',
        featured: true,
        sortOrder: 3,
      },
    });

    await prisma.project.create({
      data: {
        title: 'Gestion de restaurant',
        slug: 'gestion-de-restaurant',
        category: 'Application métier',
        shortDescription: 'Application métier de gestion de restaurant, stocks et réservations.',
        description: 'Application métier pour la gestion d\'un restaurant. Tableaux de bord, gestion des stocks, des réservations et des équipes de manière fluide et intuitive.',
        featuredImage: '/project-gestion-restaurant.jpg',
        gallery: JSON.stringify([]),
        technologies: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS']),
        projectUrl: 'https://restopilote.onrender.com/',
        githubUrl: '',
        year: '2026',
        featured: false,
        sortOrder: 4,
      },
    });

    await prisma.project.create({
      data: {
        title: 'Gestion d\'agence',
        slug: 'gestion-dagence',
        category: 'Application métier',
        shortDescription: 'Gestion centralisée des projets, clients et finances d\'une agence web.',
        description: 'Application métier centralisant la gestion des projets, des clients et des finances d\'une agence, avec un suivi analytique précis de la rentabilité.',
        featuredImage: null,
        gallery: JSON.stringify([]),
        technologies: JSON.stringify(['React', 'TypeScript', 'Node.js']),
        projectUrl: '',
        githubUrl: '',
        year: '2022',
        featured: false,
        sortOrder: 5,
      },
    });

    await prisma.project.create({
      data: {
        title: "Gestion d'école",
        slug: 'gestion-decole',
        category: 'Application métier',
        shortDescription: "Application de gestion scolaire : élèves, classes, notes, scolarité et communication.",
        description: "Application métier de gestion d'école couvrant les inscriptions, la gestion des classes et des élèves, le suivi des notes et bulletins, la scolarité (paiements) et la communication avec les familles.",
        featuredImage: null,
        gallery: JSON.stringify([]),
        technologies: JSON.stringify(['React', 'Node.js', 'PostgreSQL']),
        projectUrl: '',
        githubUrl: '',
        year: '2024',
        featured: false,
        sortOrder: 6,
      },
    });

    console.log('✅ Projects seeded');
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
