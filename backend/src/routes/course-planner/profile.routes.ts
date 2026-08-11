import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import prisma from '../../services/prisma';

const router = Router();

// GET /api/course-planner/profile
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        studentProfile: true,
        tutorProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch profile.' });
  }
});

// PUT /api/course-planner/profile
router.put('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === 'STUDENT') {
      const { learningGoals, targetSkills, phone, bio } = req.body;
      const profile = await prisma.coursePlannerStudentProfile.upsert({
        where: { userId },
        update: {
          learningGoals: learningGoals !== undefined ? learningGoals : undefined,
          targetSkills: targetSkills !== undefined ? targetSkills : undefined,
          phone: phone !== undefined ? phone : undefined,
          bio: bio !== undefined ? bio : undefined,
        },
        create: {
          userId,
          learningGoals: learningGoals || null,
          targetSkills: targetSkills || null,
          phone: phone || null,
          bio: bio || null,
        },
      });
      return res.json({ profileType: 'STUDENT', profile });
    } else if (userRole === 'TUTOR') {
      const { expertise, qualifications, hourlyRate, availability, bio } = req.body;
      const profile = await prisma.coursePlannerTutorProfile.upsert({
        where: { userId },
        update: {
          expertise: expertise !== undefined ? expertise : undefined,
          qualifications: qualifications !== undefined ? qualifications : undefined,
          hourlyRate: hourlyRate !== undefined ? (hourlyRate ? Number(hourlyRate) : null) : undefined,
          availability: availability !== undefined ? availability : undefined,
          bio: bio !== undefined ? bio : undefined,
        },
        create: {
          userId,
          expertise: expertise || null,
          qualifications: qualifications || null,
          hourlyRate: hourlyRate ? Number(hourlyRate) : null,
          availability: availability || null,
          bio: bio || null,
        },
      });
      return res.json({ profileType: 'TUTOR', profile });
    } else {
      return res.json({ message: 'Admin profile updated via host application.' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to update profile.' });
  }
});

export default router;
