import { Router } from 'express';
import authRoutes from './auth.routes';
import dashboardRoutes from './course-planner/dashboard.routes';
import categoriesRoutes from './course-planner/categories.routes';
import coursesRoutes from './course-planner/courses.routes';
import topicsRoutes from './course-planner/topics.routes';
import materialsRoutes from './course-planner/materials.routes';
import tutoringRequestsRoutes from './course-planner/tutoring-requests.routes';
import paymentsRoutes from './course-planner/payments.routes';
import profileRoutes from './course-planner/profile.routes';
import usersRoutes from './course-planner/users.routes';

const router = Router();

// Host authentication routes
router.use('/auth', authRoutes);

// Course Planner Module Namespace (/api/course-planner/*)
router.use('/course-planner/dashboard', dashboardRoutes);
router.use('/course-planner/categories', categoriesRoutes);
router.use('/course-planner/courses', coursesRoutes);
router.use('/course-planner/topics', topicsRoutes);
router.use('/course-planner/materials', materialsRoutes);
router.use('/course-planner/tutoring-requests', tutoringRequestsRoutes);
router.use('/course-planner/payments', paymentsRoutes);
router.use('/course-planner/profile', profileRoutes);
router.use('/course-planner/users', usersRoutes);

export default router;
