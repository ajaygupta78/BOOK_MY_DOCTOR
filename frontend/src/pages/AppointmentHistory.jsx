import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AppointmentHistory = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Rating Feedback States
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await API.get('/appointments/patient');
      setAppointments(response.data);
    } catch (err) {
      setErrorMsg('Failed to query appointment logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = (appt) => {
    navigate(`/payment?appointment_id=${appt.id}&amount=${appt.consultation_fee}`);
  };

  const handleDownloadInvoice = (appt) => {
    // Navigating to the payment screen with pre-applied paid context will render the invoice directly
    navigate(`/payment?appointment_id=${appt.id}&amount=${appt.consultation_fee}`);
  };

  const openFeedbackModal = (apptId) => {
    setSelectedApptId(apptId);
    setRating(5);
    setComments('');
    setFeedbackSuccess('');
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApptId) return;

    setSubmittingFeedback(true);
    setErrorMsg('');
    try {
      await API.post(`/appointments/${selectedApptId}/feedback`, {
        rating: rating,
        comments: comments
      });
      setFeedbackSuccess('Thank you! Your clinical review rating has been logged.');
      
      // Refresh timeline to reflect review adjustments
      setTimeout(() => {
        // Trigger modal dismiss
        const closeBtn = document.getElementById('closeFeedbackModalBtn');
        if (closeBtn) closeBtn.click();
        fetchHistory();
      }, 2000);

    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error occurred while saving rating.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-teal my-5" role="status">
          <span className="visually-hidden">Syncing records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 animated-fade">
      
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div>
          <h1 className="outfit-font fw-extrabold text-dark mb-1">My Booking History</h1>
          <p className="text-secondary mb-0">Track clinical slots status, complete outstanding invoices, and review specialist consultations.</p>
        </div>
        <button onClick={() => navigate('/doctors')} className="btn btn-primary-grad rounded-pill px-4 fw-semibold">
          <i className="bi bi-calendar2-plus me-1 text-white"></i> Book New Consult
        </button>
      </div>

      {errorMsg && !selectedApptId && (
        <div className="alert alert-danger border-0 rounded-3 mb-4" role="alert" style={{ background: '#fef2f2', color: '#b91c1c' }}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{errorMsg}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-4">
          <i className="bi bi-calendar2-x fs-1 text-muted mb-3"></i>
          <h4 className="outfit-font fw-bold text-dark">No Bookings Recorded</h4>
          <p className="text-secondary mb-4">You have not scheduled any appointments yet. Search doctors to schedule your first consultation.</p>
          <button onClick={() => navigate('/doctors')} className="btn btn-accent-grad rounded-pill px-4 mx-auto fw-bold text-white">
            <i className="bi bi-search me-2"></i> Search Specialized Doctors
          </button>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.92rem' }}>
              
              <thead className="table-light text-secondary" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <tr>
                  <th className="py-3 ps-4">Doctor Practitioner</th>
                  <th className="py-3">Hospital Network</th>
                  <th className="py-3">Consultation date/time</th>
                  <th className="py-3">Scheduler Status</th>
                  <th className="py-3">Invoice Balance</th>
                  <th className="py-3 pe-4 text-end">Action Controls</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} className="border-bottom border-light">
                    
                    {/* Doctor Practitioner name */}
                    <td className="py-3 ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold" style={{ width: '42px', height: '42px', fontSize: '0.9rem' }}>
                          DR
                        </div>
                        <div>
                          <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '0.92rem' }}>{appt.doctor_name}</h6>
                          <span className="text-secondary" style={{ fontSize: '0.78rem' }}>{appt.doctor_specialization}</span>
                        </div>
                      </div>
                    </td>

                    {/* Hospital Name */}
                    <td className="py-3 text-secondary">{appt.hospital_name}</td>

                    {/* Date/Time */}
                    <td className="py-3">
                      <span className="fw-semibold text-dark">{appt.appointment_date}</span>
                      <span className="d-block text-secondary" style={{ fontSize: '0.78rem' }}>@ {appt.appointment_time} hrs</span>
                    </td>

                    {/* Booking Status Badge */}
                    <td className="py-3">
                      <span className={`badge-status badge-${appt.status.toLowerCase()}`}>
                        {appt.status}
                      </span>
                    </td>

                    {/* Payment Invoice Status */}
                    <td className="py-3">
                      {appt.payment_status === 'Success' ? (
                        <span className="text-success fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Paid</span>
                      ) : appt.status === 'Rejected' || appt.status === 'Cancelled' ? (
                        <span className="text-muted text-decoration-line-through">₹{appt.consultation_fee}</span>
                      ) : (
                        <button onClick={() => handleCheckout(appt)} className="btn btn-warning rounded-pill btn-xs py-1 px-3 fw-bold text-dark" style={{ fontSize: '0.75rem' }}>
                          <i className="bi bi-wallet2 me-1"></i>Pay ₹{appt.consultation_fee}
                        </button>
                      )}
                    </td>

                    {/* Action buttons depending on status */}
                    <td className="py-3 pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {appt.payment_status === 'Success' && (
                          <button 
                            onClick={() => handleDownloadInvoice(appt)} 
                            className="btn btn-outline-primary btn-sm rounded-pill px-3" 
                            title="Invoice Receipt"
                          >
                            <i className="bi bi-receipt me-1"></i> Receipt
                          </button>
                        )}
                        {appt.status === 'Completed' && (
                          <button 
                            onClick={() => openFeedbackModal(appt.id)}
                            className="btn btn-accent-grad text-white btn-sm rounded-pill px-3"
                            data-bs-toggle="modal" 
                            data-bs-target="#feedbackSubmitModal"
                          >
                            <i className="bi bi-star me-1"></i> Rate Consult
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
         PATIENT CONSULTATION RATING SUBMISSION MODAL
         ===================================================================== */}
      <div className="modal fade" id="feedbackSubmitModal" tabIndex="-1" aria-labelledby="feedbackSubmitModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '450px' }}>
          <div className="modal-content border-0 glass-card">
            
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title outfit-font fw-bold text-dark" id="feedbackSubmitModalLabel">Consultation Rating Feedback</h5>
              <button id="closeFeedbackModalBtn" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <form onSubmit={handleFeedbackSubmit}>
              <div className="modal-body py-4">
                
                {feedbackSuccess && (
                  <div className="alert alert-success border-0 rounded-3 mb-3 d-flex align-items-center gap-2" role="alert" style={{ fontSize: '0.84rem' }}>
                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                    <span>{feedbackSuccess}</span>
                  </div>
                )}

                {errorMsg && selectedApptId && (
                  <div className="alert alert-danger border-0 rounded-3 mb-3" role="alert" style={{ fontSize: '0.82rem' }}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>{errorMsg}
                  </div>
                )}

                <p className="text-secondary mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Please rate your diagnosis visit experience. Your honest reviews help improve corporate clinical service qualities.
                </p>

                {/* Star selectors */}
                <div className="mb-4 text-center">
                  <label className="form-label text-secondary fw-semibold d-block mb-2" style={{ fontSize: '0.85rem' }}>Select Star Rating</label>
                  <div className="d-flex justify-content-center gap-2 fs-2 text-warning">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i 
                        key={star} 
                        onClick={() => setRating(star)} 
                        className={`bi bi-star${star <= rating ? '-fill' : ''}`} 
                        style={{ cursor: 'pointer' }}
                      ></i>
                    ))}
                  </div>
                  <span className="badge bg-light text-primary border mt-2 px-3 fw-bold" style={{ fontSize: '0.8rem' }}>
                    {rating === 5 ? 'Excellent 🌟' : rating === 4 ? 'Very Good 👍' : rating === 3 ? 'Good Ok' : 'Needs Improvement'}
                  </span>
                </div>

                {/* Comment area */}
                <div className="mb-2">
                  <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Clinical Comments</label>
                  <textarea 
                    rows="3" 
                    className="form-control form-control-custom" 
                    placeholder="Type comments about doctor bio advice or hospital cleanliness..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  ></textarea>
                </div>

              </div>

              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-3" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary-grad text-white rounded-pill px-4" disabled={submittingFeedback}>
                  {submittingFeedback ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>

    </div>
  );
};

export default AppointmentHistory;
