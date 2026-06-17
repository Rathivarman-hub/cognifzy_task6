import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getActivityLog } from '../services/authApi.js';

const activityIcons = {
  login: { icon: 'bi-box-arrow-in-right', color: 'text-primary' },
  profile_updated: { icon: 'bi-pencil-square', color: 'text-info' },
  password_changed: { icon: 'bi-key-fill', color: 'text-warning' },
  avatar_updated: { icon: 'bi-image', color: 'text-success' },
  password_reset: { icon: 'bi-arrow-counterclockwise', color: 'text-danger' },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [activity, setActivity] = useState([]);
  const [lastLogin, setLastLogin] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    getActivityLog()
      .then(({ data }) => {
        setActivity(data.activityLog);
        setLastLogin(data.lastLogin);
      })
      .catch(() => {})
      .finally(() => setLoadingActivity(false));
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="dashboard-page">
      <div className="container py-4">

        {/* Welcome Banner */}
        <div className="welcome-banner mb-4">
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div>
              {user?.avatar ? (
                <img
                  src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${user.avatar}`}
                  alt={user.name}
                  className="avatar-lg"
                />
              ) : (
                <div className="avatar-placeholder-lg">{getInitials(user?.name)}</div>
              )}
            </div>
            <div>
              <h2 className="welcome-title mb-1">
                Hello, {user?.name?.split(' ')[0]} 👋
              </h2>
              <p className="text-muted mb-0">{user?.email}</p>
              {lastLogin && (
                <small className="text-muted">
                  <i className="bi bi-clock me-1"></i>Last login: {formatDate(lastLogin)}
                </small>
              )}
            </div>
            <div className="ms-auto">
              <Link to="/profile" className="btn btn-primary">
                <i className="bi bi-pencil me-2"></i>Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          {[
            { icon: 'bi-person-check-fill', label: 'Account Status', value: 'Active', color: 'success' },
            { icon: 'bi-shield-fill-check', label: 'Role', value: user?.role === 'admin' ? 'Administrator' : 'User', color: user?.role === 'admin' ? 'warning' : 'primary' },
            { icon: 'bi-envelope-check-fill', label: 'Email Verified', value: user?.isEmailVerified ? 'Verified' : 'Not Verified', color: user?.isEmailVerified ? 'success' : 'danger' },
            { icon: 'bi-calendar-check', label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—', color: 'info' },
          ].map((stat, i) => (
            <div key={i} className="col-6 col-lg-3">
              <div className="stat-card">
                <div className={`stat-icon text-${stat.color}`}>
                  <i className={`bi ${stat.icon}`}></i>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Quick Actions */}
          <div className="col-lg-4">
            <div className="dash-card h-100">
              <h6 className="dash-card-title mb-3">
                <i className="bi bi-grid me-2"></i>Quick Actions
              </h6>
              <div className="d-grid gap-2">
                <Link to="/profile" className="btn btn-outline-primary text-start">
                  <i className="bi bi-person-circle me-2"></i>View & Edit Profile
                </Link>
                <Link to="/profile?tab=password" className="btn btn-outline-secondary text-start">
                  <i className="bi bi-key me-2"></i>Change Password
                </Link>
                <Link to="/profile?tab=avatar" className="btn btn-outline-secondary text-start">
                  <i className="bi bi-image me-2"></i>Update Avatar
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn btn-outline-warning text-start">
                    <i className="bi bi-people-fill me-2"></i>Manage Users
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="col-lg-4">
            <div className="dash-card h-100">
              <h6 className="dash-card-title mb-3">
                <i className="bi bi-info-circle me-2"></i>Account Info
              </h6>
              <ul className="info-list">
                <li>
                  <span className="info-label"><i className="bi bi-person me-2"></i>Name</span>
                  <span className="info-value">{user?.name}</span>
                </li>
                <li>
                  <span className="info-label"><i className="bi bi-envelope me-2"></i>Email</span>
                  <span className="info-value text-truncate">{user?.email}</span>
                </li>
                <li>
                  <span className="info-label"><i className="bi bi-shield me-2"></i>Role</span>
                  <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                    {user?.role}
                  </span>
                </li>
                <li>
                  <span className="info-label"><i className="bi bi-calendar me-2"></i>Joined</span>
                  <span className="info-value">{user?.createdAt ? formatDate(user.createdAt) : '—'}</span>
                </li>
                <li>
                  <span className="info-label"><i className="bi bi-envelope-check me-2"></i>Verified</span>
                  <span className={`badge ${user?.isEmailVerified ? 'badge-verified' : 'badge-unverified'}`}>
                    {user?.isEmailVerified ? 'Yes' : 'No'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Activity Log */}
          <div className="col-lg-4">
            <div className="dash-card h-100">
              <h6 className="dash-card-title mb-3">
                <i className="bi bi-activity me-2"></i>Recent Activity
              </h6>
              {loadingActivity ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-primary" />
                </div>
              ) : activity.length === 0 ? (
                <p className="text-muted small text-center py-3">No activity recorded yet</p>
              ) : (
                <ul className="activity-list">
                  {activity.slice(0, 8).map((item, i) => {
                    const meta = activityIcons[item.action] || { icon: 'bi-dot', color: 'text-muted' };
                    return (
                      <li key={i} className="activity-item">
                        <i className={`bi ${meta.icon} ${meta.color} me-2`}></i>
                        <div>
                          <div className="activity-action">
                            {item.action.replace(/_/g, ' ')}
                          </div>
                          <div className="activity-time">
                            {formatDate(item.timestamp)}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
