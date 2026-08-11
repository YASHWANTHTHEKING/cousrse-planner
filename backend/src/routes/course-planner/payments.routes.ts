import { Router, Response } from 'express';
import { authenticate, authorizeRole, AuthRequest } from '../../middleware/auth';
import prisma from '../../services/prisma';

const router = Router();

// GET /api/course-planner/payments
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const where: any = {};
    if (userRole === 'STUDENT') {
      where.studentId = userId;
    }

    const payments = await prisma.coursePlannerPayment.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, name: true, code: true, category: true } },
      },
      orderBy: { date: 'desc' },
    });

    return res.json(payments);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch payments.' });
  }
});

// POST /api/course-planner/payments (STUDENT or ADMIN)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user!.id;
    const { courseId, amount, paymentMethod, transactionId } = req.body;

    if (!courseId || amount === undefined) {
      return res.status(400).json({ message: 'courseId and amount are required.' });
    }

    const course = await prisma.coursePlannerCourse.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const payment = await prisma.coursePlannerPayment.create({
      data: {
        studentId,
        courseId,
        amount: Number(amount),
        status: 'COMPLETED',
        paymentMethod: paymentMethod || 'CREDIT_CARD',
        transactionId: transactionId || `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        date: new Date(),
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, name: true } },
      },
    });

    return res.status(201).json(payment);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to process payment.' });
  }
});

// PATCH /api/course-planner/payments/:id/status (ADMIN)
router.patch('/:id/status', authenticate, authorizeRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'COMPLETED', 'REFUNDED', 'FAILED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid payment status.' });
    }

    const updated = await prisma.coursePlannerPayment.update({
      where: { id },
      data: { status },
      include: {
        student: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, name: true } },
      },
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to update payment status.' });
  }
});

export default router;
