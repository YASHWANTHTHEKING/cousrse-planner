export type UserRole = 'ADMIN' | 'STUDENT' | 'TUTOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentProfile?: StudentProfile;
  tutorProfile?: TutorProfile;
  _count?: {
    taughtCourses?: number;
    tutoringRequestsAsStudent?: number;
    tutoringRequestsAsTutor?: number;
    payments?: number;
  };
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  _count?: {
    courses: number;
  };
  createdAt?: string;
}

export type CourseStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export interface Course {
  id: string;
  name: string;
  code?: string;
  categoryId: string;
  category: Category;
  startDate: string;
  endDate: string;
  summary: string;
  status: CourseStatus;
  tutorId?: string;
  tutor?: User;
  topics?: Topic[];
  materials?: Material[];
  tutoringRequests?: TutoringRequest[];
  payments?: Payment[];
  _count?: {
    topics: number;
    materials: number;
    tutoringRequests: number;
    payments: number;
  };
  createdAt?: string;
}

export interface Topic {
  id: string;
  name: string;
  courseId: string;
  course?: { id: string; name: string; code?: string };
  materials?: Material[];
  createdAt?: string;
}

export interface Material {
  id: string;
  title: string;
  courseId: string;
  course?: { id: string; name: string; code?: string };
  topicId: string;
  topic?: { id: string; name: string };
  content: string;
  fileType?: string;
  order: number;
  createdAt?: string;
}

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface TutoringRequest {
  id: string;
  studentId: string;
  student: User;
  tutorId?: string;
  tutor?: User;
  courseId: string;
  course: Course;
  message?: string;
  status: RequestStatus;
  createdAt: string;
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'REFUNDED' | 'FAILED';

export interface Payment {
  id: string;
  studentId: string;
  student: User;
  courseId: string;
  course: Course;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  date: string;
}

export interface StudentProfile {
  id?: string;
  userId?: string;
  learningGoals?: string;
  targetSkills?: string;
  phone?: string;
  bio?: string;
}

export interface TutorProfile {
  id?: string;
  userId?: string;
  expertise?: string;
  qualifications?: string;
  hourlyRate?: number;
  availability?: string;
  bio?: string;
}

export interface DashboardStats {
  summary: {
    totalCourses: number;
    upcomingCourses: number;
    ongoingCourses: number;
    completedCourses: number;
    activeCourses: number;
    pendingRequests: number;
    totalRequests: number;
    totalRevenue: number;
    totalStudents: number;
    totalTutors: number;
    categoriesCount: number;
  };
  recentRequests: TutoringRequest[];
  recentPayments: Payment[];
}
