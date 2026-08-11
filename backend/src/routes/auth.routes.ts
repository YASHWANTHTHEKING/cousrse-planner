import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../services/prisma';
import { generateToken } from '../utils/jwt';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Host Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
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
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error.' });
  }
});

// Switch role for quick testing/demo
router.post('/switch-role', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!['ADMIN', 'STUDENT', 'TUTOR'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: { role },
    });

    const token = generateToken({ userId: updatedUser.id, email: updatedUser.email, role: updatedUser.role });
    return res.json({
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error.' });
  }
});

export default router;
