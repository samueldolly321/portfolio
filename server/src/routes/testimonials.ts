import { Router, Request, Response } from 'express';
import prisma from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/testimonials  -> liste publique des témoignages visibles
router.get('/', async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
    });
    return res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des témoignages.' });
  }
});

// GET /api/testimonials/all  -> TOUS les témoignages (admin), y compris masqués
router.get('/all', authenticate, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const all = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } });
    return res.json(all);
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des témoignages.' });
  }
});

// POST /api/testimonials  -> créer
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { author, role, company, message, rating, sortOrder, isVisible } = req.body;
    if (!author || !message) {
      return res.status(400).json({ error: "L'auteur et le message sont obligatoires." });
    }
    const maxSort = await prisma.testimonial.aggregate({ _max: { sortOrder: true } });
    const nextOrder = sortOrder ?? ((maxSort._max.sortOrder || 0) + 1);

    const created = await prisma.testimonial.create({
      data: {
        author,
        role: role || null,
        company: company || null,
        message,
        rating: rating !== undefined ? Number(rating) : 5,
        sortOrder: nextOrder,
        isVisible: isVisible ?? true,
      },
    });
    return res.status(201).json(created);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return res.status(500).json({ error: 'Erreur lors de la création du témoignage.' });
  }
});

// PUT /api/testimonials/:id  -> modifier (mise à jour partielle)
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { author, role, company, message, rating, sortOrder, isVisible } = req.body;

    const data: any = {};
    if (author !== undefined) data.author = author;
    if (role !== undefined) data.role = role;
    if (company !== undefined) data.company = company;
    if (message !== undefined) data.message = message;
    if (rating !== undefined) data.rating = Number(rating);
    if (sortOrder !== undefined) data.sortOrder = Number(sortOrder);
    if (isVisible !== undefined) data.isVisible = Boolean(isVisible);

    const updated = await prisma.testimonial.update({ where: { id }, data });
    return res.json(updated);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return res.status(500).json({ error: 'Erreur lors de la modification du témoignage.' });
  }
});

// DELETE /api/testimonials/:id  -> supprimer
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression du témoignage.' });
  }
});

export default router;
