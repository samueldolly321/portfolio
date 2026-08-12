import { Router, Request, Response } from 'express';
import prisma from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/education
router.get('/', async (_req: Request, res: Response) => {
  try {
    const eduList = await prisma.education.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return res.json(eduList);
  } catch (error) {
    console.error('Error fetching education:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des formations.' });
  }
});

// POST /api/education
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { year, startYear, endYear, title, institution, description, sortOrder, isVisible } = req.body;
    if (!year || !title || !institution) {
      return res.status(400).json({ error: 'Année, titre et établissement sont requis.' });
    }

    const maxSort = await prisma.education.aggregate({ _max: { sortOrder: true } });
    const nextOrder = sortOrder ?? ((maxSort._max.sortOrder || 0) + 1);

    const edu = await prisma.education.create({
      data: {
        year,
        startYear,
        endYear,
        title,
        institution,
        description: description || '',
        sortOrder: nextOrder,
        isVisible: isVisible ?? true,
      },
    });

    return res.status(201).json(edu);
  } catch (error) {
    console.error('Error creating education:', error);
    return res.status(500).json({ error: 'Erreur lors de la création de la formation.' });
  }
});

// PUT /api/education/reorder
router.put('/reorder', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Données de réorganisation invalides' });
    }

    await prisma.$transaction(
      items.map((item: { id: string; sortOrder: number }) =>
        prisma.education.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    return res.json({ success: true });
  } catch (error) {
    console.error('Error reordering education:', error);
    return res.status(500).json({ error: 'Erreur lors de la réorganisation des formations.' });
  }
});

// PUT /api/education/:id
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { year, startYear, endYear, title, institution, description, sortOrder, isVisible } = req.body;

    const edu = await prisma.education.update({
      where: { id },
      data: { year, startYear, endYear, title, institution, description, sortOrder, isVisible },
    });

    return res.json(edu);
  } catch (error) {
    console.error('Error updating education:', error);
    return res.status(500).json({ error: 'Erreur lors de la modification de la formation.' });
  }
});

// DELETE /api/education/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.education.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting education:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression de la formation.' });
  }
});

export default router;
