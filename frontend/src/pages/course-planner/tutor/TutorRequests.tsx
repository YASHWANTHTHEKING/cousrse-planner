import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { TutoringRequest } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { formatDateToDdMmmYyyy } from '../../../components/ui/DatePicker';
import { MessageSquare, CheckCircle, XCircle } from 'lucide-react';

export const TutorRequests: React.FC = () => {
  const [requests, setRequests] = useState<TutoringRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getTutoringRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch tutor requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateTutoringRequestStatus(id, newStatus);
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to update request status.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Direct Tutoring Requests</h1>
          <p>Student requests directed to you or for your assigned courses</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading tutoring requests...</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            No tutoring requests directed to you at this time.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Student Message</th>
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
                    <td style={{ maxWidth: 260 }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {req.message || 'No custom message.'}
                      </span>
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
                          onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}
                          disabled={req.status === 'ACCEPTED'}
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                          disabled={req.status === 'REJECTED'}
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
