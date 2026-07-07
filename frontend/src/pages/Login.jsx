import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotAlert, setForgotAlert] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setErrorMsg('');

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Navigate contextually based on user role
      if (result.user.role === 'patient') {
        navigate('/patient-dashboard');
      } else if (result.user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (result.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setForgotLoading(true);
    setForgotAlert('');

    try {
      const response = await API.post('/auth/forgot-password', { email: forgotEmail });
      setForgotAlert(response.data.message);
      setForgotEmail('');
    } catch (err) {
      setForgotAlert(err.response?.data?.message || 'Error occurred. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="container py-5 animated-fade d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card glass-card border-0 overflow-hidden shadow-lg" style={{ maxWidth: '480px', width: '100%', borderRadius: '20px' }}>
        
        {/* Colorful Gradient Header Band */}
        <div className="py-4 text-center text-white" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)' }}>
          <i className="bi bi-heart-pulse-fill pulse-heart fs-1 text-white mb-2"></i>
          <h3 className="outfit-font fw-bold mb-1">Book My Doctor</h3>
          <span className="text-light text-opacity-75" style={{ fontSize: '0.85rem' }}>Secure Portal Authentication</span>
        </div>

        <div className="card-body p-4 p-md-5">
          {errorMsg && (
            <div className="alert alert-danger border-0 rounded-3 d-flex align-items-center gap-2 mb-4" role="alert" style={{ background: '#fef2f2', color: '#b91c1c', fontSize: '0.88rem' }}>
              <i className="bi bi-exclamation-triangle-fill fs-5 text-danger"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label className="form-label text-secondary fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderRadius: '12px 0 0 12px' }}>
                  <i className="bi bi-envelope"></i>
                </span>
                <input 
                  type="email" 
                  className="form-control form-control-custom border-start-0 ps-0" 
                  placeholder="e.g. pat.jones@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  style={{ borderRadius: '0 12px 12px 0' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label text-secondary fw-semibold mb-0" style={{ fontSize: '0.85rem' }}>Account Password</label>
                <button 
                  type="button" 
                  className="btn btn-link text-info p-0 text-decoration-none fw-semibold" 
                  style={{ fontSize: '0.8rem' }}
                  data-bs-toggle="modal"
                  data-bs-target="#forgotPasswordModal"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderRadius: '12px 0 0 12px' }}>
                  <i className="bi bi-lock"></i>
                </span>
                <input 
                  type="password" 
                  className="form-control form-control-custom border-start-0 ps-0" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  style={{ borderRadius: '0 12px 12px 0' }}
                />
              </div>
            </div>

            {/* Login button */}
            <button 
              type="submit" 
              className="btn btn-primary-grad w-100 rounded-pill py-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2 mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right text-white"></i>
                  <span>Secure Login</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Hint */}
          <div className="text-center mt-4">
            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Don't have a patient account? </span>
            <Link to="/register" className="text-info text-decoration-none fw-semibold" style={{ fontSize: '0.85rem' }}>Register Here</Link>
          </div>

          {/* Demo account helper credits */}
          <div className="bg-light p-3 rounded-3 mt-4" style={{ fontSize: '0.78rem' }}>
            <span className="fw-bold text-dark d-block mb-1">Demo Credentials:</span>
            <div className="text-secondary">Patient: <code>pat.jones@gmail.com</code> / <code>password123</code></div>
            <div className="text-secondary">Doctor: <code>dr.smith@bookmydoctor.com</code> / <code>password123</code></div>
            <div className="text-secondary">Admin: <code>admin@bookmydoctor.com</code> / <code>admin123</code></div>
          </div>

        </div>
      </div>

      {/* =====================================================================
         FORGOT PASSWORD DIALOG MODAL
         ===================================================================== */}
      <div className="modal fade" id="forgotPasswordModal" tabIndex="-1" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
          <div className="modal-content border-0 glass-card">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title outfit-font fw-bold text-dark" id="forgotPasswordModalLabel">Reset Account Password</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <form onSubmit={handleForgotSubmit}>
              <div className="modal-body py-4">
                {forgotAlert && (
                  <div className="alert alert-info border-0 rounded-3 mb-3" role="alert" style={{ fontSize: '0.82rem' }}>
                    <i className="bi bi-info-circle-fill me-2"></i>{forgotAlert}
                  </div>
                )}
                
                <p className="text-secondary mb-3" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Enter your registered email address below. The system will dispatch a simulated password resetting instructions link.
                </p>

                <div className="mb-2">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    className="form-control form-control-custom" 
                    placeholder="e.g. user@gmail.com" 
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-3" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-accent-grad text-white rounded-pill px-4" disabled={forgotLoading}>
                  {forgotLoading ? 'Processing...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
