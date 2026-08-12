import { Router, Request, Response } from 'express';
import prisma from '../db.js';

const router = Router();

// POST /api/contact
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Le nom, l\'email et le message sont obligatoires.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Adresse email invalide.' });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject ? subject.trim() : 'Nouveau message du portfolio',
        message: message.trim(),
        status: 'UNREAD',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès.',
      id: contactMessage.id,
    });
  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({ error: 'Impossible d\'envoyer le message.' });
  }
});

export default router;
