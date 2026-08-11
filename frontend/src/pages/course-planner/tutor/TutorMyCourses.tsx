import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { Course } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { formatDateToDdMmmYyyy } from '../../../components/ui/DatePicker';
import { BookOpen, ArrowRight, FolderPlus, FilePlus } from 'lucide-react';

export const TutorMyCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyCourses() {
      try {
        const data = await api.getCourses({ filterScope: 'MY_TUTORED_COURSES' });
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch tutor courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMyCourses();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>My Assigned Courses</h1>
          <p>Courses assigned to you as instructor or tutor</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading assigned courses...</div>
      ) : courses.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          You have not been assigned to any courses yet. Check "Open Courses" to claim available teaching slots!
        </div>
      ) : (
        <div className="grid grid-2">
          {courses.map((course) => (
            <div key={course.id} className="card card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span
                  style={{
                    background: 'var(--primary-light)',
                    color: '#a5b4fc',
                    padding: '2px 10px',
                    borderRadius: 12,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {course.category?.name}
                </span>
                <Badge status={course.status} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>{course.name}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
                Code: {course.code || 'N/A'}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 18 }}>
                📅 Schedule: {formatDateToDdMmmYyyy(course.startDate)} - {formatDateToDdMmmYyyy(course.endDate)}
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <div style={{ flex: 1, background: 'rgba(15,23,42,0.5)', padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Topics</div>
                  <strong style={{ fontSize: '1.1rem' }}>{course._count?.topics || 0} Topics</strong>
                </div>
                <div style={{ flex: 1, background: 'rgba(15,23,42,0.5)', padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Materials</div>
                  <strong style={{ fontSize: '1.1rem' }}>{course._count?.materials || 0} Materials</strong>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => navigate(`/course-planner/courses/${course.id}`)}
              >
                Manage Topics & Materials <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
