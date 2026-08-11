import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Career 360 database with Course Planner data...');

  // Hash passwords
  const adminPass = await bcrypt.hash('admin123', 10);
  const tutorPass = await bcrypt.hash('tutor123', 10);
  const studentPass = await bcrypt.hash('student123', 10);

  // 1. Create Host Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@career360.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@career360.com',
      password: adminPass,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
  });

  const tutor1 = await prisma.user.upsert({
    where: { email: 'tutor.john@career360.com' },
    update: {},
    create: {
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
          bio: 'Passionate computer science educator specializing in modern web architecture and cloud solutions.',
        },
      },
    },
  });

  const tutor2 = await prisma.user.upsert({
    where: { email: 'tutor.sarah@career360.com' },
    update: {},
    create: {
      name: 'Prof. Sarah Jenkins',
      email: 'tutor.sarah@career360.com',
      password: tutorPass,
      role: 'TUTOR',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      tutorProfile: {
        create: {
          expertise: 'Data Science, Python, Machine Learning',
          qualifications: 'M.S. in Data Analytics, Ex-Senior Data Scientist',
          hourlyRate: 75.0,
          availability: 'Fri - Sun, 10:00 AM - 4:00 PM EST',
          bio: 'Data Science enthusiast helping students master neural networks, NLP, and machine learning models.',
        },
      },
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'student.alex@career360.com' },
    update: {},
    create: {
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
          bio: 'Self-motivated learner transitioning from mechanical engineering to software development.',
        },
      },
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student.emily@career360.com' },
    update: {},
    create: {
      name: 'Emily Chen',
      email: 'student.emily@career360.com',
      password: studentPass,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      studentProfile: {
        create: {
          learningGoals: 'Master AI algorithms and deploy production machine learning pipelines.',
          targetSkills: 'Python, PyTorch, Scikit-Learn, AWS SageMaker',
          phone: '+1 (555) 876-5432',
          bio: 'Final-year student preparing for AI/ML engineering interviews.',
        },
      },
    },
  });

  // 2. Create Categories
  const catSE = await prisma.coursePlannerCategory.upsert({
    where: { name: 'Software Engineering' },
    update: {},
    create: {
      name: 'Software Engineering',
      description: 'Full-stack web development, backend APIs, and modern frontend frameworks.',
    },
  });

  const catDS = await prisma.coursePlannerCategory.upsert({
    where: { name: 'Data Science & AI' },
    update: {},
    create: {
      name: 'Data Science & AI',
      description: 'Machine learning, artificial intelligence, deep learning, and data analytics.',
    },
  });

  const catCloud = await prisma.coursePlannerCategory.upsert({
    where: { name: 'Cloud Computing & DevOps' },
    update: {},
    create: {
      name: 'Cloud Computing & DevOps',
      description: 'AWS, Azure, Docker, Kubernetes, and automated CI/CD pipelines.',
    },
  });

  const catUX = await prisma.coursePlannerCategory.upsert({
    where: { name: 'UI/UX Design' },
    update: {},
    create: {
      name: 'UI/UX Design',
      description: 'User research, wireframing, Figma design systems, and interaction design.',
    },
  });

  // 3. Create Courses
  const course1 = await prisma.coursePlannerCourse.create({
    data: {
      name: 'Full-Stack Web Development Mastery',
      code: 'CS-101',
      categoryId: catSE.id,
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-12-15'),
      summary: `<p><strong>Comprehensive bootcamp</strong> covering modern web technologies.</p><ul><li>React 18 &amp; Next.js App Router</li><li>Node.js &amp; Express REST APIs</li><li>Database management with Prisma &amp; PostgreSQL</li></ul><p><em>Prerequisite: Basic HTML/JS knowledge.</em></p>`,
      status: 'ONGOING',
      tutorId: tutor1.id,
    },
  });

  const course2 = await prisma.coursePlannerCourse.create({
    data: {
      name: 'Applied Machine Learning & Neural Networks',
      code: 'DS-201',
      categoryId: catDS.id,
      startDate: new Date('2026-10-01'),
      endDate: new Date('2027-01-20'),
      summary: `<h3>Master Data-Driven Intelligence</h3><p>Learn supervised and unsupervised learning algorithms with hands-on PyTorch labs.</p><ul><li>Linear &amp; Logistic Regression</li><li>Deep Neural Networks &amp; CNNs</li><li>Model Deployment via FastAPI</li></ul>`,
      status: 'UPCOMING',
      tutorId: tutor2.id,
    },
  });

  const course3 = await prisma.coursePlannerCourse.create({
    data: {
      name: 'AWS Cloud Solutions Architecture',
      code: 'CC-301',
      categoryId: catCloud.id,
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-08-01'),
      summary: `<p>Preparation for the <strong>AWS Certified Solutions Architect</strong> exam with real-world infrastructure deployments.</p>`,
      status: 'COMPLETED',
      tutorId: tutor1.id,
    },
  });

  const course4 = await prisma.coursePlannerCourse.create({
    data: {
      name: 'Figma UI/UX & Design Systems Masterclass',
      code: 'UX-102',
      categoryId: catUX.id,
      startDate: new Date('2026-09-15'),
      endDate: new Date('2026-11-30'),
      summary: `<p>Build scalable design systems, master interactive prototyping, and conduct usability testing.</p>`,
      status: 'UPCOMING',
      tutorId: null, // Open course needing a tutor!
    },
  });

  // 4. Create Topics and Materials for Course 1
  const topic1 = await prisma.coursePlannerTopic.create({
    data: {
      name: 'Frontend Architecture & Modern React',
      courseId: course1.id,
    },
  });

  const topic2 = await prisma.coursePlannerTopic.create({
    data: {
      name: 'Backend Microservices & Prisma ORM',
      courseId: course1.id,
    },
  });

  await prisma.coursePlannerMaterial.createMany({
    data: [
      {
        title: 'React Hooks & State Management Guide',
        courseId: course1.id,
        topicId: topic1.id,
        content: 'https://react.dev/learn',
        fileType: 'DOCUMENT',
        order: 1,
      },
      {
        title: 'Component Design Patterns (Slides)',
        courseId: course1.id,
        topicId: topic1.id,
        content: 'https://example.com/slides/react-patterns.pdf',
        fileType: 'PDF',
        order: 2,
      },
      {
        title: 'REST API Best Practices & JWT Auth',
        courseId: course1.id,
        topicId: topic2.id,
        content: 'https://example.com/guides/express-auth-guide',
        fileType: 'LINK',
        order: 1,
      },
    ],
  });

  // 5. Create Tutoring Requests
  await prisma.coursePlannerTutoringRequest.create({
    data: {
      studentId: student1.id,
      tutorId: tutor1.id,
      courseId: course1.id,
      message: 'Hi Dr. John, I would love 1-on-1 guidance on building complex database migrations.',
      status: 'ACCEPTED',
    },
  });

  await prisma.coursePlannerTutoringRequest.create({
    data: {
      studentId: student2.id,
      tutorId: tutor2.id,
      courseId: course2.id,
      message: 'Looking for assistance with deep learning hyperparameter optimization.',
      status: 'PENDING',
    },
  });

  // 6. Create Payments
  await prisma.coursePlannerPayment.create({
    data: {
      studentId: student1.id,
      courseId: course1.id,
      amount: 499.0,
      status: 'COMPLETED',
      paymentMethod: 'CREDIT_CARD',
      transactionId: 'TXN-9842104-SE',
      date: new Date('2026-08-01'),
    },
  });

  await prisma.coursePlannerPayment.create({
    data: {
      studentId: student2.id,
      courseId: course2.id,
      amount: 599.0,
      status: 'COMPLETED',
      paymentMethod: 'PAYPAL',
      transactionId: 'TXN-7391823-DS',
      date: new Date('2026-08-05'),
    },
  });

  console.log('✅ Seeding complete!');
  console.log('Credentials:');
  console.log('  Admin:   admin@career360.com / admin123');
  console.log('  Tutor:   tutor.john@career360.com / tutor123');
  console.log('  Student: student.alex@career360.com / student123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
