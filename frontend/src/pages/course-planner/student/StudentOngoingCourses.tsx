import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { Course } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { formatDateToDdMmmYyyy } from '../../../components/ui/DatePicker';
import { BookCheck, ArrowRight, FileText } from 'lucide-react';

export const StudentOngoingCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOngoing() {
      try {
        const data = await api.getCourses({ filterScope: 'STUDENT_ONGOING' });
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch ongoing courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOngoing();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Ongoing Courses</h1>
          <p>Active learning modules, course topics, and materials</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading ongoing courses...</div>
      ) : courses.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          You have no ongoing courses currently active.
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
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                📅 Term: {formatDateToDdMmmYyyy(course.startDate)} - {formatDateToDdMmmYyyy(course.endDate)}
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <div style={{ flex: 1, background: 'rgba(15,23,42,0.5)', padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Topics</div>
                  <strong style={{ fontSize: '1.1rem' }}>{course._count?.topics || 0} Modules</strong>
                </div>
                <div style={{ flex: 1, background: 'rgba(15,23,42,0.5)', padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Materials</div>
                  <strong style={{ fontSize: '1.1rem' }}>{course._count?.materials || 0} Files</strong>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => navigate(`/course-planner/courses/${course.id}`)}
              >
                Access Course Dashboard <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
