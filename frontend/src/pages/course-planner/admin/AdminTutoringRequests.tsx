import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { TutoringRequest, User } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { formatDateToDdMmmYyyy } from '../../../components/ui/DatePicker';
import { MessageSquare, CheckCircle, XCircle, UserCheck } from 'lucide-react';

export const AdminTutoringRequests: React.FC = () => {
  const [requests, setRequests] = useState<TutoringRequest[]>([]);
  const [tutors, setTutors] = useState<User[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('PENDING');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqs, tuts] = await Promise.all([
        api.getTutoringRequests(filterStatus),
        api.getUsers('TUTOR'),
      ]);
      setRequests(reqs);
      setTutors(tuts);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const handleUpdateStatus = async (id: string, newStatus: string, tutorId?: string) => {
    try {
      await api.updateTutoringRequestStatus(id, newStatus, tutorId);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update request status.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Tutoring Requests</h1>
          <p>Review student 1-on-1 tutoring inquiries and assign expert tutors</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button
          className={`btn ${filterStatus === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterStatus('PENDING')}
        >
          Pending Requests
        </button>
        <button
          className={`btn ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterStatus('ALL')}
        >
          All Requests
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading tutoring requests...</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            No requests found matching your filter.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Message / Notes</th>
                  <th>Assigned Tutor</th>
                  <th>Requested Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.student?.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.student?.email}</div>
                    </td>
                    <td>{req.course?.name}</td>
                    <td style={{ maxWidth: 220 }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {req.message || 'No custom message.'}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '2px 6px', fontSize: '0.8rem', width: 'auto' }}
                        value={req.tutorId || ''}
                        onChange={(e) => handleUpdateStatus(req.id, req.status, e.target.value)}
                      >
                        <option value="">-- Unassigned --</option>
                        {tutors.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{formatDateToDdMmmYyyy(req.createdAt)}</td>
                    <td>
                      <Badge status={req.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ background: 'var(--success)' }}
                          onClick={() => handleUpdateStatus(req.id, 'ACCEPTED', req.tutorId)}
                          title="Accept Request"
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                          title="Reject Request"
                        >
                          <XCircle size={14} /> Reject
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
    </div>
  );
};
