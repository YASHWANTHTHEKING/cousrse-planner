import { Router, Response } from 'express';
import { authenticate, authorizeRole, AuthRequest } from '../../middleware/auth';
import prisma from '../../services/prisma';

const router = Router();

// GET /api/course-planner/dashboard/stats
router.get('/stats', authenticate, authorizeRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalCourses,
      upcomingCourses,
      ongoingCourses,
      completedCourses,
      pendingRequests,
      totalRequests,
      payments,
      totalStudents,
      totalTutors,
      categoriesCount,
      recentRequests,
      recentPayments
    ] = await Promise.all([
      prisma.coursePlannerCourse.count(),
      prisma.coursePlannerCourse.count({ where: { status: 'UPCOMING' } }),
      prisma.coursePlannerCourse.count({ where: { status: 'ONGOING' } }),
      prisma.coursePlannerCourse.count({ where: { status: 'COMPLETED' } }),
      prisma.coursePlannerTutoringRequest.count({ where: { status: 'PENDING' } }),
      prisma.coursePlannerTutoringRequest.count(),
      prisma.coursePlannerPayment.findMany({ where: { status: 'COMPLETED' } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TUTOR' } }),
      prisma.coursePlannerCategory.count(),
      prisma.coursePlannerTutoringRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          student: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, name: true } },
          tutor: { select: { id: true, name: true } },
        },
      }),
      prisma.coursePlannerPayment.findMany({
        take: 5,
        orderBy: { date: 'desc' },
        include: {
          student: { select: { id: true, name: true } },
          course: { select: { id: true, name: true } },
        },
      }),
    ]);

    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    return res.json({
      summary: {
        totalCourses,
        upcomingCourses,
        ongoingCourses,
        completedCourses,
        activeCourses: upcomingCourses + ongoingCourses,
        pendingRequests,
        totalRequests,
        totalRevenue,
        totalStudents,
        totalTutors,
        categoriesCount,
      },
      recentRequests,
      recentPayments,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch dashboard stats.' });
  }
});

export default router;
