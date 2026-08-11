import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { DashboardStats } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { formatDateToDdMmmYyyy } from '../../../components/ui/DatePicker';
import { BookOpen, Clock, CheckCircle2, DollarSign, MessageSquare, Users, FolderTree } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading dashboard statistics...</div>;
  }

  if (!stats) return <div>Failed to load dashboard data.</div>;

  const { summary, recentRequests, recentPayments } = stats;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Admin Executive Dashboard</h1>
          <p>Real-time analytics and management overview for Course Planner</p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-4" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <h3>{summary.totalCourses}</h3>
            <span>Active/Total Courses</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d' }}>
            <MessageSquare size={24} />
          </div>
          <div className="stat-info">
            <h3>{summary.pendingRequests}</h3>
            <span>Pending Requests</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>${summary.totalRevenue.toLocaleString()}</h3>
            <span>Total Revenue</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{summary.totalStudents + summary.totalTutors}</h3>
            <span>Students ({summary.totalStudents}) & Tutors ({summary.totalTutors})</span>
          </div>
        </div>
      </div>

      {/* Course Breakdown Bar */}
      <div className="card" style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Course Status Breakdown</h3>
        <div className="grid grid-3">
          <div style={{ padding: 16, background: 'rgba(15, 23, 42, 0.5)', borderRadius: 8, borderLeft: '4px solid #3b82f6' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upcoming Courses</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 4 }}>{summary.upcomingCourses}</div>
          </div>
          <div style={{ padding: 16, background: 'rgba(15, 23, 42, 0.5)', borderRadius: 8, borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ongoing Courses</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 4 }}>{summary.ongoingCourses}</div>
          </div>
          <div style={{ padding: 16, background: 'rgba(15, 23, 42, 0.5)', borderRadius: 8, borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completed Courses</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: 4 }}>{summary.completedCourses}</div>
          </div>
        </div>
      </div>

      {/* Recent Activity Grids */}
      <div className="grid grid-2">
        {/* Recent Tutoring Requests */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Tutoring Requests</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest {recentRequests.length}</span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent requests</td></tr>
                ) : (
                  recentRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <strong>{req.student?.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.student?.email}</div>
                      </td>
                      <td>{req.course?.name}</td>
                      <td><Badge status={req.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Payments</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest {recentPayments.length}</span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent payments</td></tr>
                ) : (
                  recentPayments.map((p) => (
                    <tr key={p.id}>
                      <td>{p.student?.name}</td>
                      <td>{p.course?.name}</td>
                      <td><strong style={{ color: 'var(--success)' }}>${p.amount}</strong></td>
                      <td>{formatDateToDdMmmYyyy(p.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
