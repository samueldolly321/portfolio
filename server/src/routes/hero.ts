import { Router, Request, Response } from 'express';
import prisma from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/hero
router.get('/', async (_req: Request, res: Response) => {
  try {
    const hero = await prisma.hero.findFirst();
    if (!hero) {
      return res.json({});
    }
    let parsedTechs = [];
    try {
      parsedTechs = JSON.parse(hero.technologies || '[]');
    } catch {
      parsedTechs = [];
    }

    return res.json({
      ...hero,
      technologies: parsedTechs,
    });
  } catch (error) {
    console.error('Error fetching hero:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération de la section Hero.' });
  }
});

// PUT /api/hero
router.put('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      badge,
      title,
      subtitle,
      description,
      primaryCtaText,
      primaryCtaUrl,
      secondaryCtaText,
      secondaryCtaUrl,
      imageUrl,
      technologies,
    } = req.body;

    const techString = typeof technologies === 'string'
      ? technologies
      : JSON.stringify(technologies || []);

    const existing = await prisma.hero.findFirst();

    let updatedHero;
    if (existing) {
      updatedHero = await prisma.hero.update({
        where: { id: existing.id },
        data: {
          badge,
          title,
          subtitle,
          description,
          primaryCtaText,
          primaryCtaUrl,
          secondaryCtaText,
          secondaryCtaUrl,
          imageUrl,
          technologies: techString,
        },
      });
    } else {
      updatedHero = await prisma.hero.create({
        data: {
          badge,
          title,
          subtitle,
          description,
          primaryCtaText,
          primaryCtaUrl,
          secondaryCtaText,
          secondaryCtaUrl,
          imageUrl,
          technologies: techString,
        },
      });
    }

    let parsedTechs = [];
    try {
      parsedTechs = JSON.parse(updatedHero.technologies || '[]');
    } catch {
      parsedTechs = [];
    }

    return res.json({
      ...updatedHero,
      technologies: parsedTechs,
    });
  } catch (error) {
    console.error('Error updating hero:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour du Hero.' });
  }
});

export default router;
