import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authApi.js';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setMessage({ type: 'danger', text: 'Passwords do not match' });
    }
    setLoading(true);
    setMessage(null);
    try {
      await resetPassword(token, form.password);
      setMessage({ type: 'success', text: 'Password reset successfully! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Reset failed. Link may have expired.' });
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
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <h2 className="auth-title">New password</h2>
                <p className="auth-subtitle">Choose a strong password for your account</p>
              </div>

              {message && (
                <div className={`alert alert-${message.type} d-flex align-items-center gap-2`}>
                  <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} flex-shrink-0`}></i>
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                    <button type="button" className="input-group-text btn-show-pass" onClick={() => setShowPassword((p) => !p)}>
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label">Confirm New Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Repeat your password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 btn-auth" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2" />Resetting...</> : <><i className="bi bi-check2-circle me-2"></i>Reset Password</>}
                </button>
              </form>

              <div className="auth-footer text-center mt-4">
                <Link to="/login" className="auth-link">
                  <i className="bi bi-arrow-left me-1"></i>Back to sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
