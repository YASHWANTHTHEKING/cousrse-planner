import prisma from './prisma';
import bcrypt from 'bcryptjs';

export async function ensureInitialSeed() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      console.log('✅ Database already contains users.');
      return;
    }

    console.log('🌱 Empty database detected on startup. Auto-seeding initial users & courses...');

    const adminPass = await bcrypt.hash('admin123', 10);
    const tutorPass = await bcrypt.hash('tutor123', 10);
    const studentPass = await bcrypt.hash('student123', 10);

    const admin = await prisma.user.create({
      data: {
        name: 'System Admin',
        email: 'admin@career360.com',
        password: adminPass,
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
    });

    const tutor1 = await prisma.user.create({
      data: {
        name: 'Dr. John Doe',
        email: 'tutor.john@career360.com',
        password: tutorPass,
        role: 'TUTOR',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        tutorProfile: {
          create: {
            expertise: 'Full-Stack Web Engineering, Node.js, React',
            qualifications: 'Ph.D. in Computer Science, 10+ yrs Industry Experience',
            hourlyRate: 65.0,
            availability: 'Mon - Thu, 4:00 PM - 8:00 PM EST',
            bio: 'Passionate computer science educator specializing in modern web architecture.',
          },
        },
      },
    });

    const student1 = await prisma.user.create({
      data: {
        name: 'Alex Morgan',
        email: 'student.alex@career360.com',
        password: studentPass,
        role: 'STUDENT',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        studentProfile: {
          create: {
            learningGoals: 'Become a Senior Full-Stack Engineer within 12 months',
            targetSkills: 'React, TypeScript, Node.js, Microservices',
            phone: '+1 (555) 234-5678',
            bio: 'Self-motivated learner transitioning to software development.',
          },
        },
      },
    });

    const catSE = await prisma.coursePlannerCategory.create({
      data: {
        name: 'Software Engineering',
        description: 'Full-stack web development, backend APIs, and modern frameworks.',
      },
    });

    const course1 = await prisma.coursePlannerCourse.create({
      data: {
        name: 'Full-Stack Web Development Mastery',
        code: 'CS-101',
        categoryId: catSE.id,
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-12-15'),
        summary: `<p><strong>Comprehensive bootcamp</strong> covering modern web technologies.</p>`,
        status: 'ONGOING',
        tutorId: tutor1.id,
      },
    });

    console.log('✅ Auto-seeding completed successfully!');
  } catch (error) {
    console.error('Auto-seed error:', error);
  }
}
