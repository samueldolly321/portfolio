import { Router, Request, Response } from 'express';
import prisma from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/profile
router.get('/', async (_req: Request, res: Response) => {
  try {
    const profile = await prisma.profile.findFirst();
    return res.json(profile || {});
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
  }
});

// PUT /api/profile
router.put('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      title,
      email,
      phone,
      location,
      bio,
      avatarUrl,
      githubUrl,
      linkedinUrl,
      websiteUrl,
    } = req.body;

    const existing = await prisma.profile.findFirst();

    let updatedProfile;
    if (existing) {
      updatedProfile = await prisma.profile.update({
        where: { id: existing.id },
        data: {
          firstName,
          lastName,
          title,
          email,
          phone,
          location,
          bio,
          avatarUrl,
          githubUrl,
          linkedinUrl,
          websiteUrl,
        },
      });
    } else {
      updatedProfile = await prisma.profile.create({
        data: {
          firstName,
          lastName,
          title,
          email,
          phone,
          location,
          bio,
          avatarUrl,
          githubUrl,
          linkedinUrl,
          websiteUrl,
        },
      });
    }

    return res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil.' });
  }
});

export default router;
