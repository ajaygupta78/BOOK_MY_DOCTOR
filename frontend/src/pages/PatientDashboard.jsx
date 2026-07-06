import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';

const PatientDashboard = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await API.get('/appointments/patient');
      setAppointments(response.data);
    } catch (err) {
      setErrorMsg('Failed to query dashboard parameters.');
    } finally {
      setLoading(false);
    }
  };

  // Compute stat metrics locally
  const totalBookings = appointments.length;
  const pendingVisits = appointments.filter(a => a.status === 'Pending').length;
  const clearedPayments = appointments.filter(a => a.payment_status === 'Success').length;
  const unpaidBookings = appointments.filter(a => a.payment_status !== 'Success' && a.status !== 'Rejected' && a.status !== 'Cancelled').length;

  return (
    <div className="container-fluid py-4 animated-fade">
      <div className="row g-4">
        
        {/* 1. LEFT SIDEBAR PANEL */}
        <div className="col-lg-3">
          <Sidebar />
        </div>

        {/* 2. MAIN WORKSPACE */}
        <div className="col-lg-9">
          
          {/* Welcome Alert Banner */}
          <div className="bg-white p-4 rounded-4 mb-4 shadow-sm border border-light d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="outfit-font fw-bold text-dark mb-1">Patient Control Portal</h2>
              <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Welcome back! Schedule physician slots and manage medical invoices cleanly.</span>
            </div>
            <Link to="/doctors" className="btn btn-accent-grad rounded-pill px-4 fw-semibold text-white">
              <i className="bi bi-search me-2"></i> Book Appointment
            </Link>
          </div>

          {errorMsg && (
            <div className="alert alert-danger border-0 rounded-3 mb-4" role="alert" style={{ background: '#fef2f2', color: '#b91c1c' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>{errorMsg}
            </div>
          )}

          {/* Quick Stats Widgets grid */}
          <div className="row g-3 mb-4">
            {/* Stat widget 1 */}
            <div className="col-sm-6 col-md-3">
              <div className="stat-widget">
                <div>
                  <span className="text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>Total Bookings</span>
                  <div className="stat-number text-dark">{totalBookings}</div>
                </div>
                <div className="stat-icon-wrapper bg-primary bg-opacity-10 text-primary"><i className="bi bi-calendar2-range-fill"></i></div>
              </div>
            </div>
            {/* Stat widget 2 */}
            <div className="col-sm-6 col-md-3">
              <div className="stat-widget">
                <div>
                  <span className="text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>Pending Review</span>
                  <div className="stat-number text-warning">{pendingVisits}</div>
                </div>
                <div className="stat-icon-wrapper bg-warning bg-opacity-10 text-warning"><i className="bi bi-clock-history"></i></div>
              </div>
            </div>
            {/* Stat widget 3 */}
            <div className="col-sm-6 col-md-3">
              <div className="stat-widget">
                <div>
                  <span className="text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>Cleared Payments</span>
                  <div className="stat-number text-success">{clearedPayments}</div>
                </div>
                <div className="stat-icon-wrapper bg-success bg-opacity-10 text-success"><i className="bi bi-credit-card-fill"></i></div>
              </div>
            </div>
            {/* Stat widget 4 */}
            <div className="col-sm-6 col-md-3">
              <div className="stat-widget">
                <div>
                  <span className="text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>Unpaid Balance</span>
                  <div className="stat-number text-danger">{unpaidBookings}</div>
                </div>
                <div className="stat-icon-wrapper bg-danger bg-opacity-10 text-danger"><i className="bi bi-wallet2"></i></div>
              </div>
            </div>
          </div>

          {/* Recent Bookings timeline summaries */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="outfit-font fw-bold text-dark mb-4 d-flex align-items-center justify-content-between">
              <span><i className="bi bi-clock me-2 text-primary"></i>Recent Clinical Transactions</span>
              <Link to="/history" className="btn btn-link text-info p-0 text-decoration-none fw-semibold" style={{ fontSize: '0.82rem' }}>
                View All History
              </Link>
            </h5>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-teal" role="status">
                  <span className="visually-hidden">Syncing records...</span>
                </div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-journal-medical fs-1 text-muted mb-2"></i>
                <p className="text-secondary mb-0">No active clinics found in your history log.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.88rem' }}>
                  
                  <thead className="table-light text-secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <tr>
                      <th className="py-3 ps-3">Doctor</th>
                      <th className="py-3">Branch Clinic</th>
                      <th className="py-3">Consult date/time</th>
                      <th className="py-3">Clinic Status</th>
                      <th className="py-3 pe-3 text-end">Action Shortcut</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments.slice(0, 3).map((appt) => (
                      <tr key={appt.id}>
                        <td className="py-3 ps-3">
                          <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '0.88rem' }}>{appt.doctor_name}</h6>
                          <span className="text-secondary" style={{ fontSize: '0.74rem' }}>{appt.doctor_specialization}</span>
                        </td>
                        <td className="py-3 text-secondary" style={{ fontSize: '0.82rem' }}>{appt.hospital_name}</td>
                        <td className="py-3 text-dark font-monospace" style={{ fontSize: '0.82rem' }}>
                          {appt.appointment_date} <br />
                          {appt.appointment_time} hrs
                        </td>
                        <td className="py-3">
                          <span className={`badge-status badge-${appt.status.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="py-3 pe-3 text-end">
                          {appt.payment_status !== 'Success' && appt.status !== 'Rejected' && appt.status !== 'Cancelled' ? (
                            <button onClick={() => navigate(`/payment?appointment_id=${appt.id}&amount=${appt.consultation_fee}`)} className="btn btn-warning btn-xs rounded-pill px-3 py-1 fw-bold text-dark" style={{ fontSize: '0.75rem' }}>
                              <i className="bi bi-credit-card me-1"></i> Pay ₹{appt.consultation_fee}
                            </button>
                          ) : appt.payment_status === 'Success' ? (
                            <button onClick={() => navigate(`/payment?appointment_id=${appt.id}&amount=${appt.consultation_fee}`)} className="btn btn-outline-primary btn-xs rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '0.75rem' }}>
                              <i className="bi bi-printer me-1"></i> Receipt
                            </button>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>No Actions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
