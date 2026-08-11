import { Router, Response } from 'express';
import { authenticate, authorizeRole, AuthRequest } from '../../middleware/auth';
import prisma from '../../services/prisma';

const router = Router();

// GET /api/course-planner/topics?courseId=xyz
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.query;
    const where: any = {};
    if (courseId && typeof courseId === 'string') {
      where.courseId = courseId;
    }

    const topics = await prisma.coursePlannerTopic.findMany({
      where,
      include: {
        course: { select: { id: true, name: true, code: true } },
        materials: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return res.json(topics);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch topics.' });
  }
});

// POST /api/course-planner/topics (ADMIN or TUTOR assigned to course)
router.post('/', authenticate, authorizeRole(['ADMIN', 'TUTOR']), async (req: AuthRequest, res: Response) => {
  try {
    const { name, courseId } = req.body;
    if (!name || !name.trim() || !courseId) {
      return res.status(400).json({ message: 'Topic name and courseId are required.' });
    }

    const course = await prisma.coursePlannerCourse.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    if (req.user!.role === 'TUTOR' && course.tutorId !== req.user!.id) {
      return res.status(403).json({ message: 'Tutors can only add topics to their assigned courses.' });
    }

    const topic = await prisma.coursePlannerTopic.create({
      data: {
        name: name.trim(),
        courseId,
      },
      include: {
        course: { select: { id: true, name: true } },
        materials: true,
      },
    });

    return res.status(201).json(topic);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to create topic.' });
  }
});

// DELETE /api/course-planner/topics/:id (ADMIN or TUTOR)
router.delete('/:id', authenticate, authorizeRole(['ADMIN', 'TUTOR']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const topic = await prisma.coursePlannerTopic.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found.' });
    }

    if (req.user!.role === 'TUTOR' && topic.course.tutorId !== req.user!.id) {
      return res.status(403).json({ message: 'Tutors can only delete topics from their assigned courses.' });
    }

    await prisma.coursePlannerTopic.delete({ where: { id } });
    return res.json({ message: 'Topic deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to delete topic.' });
  }
});

export default router;
