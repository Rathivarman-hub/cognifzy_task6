import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 2) return { level: score, label: 'Weak', color: 'danger' };
    if (score <= 3) return { level: score, label: 'Fair', color: 'warning' };
    return { level: score, label: 'Strong', color: 'success' };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-8 col-lg-5">
            <div className="auth-card">
              <div className="auth-card-header text-center">
                <div className="auth-icon-wrap mb-3">
                  <i className="bi bi-person-plus-fill"></i>
                </div>
                <h2 className="auth-title">Create account</h2>
                <p className="auth-subtitle">Get started for free today</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                  <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">Full name</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-person"></i></span>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                      minLength={2}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="form-control"
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                    />
                    <button type="button" className="input-group-text btn-show-pass" onClick={() => setShowPassword((p) => !p)}>
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2">
                      <div className="d-flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className={`strength-bar flex-grow-1 bg-${i <= strength.level ? strength.color : 'secondary'} opacity-${i <= strength.level ? '100' : '25'}`} />
                        ))}
                      </div>
                      <small className={`text-${strength.color}`}>{strength.label} password</small>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirm password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Repeat your password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <small className="text-danger mt-1 d-block">
                      <i className="bi bi-x-circle me-1"></i>Passwords don't match
                    </small>
                  )}
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <small className="text-success mt-1 d-block">
                      <i className="bi bi-check-circle me-1"></i>Passwords match
                    </small>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100 btn-auth" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
                  ) : (
                    <><i className="bi bi-person-check me-2"></i>Create account</>
                  )}
                </button>
              </form>

              <div className="auth-footer text-center mt-4">
                <span className="text-muted">Already have an account? </span>
                <Link to="/login" className="auth-link fw-semibold">Sign in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
