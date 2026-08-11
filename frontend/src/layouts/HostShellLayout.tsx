import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  FileText,
  CreditCard,
  MessageSquare,
  Users,
  Search,
  BookCheck,
  UserCheck,
  Compass,
  LogOut,
  Menu,
  X,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const HostShellLayout: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleChange = async (role: UserRole) => {
    await switchRole(role);
  };

  const currentRole = user?.role || 'STUDENT';

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <GraduationCap size={24} />
          </div>
          <div className="brand-info">
            <h2>Career 360</h2>
            <span>Course Planner</span>
          </div>
        </div>

        <div className="sidebar-nav">
          {/* Host App Core Section */}
          <div>
            <div className="nav-group-title">Career 360 Host</div>
            <ul className="nav-links">
              <li>
                <div className="nav-link" style={{ opacity: 0.6, cursor: 'default' }}>
                  <Layers size={18} />
                  Host Platform Shell
                </div>
              </li>
            </ul>
          </div>

          {/* Course Planner Module Section */}
          <div>
            <div className="nav-group-title">Course Planner ({currentRole})</div>
            <ul className="nav-links">
              {currentRole === 'ADMIN' && (
                <>
                  <li>
                    <NavLink
                      to="/course-planner/admin/dashboard"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/admin/courses"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <BookOpen size={18} />
                      Courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/admin/materials"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <FileText size={18} />
                      Course Materials
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/admin/categories"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <FolderTree size={18} />
                      Course Categories
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/admin/payments"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <CreditCard size={18} />
                      Course Payments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/admin/requests"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <MessageSquare size={18} />
                      Tutoring Requests
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/admin/users"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Users size={18} />
                      Users
                    </NavLink>
                  </li>
                </>
              )}

              {currentRole === 'STUDENT' && (
                <>
                  <li>
                    <NavLink
                      to="/course-planner/student/available-courses"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Compass size={18} />
                      Available Courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/student/ongoing-courses"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <BookCheck size={18} />
                      Ongoing Courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/student/all-courses"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <BookOpen size={18} />
                      All Courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/student/payments"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <CreditCard size={18} />
                      My Payments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/student/profile"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <UserCheck size={18} />
                      My Profile
                    </NavLink>
                  </li>
                </>
              )}

              {currentRole === 'TUTOR' && (
                <>
                  <li>
                    <NavLink
                      to="/course-planner/tutor/open-courses"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Compass size={18} />
                      Open Courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/tutor/requests"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <MessageSquare size={18} />
                      Tutoring Requests
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/tutor/my-courses"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <BookOpen size={18} />
                      My Courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/course-planner/tutor/profile"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <UserCheck size={18} />
                      My Profile
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="main-content">
        {/* Top Navbar */}
        <header className="top-navbar">
          <button className="mobile-menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Fast Role Switcher */}
          <div className="role-switcher-bar">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 4 }}>
              Active View:
            </span>
            <button
              className={`role-btn ${currentRole === 'ADMIN' ? 'active' : ''}`}
              onClick={() => handleRoleChange('ADMIN')}
            >
              Admin
            </button>
            <button
              className={`role-btn ${currentRole === 'STUDENT' ? 'active' : ''}`}
              onClick={() => handleRoleChange('STUDENT')}
            >
              Student
            </button>
            <button
              className={`role-btn ${currentRole === 'TUTOR' ? 'active' : ''}`}
              onClick={() => handleRoleChange('TUTOR')}
            >
              Tutor
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="user-profile-pill">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              className="user-avatar"
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <strong style={{ fontSize: '0.85rem' }}>{user?.name}</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>{user?.role}</span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
              title="Logout"
              style={{ marginLeft: 8 }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* Dynamic Route Pages */}
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
