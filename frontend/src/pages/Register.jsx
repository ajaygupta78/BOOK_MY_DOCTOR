import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    gender: 'Male',
    dob: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Field checking validation
    if (!formData.email.trim() || !formData.password.trim() || !formData.first_name.trim() || !formData.last_name.trim() || !formData.phone.trim() || !formData.dob.trim()) {
      setErrorMsg('Please populate all mandatory registration fields.');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      setSuccessMsg(result.message);
      // Reset form
      setFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        gender: 'Male',
        dob: '',
        address: ''
      });
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="container py-5 animated-fade d-flex align-items-center justify-content-center" style={{ minHeight: '90vh' }}>
      <div className="card glass-card border-0 overflow-hidden shadow-lg" style={{ maxWidth: '650px', width: '100%', borderRadius: '20px' }}>
        
        {/* Colorful Gradient Header Band */}
        <div className="py-4 text-center text-white" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)' }}>
          <i className="bi bi-person-plus-fill fs-1 text-white mb-2"></i>
          <h3 className="outfit-font fw-bold mb-1">Create Patient Account</h3>
          <span className="text-light text-opacity-75" style={{ fontSize: '0.85rem' }}>Join our digital clinic network immediately</span>
        </div>

        <div className="card-body p-4 p-md-5">
          {errorMsg && (
            <div className="alert alert-danger border-0 rounded-3 d-flex align-items-center gap-2 mb-4" role="alert" style={{ background: '#fef2f2', color: '#b91c1c', fontSize: '0.88rem' }}>
              <i className="bi bi-exclamation-triangle-fill fs-5 text-danger"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success border-0 rounded-3 d-flex align-items-center gap-2 mb-4" role="alert" style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.88rem' }}>
              <i className="bi bi-check-circle-fill fs-5 text-success"></i>
              <span>{successMsg} Redirecting to login portal...</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit}>
            <div className="row g-3">
              
              {/* First Name */}
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>First Name *</label>
                <input 
                  type="text" 
                  name="first_name"
                  className="form-control form-control-custom" 
                  placeholder="e.g. Patrick"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Last Name */}
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Last Name *</label>
                <input 
                  type="text" 
                  name="last_name"
                  className="form-control form-control-custom" 
                  placeholder="e.g. Jones"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Address */}
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-control form-control-custom" 
                  placeholder="e.g. patrick@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Password *</label>
                <input 
                  type="password" 
                  name="password"
                  className="form-control form-control-custom" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Telephone */}
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Contact Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  className="form-control form-control-custom" 
                  placeholder="e.g. +91 98888 77777"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Gender */}
              <div className="col-md-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Gender *</label>
                <select 
                  name="gender" 
                  className="form-select form-control-custom"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date of birth */}
              <div className="col-12 col-md-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Date of Birth *</label>
                <input 
                  type="date" 
                  name="dob"
                  className="form-control form-control-custom" 
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Address */}
              <div className="col-12">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Physical Residential Address</label>
                <textarea 
                  name="address"
                  rows="2" 
                  className="form-control form-control-custom" 
                  placeholder="Type your complete residential address..."
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Register button */}
              <div className="col-12 pt-3">
                <button 
                  type="submit" 
                  className="btn btn-primary-grad w-100 rounded-pill py-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Creating patient account...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-check-fill text-white"></i>
                      <span>Complete Registration</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>

          {/* Login Hint */}
          <div className="text-center mt-4">
            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Already have a patient account? </span>
            <Link to="/login" className="text-info text-decoration-none fw-semibold" style={{ fontSize: '0.85rem' }}>Login Here</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
