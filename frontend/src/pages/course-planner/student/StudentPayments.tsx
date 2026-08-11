import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Payment } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { formatDateToDdMmmYyyy } from '../../../components/ui/DatePicker';
import { CreditCard, CheckCircle } from 'lucide-react';

export const StudentPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const data = await api.getPayments();
        setPayments(data);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>My Payments</h1>
          <p>Personal payment history, receipts, and course access status</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading payments...</div>
        ) : payments.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            No payments on record yet. Enroll in an available course to see payment receipts here!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Course Name</th>
                  <th>Amount Paid</th>
                  <th>Payment Method</th>
                  <th>Date (dd-MMM-yyyy)</th>
                  <th>Status</th>
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
                      <strong>{p.course?.name}</strong>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--success)' }}>${p.amount}</strong>
                    </td>
                    <td>{p.paymentMethod}</td>
                    <td>{formatDateToDdMmmYyyy(p.date)}</td>
                    <td>
                      <Badge status={p.status} />
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
