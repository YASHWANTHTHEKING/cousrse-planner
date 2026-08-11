import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { StudentProfile } from '../../../types';
import { UserCheck, Save, CheckCircle } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [formData, setFormData] = useState<StudentProfile>({
    learningGoals: '',
    targetSkills: '',
    phone: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const profileData = await api.getProfile();
        if (profileData.studentProfile) {
          setFormData({
            learningGoals: profileData.studentProfile.learningGoals || '',
            targetSkills: profileData.studentProfile.targetSkills || '',
            phone: profileData.studentProfile.phone || '',
            bio: profileData.studentProfile.bio || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.updateProfile(formData);
      await refreshProfile();
      setMessage('Course Planner profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading student profile...</div>;
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <div className="page-header">
        <div className="page-title">
          <h1>My Student Profile</h1>
          <p>Course planner specific profile settings and academic goals</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border-color)', paddingBottom: 20, marginBottom: 20 }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--primary)' }}
          />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{user?.name}</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.email}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>Host User ID: {user?.id}</span>
          </div>
        </div>

        {message && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: '10px 14px', borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={18} /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Learning Goals</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Become a Senior Full-Stack Engineer within 12 months"
              value={formData.learningGoals || ''}
              onChange={(e) => setFormData({ ...formData, learningGoals: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Skills</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. React, TypeScript, Node.js, Cloud AWS"
              value={formData.targetSkills || ''}
              onChange={(e) => setFormData({ ...formData, targetSkills: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              type="text"
              className="form-input"
              placeholder="+1 (555) 000-0000"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Academic Bio / Background</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Tell tutors and admins a bit about your experience and background..."
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={18} /> {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
