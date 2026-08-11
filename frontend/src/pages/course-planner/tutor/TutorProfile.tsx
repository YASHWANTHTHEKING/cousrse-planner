import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { TutorProfile } from '../../../types';
import { Save, CheckCircle } from 'lucide-react';

export const TutorProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [formData, setFormData] = useState<TutorProfile>({
    expertise: '',
    qualifications: '',
    hourlyRate: 65,
    availability: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const profileData = await api.getProfile();
        if (profileData.tutorProfile) {
          setFormData({
            expertise: profileData.tutorProfile.expertise || '',
            qualifications: profileData.tutorProfile.qualifications || '',
            hourlyRate: profileData.tutorProfile.hourlyRate || 65,
            availability: profileData.tutorProfile.availability || '',
            bio: profileData.tutorProfile.bio || '',
          });
        }
      } catch (err) {
        console.error('Failed to load tutor profile:', err);
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
      setMessage('Tutor profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update tutor profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading tutor profile...</div>;
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <div className="page-header">
        <div className="page-title">
          <h1>My Tutor Profile</h1>
          <p>Course planner specific tutor credentials and availability</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border-color)', paddingBottom: 20, marginBottom: 20 }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--accent)' }}
          />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{user?.name}</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.email}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>Host User ID: {user?.id}</span>
          </div>
        </div>

        {message && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: '10px 14px', borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={18} /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Areas of Expertise</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Full-Stack Engineering, React, Node.js, Cloud AWS"
              value={formData.expertise || ''}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Academic Qualifications</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ph.D. in Computer Science"
                value={formData.qualifications || ''}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hourly Rate ($ USD)</label>
              <input
                type="number"
                className="form-input"
                placeholder="65.00"
                value={formData.hourlyRate || ''}
                onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">General Availability / Hours</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Mon - Thu, 4:00 PM - 8:00 PM EST"
              value={formData.availability || ''}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Professional Bio</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Share your industry experience, teaching philosophy, and background..."
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={18} /> {saving ? 'Saving Profile...' : 'Save Tutor Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};
