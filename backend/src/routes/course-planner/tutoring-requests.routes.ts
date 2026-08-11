import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import prisma from '../../services/prisma';

const router = Router();

// GET /api/course-planner/tutoring-requests
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { status, courseId } = req.query;

    const where: any = {};

    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }
    if (courseId && typeof courseId === 'string') {
      where.courseId = courseId;
    }

    if (userRole === 'STUDENT') {
      where.studentId = userId;
    } else if (userRole === 'TUTOR') {
      where.OR = [
        { tutorId: userId },
        { tutorId: null, course: { tutorId: userId } },
      ];
    }
    // ADMIN gets all based on filters

    const requests = await prisma.coursePlannerTutoringRequest.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, email: true, avatar: true } },
        tutor: { select: { id: true, name: true, email: true, avatar: true } },
        course: { select: { id: true, name: true, code: true, category: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(requests);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch tutoring requests.' });
  }
});

// POST /api/course-planner/tutoring-requests (STUDENT)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { courseId, tutorId, message } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required.' });
    }

    const course = await prisma.coursePlannerCourse.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if there is an existing pending request from this student for this course
    const existing = await prisma.coursePlannerTutoringRequest.findFirst({
      where: {
        studentId,
        courseId,
        status: 'PENDING',
      },
    });

    if (existing) {
      return res.status(400).json({ message: 'You already have a pending tutoring request for this course.' });
    }

    const newRequest = await prisma.coursePlannerTutoringRequest.create({
      data: {
        studentId,
        courseId,
        tutorId: tutorId || course.tutorId || null,
        message: message || null,
        status: 'PENDING',
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
        tutor: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, name: true } },
      },
    });

    return res.status(201).json(newRequest);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to create tutoring request.' });
  }
});

// PATCH /api/course-planner/tutoring-requests/:id/status (ADMIN or TUTOR)
router.patch('/:id/status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, tutorId } = req.body;
    const userRole = req.user!.role;
    const userId = req.user!.id;

    if (!['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const request = await prisma.coursePlannerTutoringRequest.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!request) {
      return res.status(404).json({ message: 'Tutoring request not found.' });
    }

    // Authorization check
    if (userRole === 'STUDENT') {
      return res.status(403).json({ message: 'Students cannot update request status.' });
    }

    if (userRole === 'TUTOR' && request.tutorId && request.tutorId !== userId) {
      return res.status(403).json({ message: 'Tutors can only manage requests directed to them.' });
    }

    const updated = await prisma.coursePlannerTutoringRequest.update({
      where: { id },
      data: {
        status,
        tutorId: userRole === 'TUTOR' ? userId : (tutorId !== undefined ? tutorId : request.tutorId),
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
        tutor: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, name: true } },
      },
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to update tutoring request status.' });
  }
});

export default router;
