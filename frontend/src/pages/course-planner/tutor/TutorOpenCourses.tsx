import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Course } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { formatDateToDdMmmYyyy } from '../../../components/ui/DatePicker';
import { Compass, UserCheck, ArrowRight } from 'lucide-react';

export const TutorOpenCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const fetchOpenCourses = async () => {
    setLoading(true);
    try {
      const data = await api.getCourses({ filterScope: 'OPEN_FOR_TUTOR' });
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch open courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenCourses();
  }, []);

  const handleClaimCourse = async (courseId: string) => {
    if (!confirm('Do you want to claim and assign yourself as the instructor for this course?')) return;
    setClaimingId(courseId);
    try {
      await api.updateCourse(courseId, { claimAsTutor: true });
      fetchOpenCourses();
    } catch (err: any) {
      alert(err.message || 'Failed to claim course.');
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Open Courses</h1>
          <p>Explore courses awaiting a tutor assignment and claim opportunities to teach</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading open courses...</div>
      ) : courses.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          There are currently no open unassigned courses. Check back later!
        </div>
      ) : (
        <div className="grid grid-2">
          {courses.map((course) => (
            <div key={course.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
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

              <div
                className="rich-content-rendered"
                style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 16, flex: 1 }}
                dangerouslySetInnerHTML={{ __html: course.summary }}
              />

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 18, borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
                📅 Schedule: {formatDateToDdMmmYyyy(course.startDate)} to {formatDateToDdMmmYyyy(course.endDate)}
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={() => handleClaimCourse(course.id)}
                disabled={claimingId === course.id}
              >
                <UserCheck size={18} /> {claimingId === course.id ? 'Claiming...' : 'Claim & Teach This Course'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
