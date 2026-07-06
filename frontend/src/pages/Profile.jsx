import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfileState } = useAuth();
  
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    name: '', // admin name
    phone: '',
    gender: '',
    dob: '',
    address: '',
    experience_years: '',
    consultation_fee: '',
    bio: '',
    password: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await API.get('/auth/profile');
      setProfileData({
        ...response.data,
        password: '' // Keep password input blank initially
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error fetching profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await API.put('/auth/profile', profileData);
      setSuccessMsg(response.data.message);
      
      // Update global context name state
      const updatedName = user.role === 'admin' 
        ? profileData.name 
        : `${profileData.first_name} ${profileData.last_name}`;
      
      updateProfileState(user.role === 'doctor' ? `Dr. ${updatedName}` : updatedName);

      // Clear password field
      setProfileData(prev => ({ ...prev, password: '' }));
      
      // Auto-hide success alert
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error occurred while updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary my-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 animated-fade">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          
          <div className="card glass-card border-0 p-4 p-md-5">
            <div className="card-body">
              
              {/* Profile Header */}
              <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom border-light">
                <div className="bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center rounded-circle border border-primary border-opacity-10" style={{ width: '80px', height: '80px', color: '#0284c7' }}>
                  <i className="bi bi-person-fill" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <div>
                  <h3 className="outfit-font fw-bold text-dark mb-1">Profile Settings</h3>
                  <span className="badge bg-secondary text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                    {user.role} Account Control
                  </span>
                </div>
              </div>

              {/* Alert Feedback Notifications */}
              {errorMsg && (
                <div className="alert alert-danger border-0 rounded-3 mb-4" role="alert" style={{ background: '#fef2f2', color: '#b91c1c', fontSize: '0.88rem' }}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="alert alert-success border-0 rounded-3 mb-4" role="alert" style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.88rem' }}>
                  <i className="bi bi-check-circle-fill me-2"></i>{successMsg}
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <div className="row g-3">
                  
                  {/* Global Email Address (Read-Only) */}
                  <div className="col-12 col-md-6">
                    <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Registered Email *</label>
                    <input 
                      type="email" 
                      className="form-control form-control-custom bg-light" 
                      value={profileData.email}
                      disabled 
                    />
                  </div>

                  {/* Dynamic inputs for Patients and Doctors */}
                  {user.role !== 'admin' ? (
                    <>
                      {/* First Name */}
                      <div className="col-md-6">
                        <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>First Name *</label>
                        <input 
                          type="text" 
                          name="first_name" 
                          className="form-control form-control-custom"
                          value={profileData.first_name || ''} 
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
                          value={profileData.last_name || ''} 
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    // Admin Name
                    <div className="col-md-6">
                      <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Administrator Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        className="form-control form-control-custom"
                        value={profileData.name || ''} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}

                  {/* Contact Phone */}
                  <div className="col-md-6">
                    <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Contact Phone *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      className="form-control form-control-custom"
                      value={profileData.phone || ''} 
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Dynamic inputs specifically for Patient profiles */}
                  {user.role === 'patient' && (
                    <>
                      {/* Gender selection */}
                      <div className="col-md-6">
                        <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Gender *</label>
                        <select 
                          name="gender" 
                          className="form-select form-control-custom"
                          value={profileData.gender || ''}
                          onChange={handleChange}
                          required
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Date of birth */}
                      <div className="col-md-6">
                        <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Date of Birth *</label>
                        <input 
                          type="date" 
                          name="dob" 
                          className="form-control form-control-custom"
                          value={profileData.dob || ''} 
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Patient address */}
                      <div className="col-12">
                        <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Residential Address</label>
                        <textarea 
                          name="address" 
                          rows="2" 
                          className="form-control form-control-custom"
                          value={profileData.address || ''} 
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </>
                  )}

                  {/* Dynamic inputs specifically for Doctor profiles */}
                  {user.role === 'doctor' && (
                    <>
                      {/* Doctor Experience Years */}
                      <div className="col-md-6">
                        <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Experience (in Years) *</label>
                        <input 
                          type="number" 
                          name="experience_years" 
                          className="form-control form-control-custom"
                          value={profileData.experience_years || ''} 
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Consultation Fees */}
                      <div className="col-md-6">
                        <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Consultation Fee (INR) *</label>
                        <input 
                          type="number" 
                          name="consultation_fee" 
                          className="form-control form-control-custom"
                          value={profileData.consultation_fee || ''} 
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Professional Bio Biography */}
                      <div className="col-12">
                        <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Professional Bio Biography</label>
                        <textarea 
                          name="bio" 
                          rows="3" 
                          className="form-control form-control-custom"
                          value={profileData.bio || ''} 
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </>
                  )}

                  {/* Password modifier */}
                  <div className="col-12 border-top pt-4 mt-4">
                    <h5 className="outfit-font fw-bold text-dark mb-3"><i className="bi bi-shield-lock me-2 text-primary"></i>Modify Account Password</h5>
                    <div className="col-md-6">
                      <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>New Password (Leave blank to keep current)</label>
                      <input 
                        type="password" 
                        name="password" 
                        className="form-control form-control-custom"
                        placeholder="••••••••"
                        value={profileData.password || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Save changes button */}
                  <div className="col-12 pt-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary-grad px-5 rounded-pill fw-bold text-white py-3 d-flex align-items-center justify-content-center gap-2"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>Updating profile records...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle text-white"></i>
                          <span>Save Settings Modifications</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
