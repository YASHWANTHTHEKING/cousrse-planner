import { Router, Response } from 'express';
import { authenticate, authorizeRole, AuthRequest } from '../../middleware/auth';
import prisma from '../../services/prisma';

const router = Router();

// GET /api/course-planner/materials
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, topicId } = req.query;
    const where: any = {};

    if (courseId && typeof courseId === 'string') {
      where.courseId = courseId;
    }
    if (topicId && typeof topicId === 'string') {
      where.topicId = topicId;
    }

    const materials = await prisma.coursePlannerMaterial.findMany({
      where,
      include: {
        course: { select: { id: true, name: true, code: true } },
        topic: { select: { id: true, name: true } },
      },
      orderBy: [{ topicId: 'asc' }, { order: 'asc' }],
    });

    return res.json(materials);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch course materials.' });
  }
});

// POST /api/course-planner/materials (ADMIN or TUTOR assigned to course)
router.post('/', authenticate, authorizeRole(['ADMIN', 'TUTOR']), async (req: AuthRequest, res: Response) => {
  try {
    const { title, courseId, topicId, content, fileType, order } = req.body;

    if (!title || !courseId || !topicId) {
      return res.status(400).json({ message: 'Title, courseId, and topicId are required.' });
    }

    const course = await prisma.coursePlannerCourse.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    if (req.user!.role === 'TUTOR' && course.tutorId !== req.user!.id) {
      return res.status(403).json({ message: 'Tutors can only add materials to their assigned courses.' });
    }

    const topic = await prisma.coursePlannerTopic.findUnique({ where: { id: topicId } });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found.' });
    }

    const material = await prisma.coursePlannerMaterial.create({
      data: {
        title: title.trim(),
        courseId,
        topicId,
        content: content || '',
        fileType: fileType || 'DOCUMENT',
        order: order !== undefined ? Number(order) : 0,
      },
      include: {
        course: { select: { id: true, name: true } },
        topic: { select: { id: true, name: true } },
      },
    });

    return res.status(201).json(material);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to create course material.' });
  }
});

// PUT /api/course-planner/materials/:id
router.put('/:id', authenticate, authorizeRole(['ADMIN', 'TUTOR']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, topicId, content, fileType, order } = req.body;

    const existing = await prisma.coursePlannerMaterial.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Material not found.' });
    }

    if (req.user!.role === 'TUTOR' && existing.course.tutorId !== req.user!.id) {
      return res.status(403).json({ message: 'Tutors can only edit materials in their assigned courses.' });
    }

    const updated = await prisma.coursePlannerMaterial.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        topicId: topicId || existing.topicId,
        content: content !== undefined ? content : existing.content,
        fileType: fileType || existing.fileType,
        order: order !== undefined ? Number(order) : existing.order,
      },
      include: {
        course: { select: { id: true, name: true } },
        topic: { select: { id: true, name: true } },
      },
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to update course material.' });
  }
});

// DELETE /api/course-planner/materials/:id
router.delete('/:id', authenticate, authorizeRole(['ADMIN', 'TUTOR']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.coursePlannerMaterial.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Material not found.' });
    }

    if (req.user!.role === 'TUTOR' && existing.course.tutorId !== req.user!.id) {
      return res.status(403).json({ message: 'Tutors can only delete materials from their assigned courses.' });
    }

    await prisma.coursePlannerMaterial.delete({ where: { id } });
    return res.json({ message: 'Material deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to delete material.' });
  }
});

export default router;
