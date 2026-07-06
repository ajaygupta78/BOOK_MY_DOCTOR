import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Schedule form states
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  useEffect(() => {
    fetchDashboardDetails();
  }, []);

  const fetchDashboardDetails = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Fetch assigned appointments
      const apptRes = await API.get('/appointments/doctor');
      setAppointments(apptRes.data);

      // 2. Fetch logged in doctor profile to query schedules
      const profileRes = await API.get('/auth/profile');
      const docId = profileRes.data.doctor_id;
      
      const schedRes = await API.get(`/doctors/${docId}/schedules`);
      setSchedules(schedRes.data);
    } catch (err) {
      setErrorMsg('Failed to query clinical dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusTransition = async (apptId, targetStatus) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await API.put(`/appointments/${apptId}/status`, { status: targetStatus });
      setSuccessMsg(response.data.message);
      
      // Refresh list
      const apptRes = await API.get('/appointments/doctor');
      setAppointments(apptRes.data);
      
      // Auto-hide alert
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error occurred while updating status.');
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Check time values bounds
    if (startTime >= endTime) {
      setErrorMsg('Start time must be strictly before End time.');
      return;
    }

    setSubmittingSchedule(true);
    try {
      const response = await API.post('/doctors/schedule', {
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime
      });
      setSuccessMsg(response.data.message);

      // Refresh schedules
      const profileRes = await API.get('/auth/profile');
      const docId = profileRes.data.doctor_id;
      const schedRes = await API.get(`/doctors/${docId}/schedules`);
      setSchedules(schedRes.data);

      // Reset form
      setDayOfWeek('Monday');
      setStartTime('09:00');
      setEndTime('13:00');
      
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error occurred while saving schedule.');
    } finally {
      setSubmittingSchedule(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await API.delete(`/doctors/schedule/${scheduleId}`);
      setSuccessMsg(response.data.message);

      // Refresh schedules
      const profileRes = await API.get('/auth/profile');
      const docId = profileRes.data.doctor_id;
      const schedRes = await API.get(`/doctors/${docId}/schedules`);
      setSchedules(schedRes.data);

      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error occurred while deleting schedule.');
    }
  };

  // Compute stat metrics locally
  const totalAssigned = appointments.length;
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const approvedCount = appointments.filter(a => a.status === 'Approved').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

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
          <div className="bg-white p-4 rounded-4 mb-4 shadow-sm border border-light">
            <h2 className="outfit-font fw-bold text-dark mb-1">Physician Dashboard Command Console</h2>
            <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Configure weekly availability slots and manage outpatient clinical bookings.</span>
          </div>

          {/* Feedback alerts */}
          {successMsg && (
            <div className="alert alert-success border-0 rounded-3 mb-4 d-flex align-items-center gap-2" role="alert" style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.86rem' }}>
              <i className="bi bi-check-circle-fill fs-5 text-success"></i>
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger border-0 rounded-3 mb-4 d-flex align-items-center gap-2" role="alert" style={{ background: '#fef2f2', color: '#b91c1c', fontSize: '0.86rem' }}>
              <i className="bi bi-exclamation-triangle-fill fs-5 text-danger"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Stats Widgets grid */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-md-3">
              <div className="stat-widget">
                <div>
                  <span className="text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>Assigned Bookings</span>
                  <div className="stat-number text-dark">{totalAssigned}</div>
                </div>
                <div className="stat-icon-wrapper bg-primary bg-opacity-10 text-primary"><i className="bi bi-calendar2-heart"></i></div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="stat-widget">
                <div>
                  <span className="text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>Pending Approval</span>
                  <div className="stat-number text-warning">{pendingCount}</div>
                </div>
                <div className="stat-icon-wrapper bg-warning bg-opacity-10 text-warning"><i className="bi bi-hourglass-split"></i></div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="stat-widget">
                <div>
                  <span className="text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>Approved Schedules</span>
                  <div className="stat-number text-success">{approvedCount}</div>
                </div>
                <div className="stat-icon-wrapper bg-success bg-opacity-10 text-success"><i className="bi bi-check-circle"></i></div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="stat-widget">
                <div>
                  <span className="text-secondary fw-semibold" style={{ fontSize: '0.8rem' }}>Completed Consults</span>
                  <div className="stat-number text-info">{completedCount}</div>
                </div>
                <div className="stat-icon-wrapper bg-info bg-opacity-10 text-info"><i className="bi bi-patch-check"></i></div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            
            {/* 2A. ACTIVE APPOINTMENTS QUEUE */}
            <div className="col-xl-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                <h5 className="outfit-font fw-bold text-dark mb-4"><i className="bi bi-calendar-event me-2 text-primary"></i>Consultation Booking Queue</h5>
                
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-teal" role="status">
                      <span className="visually-hidden">Syncing bookings...</span>
                    </div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-clipboard2-pulse fs-1 text-muted mb-2"></i>
                    <p className="text-secondary mb-0">No outpatient bookings assigned currently.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.86rem' }}>
                      
                      <thead className="table-light text-secondary" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                        <tr>
                          <th className="py-3 ps-3">Patient Billed</th>
                          <th className="py-3">Consult date/time</th>
                          <th className="py-3">Symptom / Reason</th>
                          <th className="py-3 text-center">Scheduler Status</th>
                          <th className="py-3 pe-3 text-end">Action Controls</th>
                        </tr>
                      </thead>

                      <tbody>
                        {appointments.map((appt) => (
                          <tr key={appt.id}>
                            {/* Patient details */}
                            <td className="py-3 ps-3">
                              <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '0.86rem' }}>{appt.patient_name}</h6>
                              <span className="text-secondary" style={{ fontSize: '0.74rem' }}>Cell: {appt.patient_phone}</span>
                            </td>
                            {/* Date time */}
                            <td className="py-3 text-dark font-monospace" style={{ fontSize: '0.8rem' }}>
                              {appt.appointment_date} <br />
                              {appt.appointment_time} hrs
                            </td>
                            {/* Reason */}
                            <td className="py-3 text-secondary text-truncate" style={{ maxWidth: '140px' }} title={appt.reason}>
                              {appt.reason || 'General routine checkup'}
                            </td>
                            {/* Status badge */}
                            <td className="py-3 text-center">
                              <span className={`badge-status badge-${appt.status.toLowerCase()}`} style={{ fontSize: '0.68rem', padding: '3px 6px' }}>
                                {appt.status}
                              </span>
                            </td>
                            {/* Action Buttons */}
                            <td className="py-3 pe-3 text-end">
                              <div className="d-flex justify-content-end gap-1">
                                {appt.status === 'Pending' && (
                                  <>
                                    <button 
                                      onClick={() => handleStatusTransition(appt.id, 'Approved')} 
                                      className="btn btn-success btn-xs rounded-circle p-1 d-inline-flex align-items-center justify-content-center" 
                                      style={{ width: '28px', height: '28px' }} 
                                      title="Approve Booking"
                                    >
                                      <i className="bi bi-check text-white"></i>
                                    </button>
                                    <button 
                                      onClick={() => handleStatusTransition(appt.id, 'Rejected')} 
                                      className="btn btn-danger btn-xs rounded-circle p-1 d-inline-flex align-items-center justify-content-center" 
                                      style={{ width: '28px', height: '28px' }} 
                                      title="Reject Booking"
                                    >
                                      <i className="bi bi-x text-white"></i>
                                    </button>
                                  </>
                                )}
                                {appt.status === 'Approved' && (
                                  <button 
                                    onClick={() => handleStatusTransition(appt.id, 'Completed')} 
                                    className="btn btn-primary btn-xs rounded-pill px-2 py-1 fw-bold text-white" 
                                    style={{ fontSize: '0.72rem' }}
                                  >
                                    <i className="bi bi-check2-all me-1"></i> Complete
                                  </button>
                                )}
                                {appt.status === 'Completed' && (
                                  <span className="text-secondary" style={{ fontSize: '0.75rem' }}>No Actions</span>
                                )}
                                {appt.status === 'Rejected' && (
                                  <span className="text-danger" style={{ fontSize: '0.75rem' }}>Rejected</span>
                                )}
                                {appt.status === 'Cancelled' && (
                                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Cancelled</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* 2B. WEEKLY CLINIC HOURS WORKSPACE */}
            <div className="col-xl-4">
              <div className="d-flex flex-column gap-4 h-100">
                
                {/* Form to Add Schedules */}
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <h5 className="outfit-font fw-bold text-dark mb-3"><i className="bi bi-clock-history me-2 text-primary"></i>Add Availability Slot</h5>
                  
                  <form onSubmit={handleAddSchedule}>
                    <div className="mb-3">
                      <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Day of Week *</label>
                      <select className="form-select form-control-custom" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} required>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Start Time *</label>
                        <input type="time" className="form-control form-control-custom" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>End Time *</label>
                        <input type="time" className="form-control form-control-custom" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary-grad w-100 rounded-pill py-2 fw-semibold text-white" disabled={submittingSchedule}>
                      {submittingSchedule ? 'Saving...' : 'Add Schedule Slot'}
                    </button>
                  </form>
                </div>

                {/* Displaying schedules availability slots */}
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white flex-grow-1">
                  <h6 className="outfit-font fw-bold text-dark mb-3">Active Availability Roster</h6>
                  
                  {schedules.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-slash-circle fs-2 text-muted mb-2 d-block"></i>
                      <span className="text-secondary" style={{ fontSize: '0.8rem' }}>No custom slots configured.</span>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {schedules.map((s) => (
                        <div key={s.id} className="d-flex justify-content-between align-items-center bg-light p-2 rounded-2" style={{ fontSize: '0.82rem' }}>
                          <div>
                            <span className="fw-bold text-dark d-block">{s.day_of_week}</span>
                            <span className="text-secondary" style={{ fontSize: '0.78rem' }}>{s.start_time} - {s.end_time}</span>
                          </div>
                          <button onClick={() => handleDeleteSchedule(s.id)} className="btn btn-outline-danger btn-xs border-0 p-1" title="Delete slot">
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;
