import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Course, Topic, Material } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { formatDateToDdMmmYyyy } from '../../components/ui/DatePicker';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, BookOpen, Folder, FileText, ExternalLink, Calendar, UserCheck, CheckCircle } from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      try {
        const data = await api.getCourseById(id);
        setCourse(data);
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading course details...</div>;
  }

  if (!course) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Course not found</h2>
        <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <button
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: 20 }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={14} /> Back to Courses
      </button>

      {/* Course Header Banner */}
      <div className="card" style={{ marginBottom: 28, background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <div>
            <span
              style={{
                background: 'var(--primary-light)',
                color: '#a5b4fc',
                padding: '4px 12px',
                borderRadius: 14,
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: 8,
                display: 'inline-block',
              }}
            >
              {course.category?.name}
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: 4 }}>{course.name}</h1>
            <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
              Code: {course.code || 'UNCODED'}
            </div>
          </div>
          <Badge status={course.status} />
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
            <Calendar size={18} color="var(--primary)" />
            <span>
              <strong>Term:</strong> {formatDateToDdMmmYyyy(course.startDate)} - {formatDateToDdMmmYyyy(course.endDate)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
            <UserCheck size={18} color="var(--accent)" />
            <span>
              <strong>Instructor:</strong> {course.tutor ? course.tutor.name : 'Unassigned (Open)'}
            </span>
          </div>
        </div>
      </div>

      {/* Course Summary & Description */}
      <div className="card" style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
          Course Overview & Syllabus
        </h3>
        <div
          className="rich-content-rendered"
          dangerouslySetInnerHTML={{ __html: course.summary || '<p>No summary provided for this course.</p>' }}
        />
      </div>

      {/* Topics & Course Materials */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Learning Modules & Materials</h3>

        {(!course.topics || course.topics.length === 0) ? (
          <div style={{ padding: 20, color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No topics or materials published yet for this course.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {course.topics.map((topic: Topic, idx: number) => (
              <div
                key={topic.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <Folder size={20} color="var(--primary)" />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    Module {idx + 1}: {topic.name}
                  </h4>
                </div>

                {(!topic.materials || topic.materials.length === 0) ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: 30 }}>
                    No material resources added to this module yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 10 }}>
                    {topic.materials.map((mat: Material) => (
                      <div
                        key={mat.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(30, 41, 59, 0.7)',
                          padding: '10px 16px',
                          borderRadius: 8,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <FileText size={16} color="var(--accent)" />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{mat.title}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type: {mat.fileType}</span>
                          </div>
                        </div>

                        {mat.content && (
                          <a
                            href={mat.content.startsWith('http') ? mat.content : '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                          >
                            Open Resource <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
