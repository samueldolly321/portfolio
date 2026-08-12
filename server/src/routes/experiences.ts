import { Router, Request, Response } from 'express';
import prisma from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Helper to format experience output with parsed JSON fields
function formatExperience(exp: any) {
  let responsibilities = [];
  let technologies = [];
  try {
    responsibilities = typeof exp.responsibilities === 'string'
      ? JSON.parse(exp.responsibilities)
      : exp.responsibilities || [];
  } catch {
    responsibilities = [];
  }
  try {
    technologies = typeof exp.technologies === 'string'
      ? JSON.parse(exp.technologies)
      : exp.technologies || [];
  } catch {
    technologies = [];
  }

  return {
    ...exp,
    responsibilities,
    technologies,
  };
}

// GET /api/experiences
router.get('/', async (_req: Request, res: Response) => {
  try {
    const exps = await prisma.experience.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return res.json(exps.map(formatExperience));
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des expériences.' });
  }
});

// POST /api/experiences
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      company,
      position,
      startDate,
      endDate,
      current,
      description,
      responsibilities,
      technologies,
      location,
      sortOrder,
      isVisible,
    } = req.body;

    const respStr = typeof responsibilities === 'string'
      ? responsibilities
      : JSON.stringify(responsibilities || []);
    const techStr = typeof technologies === 'string'
      ? technologies
      : JSON.stringify(technologies || []);

    const maxSort = await prisma.experience.aggregate({ _max: { sortOrder: true } });
    const nextOrder = sortOrder ?? ((maxSort._max.sortOrder || 0) + 1);

    const exp = await prisma.experience.create({
      data: {
        company,
        position,
        startDate,
        endDate,
        current: Boolean(current),
        description,
        responsibilities: respStr,
        technologies: techStr,
        location,
        sortOrder: nextOrder,
        isVisible: isVisible ?? true,
      },
    });

    return res.status(201).json(formatExperience(exp));
  } catch (error) {
    console.error('Error creating experience:', error);
    return res.status(500).json({ error: 'Erreur lors de la création de l\'expérience.' });
  }
});

// PUT /api/experiences/reorder
router.put('/reorder', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Tableau invalide' });
    }

    await prisma.$transaction(
      items.map((item: { id: string; sortOrder: number }) =>
        prisma.experience.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    return res.json({ success: true });
  } catch (error) {
    console.error('Error reordering experiences:', error);
    return res.status(500).json({ error: 'Erreur lors de la réorganisation des expériences.' });
  }
});

// PUT /api/experiences/:id
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      company,
      position,
      startDate,
      endDate,
      current,
      description,
      responsibilities,
      technologies,
      location,
      sortOrder,
      isVisible,
    } = req.body;

    const respStr = typeof responsibilities === 'string'
      ? responsibilities
      : JSON.stringify(responsibilities || []);
    const techStr = typeof technologies === 'string'
      ? technologies
      : JSON.stringify(technologies || []);

    const exp = await prisma.experience.update({
      where: { id },
      data: {
        company,
        position,
        startDate,
        endDate,
        current: Boolean(current),
        description,
        responsibilities: respStr,
        technologies: techStr,
        location,
        sortOrder,
        isVisible,
      },
    });

    return res.json(formatExperience(exp));
  } catch (error) {
    console.error('Error updating experience:', error);
    return res.status(500).json({ error: 'Erreur lors de la modification de l\'expérience.' });
  }
});

// DELETE /api/experiences/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.experience.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression de l\'expérience.' });
  }
});

export default router;
