import { useState, useEffect } from 'react';
import { getAllUsers } from '../services/authApi.js';
import UserCard from '../components/UserCard.jsx';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const fetchUsers = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await getAllUsers(p);
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setPage(p);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u._id !== id));
    setTotal((prev) => prev - 1);
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-0">
              <i className="bi bi-people-fill me-2 text-primary"></i>User Management
            </h4>
            <p className="text-muted small mb-0">{total} total users registered</p>
          </div>
          <div className="admin-search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Users', value: total, icon: 'bi-people', color: 'primary' },
            { label: 'Admins', value: users.filter((u) => u.role === 'admin').length, icon: 'bi-shield-fill', color: 'warning' },
            { label: 'Verified', value: users.filter((u) => u.isEmailVerified).length, icon: 'bi-envelope-check', color: 'success' },
            { label: 'This Page', value: users.length, icon: 'bi-card-list', color: 'info' },
          ].map((s, i) => (
            <div key={i} className="col-6 col-lg-3">
              <div className="stat-card">
                <div className={`stat-icon text-${s.color}`}><i className={`bi ${s.icon}`}></i></div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table header */}
        <div className="dash-card">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="dash-card-title mb-0">
              <i className="bi bi-list-ul me-2"></i>All Users
            </h6>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => fetchUsers(page)}>
              <i className="bi bi-arrow-clockwise me-1"></i>Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="text-muted mt-3">Loading users...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people display-4 text-muted"></i>
              <p className="text-muted mt-2">No users found</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {filtered.map((u) => (
                <UserCard key={u._id} user={u} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => fetchUsers(page - 1)}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => fetchUsers(p)}>{p}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => fetchUsers(page + 1)}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
