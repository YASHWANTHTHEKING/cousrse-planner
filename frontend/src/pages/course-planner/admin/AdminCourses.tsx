import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { Course, Category, User } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { DatePicker, formatDateToDdMmmYyyy } from '../../../components/ui/DatePicker';
import { RichTextEditor } from '../../../components/ui/RichTextEditor';
import { Plus, Search, Filter, Edit, Trash2, Eye, UserPlus, BookOpen } from 'lucide-react';

export const AdminCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tutors, setTutors] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'ONGOING' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Add/Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    categoryId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    summary: '<p>Comprehensive course summary and learning outcomes.</p>',
    status: 'UPCOMING',
    tutorId: '',
  });

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await api.getCourses({
        status: activeTab,
        categoryId: selectedCategory,
        search,
      });
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const [cats, tuts] = await Promise.all([
          api.getCategories(),
          api.getUsers('TUTOR'),
        ]);
        setCategories(cats);
        setTutors(tuts);
        if (cats.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
        }
      } catch (err) {
        console.error('Failed to load metadata:', err);
      }
    }
    init();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [activeTab, selectedCategory, search]);

  const handleOpenAddModal = () => {
    setEditingCourseId(null);
    setFormData({
      name: '',
      code: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      summary: '<p>Comprehensive course summary and learning outcomes.</p>',
      status: 'UPCOMING',
      tutorId: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourseId(course.id);
    setFormData({
      name: course.name,
      code: course.code || '',
      categoryId: course.categoryId,
      startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : '',
      endDate: course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : '',
      summary: course.summary,
      status: course.status,
      tutorId: course.tutorId || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name.trim()) {
      setFormError('Course Name is required.');
      return;
    }
    if (!formData.categoryId) {
      setFormError('Category is required.');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setFormError('Start and End dates are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        status: formData.status as any,
      };
      if (editingCourseId) {
        await api.updateCourse(editingCourseId, payload);
      } else {
        await api.createCourse(payload);
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save course.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.deleteCourse(id);
      fetchCourses();
    } catch (err: any) {
      alert(err.message || 'Failed to delete course.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Course Management</h1>
          <p>Create, filter, and assign tutors to courses</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add Course
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
        {(['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'] as const).map((tab) => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab)}
            style={{ borderRadius: '20px 20px 0 0', textTransform: 'capitalize' }}
          >
            {tab === 'ALL' ? 'All Courses' : tab.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: 24, padding: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search by course name, code, or summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ minWidth: 200 }}>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Table / Cards */}
      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading courses...</div>
        ) : courses.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            No courses found matching your criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Course Code & Name</th>
                  <th>Category</th>
                  <th>Duration (dd-MMM-yyyy)</th>
                  <th>Status</th>
                  <th>Assigned Tutor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{course.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        {course.code || 'NO-CODE'}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {course.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                        {formatDateToDdMmmYyyy(course.startDate)} - {formatDateToDdMmmYyyy(course.endDate)}
                      </div>
                    </td>
                    <td>
                      <Badge status={course.status} />
                    </td>
                    <td>
                      {course.tutor ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img
                            src={course.tutor.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                            alt={course.tutor.name}
                            style={{ width: 24, height: 24, borderRadius: '50%' }}
                          />
                          <span style={{ fontSize: '0.85rem' }}>{course.tutor.name}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontStyle: 'italic' }}>
                          Unassigned (Open)
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/course-planner/courses/${course.id}`)}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEditModal(course)}
                          title="Edit Course"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCourse(course.id)}
                          title="Delete Course"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourseId ? 'Edit Course' : 'Add New Course'}
        maxWidth="750px"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleFormSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : editingCourseId ? 'Update Course' : 'Create Course'}
            </button>
          </>
        }
      >
        {formError && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: '0.85rem',
              marginBottom: 18,
            }}
          >
            {formError}
          </div>
        )}

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">
              Course Name <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Full-Stack Web Development Mastery"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Course Code</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CS-101"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">
              Category <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <select
              className="form-select"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Course Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="UPCOMING">UPCOMING</option>
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        </div>

        <div className="grid grid-2">
          <DatePicker
            label="Start Date"
            required
            value={formData.startDate}
            onChange={(iso) => setFormData({ ...formData, startDate: iso })}
          />

          <DatePicker
            label="End Date"
            required
            value={formData.endDate}
            onChange={(iso) => setFormData({ ...formData, endDate: iso })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Assign Tutor (Optional)</label>
          <select
            className="form-select"
            value={formData.tutorId}
            onChange={(e) => setFormData({ ...formData, tutorId: e.target.value })}
          >
            <option value="">-- No Tutor (Open Course) --</option>
            {tutors.map((tut) => (
              <option key={tut.id} value={tut.id}>
                {tut.name} ({tut.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Course Summary (Rich Text)</label>
          <RichTextEditor
            value={formData.summary}
            onChange={(html) => setFormData({ ...formData, summary: html })}
            placeholder="Write detailed course overview, syllabus, prerequisites..."
          />
        </div>
      </Modal>
    </div>
  );
};
