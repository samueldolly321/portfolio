import { Router, Request, Response } from 'express';
import prisma from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/statistics
router.get('/', async (_req: Request, res: Response) => {
  try {
    const stats = await prisma.statistic.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des statistiques.' });
  }
});

// POST /api/statistics
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { label, value, subtext, sortOrder, isVisible } = req.body;
    const stat = await prisma.statistic.create({
      data: {
        label,
        value,
        subtext,
        sortOrder: sortOrder ?? 0,
        isVisible: isVisible ?? true,
      },
    });
    return res.status(201).json(stat);
  } catch (error) {
    console.error('Error creating statistic:', error);
    return res.status(500).json({ error: 'Erreur lors de la création de la statistique.' });
  }
});

// PUT /api/statistics/:id
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { label, value, subtext, sortOrder, isVisible } = req.body;
    const stat = await prisma.statistic.update({
      where: { id },
      data: { label, value, subtext, sortOrder, isVisible },
    });
    return res.json(stat);
  } catch (error) {
    console.error('Error updating statistic:', error);
    return res.status(500).json({ error: 'Erreur lors de la modification de la statistique.' });
  }
});

// DELETE /api/statistics/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.statistic.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting statistic:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression de la statistique.' });
  }
});

export default router;
