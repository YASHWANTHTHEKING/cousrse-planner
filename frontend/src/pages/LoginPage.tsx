import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight, Shield, UserCheck, BookOpen } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@career360.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/course-planner/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string, demoPass: string, defaultPath: string) => {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      navigate(defaultPath);
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a)',
        padding: 20,
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 460, padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            className="brand-logo"
            style={{ width: 56, height: 56, margin: '0 auto 16px auto', borderRadius: 16 }}
          >
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Career 360</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Course Planner Platform Module
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: '0.85rem',
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8, padding: 12 }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            Demo Accounts (One-Click Sign In)
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              className="btn btn-secondary"
              onClick={() => quickLogin('admin@career360.com', 'admin123', '/course-planner/admin/dashboard')}
              style={{ justifyContent: 'flex-start' }}
            >
              <Shield size={16} color="var(--primary)" />
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sign in as Admin</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>admin@career360.com</div>
              </div>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => quickLogin('student.alex@career360.com', 'student123', '/course-planner/student/available-courses')}
              style={{ justifyContent: 'flex-start' }}
            >
              <BookOpen size={16} color="var(--success)" />
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sign in as Student</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>student.alex@career360.com</div>
              </div>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => quickLogin('tutor.john@career360.com', 'tutor123', '/course-planner/tutor/open-courses')}
              style={{ justifyContent: 'flex-start' }}
            >
              <UserCheck size={16} color="var(--accent)" />
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sign in as Tutor</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>tutor.john@career360.com</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
