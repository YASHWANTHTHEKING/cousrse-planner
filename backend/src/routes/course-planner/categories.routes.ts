import { Router, Request, Response } from 'express';
import { authenticate, authorizeRole, AuthRequest } from '../../middleware/auth';
import prisma from '../../services/prisma';

const router = Router();

// GET /api/course-planner/categories (All authenticated users can list categories)
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const categories = await prisma.coursePlannerCategory.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return res.json(categories);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch categories.' });
  }
});

// POST /api/course-planner/categories (ADMIN)
router.post('/', authenticate, authorizeRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const existing = await prisma.coursePlannerCategory.findUnique({
      where: { name: name.trim() },
    });
    if (existing) {
      return res.status(400).json({ message: 'Category with this name already exists.' });
    }

    const category = await prisma.coursePlannerCategory.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });
    return res.status(201).json(category);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to create category.' });
  }
});

// PUT /api/course-planner/categories/:id (ADMIN)
router.put('/:id', authenticate, authorizeRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existing = await prisma.coursePlannerCategory.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const updated = await prisma.coursePlannerCategory.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existing.name,
        description: description !== undefined ? description.trim() : existing.description,
      },
    });
    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to update category.' });
  }
});

// DELETE /api/course-planner/categories/:id (ADMIN)
router.delete('/:id', authenticate, authorizeRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.coursePlannerCategory.findUnique({
      where: { id },
      include: { _count: { select: { courses: true } } },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    if (existing._count.courses > 0) {
      return res.status(400).json({ message: 'Cannot delete category that has assigned courses.' });
    }

    await prisma.coursePlannerCategory.delete({ where: { id } });
    return res.json({ message: 'Category deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to delete category.' });
  }
});

export default router;
