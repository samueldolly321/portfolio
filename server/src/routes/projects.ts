import { Router, Request, Response } from 'express';
import prisma from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

function formatProject(p: any) {
  let gallery = [];
  let technologies = [];
  try {
    gallery = typeof p.gallery === 'string' ? JSON.parse(p.gallery) : p.gallery || [];
  } catch {
    gallery = [];
  }
  try {
    technologies = typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies || [];
  } catch {
    technologies = [];
  }

  return {
    ...p,
    gallery,
    technologies,
  };
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
}

// GET /api/projects
router.get('/', async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return res.json(projects.map(formatProject));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des projets.' });
  }
});

// GET /api/projects/:idOrSlug — resolves by slug (public modal) or id (admin edit)
router.get('/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;
    const project = await prisma.project.findFirst({
      where: { OR: [{ slug: idOrSlug }, { id: idOrSlug }] },
    });
    if (!project) {
      return res.status(404).json({ error: 'Projet introuvable.' });
    }
    return res.json(formatProject(project));
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération du projet.' });
  }
});

// POST /api/projects
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug: customSlug,
      category,
      shortDescription,
      description,
      featuredImage,
      gallery,
      technologies,
      projectUrl,
      githubUrl,
      year,
      featured,
      sortOrder,
      isVisible,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Le titre est requis.' });
    }

    let finalSlug = customSlug ? slugify(customSlug) : slugify(title);
    const existingSlug = await prisma.project.findUnique({ where: { slug: finalSlug } });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    const galleryStr = typeof gallery === 'string' ? gallery : JSON.stringify(gallery || []);
    const techStr = typeof technologies === 'string' ? technologies : JSON.stringify(technologies || []);

    const maxSort = await prisma.project.aggregate({ _max: { sortOrder: true } });
    const nextOrder = sortOrder ?? ((maxSort._max.sortOrder || 0) + 1);

    const project = await prisma.project.create({
      data: {
        title,
        slug: finalSlug,
        category: category || 'Application métier',
        shortDescription: shortDescription || '',
        description: description || '',
        featuredImage: featuredImage || null,
        gallery: galleryStr,
        technologies: techStr,
        projectUrl: projectUrl || '',
        githubUrl: githubUrl || '',
        year: year || new Date().getFullYear().toString(),
        featured: Boolean(featured),
        sortOrder: nextOrder,
        isVisible: isVisible ?? true,
      },
    });

    return res.status(201).json(formatProject(project));
  } catch (error) {
    console.error('Error creating project:', error);
    return res.status(500).json({ error: 'Erreur lors de la création du projet.' });
  }
});

// PUT /api/projects/reorder
router.put('/reorder', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Format d\'éléments invalide.' });
    }

    await prisma.$transaction(
      items.map((item: { id: string; sortOrder: number }) =>
        prisma.project.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    return res.json({ success: true });
  } catch (error) {
    console.error('Error reordering projects:', error);
    return res.status(500).json({ error: 'Erreur lors de la réorganisation des projets.' });
  }
});

// POST /api/projects/:id/duplicate
router.post('/:id/duplicate', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const original = await prisma.project.findUnique({ where: { id } });
    if (!original) {
      return res.status(404).json({ error: 'Projet introuvable.' });
    }

    const newTitle = `${original.title} (Copie)`;
    let newSlug = `${original.slug}-copie-${Date.now()}`;

    const maxSort = await prisma.project.aggregate({ _max: { sortOrder: true } });
    const nextOrder = (maxSort._max.sortOrder || 0) + 1;

    const copy = await prisma.project.create({
      data: {
        title: newTitle,
        slug: newSlug,
        category: original.category,
        shortDescription: original.shortDescription,
        description: original.description,
        featuredImage: original.featuredImage,
        gallery: original.gallery,
        technologies: original.technologies,
        projectUrl: original.projectUrl,
        githubUrl: original.githubUrl,
        year: original.year,
        featured: original.featured,
        sortOrder: nextOrder,
        isVisible: original.isVisible,
      },
    });

    return res.status(201).json(formatProject(copy));
  } catch (error) {
    console.error('Error duplicating project:', error);
    return res.status(500).json({ error: 'Erreur lors de la duplication du projet.' });
  }
});

// PUT /api/projects/:id
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug: customSlug,
      category,
      shortDescription,
      description,
      featuredImage,
      gallery,
      technologies,
      projectUrl,
      githubUrl,
      year,
      featured,
      sortOrder,
      isVisible,
    } = req.body;

    let finalSlug = customSlug ? slugify(customSlug) : slugify(title);

    // Check if slug is taken by another project
    const existing = await prisma.project.findFirst({
      where: { slug: finalSlug, NOT: { id } },
    });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    const galleryStr = typeof gallery === 'string' ? gallery : JSON.stringify(gallery || []);
    const techStr = typeof technologies === 'string' ? technologies : JSON.stringify(technologies || []);

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title,
        slug: finalSlug,
        category,
        shortDescription,
        description,
        featuredImage,
        gallery: galleryStr,
        technologies: techStr,
        projectUrl,
        githubUrl,
        year,
        featured: Boolean(featured),
        sortOrder,
        isVisible,
      },
    });

    return res.json(formatProject(updated));
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ error: 'Erreur lors de la modification du projet.' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression du projet.' });
  }
});

export default router;
