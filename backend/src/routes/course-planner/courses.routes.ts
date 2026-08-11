import { Router, Response } from 'express';
import { authenticate, authorizeRole, AuthRequest } from '../../middleware/auth';
import prisma from '../../services/prisma';

const router = Router();

// GET /api/course-planner/courses
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status, categoryId, search, filterScope } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const where: any = {};

    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }

    if (categoryId && typeof categoryId === 'string' && categoryId !== 'ALL') {
      where.categoryId = categoryId;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { summary: { contains: search } },
      ];
    }

    // Role-specific filtering shortcuts
    if (filterScope === 'OPEN_FOR_TUTOR' || (userRole === 'TUTOR' && filterScope === 'OPEN')) {
      where.tutorId = null;
    } else if (filterScope === 'MY_TUTORED_COURSES' || (userRole === 'TUTOR' && filterScope === 'MY_COURSES')) {
      where.tutorId = userId;
    } else if (filterScope === 'STUDENT_ONGOING') {
      where.status = 'ONGOING';
    } else if (filterScope === 'STUDENT_AVAILABLE') {
      where.status = 'UPCOMING';
    }

    const courses = await prisma.coursePlannerCourse.findMany({
      where,
      include: {
        category: true,
        tutor: { select: { id: true, name: true, email: true, avatar: true } },
        _count: {
          select: {
            topics: true,
            materials: true,
            tutoringRequests: true,
            payments: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    return res.json(courses);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch courses.' });
  }
});

// GET /api/course-planner/courses/:id
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const course = await prisma.coursePlannerCourse.findUnique({
      where: { id },
      include: {
        category: true,
        tutor: { select: { id: true, name: true, email: true, avatar: true } },
        topics: {
          include: {
            materials: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        materials: {
          include: {
            topic: true,
          },
          orderBy: { order: 'asc' },
        },
        tutoringRequests: {
          include: {
            student: { select: { id: true, name: true, email: true } },
            tutor: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        payments: {
          include: {
            student: { select: { id: true, name: true } },
          },
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    return res.json(course);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch course details.' });
  }
});

// POST /api/course-planner/courses (ADMIN)
router.post('/', authenticate, authorizeRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, code, categoryId, startDate, endDate, summary, status, tutorId } = req.body;

    if (!name || !categoryId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Course Name, Category, Start Date, and End Date are required.' });
    }

    // Verify category existence
    const categoryExists = await prisma.coursePlannerCategory.findUnique({ where: { id: categoryId } });
    if (!categoryExists) {
      return res.status(400).json({ message: 'Selected Category does not exist.' });
    }

    // If tutorId provided, verify tutor user
    if (tutorId) {
      const tutorUser = await prisma.user.findUnique({ where: { id: tutorId } });
      if (!tutorUser) {
        return res.status(400).json({ message: 'Selected Tutor user does not exist.' });
      }
    }

    const course = await prisma.coursePlannerCourse.create({
      data: {
        name: name.trim(),
        code: code ? code.trim() : null,
        categoryId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        summary: summary || '',
        status: status || 'UPCOMING',
        tutorId: tutorId || null,
      },
      include: {
        category: true,
        tutor: { select: { id: true, name: true, email: true } },
      },
    });

    return res.status(201).json(course);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to create course.' });
  }
});

// PUT /api/course-planner/courses/:id (ADMIN or TUTOR requesting/claiming)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;
    const userId = req.user!.id;

    const existingCourse = await prisma.coursePlannerCourse.findUnique({ where: { id } });
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const { name, code, categoryId, startDate, endDate, summary, status, tutorId, claimAsTutor } = req.body;

    // Tutors can express intent to claim an open course
    if (userRole === 'TUTOR' && claimAsTutor) {
      if (existingCourse.tutorId && existingCourse.tutorId !== userId) {
        return res.status(400).json({ message: 'This course is already assigned to another tutor.' });
      }
      const updated = await prisma.coursePlannerCourse.update({
        where: { id },
        data: { tutorId: userId },
        include: { category: true, tutor: true },
      });
      return res.json(updated);
    }

    // Admin updates all fields
    if (userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Only Admins can modify course specifications.' });
    }

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name.trim();
    if (code !== undefined) dataToUpdate.code = code ? code.trim() : null;
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId;
    if (startDate !== undefined) dataToUpdate.startDate = new Date(startDate);
    if (endDate !== undefined) dataToUpdate.endDate = new Date(endDate);
    if (summary !== undefined) dataToUpdate.summary = summary;
    if (status !== undefined) dataToUpdate.status = status;
    if (tutorId !== undefined) dataToUpdate.tutorId = tutorId || null;

    const updated = await prisma.coursePlannerCourse.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: true,
        tutor: { select: { id: true, name: true, email: true } },
      },
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to update course.' });
  }
});

// DELETE /api/course-planner/courses/:id (ADMIN)
router.delete('/:id', authenticate, authorizeRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.coursePlannerCourse.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    await prisma.coursePlannerCourse.delete({ where: { id } });
    return res.json({ message: 'Course deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to delete course.' });
  }
});

export default router;
