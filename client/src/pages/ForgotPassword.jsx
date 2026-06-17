import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authApi.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await forgotPassword(email);
      setMessage({ type: 'success', text: 'If that email is registered, a reset link has been sent. Check your inbox.' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Something went wrong. Try again.' });
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
                  <i className="bi bi-envelope-open-fill"></i>
                </div>
                <h2 className="auth-title">Reset password</h2>
                <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>
              </div>

              {message && (
                <div className={`alert alert-${message.type} d-flex align-items-center gap-2`}>
                  <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} flex-shrink-0`}></i>
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label className="form-label">Email address</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 btn-auth" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</> : <><i className="bi bi-send me-2"></i>Send reset link</>}
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

export default ForgotPassword;
