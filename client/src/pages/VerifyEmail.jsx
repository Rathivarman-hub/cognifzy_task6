import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/authApi.js';
import { useAuth } from '../context/AuthContext.jsx';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const hasVerified = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;
      
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified!');
        
        if (user) {
          try {
            await refreshUser();
          } catch (err) {
            console.error('Failed to refresh user:', err);
          }
        }

        setTimeout(() => {
          navigate(user ? '/dashboard' : '/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link might be invalid or expired.');
      }
    };

    if (token) {
      verify();
    }
  }, [token, navigate, user, refreshUser]);

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="auth-card">
              <div className="text-center mb-4">
                <div className="brand-logo justify-content-center mb-3">
                  <div className="brand-icon">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <span className="brand-text">AuthVault</span>
                </div>
                <h4 className="auth-title">Email Verification</h4>
              </div>

              <div className="text-center py-4">
                {status === 'verifying' && (
                  <div className="mb-4">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                
                {status === 'success' && (
                  <div className="mb-4">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                  </div>
                )}

                {status === 'error' && (
                  <div className="mb-4">
                    <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
                  </div>
                )}

                <p className={`lead ${status === 'error' ? 'text-danger' : status === 'success' ? 'text-success' : ''}`}>
                  {message}
                </p>

                {status === 'success' && (
                  <p className="text-muted mt-3">Redirecting you shortly...</p>
                )}

                {status === 'error' && (
                  <Link to="/login" className="btn btn-primary mt-3">
                    Back to Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
