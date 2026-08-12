import { Router, Request, Response } from 'express';
import prisma from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/messages
router.get('/', authenticate, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
  }
});

// PUT /api/messages/:id
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // UNREAD, READ, ARCHIVED

    if (!['UNREAD', 'READ', 'ARCHIVED'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide.' });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return res.json(updated);
  } catch (error) {
    console.error('Error updating message status:', error);
    return res.status(500).json({ error: 'Erreur lors de la modification du message.' });
  }
});

// DELETE /api/messages/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression du message.' });
  }
});

export default router;
