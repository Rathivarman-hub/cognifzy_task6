import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);

  const togglerRef = useRef(null);
  const navbarCollapseRef = useRef(null);

  const closeNavbar = () => {
    if (navbarCollapseRef.current && navbarCollapseRef.current.classList.contains('show')) {
      togglerRef.current?.click();
    }
  };

  // Close on route change
  useEffect(() => {
    closeNavbar();
  }, [location.pathname]);

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => closeNavbar();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  const getAvatarInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <nav className="navbar navbar-expand-lg app-navbar sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div className="brand-icon">
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <span className="brand-name">AuthFlow</span>
        </Link>

        <button
          ref={togglerRef}
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-4"></i>
        </button>

        <div ref={navbarCollapseRef} className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" end>
                <i className="bi bi-house-door me-1"></i> Home
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink to="/dashboard" className="nav-link">
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </NavLink>
              </li>
            )}
            {user?.role === 'admin' && (
              <li className="nav-item">
                <NavLink to="/admin" className="nav-link">
                  <i className="bi bi-people-fill me-1"></i> Admin
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0 pb-3 pb-lg-0">
            <ThemeToggle />

            {user ? (
              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center gap-2 user-menu-btn"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.avatar ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${user.avatar}`}
                      alt={user.name}
                      className="avatar-sm"
                    />
                  ) : (
                    <div className="avatar-placeholder-sm">
                      {getAvatarInitials(user.name)}
                    </div>
                  )}
                  <span className="d-none d-md-inline fw-medium">{user.name?.split(' ')[0]}</span>
                  <i className="bi bi-chevron-down small"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-lg-end app-dropdown">
                  <li className="px-3 py-2">
                    <div className="fw-semibold">{user.name}</div>
                    <div className="small text-muted">{user.email}</div>
                    <span className={`badge mt-1 ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {user.role}
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      <i className="bi bi-person-circle me-2"></i> Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="dropdown-item">
                      <i className="bi bi-speedometer2 me-2"></i> Dashboard
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout} disabled={loggingOut}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      {loggingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary btn-sm">Sign in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
