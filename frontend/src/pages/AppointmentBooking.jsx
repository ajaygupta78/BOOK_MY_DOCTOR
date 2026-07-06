import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  
  // Form fields
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchDoctorAndSchedules();
  }, [doctorId]);

  const fetchDoctorAndSchedules = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [docRes, schedRes] = await Promise.all([
        API.get(`/doctors/${doctorId}`),
        API.get(`/doctors/${doctorId}/schedules`)
      ]);
      setDoctor(docRes.data);
      setSchedules(schedRes.data);
    } catch (err) {
      setErrorMsg('Failed to query doctor or active schedule records.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentDate || !appointmentTime) return;

    // Simple date validator: Cannot book in past
    const selectedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (selectedDate < today) {
      setErrorMsg('Cannot schedule consultations on past dates.');
      return;
    }

    // Day of week check: Verify if doctor is available on selected day
    const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const selectedDayOfWeek = weekdayNames[selectedDate.getDay() + 1 > 6 ? 0 : selectedDate.getDay() + 1]; // Offset adjustments depending on regional clocks
    // Find active schedule days
    const activeDays = schedules.map(s => s.day_of_week);
    // Simple warning: we let them book but warn. Let's do a soft check:
    const dayIndex = selectedDate.getDay();
    const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const chosenDay = dayMap[dayIndex];
    
    const isDoctorAvailableOnChosenDay = schedules.some(s => s.day_of_week === chosenDay);
    if (schedules.length > 0 && !isDoctorAvailableOnChosenDay) {
      setErrorMsg(`Dr. ${doctor.last_name} is typically not available on ${chosenDay}s. Please check their schedule below.`);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const response = await API.post('/appointments/book', {
        doctor_id: doctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason: reason
      });
      
      const apptId = response.data.appointment.id;
      const consultationFee = doctor.consultation_fee;

      // Booking recorded! Redirect patient immediately to the simulated Payment panel
      navigate(`/payment?appointment_id=${apptId}&amount=${consultationFee}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error occurred while scheduling booking.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: Generates hourly slot options between schedule start and end
  const generateTimeSlots = () => {
    if (schedules.length === 0) {
      // Default fallback hourly slots
      return ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
    }
    
    // We can collect unique times or generate list based on first schedule
    const firstSched = schedules[0];
    const slots = [];
    try {
      const startHour = parseInt(firstSched.start_time.split(':')[0]);
      const endHour = parseInt(firstSched.end_time.split(':')[0]);
      
      for (let h = startHour; h < endHour; h++) {
        const hStr = h < 10 ? `0${h}` : `${h}`;
        slots.push(`${hStr}:00`);
        slots.push(`${hStr}:30`);
      }
    } catch (e) {
      return ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
    }
    return slots.length > 0 ? slots : ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-teal my-5" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (errorMsg && !doctor) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger border-0 p-4 text-center rounded-3">
          <i className="bi bi-exclamation-octagon fs-2 mb-2 d-block"></i>
          <h5>Loading Failure</h5>
          <span>{errorMsg}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 animated-fade">
      
      <div className="row g-5">
        
        {/* 1. DOCTOR SUMMARY INFO PANEL */}
        <div className="col-lg-5">
          <div className="card glass-card border-0 p-4 mb-4">
            <h5 className="outfit-font fw-bold text-dark mb-4 pb-2 border-bottom border-light">Consultation Practitioner</h5>
            
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-teal bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center border border-success border-opacity-10 text-teal" style={{ width: '64px', height: '64px', backgroundColor: '#e6fffa', color: '#0d9488' }}>
                <span className="outfit-font fw-bold fs-4">{doctor.first_name[0]}{doctor.last_name[0]}</span>
              </div>
              <div>
                <h4 className="outfit-font fw-bold mb-1 text-dark">{doctor.name}</h4>
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10">{doctor.specialization_name}</span>
              </div>
            </div>

            <div className="bg-light p-3 rounded-3 mb-4" style={{ fontSize: '0.9rem' }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Hospital Network:</span>
                <span className="fw-semibold text-dark">{doctor.hospital_name}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Clinical City:</span>
                <span className="fw-semibold text-dark">{doctor.hospital_city}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Experience:</span>
                <span className="fw-semibold text-dark">{doctor.experience_years} Years</span>
              </div>
              <div className="d-flex justify-content-between pt-2 border-top border-secondary border-opacity-10">
                <span className="text-secondary fw-bold">Consultation Fee:</span>
                <span className="fw-extrabold text-success fs-5">₹{doctor.consultation_fee}</span>
              </div>
            </div>

            {/* Doctor availability hours tracker */}
            <h6 className="outfit-font fw-bold text-dark mb-3">Weekly Schedule Parameters</h6>
            {schedules.length === 0 ? (
              <div className="alert alert-warning border-0 p-3 rounded-3 mb-0" style={{ fontSize: '0.82rem' }}>
                <i className="bi bi-info-circle-fill me-2"></i>No custom schedules configured. Standard weekday (Mon-Fri 09:00 - 13:00) hours apply.
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {schedules.map((s) => (
                  <div key={s.id} className="d-flex justify-content-between align-items-center bg-light p-2 rounded-2" style={{ fontSize: '0.82rem' }}>
                    <span className="fw-semibold text-secondary">{s.day_of_week}</span>
                    <span className="badge bg-teal bg-opacity-10 text-teal border border-success border-opacity-10" style={{ color: '#0d9488' }}>
                      {s.start_time} - {s.end_time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. SCHEDULER BOOKING FORM */}
        <div className="col-lg-7">
          <div className="card glass-card border-0 p-4 p-md-5 h-100">
            <h3 className="outfit-font fw-bold text-dark mb-4"><i className="bi bi-calendar2-week-fill me-2 text-primary"></i>Schedule Appointment</h3>
            
            {errorMsg && (
              <div className="alert alert-danger border-0 rounded-3 mb-4 d-flex align-items-center gap-2" role="alert" style={{ background: '#fef2f2', color: '#b91c1c', fontSize: '0.86rem' }}>
                <i className="bi bi-exclamation-triangle-fill fs-5 text-danger"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit}>
              <div className="row g-4">
                
                {/* Appointment Date */}
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Select Consultation Date *</label>
                  <input 
                    type="date" 
                    className="form-control form-control-custom" 
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required 
                  />
                </div>

                {/* Appointment Time */}
                <div className="col-md-6">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Select Time Slot *</label>
                  <select 
                    className="form-select form-control-custom" 
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  >
                    <option value="">Choose timeslot...</option>
                    {generateTimeSlots().map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                {/* Reason */}
                <div className="col-12">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Consultation Symptoms / Booking Reason</label>
                  <textarea 
                    rows="3" 
                    className="form-control form-control-custom" 
                    placeholder="Briefly detail clinical history or symptoms..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </div>

                {/* Confirm and pay CTA */}
                <div className="col-12 pt-3">
                  <button 
                    type="submit" 
                    className="btn btn-accent-grad w-100 rounded-pill py-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Filing scheduling log...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card me-1 text-white"></i>
                        <span>Confirm & Proceed to Payment</span>
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
  );
};

export default AppointmentBooking;
