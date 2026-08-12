import { Router, Request, Response } from 'express';
import prisma from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/about
router.get('/', async (_req: Request, res: Response) => {
  try {
    const about = await prisma.about.findFirst();
    return res.json(about || {});
  } catch (error) {
    console.error('Error fetching about:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération de la section À Propos.' });
  }
});

// PUT /api/about
router.put('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, tagline, description, imageUrl, cvUrl } = req.body;

    const existing = await prisma.about.findFirst();

    let updatedAbout;
    if (existing) {
      updatedAbout = await prisma.about.update({
        where: { id: existing.id },
        data: { title, tagline, description, imageUrl, cvUrl },
      });
    } else {
      updatedAbout = await prisma.about.create({
        data: { title, tagline, description, imageUrl, cvUrl },
      });
    }

    return res.json(updatedAbout);
  } catch (error) {
    console.error('Error updating about:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour de la section À Propos.' });
  }
});

export default router;
