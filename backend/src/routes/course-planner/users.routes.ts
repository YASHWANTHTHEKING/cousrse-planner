import { Router, Response } from 'express';
import { authenticate, authorizeRole, AuthRequest } from '../../middleware/auth';
import prisma from '../../services/prisma';

const router = Router();

// GET /api/course-planner/users (ADMIN only)
router.get('/', authenticate, authorizeRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { role, search } = req.query;
    const where: any = {};

    if (role && typeof role === 'string' && role !== 'ALL') {
      where.role = role;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        studentProfile: true,
        tutorProfile: true,
        _count: {
          select: {
            taughtCourses: true,
            tutoringRequestsAsStudent: true,
            tutoringRequestsAsTutor: true,
            payments: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch users.' });
  }
});

export default router;
