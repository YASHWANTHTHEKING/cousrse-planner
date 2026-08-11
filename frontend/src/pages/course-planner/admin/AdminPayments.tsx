import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Payment } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { formatDateToDdMmmYyyy } from '../../../components/ui/DatePicker';
import { CreditCard, DollarSign, RefreshCw } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await api.getPayments();
      setPayments(data);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.updatePaymentStatus(id, newStatus);
      fetchPayments();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const totalAmount = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Course Payments</h1>
          <p>Financial ledger, completed payments, and refund controls</p>
        </div>
        <div className="stat-card" style={{ padding: '8px 16px' }}>
          <DollarSign size={20} color="var(--success)" />
          <div className="stat-info">
            <h3 style={{ fontSize: '1.2rem' }}>${totalAmount.toLocaleString()}</h3>
            <span style={{ fontSize: '0.75rem' }}>Total Processed</span>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading payments...</div>
        ) : payments.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No payment records found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)' }}>
                        {p.transactionId || p.id.slice(0, 8)}
                      </span>
                    </td>
                    <td>
                      <strong>{p.student?.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.student?.email}</div>
                    </td>
                    <td>{p.course?.name}</td>
                    <td>
                      <strong style={{ color: 'var(--success)' }}>${p.amount}</strong>
                    </td>
                    <td>{p.paymentMethod}</td>
                    <td>{formatDateToDdMmmYyyy(p.date)}</td>
                    <td>
                      <Badge status={p.status} />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '2px 6px', fontSize: '0.8rem', width: 'auto' }}
                        value={p.status}
                        onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                      >
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="REFUNDED">REFUNDED</option>
                        <option value="FAILED">FAILED</option>
                      </select>
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
