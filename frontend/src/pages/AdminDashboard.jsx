import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Data States
  const [analytics, setAnalytics] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);

  // Form & UI States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals / Toggles
  const [showDocForm, setShowDocForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showHospForm, setShowHospForm] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);

  // Doctor Form Fields
  const [docFields, setDocFields] = useState({
    email: '', password: '', first_name: '', last_name: '',
    specialization_id: '', hospital_id: '', phone: '', gender: 'Male',
    experience_years: '', consultation_fee: '', bio: ''
  });

  // Hospital Form Fields
  const [hospFields, setHospFields] = useState({
    name: '', city: '', address: '', phone: '', email: '', rating: 5.0
  });

  // Fetch initial analytical summaries
  useEffect(() => {
    fetchAnalytics();
    fetchHospitals();
    fetchSpecializations();
  }, []);

  // Fetch data when switching tabs
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'doctors') {
      fetchDoctors();
      fetchHospitals();
      fetchSpecializations();
    } else if (activeTab === 'hospitals') {
      fetchHospitals();
    } else if (activeTab === 'patients') {
      fetchPatients();
    } else if (activeTab === 'appointments') {
      fetchAppointments();
    } else if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [activeTab]);

  // Alert Timers
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg('');
        setErrorMsg('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  // API Call Helpers
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error loading dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors/all');
      setDoctors(res.data);
    } catch (err) {
      setErrorMsg('Failed to retrieve doctors directory.');
    }
  };

  const fetchHospitals = async () => {
    try {
      const res = await api.get('/hospitals');
      setHospitals(res.data);
    } catch (err) {
      setErrorMsg('Failed to retrieve hospitals.');
    }
  };

  const fetchSpecializations = async () => {
    try {
      const res = await api.get('/doctors/specializations');
      setSpecializations(res.data);
    } catch (err) {
      setErrorMsg('Failed to retrieve specializations.');
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get('/admin/patients');
      setPatients(res.data);
    } catch (err) {
      setErrorMsg('Failed to retrieve patient logs.');
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/admin/appointments');
      setAppointments(res.data);
    } catch (err) {
      setErrorMsg('Failed to retrieve clinical appointments history.');
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get('/admin/payments');
      setPayments(res.data);
    } catch (err) {
      setErrorMsg('Failed to retrieve payment ledgers.');
    }
  };

  // Hospital CRUD handlers
  const handleHospitalSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (editingHospital) {
        await api.put(`/admin/hospitals/${editingHospital.id}`, hospFields);
        setSuccessMsg(`Hospital "${hospFields.name}" updated successfully!`);
      } else {
        await api.post('/admin/hospitals', hospFields);
        setSuccessMsg(`Hospital "${hospFields.name}" added successfully!`);
      }
      setHospFields({ name: '', city: '', address: '', phone: '', email: '', rating: 5.0 });
      setEditingHospital(null);
      setShowHospForm(false);
      fetchHospitals();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error processing hospital request.');
    }
  };

  const handleEditHospital = (hosp) => {
    setEditingHospital(hosp);
    setHospFields({
      name: hosp.name,
      city: hosp.city,
      address: hosp.address,
      phone: hosp.phone,
      email: hosp.email || '',
      rating: hosp.rating || 5.0
    });
    setShowHospForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHospital = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete hospital "${name}"?\nThis will remove all associated doctors and appointments!`)) return;
    try {
      await api.delete(`/admin/hospitals/${id}`);
      setSuccessMsg(`Hospital "${name}" successfully deleted.`);
      fetchHospitals();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error deleting hospital.');
    }
  };

  // Doctor CRUD handlers
  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    // Validations
    if (!docFields.hospital_id || !docFields.specialization_id) {
      setErrorMsg('Please select a valid Hospital and Specialization.');
      return;
    }

    try {
      if (editingDoctor) {
        // Exclude password from payload if empty
        const payload = { ...docFields };
        if (!payload.password) delete payload.password;
        await api.put(`/admin/doctors/${editingDoctor.id}`, payload);
        setSuccessMsg(`Dr. ${docFields.first_name} ${docFields.last_name} profile updated successfully!`);
      } else {
        if (!docFields.password) {
          setErrorMsg('Password is required for creating a new doctor account.');
          return;
        }
        await api.post('/admin/doctors', docFields);
        setSuccessMsg(`Dr. ${docFields.first_name} ${docFields.last_name} account created successfully!`);
      }
      
      setDocFields({
        email: '', password: '', first_name: '', last_name: '',
        specialization_id: '', hospital_id: '', phone: '', gender: 'Male',
        experience_years: '', consultation_fee: '', bio: ''
      });
      setEditingDoctor(null);
      setShowDocForm(false);
      fetchDoctors();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving doctor details.');
    }
  };

  const handleEditDoctor = (doc) => {
    setEditingDoctor(doc);
    setDocFields({
      email: doc.email || '',
      password: '', // Keep blank unless resetting
      first_name: doc.first_name,
      last_name: doc.last_name,
      specialization_id: doc.specialization_id,
      hospital_id: doc.hospital_id,
      phone: doc.phone || '',
      gender: doc.gender || 'Male',
      experience_years: doc.experience_years || '',
      consultation_fee: doc.consultation_fee || '',
      bio: doc.bio || ''
    });
    setShowDocForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDoctor = async (id, firstName, lastName) => {
    const fullName = `Dr. ${firstName} ${lastName}`;
    if (!window.confirm(`Are you sure you want to permanently delete "${fullName}"'s clinical account?\nThis will clear all schedules and appointments!`)) return;
    try {
      await api.delete(`/admin/doctors/${id}`);
      setSuccessMsg(`${fullName} has been removed.`);
      fetchDoctors();
    } catch (err) {
      setErrorMsg('Failed to delete doctor account.');
    }
  };

  // Patient CRUD handlers
  const handleDeletePatient = async (id, firstName, lastName) => {
    const name = `${firstName} ${lastName}`;
    if (!window.confirm(`Are you sure you want to permanently delete patient "${name}"?\nThis removes all their appointment histories!`)) return;
    try {
      await api.delete(`/admin/patients/${id}`);
      setSuccessMsg(`Patient "${name}" has been deleted.`);
      fetchPatients();
    } catch (err) {
      setErrorMsg('Error deleting patient account.');
    }
  };

  return (
    <div className="container-fluid py-5 px-md-5 bg-light-gradient min-vh-100" style={{ marginTop: '70px' }}>
      <div className="row mb-4 align-items-center">
        <div className="col-12 col-md-8">
          <span className="badge bg-soft-primary text-primary px-3 py-2 rounded-pill fw-semibold text-uppercase tracking-wider mb-2">
            Administrator Area
          </span>
          <h1 className="fw-extrabold text-navy display-5 mb-1">Control Panel</h1>
          <p className="text-secondary mb-0">Monitor hospital registries, doctors, active bookings, and financials.</p>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
          <button 
            className="btn btn-outline-primary border-2 px-4 py-2 rounded-pill fw-bold"
            onClick={() => {
              if (activeTab === 'analytics') fetchAnalytics();
              else if (activeTab === 'doctors') fetchDoctors();
              else if (activeTab === 'hospitals') fetchHospitals();
              else if (activeTab === 'patients') fetchPatients();
              else if (activeTab === 'appointments') fetchAppointments();
              else if (activeTab === 'payments') fetchPayments();
              setSuccessMsg('Registry refreshed successfully!');
            }}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>Refresh Registry
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm border-0 rounded-4 p-3 mb-4" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill fs-4 me-3 text-success"></i>
            <div>
              <h6 className="alert-heading fw-bold mb-0">Success!</h6>
              <span className="small">{successMsg}</span>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm border-0 rounded-4 p-3 mb-4" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill fs-4 me-3 text-danger"></i>
            <div>
              <h6 className="alert-heading fw-bold mb-0">Action Failed</h6>
              <span className="small">{errorMsg}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation tabs */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-5">
        <div className="card-header bg-white border-0 py-3">
          <ul className="nav nav-pills card-header-pills justify-content-start gap-2">
            <li className="nav-item">
              <button 
                className={`nav-link px-4 py-2 fw-bold rounded-pill transition-all ${activeTab === 'analytics' ? 'active bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="bi bi-grid-fill me-2"></i>Analytics
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link px-4 py-2 fw-bold rounded-pill transition-all ${activeTab === 'hospitals' ? 'active bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}
                onClick={() => setActiveTab('hospitals')}
              >
                <i className="bi bi-hospital me-2"></i>Hospitals
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link px-4 py-2 fw-bold rounded-pill transition-all ${activeTab === 'doctors' ? 'active bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}
                onClick={() => setActiveTab('doctors')}
              >
                <i className="bi bi-person-badge-fill me-2"></i>Doctors
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link px-4 py-2 fw-bold rounded-pill transition-all ${activeTab === 'patients' ? 'active bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}
                onClick={() => setActiveTab('patients')}
              >
                <i className="bi bi-people-fill me-2"></i>Patients
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link px-4 py-2 fw-bold rounded-pill transition-all ${activeTab === 'appointments' ? 'active bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}
                onClick={() => setActiveTab('appointments')}
              >
                <i className="bi bi-calendar-check me-2"></i>Appointments
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link px-4 py-2 fw-bold rounded-pill transition-all ${activeTab === 'payments' ? 'active bg-primary text-white shadow-sm' : 'text-secondary hover-bg-light'}`}
                onClick={() => setActiveTab('payments')}
              >
                <i className="bi bi-cash-stack me-2"></i>Payments
              </button>
            </li>
          </ul>
        </div>
      </div>

      {loading && !analytics && (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-primary fs-4" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading data...</span>
          </div>
          <p className="mt-3 text-secondary fw-semibold">Loading clinical registers...</p>
        </div>
      )}

      {/* ==========================================
          TAB 1: ANALYTICS
          ========================================== */}
      {activeTab === 'analytics' && analytics && (
        <div className="fade-in">
          {/* Key Metric Blocks */}
          <div className="row g-4 mb-5">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white hover-up transition-all border-start border-primary border-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-secondary fw-bold text-uppercase small tracking-wider">Total Revenue</span>
                    <h2 className="fw-extrabold text-navy display-6 mt-1 mb-0">₹{analytics.total_earnings?.toLocaleString()}</h2>
                  </div>
                  <div className="bg-soft-primary p-3 rounded-4">
                    <i className="bi bi-currency-rupee text-primary fs-3"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white hover-up transition-all border-start border-success border-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-secondary fw-bold text-uppercase small tracking-wider">Registered Patients</span>
                    <h2 className="fw-extrabold text-navy display-6 mt-1 mb-0">{analytics.patients_count}</h2>
                  </div>
                  <div className="bg-soft-success p-3 rounded-4">
                    <i className="bi bi-people text-success fs-3"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white hover-up transition-all border-start border-info border-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-secondary fw-bold text-uppercase small tracking-wider">Active Physicians</span>
                    <h2 className="fw-extrabold text-navy display-6 mt-1 mb-0">{analytics.doctors_count}</h2>
                  </div>
                  <div className="bg-soft-info p-3 rounded-4">
                    <i className="bi bi-person-badge-fill text-info fs-3"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white hover-up transition-all border-start border-warning border-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-secondary fw-bold text-uppercase small tracking-wider">Hospitals</span>
                    <h2 className="fw-extrabold text-navy display-6 mt-1 mb-0">{analytics.hospitals_count}</h2>
                  </div>
                  <div className="bg-soft-warning p-3 rounded-4">
                    <i className="bi bi-building text-warning fs-3"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Appointment breakdown list */}
            <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                <h4 className="fw-extrabold text-navy mb-4">Bookings Stats</h4>
                <div className="d-flex flex-column gap-3">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold text-secondary">Total Registered Bookings</span>
                      <span className="badge bg-primary rounded-pill px-3 py-2 fw-bold">{analytics.appointments?.total || 0}</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: '8px' }}>
                      <div className="progress-bar bg-primary" role="progressbar" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold text-secondary">Pending Approvals</span>
                      <span className="badge bg-warning text-dark rounded-pill px-3 py-2 fw-bold">{analytics.appointments?.pending || 0}</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-warning" 
                        role="progressbar" 
                        style={{ width: `${analytics.appointments?.total ? (analytics.appointments.pending / analytics.appointments.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold text-secondary">Approved / Active</span>
                      <span className="badge bg-info text-white rounded-pill px-3 py-2 fw-bold">{analytics.appointments?.approved || 0}</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-info" 
                        role="progressbar" 
                        style={{ width: `${analytics.appointments?.total ? (analytics.appointments.approved / analytics.appointments.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold text-secondary">Completed Treatments</span>
                      <span className="badge bg-success rounded-pill px-3 py-2 fw-bold">{analytics.appointments?.completed || 0}</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: `${analytics.appointments?.total ? (analytics.appointments.completed / analytics.appointments.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold text-secondary">Cancelled / Rejected</span>
                      <span className="badge bg-danger rounded-pill px-3 py-2 fw-bold">{analytics.appointments?.cancelled || 0}</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-danger" 
                        role="progressbar" 
                        style={{ width: `${analytics.appointments?.total ? (analytics.appointments.cancelled / analytics.appointments.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="border-top pt-3 mt-3 text-center">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <i className="bi bi-star-fill text-warning fs-4"></i>
                      <span className="fs-4 fw-extrabold text-navy">{analytics.average_rating}</span>
                      <span className="text-secondary fw-semibold">/ 5.0 Global Satisfaction</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings lists */}
            <div className="col-12 col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-extrabold text-navy mb-0">Recent Activity Timeline</h4>
                  <button onClick={() => setActiveTab('appointments')} className="btn btn-link text-primary fw-bold text-decoration-none p-0">
                    View Ledger <i className="bi bi-chevron-right small"></i>
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light border-0">
                      <tr>
                        <th className="fw-bold text-secondary text-uppercase py-3">Patient</th>
                        <th className="fw-bold text-secondary text-uppercase py-3">Doctor</th>
                        <th className="fw-bold text-secondary text-uppercase py-3">Schedule</th>
                        <th className="fw-bold text-secondary text-uppercase py-3">State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recent_appointments?.length > 0 ? (
                        analytics.recent_appointments.map((appt) => (
                          <tr key={appt.id}>
                            <td className="py-3">
                              <span className="fw-bold text-navy">
                                {appt.patient?.first_name} {appt.patient?.last_name}
                              </span>
                            </td>
                            <td>
                              <span className="fw-semibold text-secondary">
                                Dr. {appt.doctor?.first_name} {appt.doctor?.last_name}
                              </span>
                            </td>
                            <td>
                              <div className="small text-secondary">{appt.appointment_date}</div>
                              <div className="badge bg-light text-dark border">{appt.time_slot}</div>
                            </td>
                            <td>
                              <span className={`badge px-3 py-2 rounded-pill fw-bold ${
                                appt.status === 'Completed' ? 'bg-soft-success text-success' :
                                appt.status === 'Approved' ? 'bg-soft-info text-info' :
                                appt.status === 'Pending' ? 'bg-soft-warning text-warning' :
                                'bg-soft-danger text-danger'
                              }`}>
                                {appt.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-5">
                            <i className="bi bi-calendar-x fs-1 d-block mb-3 text-secondary"></i>
                            No clinical appointments recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: HOSPITALS (CRUD)
          ========================================== */}
      {activeTab === 'hospitals' && (
        <div className="fade-in">
          {/* Toggle form button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-extrabold text-navy mb-0">Registered Hospitals ({hospitals.length})</h4>
            <button 
              className={`btn px-4 py-2 rounded-pill fw-bold transition-all ${showHospForm ? 'btn-secondary' : 'btn-primary shadow-sm'}`}
              onClick={() => {
                setShowHospForm(!showHospForm);
                if (showHospForm) {
                  setEditingHospital(null);
                  setHospFields({ name: '', city: '', address: '', phone: '', email: '', rating: 5.0 });
                }
              }}
            >
              {showHospForm ? (
                <span><i className="bi bi-x-lg me-2"></i>Close Form</span>
              ) : (
                <span><i className="bi bi-plus-lg me-2"></i>Add Hospital</span>
              )}
            </button>
          </div>

          {/* Form Block */}
          {showHospForm && (
            <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4 fade-in">
              <h5 className="fw-extrabold text-navy mb-3">
                {editingHospital ? `Modify Hospital: ${editingHospital.name}` : 'Register New Hospital Clinic'}
              </h5>
              <form onSubmit={handleHospitalSubmit} className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold text-secondary">Hospital/Clinic Name</label>
                  <input 
                    type="text" 
                    className="form-control rounded-3 p-2 border-2" 
                    placeholder="E.g. Metro Multispecialty Center" 
                    value={hospFields.name}
                    onChange={(e) => setHospFields({ ...hospFields, name: e.target.value })}
                    required 
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold text-secondary">City Location</label>
                  <input 
                    type="text" 
                    className="form-control rounded-3 p-2 border-2" 
                    placeholder="E.g. Noida, Delhi, Mumbai" 
                    value={hospFields.city}
                    onChange={(e) => setHospFields({ ...hospFields, city: e.target.value })}
                    required 
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold text-secondary">Full Street Address</label>
                  <input 
                    type="text" 
                    className="form-control rounded-3 p-2 border-2" 
                    placeholder="Plot Number, Sector / Lane, Landmark" 
                    value={hospFields.address}
                    onChange={(e) => setHospFields({ ...hospFields, address: e.target.value })}
                    required 
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold text-secondary">Contact Number</label>
                  <input 
                    type="tel" 
                    className="form-control rounded-3 p-2 border-2" 
                    placeholder="10-digit number or Landline" 
                    value={hospFields.phone}
                    onChange={(e) => setHospFields({ ...hospFields, phone: e.target.value })}
                    required 
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold text-secondary">Hospital Email Address</label>
                  <input 
                    type="email" 
                    className="form-control rounded-3 p-2 border-2" 
                    placeholder="info@hospital.com" 
                    value={hospFields.email}
                    onChange={(e) => setHospFields({ ...hospFields, email: e.target.value })}
                    required 
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold text-secondary">Quality Star Rating (1 - 5)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="1.0" 
                    max="5.0" 
                    className="form-control rounded-3 p-2 border-2" 
                    value={hospFields.rating}
                    onChange={(e) => setHospFields({ ...hospFields, rating: parseFloat(e.target.value) })}
                    required 
                  />
                </div>
                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-success px-5 py-2 rounded-pill fw-bold">
                    <i className="bi bi-save me-2"></i>Save Registry
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Hospitals Table List */}
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-0">
                  <tr>
                    <th className="fw-bold text-secondary text-uppercase py-3">Hospital Details</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">City Location</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Contacts Info</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Rating</th>
                    <th className="fw-bold text-secondary text-uppercase py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.length > 0 ? (
                    hospitals.map((hosp) => (
                      <tr key={hosp.id}>
                        <td className="py-3">
                          <div className="fw-extrabold text-navy fs-6">{hosp.name}</div>
                          <div className="small text-secondary mt-1">{hosp.address}</div>
                        </td>
                        <td>
                          <span className="badge bg-soft-primary text-primary px-3 py-2 rounded-pill fw-bold">
                            <i className="bi bi-geo-alt-fill me-1"></i>{hosp.city}
                          </span>
                        </td>
                        <td>
                          <div className="small"><i className="bi bi-telephone-fill text-muted me-2"></i>{hosp.phone}</div>
                          <div className="small text-secondary mt-1"><i className="bi bi-envelope-fill text-muted me-2"></i>{hosp.email}</div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <i className="bi bi-star-fill text-warning"></i>
                            <span className="fw-bold text-navy">{hosp.rating || 5.0}</span>
                          </div>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <button 
                              className="btn btn-soft-warning btn-sm rounded-pill px-3 fw-bold"
                              onClick={() => handleEditHospital(hosp)}
                            >
                              <i className="bi bi-pencil-fill me-1"></i>Edit
                            </button>
                            <button 
                              className="btn btn-soft-danger btn-sm rounded-pill px-3 fw-bold"
                              onClick={() => handleDeleteHospital(hosp.id, hosp.name)}
                            >
                              <i className="bi bi-trash-fill me-1"></i>Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-5">
                        <i className="bi bi-building-fill-exclamation fs-1 d-block mb-3 text-secondary"></i>
                        No clinics or hospitals registered in the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: DOCTORS (CRUD)
          ========================================== */}
      {activeTab === 'doctors' && (
        <div className="fade-in">
          {/* Toggle form button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-extrabold text-navy mb-0">Registered Doctors ({doctors.length})</h4>
            <button 
              className={`btn px-4 py-2 rounded-pill fw-bold transition-all ${showDocForm ? 'btn-secondary' : 'btn-primary shadow-sm'}`}
              onClick={() => {
                setShowDocForm(!showDocForm);
                if (showDocForm) {
                  setEditingDoctor(null);
                  setDocFields({
                    email: '', password: '', first_name: '', last_name: '',
                    specialization_id: '', hospital_id: '', phone: '', gender: 'Male',
                    experience_years: '', consultation_fee: '', bio: ''
                  });
                }
              }}
            >
              {showDocForm ? (
                <span><i className="bi bi-x-lg me-2"></i>Close Form</span>
              ) : (
                <span><i className="bi bi-person-plus-fill me-2"></i>Add Physician</span>
              )}
            </button>
          </div>

          {/* Form Block */}
          {showDocForm && (
            <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4 fade-in">
              <h5 className="fw-extrabold text-navy mb-3">
                {editingDoctor ? `Modify Profile: Dr. ${docFields.first_name} ${docFields.last_name}` : 'Register New Medical Doctor'}
              </h5>
              <form onSubmit={handleDoctorSubmit} className="row g-3">
                {/* Account Details */}
                <div className="col-12 col-md-6 col-lg-3">
                  <label className="form-label fw-bold text-secondary">First Name</label>
                  <input 
                    type="text" 
                    className="form-control rounded-3 p-2 border-2" 
                    value={docFields.first_name}
                    onChange={(e) => setDocFields({ ...docFields, first_name: e.target.value })}
                    required 
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <label className="form-label fw-bold text-secondary">Last Name</label>
                  <input 
                    type="text" 
                    className="form-control rounded-3 p-2 border-2" 
                    value={docFields.last_name}
                    onChange={(e) => setDocFields({ ...docFields, last_name: e.target.value })}
                    required 
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <label className="form-label fw-bold text-secondary">Email (User Login)</label>
                  <input 
                    type="email" 
                    className="form-control rounded-3 p-2 border-2" 
                    value={docFields.email}
                    onChange={(e) => setDocFields({ ...docFields, email: e.target.value })}
                    required 
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <label className="form-label fw-bold text-secondary">
                    Password {editingDoctor && <span className="text-muted small fw-normal">(Leave blank to keep)</span>}
                  </label>
                  <input 
                    type="password" 
                    className="form-control rounded-3 p-2 border-2" 
                    value={docFields.password}
                    onChange={(e) => setDocFields({ ...docFields, password: e.target.value })}
                    required={!editingDoctor} 
                  />
                </div>

                {/* Professional details */}
                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label fw-bold text-secondary">Hospital Association</label>
                  <select 
                    className="form-select rounded-3 p-2 border-2"
                    value={docFields.hospital_id}
                    onChange={(e) => setDocFields({ ...docFields, hospital_id: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Hospital --</option>
                    {hospitals.map((hosp) => (
                      <option key={hosp.id} value={hosp.id}>{hosp.name} ({hosp.city})</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label fw-bold text-secondary">Specialization Category</label>
                  <select 
                    className="form-select rounded-3 p-2 border-2"
                    value={docFields.specialization_id}
                    onChange={(e) => setDocFields({ ...docFields, specialization_id: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Specialty --</option>
                    {specializations.map((spec) => (
                      <option key={spec.id} value={spec.id}>{spec.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label fw-bold text-secondary">Contact Number</label>
                  <input 
                    type="tel" 
                    className="form-control rounded-3 p-2 border-2" 
                    placeholder="10-digit phone" 
                    value={docFields.phone}
                    onChange={(e) => setDocFields({ ...docFields, phone: e.target.value })}
                    required 
                  />
                </div>

                {/* Logistics */}
                <div className="col-12 col-md-4 col-lg-3">
                  <label className="form-label fw-bold text-secondary">Consultation Fee (INR)</label>
                  <input 
                    type="number" 
                    className="form-control rounded-3 p-2 border-2" 
                    placeholder="INR fee" 
                    value={docFields.consultation_fee}
                    onChange={(e) => setDocFields({ ...docFields, consultation_fee: e.target.value })}
                    required 
                  />
                </div>
                <div className="col-12 col-md-4 col-lg-3">
                  <label className="form-label fw-bold text-secondary">Experience (Years)</label>
                  <input 
                    type="number" 
                    className="form-control rounded-3 p-2 border-2" 
                    placeholder="Total years" 
                    value={docFields.experience_years}
                    onChange={(e) => setDocFields({ ...docFields, experience_years: e.target.value })}
                    required 
                  />
                </div>
                <div className="col-12 col-md-4 col-lg-3">
                  <label className="form-label fw-bold text-secondary">Physician Gender</label>
                  <select 
                    className="form-select rounded-3 p-2 border-2"
                    value={docFields.gender}
                    onChange={(e) => setDocFields({ ...docFields, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold text-secondary">Biographical & Qualifications Summary</label>
                  <textarea 
                    className="form-control rounded-3 p-2 border-2" 
                    rows="3" 
                    placeholder="Detailed professional bio, degrees, certifications, etc." 
                    value={docFields.bio}
                    onChange={(e) => setDocFields({ ...docFields, bio: e.target.value })}
                  ></textarea>
                </div>
                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-success px-5 py-2 rounded-pill fw-bold">
                    <i className="bi bi-save me-2"></i>Save Doctor
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Doctors Table Grid */}
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-0">
                  <tr>
                    <th className="fw-bold text-secondary text-uppercase py-3">Physician Name</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Specialty</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Hospital Clinic</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Fee / Experience</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Contacts</th>
                    <th className="fw-bold text-secondary text-uppercase py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.length > 0 ? (
                    doctors.map((doc) => (
                      <tr key={doc.id}>
                        <td className="py-3">
                          <div className="fw-extrabold text-navy fs-6">Dr. {doc.first_name} {doc.last_name}</div>
                          <span className="badge bg-soft-info text-info small mt-1">{doc.gender}</span>
                        </td>
                        <td>
                          <span className="badge bg-primary text-white px-3 py-2 rounded-pill fw-bold">
                            {doc.specialization?.name || 'Physician'}
                          </span>
                        </td>
                        <td>
                          <div className="fw-semibold text-secondary">{doc.hospital?.name}</div>
                          <div className="small text-muted">{doc.hospital?.city}</div>
                        </td>
                        <td>
                          <div className="fw-extrabold text-navy">₹{doc.consultation_fee}</div>
                          <div className="small text-secondary">{doc.experience_years} Years Experience</div>
                        </td>
                        <td>
                          <div className="small"><i className="bi bi-telephone me-2"></i>{doc.phone}</div>
                          <div className="small text-muted"><i className="bi bi-envelope me-2"></i>{doc.email}</div>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <button 
                              className="btn btn-soft-warning btn-sm rounded-pill px-3 fw-bold"
                              onClick={() => handleEditDoctor(doc)}
                            >
                              <i className="bi bi-pencil-fill me-1"></i>Edit
                            </button>
                            <button 
                              className="btn btn-soft-danger btn-sm rounded-pill px-3 fw-bold"
                              onClick={() => handleDeleteDoctor(doc.id, doc.first_name, doc.last_name)}
                            >
                              <i className="bi bi-trash-fill me-1"></i>Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-5">
                        <i className="bi bi-person-x fs-1 d-block mb-3 text-secondary"></i>
                        No medical doctors registered in the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 4: PATIENTS
          ========================================== */}
      {activeTab === 'patients' && (
        <div className="fade-in">
          <h4 className="fw-extrabold text-navy mb-4">Registered Patient Directory ({patients.length})</h4>
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-0">
                  <tr>
                    <th className="fw-bold text-secondary text-uppercase py-3">Patient Name</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Gender / Age</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Account Email</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Phone</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Registered At</th>
                    <th className="fw-bold text-secondary text-uppercase py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length > 0 ? (
                    patients.map((pat) => (
                      <tr key={pat.id}>
                        <td className="py-3">
                          <div className="fw-extrabold text-navy fs-6">{pat.first_name} {pat.last_name}</div>
                        </td>
                        <td>
                          <div className="fw-semibold text-secondary">{pat.gender}</div>
                          <div className="small text-muted">{pat.age} Years Old</div>
                        </td>
                        <td>
                          <span className="fw-bold text-secondary">{pat.email}</span>
                        </td>
                        <td>
                          <span className="text-navy">{pat.phone}</span>
                        </td>
                        <td>
                          <span className="small text-secondary">{pat.created_at ? new Date(pat.created_at).toLocaleDateString() : 'N/A'}</span>
                        </td>
                        <td className="text-end">
                          <button 
                            className="btn btn-soft-danger btn-sm rounded-pill px-3 fw-bold"
                            onClick={() => handleDeletePatient(pat.id, pat.first_name, pat.last_name)}
                          >
                            <i className="bi bi-trash-fill me-1"></i>Delete Account
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-5">
                        <i className="bi bi-people-fill fs-1 d-block mb-3 text-secondary"></i>
                        No patient profiles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 5: APPOINTMENTS LEDGER
          ========================================== */}
      {activeTab === 'appointments' && (
        <div className="fade-in">
          <h4 className="fw-extrabold text-navy mb-4">Global Clinical Booking Ledger ({appointments.length})</h4>
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-0">
                  <tr>
                    <th className="fw-bold text-secondary text-uppercase py-3">Patient</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Assigned Doctor</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Timing Details</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Consult Fee</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Clinical State</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td className="py-3">
                          <div className="fw-extrabold text-navy fs-6">{appt.patient?.first_name} {appt.patient?.last_name}</div>
                          <div className="small text-muted">{appt.patient?.phone}</div>
                        </td>
                        <td>
                          <div className="fw-bold text-primary">Dr. {appt.doctor?.first_name} {appt.doctor?.last_name}</div>
                          <div className="small text-secondary">{appt.doctor?.specialization?.name}</div>
                        </td>
                        <td>
                          <div className="fw-semibold text-secondary">{appt.appointment_date}</div>
                          <div className="badge bg-light text-dark border mt-1">{appt.time_slot}</div>
                        </td>
                        <td>
                          <span className="fw-extrabold text-navy">₹{appt.doctor?.consultation_fee}</span>
                        </td>
                        <td>
                          <span className={`badge px-3 py-2 rounded-pill fw-bold ${
                            appt.status === 'Completed' ? 'bg-soft-success text-success' :
                            appt.status === 'Approved' ? 'bg-soft-info text-info' :
                            appt.status === 'Pending' ? 'bg-soft-warning text-warning' :
                            'bg-soft-danger text-danger'
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge px-3 py-2 rounded-pill fw-bold ${
                            appt.payment_status === 'Paid' ? 'bg-success text-white' : 'bg-secondary text-white'
                          }`}>
                            {appt.payment_status || 'Unpaid'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-5">
                        <i className="bi bi-calendar-x fs-1 d-block mb-3 text-secondary"></i>
                        No system appointment logs recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 6: PAYMENTS LEDGER
          ========================================== */}
      {activeTab === 'payments' && (
        <div className="fade-in">
          <h4 className="fw-extrabold text-navy mb-4">Financial Ledger & Payments Directory ({payments.length})</h4>
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-0">
                  <tr>
                    <th className="fw-bold text-secondary text-uppercase py-3">Transaction ID</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Patient</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Doctor</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Appt Date</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Amount</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Method</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Status</th>
                    <th className="fw-bold text-secondary text-uppercase py-3">Processed On</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((pay) => (
                      <tr key={pay.id}>
                        <td className="py-3">
                          <code className="text-primary fw-bold">{pay.transaction_id || `TXN-${pay.id}`}</code>
                        </td>
                        <td>
                          <span className="fw-bold text-navy">{pay.patient_name}</span>
                        </td>
                        <td>
                          <span className="fw-semibold text-secondary">{pay.doctor_name}</span>
                        </td>
                        <td>
                          <span className="small text-secondary">{pay.appointment_date}</span>
                        </td>
                        <td>
                          <span className="fw-extrabold text-success">₹{pay.amount}</span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark text-uppercase border">{pay.payment_method}</span>
                        </td>
                        <td>
                          <span className={`badge px-3 py-2 rounded-pill fw-bold ${
                            pay.status === 'Success' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'
                          }`}>
                            {pay.status}
                          </span>
                        </td>
                        <td>
                          <span className="small text-secondary">{new Date(pay.payment_date).toLocaleString()}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-5">
                        <i className="bi bi-wallet2 fs-1 d-block mb-3 text-secondary"></i>
                        No payment log transactions exist yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
