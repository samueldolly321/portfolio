import { Router, Request, Response } from 'express';
import prisma from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/skills
router.get('/', async (_req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des compétences.' });
  }
});

// POST /api/skills
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, category, icon, level, sortOrder, isVisible } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Le nom et la catégorie sont requis.' });
    }

    const maxSort = await prisma.skill.aggregate({ _max: { sortOrder: true } });
    const nextOrder = sortOrder ?? ((maxSort._max.sortOrder || 0) + 1);

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        icon,
        level: level ?? 80,
        sortOrder: nextOrder,
        isVisible: isVisible ?? true,
      },
    });
    return res.status(201).json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    return res.status(500).json({ error: 'Erreur lors de la création de la compétence.' });
  }
});

// PUT /api/skills/reorder
router.put('/reorder', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // array of { id: string, sortOrder: number }
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Format d\'éléments invalide pour la réorganisation.' });
    }

    await prisma.$transaction(
      items.map((item: { id: string; sortOrder: number }) =>
        prisma.skill.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    return res.json({ success: true });
  } catch (error) {
    console.error('Error reordering skills:', error);
    return res.status(500).json({ error: 'Erreur lors de la réorganisation des compétences.' });
  }
});

// PUT /api/skills/:id
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, icon, level, sortOrder, isVisible } = req.body;

    const skill = await prisma.skill.update({
      where: { id },
      data: { name, category, icon, level, sortOrder, isVisible },
    });
    return res.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    return res.status(500).json({ error: 'Erreur lors de la modification de la compétence.' });
  }
});

// DELETE /api/skills/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression de la compétence.' });
  }
});

export default router;
