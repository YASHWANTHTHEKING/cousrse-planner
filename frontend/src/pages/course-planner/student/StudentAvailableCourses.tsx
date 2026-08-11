import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { Course } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { formatDateToDdMmmYyyy } from '../../../components/ui/DatePicker';
import { Modal } from '../../../components/ui/Modal';
import { Compass, BookOpen, DollarSign, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';

export const StudentAvailableCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Enrollment / Tutoring Request Modal State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [tutoringMessage, setTutoringMessage] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('499');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await api.getCourses({ filterScope: 'STUDENT_AVAILABLE' });
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch available courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenTutoringRequest = (course: Course) => {
    setSelectedCourse(course);
    setTutoringMessage(`Hi, I am interested in 1-on-1 tutoring sessions for ${course.name}.`);
    setFeedbackMsg('');
    setRequestModalOpen(true);
  };

  const handleSendTutoringRequest = async () => {
    if (!selectedCourse) return;
    setSubmitting(true);
    try {
      await api.createTutoringRequest(selectedCourse.id, selectedCourse.tutorId, tutoringMessage);
      setFeedbackMsg('Tutoring request submitted successfully!');
      setTimeout(() => {
        setRequestModalOpen(false);
        setFeedbackMsg('');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit tutoring request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenPayment = (course: Course) => {
    setSelectedCourse(course);
    setPaymentModalOpen(true);
    setFeedbackMsg('');
  };

  const handleProcessPayment = async () => {
    if (!selectedCourse) return;
    setSubmitting(true);
    try {
      await api.createPayment(selectedCourse.id, Number(paymentAmount) || 499);
      setFeedbackMsg('Payment successful! Course enrolled.');
      setTimeout(() => {
        setPaymentModalOpen(false);
        setFeedbackMsg('');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to process payment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Available Courses</h1>
          <p>Discover upcoming courses, enroll, and request 1-on-1 tutor support</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading available courses...</div>
      ) : courses.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          No upcoming courses available for enrollment right now. Check back soon!
        </div>
      ) : (
        <div className="grid grid-2">
          {courses.map((course) => (
            <div key={course.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
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

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>{course.name}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
                Code: {course.code || 'N/A'}
              </div>

              {/* Rendered Summary snippet */}
              <div
                className="rich-content-rendered"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  marginBottom: 16,
                  flex: 1,
                  maxHeight: 100,
                  overflow: 'hidden',
                  position: 'relative',
                }}
                dangerouslySetInnerHTML={{ __html: course.summary }}
              />

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16, borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
                📅 Starts: <strong>{formatDateToDdMmmYyyy(course.startDate)}</strong> • Ends: {formatDateToDdMmmYyyy(course.endDate)}
              </div>

              {course.tutor && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, background: 'rgba(15,23,42,0.5)', padding: 8, borderRadius: 8 }}>
                  <img
                    src={course.tutor.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                    alt={course.tutor.name}
                    style={{ width: 28, height: 28, borderRadius: '50%' }}
                  />
                  <div style={{ fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Assigned Tutor:</span> <strong>{course.tutor.name}</strong>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/course-planner/courses/${course.id}`)}
                >
                  View Details
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleOpenTutoringRequest(course)}
                >
                  <MessageSquare size={14} /> Request Tutor
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleOpenPayment(course)}
                >
                  <DollarSign size={14} /> Enroll ($499)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tutoring Request Modal */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title={`Request Tutoring - ${selectedCourse?.name}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setRequestModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSendTutoringRequest} disabled={submitting}>
              {submitting ? 'Sending...' : 'Submit Request'}
            </button>
          </>
        }
      >
        {feedbackMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: 10, borderRadius: 8, marginBottom: 16 }}>
            {feedbackMsg}
          </div>
        )}

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          Submit a request to pair with {selectedCourse?.tutor ? selectedCourse.tutor.name : 'an assigned expert tutor'} for personalized 1-on-1 guidance.
        </p>

        <div className="form-group">
          <label className="form-label">Message / Learning Goals</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={tutoringMessage}
            onChange={(e) => setTutoringMessage(e.target.value)}
          />
        </div>
      </Modal>

      {/* Payment / Enroll Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title={`Enroll & Checkout - ${selectedCourse?.name}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleProcessPayment} disabled={submitting}>
              {submitting ? 'Processing...' : 'Complete Payment ($499)'}
            </button>
          </>
        }
      >
        {feedbackMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: 10, borderRadius: 8, marginBottom: 16 }}>
            {feedbackMsg}
          </div>
        )}

        <div style={{ background: 'rgba(15,23,42,0.6)', padding: 16, borderRadius: 8, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Course Fee:</span>
            <strong>$499.00</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Access Term:</span>
            <span>Full Lifetime Access + Materials</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 8 }}>
            <strong>Total Amount:</strong>
            <strong style={{ color: 'var(--success)', fontSize: '1.1rem' }}>$499.00 USD</strong>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <select className="form-select">
            <option value="CREDIT_CARD">Credit / Debit Card (Visa, MasterCard)</option>
            <option value="PAYPAL">PayPal Instant</option>
          </select>
        </div>
      </Modal>
    </div>
  );
};
