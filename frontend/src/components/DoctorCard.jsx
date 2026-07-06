import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBooking = () => {
    if (!user) {
      // If user not authenticated, navigate to login first
      navigate('/login');
    } else {
      navigate(`/book-appointment/${doctor.id}`);
    }
  };

  return (
    <div className="card glass-card h-100 border-0 overflow-hidden animated-fade">
      <div style={{ height: '6px', background: 'linear-gradient(90deg, #0d9488 0%, #10b981 100%)' }}></div>

      <div className="card-body p-4 d-flex flex-column">
        {/* Header Avatar and Tags */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="bg-teal bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center border border-success border-opacity-10 text-teal" style={{ width: '56px', height: '56px', backgroundColor: '#e6fffa', color: '#0d9488' }}>
            <span className="outfit-font fw-bold" style={{ fontSize: '1.25rem' }}>
              {doctor.first_name[0]}{doctor.last_name[0]}
            </span>
          </div>
          <div>
            <h5 className="card-title outfit-font fw-bold mb-0 text-dark">{doctor.name}</h5>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 mt-1" style={{ fontSize: '0.78rem' }}>
              {doctor.specialization_name}
            </span>
          </div>
        </div>

        {/* Short bio snippet */}
        <p className="card-text text-secondary mb-3 flex-grow-1" style={{ fontSize: '0.88rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
          {doctor.bio || 'No medical bio biography provided.'}
        </p>

        {/* Metadata Details */}
        <div className="bg-light p-3 rounded-3 mb-4" style={{ fontSize: '0.85rem' }}>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-secondary"><i className="bi bi-hospital me-1 text-muted"></i> Hospital:</span>
            <span className="fw-semibold text-dark text-truncate text-end ms-2" style={{ maxWidth: '160px' }}>{doctor.hospital_name}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-secondary"><i className="bi bi-award me-1 text-muted"></i> Experience:</span>
            <span className="fw-semibold text-dark">{doctor.experience_years} Years</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-secondary"><i className="bi bi-cash-stack me-1 text-muted"></i> Consultation Fee:</span>
            <span className="fw-bold text-success" style={{ fontSize: '0.92rem' }}>₹{doctor.consultation_fee}</span>
          </div>
        </div>
      </div>

      <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0">
        <button 
          onClick={handleBooking} 
          className="btn btn-primary-grad w-100 rounded-pill fw-semibold btn-sm py-2"
        >
          <i className="bi bi-calendar2-plus me-1 text-white"></i> Book Appointment Now
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
