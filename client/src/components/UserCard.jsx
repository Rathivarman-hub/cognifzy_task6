import { useState } from 'react';
import { deleteUser } from '../services/authApi.js';

const UserCard = ({ user, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteUser(user._id);
      onDelete(user._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
      setDeleting(false);
    }
  };

  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="user-card">
      <div className="d-flex align-items-center gap-3">
        {user.avatar ? (
          <img
            src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${user.avatar}`}
            alt={user.name}
            className="avatar-md"
          />
        ) : (
          <div className="avatar-placeholder-md">{getInitials(user.name)}</div>
        )}
        <div className="flex-grow-1 min-w-0">
          <div className="fw-semibold text-truncate">{user.name}</div>
          <div className="small text-muted text-truncate">{user.email}</div>
          <div className="d-flex align-items-center gap-2 mt-1">
            <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
              {user.role}
            </span>
            <span className={`badge ${user.isEmailVerified ? 'badge-verified' : 'badge-unverified'}`}>
              {user.isEmailVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        </div>
        <div className="text-end flex-shrink-0">
          <div className="small text-muted mb-2">{formatDate(user.createdAt)}</div>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              <i className="bi bi-trash3"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
