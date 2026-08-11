import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { User } from '../../../types';
import { Search, Shield, UserCheck, BookOpen, ExternalLink } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers(selectedRole, search);
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole, search]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Users & Course Profiles</h1>
          <p>View registered Students, Tutors, and Admins across Career 360</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24, padding: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ minWidth: 200 }}>
            <select
              className="form-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="STUDENT">STUDENT</option>
              <option value="TUTOR">TUTOR</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading users...</div>
        ) : users.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Role</th>
                  <th>Module Profile Summary</th>
                  <th>Activity Counts</th>
                  <th>Host Link</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={u.name}
                          style={{ width: 36, height: 36, borderRadius: '50%' }}
                        />
                        <div>
                          <strong>{u.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background:
                            u.role === 'ADMIN'
                              ? 'rgba(99, 102, 241, 0.15)'
                              : u.role === 'TUTOR'
                              ? 'rgba(139, 92, 246, 0.15)'
                              : 'rgba(16, 185, 129, 0.15)',
                          color:
                            u.role === 'ADMIN'
                              ? '#818cf8'
                              : u.role === 'TUTOR'
                              ? '#c4b5fd'
                              : '#6ee7b7',
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ maxWidth: 280 }}>
                      {u.role === 'TUTOR' ? (
                        <div style={{ fontSize: '0.8rem' }}>
                          <div><strong>Expertise:</strong> {u.tutorProfile?.expertise || 'Not specified'}</div>
                          <div><strong>Rate:</strong> ${u.tutorProfile?.hourlyRate || 0}/hr</div>
                        </div>
                      ) : u.role === 'STUDENT' ? (
                        <div style={{ fontSize: '0.8rem' }}>
                          <div><strong>Goals:</strong> {u.studentProfile?.learningGoals || 'Not specified'}</div>
                          <div><strong>Skills:</strong> {u.studentProfile?.targetSkills || 'Not specified'}</div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>System Administrator</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>
                        {u.role === 'TUTOR' && <div>Courses Taught: {u._count?.taughtCourses}</div>}
                        {u.role === 'STUDENT' && <div>Payments: {u._count?.payments}</div>}
                        <div>Tutoring Requests: {u._count?.tutoringRequestsAsStudent || u._count?.tutoringRequestsAsTutor}</div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          fontStyle: 'italic',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        Career 360 User #{u.id.slice(0, 6)} <ExternalLink size={12} />
                      </span>
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
