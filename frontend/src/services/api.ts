import {
  User,
  Category,
  Course,
  Topic,
  Material,
  TutoringRequest,
  Payment,
  DashboardStats,
} from '../types';

const defaultBackendUrl = 'https://cousrse-planner.onrender.com/api';
const rawApiBase = (import.meta as any).env?.VITE_API_BASE || defaultBackendUrl;
const cleanBase = rawApiBase.trim().replace(/\/+$/, '');
const API_BASE = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;

function getAuthHeaders() {
  const token = localStorage.getItem('career360_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorData.message || `API error (${res.status})`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  switchRole: async (role: 'ADMIN' | 'STUDENT' | 'TUTOR') => {
    const res = await fetch(`${API_BASE}/auth/switch-role`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleResponse(res);
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${API_BASE}/course-planner/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${API_BASE}/course-planner/categories`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createCategory: async (name: string, description?: string): Promise<Category> => {
    const res = await fetch(`${API_BASE}/course-planner/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, description }),
    });
    return handleResponse(res);
  },

  updateCategory: async (id: string, name: string, description?: string): Promise<Category> => {
    const res = await fetch(`${API_BASE}/course-planner/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, description }),
    });
    return handleResponse(res);
  },

  deleteCategory: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/course-planner/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Courses
  getCourses: async (params?: {
    status?: string;
    categoryId?: string;
    search?: string;
    filterScope?: string;
  }): Promise<Course[]> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    if (params?.search) query.append('search', params.search);
    if (params?.filterScope) query.append('filterScope', params.filterScope);

    const res = await fetch(`${API_BASE}/course-planner/courses?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getCourseById: async (id: string): Promise<Course> => {
    const res = await fetch(`${API_BASE}/course-planner/courses/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    const res = await fetch(`${API_BASE}/course-planner/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    });
    return handleResponse(res);
  },

  updateCourse: async (id: string, courseData: Partial<Course> & { claimAsTutor?: boolean }): Promise<Course> => {
    const res = await fetch(`${API_BASE}/course-planner/courses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    });
    return handleResponse(res);
  },

  deleteCourse: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/course-planner/courses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Topics
  getTopics: async (courseId?: string): Promise<Topic[]> => {
    const query = courseId ? `?courseId=${courseId}` : '';
    const res = await fetch(`${API_BASE}/course-planner/topics${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createTopic: async (name: string, courseId: string): Promise<Topic> => {
    const res = await fetch(`${API_BASE}/course-planner/topics`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, courseId }),
    });
    return handleResponse(res);
  },

  deleteTopic: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/course-planner/topics/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Materials
  getMaterials: async (courseId?: string, topicId?: string): Promise<Material[]> => {
    const query = new URLSearchParams();
    if (courseId) query.append('courseId', courseId);
    if (topicId) query.append('topicId', topicId);

    const res = await fetch(`${API_BASE}/course-planner/materials?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createMaterial: async (materialData: {
    title: string;
    courseId: string;
    topicId: string;
    content: string;
    fileType?: string;
    order?: number;
  }): Promise<Material> => {
    const res = await fetch(`${API_BASE}/course-planner/materials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(materialData),
    });
    return handleResponse(res);
  },

  updateMaterial: async (id: string, materialData: Partial<Material>): Promise<Material> => {
    const res = await fetch(`${API_BASE}/course-planner/materials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(materialData),
    });
    return handleResponse(res);
  },

  deleteMaterial: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/course-planner/materials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Tutoring Requests
  getTutoringRequests: async (status?: string, courseId?: string): Promise<TutoringRequest[]> => {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    if (courseId) query.append('courseId', courseId);

    const res = await fetch(`${API_BASE}/course-planner/tutoring-requests?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createTutoringRequest: async (courseId: string, tutorId?: string, message?: string): Promise<TutoringRequest> => {
    const res = await fetch(`${API_BASE}/course-planner/tutoring-requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ courseId, tutorId, message }),
    });
    return handleResponse(res);
  },

  updateTutoringRequestStatus: async (id: string, status: string, tutorId?: string): Promise<TutoringRequest> => {
    const res = await fetch(`${API_BASE}/course-planner/tutoring-requests/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, tutorId }),
    });
    return handleResponse(res);
  },

  // Payments
  getPayments: async (): Promise<Payment[]> => {
    const res = await fetch(`${API_BASE}/course-planner/payments`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createPayment: async (courseId: string, amount: number, paymentMethod?: string): Promise<Payment> => {
    const res = await fetch(`${API_BASE}/course-planner/payments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ courseId, amount, paymentMethod }),
    });
    return handleResponse(res);
  },

  updatePaymentStatus: async (id: string, status: string): Promise<Payment> => {
    const res = await fetch(`${API_BASE}/course-planner/payments/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  // Profile
  getProfile: async (): Promise<User> => {
    const res = await fetch(`${API_BASE}/course-planner/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateProfile: async (profileData: any): Promise<any> => {
    const res = await fetch(`${API_BASE}/course-planner/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },

  // Users (Admin)
  getUsers: async (role?: string, search?: string): Promise<User[]> => {
    const query = new URLSearchParams();
    if (role) query.append('role', role);
    if (search) query.append('search', search);

    const res = await fetch(`${API_BASE}/course-planner/users?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
