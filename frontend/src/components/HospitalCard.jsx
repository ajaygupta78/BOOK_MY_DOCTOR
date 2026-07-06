import React from 'react';
import { useNavigate } from 'react-router-dom';

const HospitalCard = ({ hospital }) => {
  const navigate = useNavigate();

  const handleFindDoctors = () => {
    // Navigate to doctor search with pre-applied hospital filter
    navigate(`/doctors?hospital_id=${hospital.id}&hospital_name=${encodeURIComponent(hospital.name)}`);
  };

  return (
    <div className="card glass-card h-100 border-0 overflow-hidden animated-fade">
      {/* Decorative medical badge top */}
      <div style={{ height: '6px', background: 'linear-gradient(90deg, #0284c7 0%, #0d9488 100%)' }}></div>
      
      <div className="card-body p-4 d-flex flex-column">
        {/* Rating badge */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className="badge bg-light text-primary border border-primary border-opacity-25 px-2 py-1" style={{ fontSize: '0.8rem' }}>
            <i className="bi bi-geo-alt-fill me-1"></i>{hospital.city}
          </span>
          <span className="text-warning fw-bold d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
            <i className="bi bi-star-fill me-1"></i>{hospital.rating || '5.0'}
          </span>
        </div>

        {/* Hospital details */}
        <h5 className="card-title outfit-font fw-bold text-dark mb-2">{hospital.name}</h5>
        
        <p className="card-text text-secondary mb-3 flex-grow-1" style={{ fontSize: '0.88rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          <i className="bi bi-map me-2 text-muted"></i>{hospital.address}
        </p>

        <div className="border-top pt-3 mt-auto d-flex flex-column gap-2" style={{ fontSize: '0.85rem' }}>
          <div className="text-secondary">
            <i className="bi bi-telephone me-2 text-info"></i>{hospital.phone}
          </div>
          <div className="text-secondary text-truncate">
            <i className="bi bi-envelope me-2 text-info"></i>{hospital.email}
          </div>
        </div>
      </div>

      <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0">
        <button 
          onClick={handleFindDoctors} 
          className="btn btn-outline-primary w-100 rounded-pill fw-semibold btn-sm py-2"
        >
          <i className="bi bi-search-heart me-1"></i> Consult Available Doctors
        </button>
      </div>
    </div>
  );
};

export default HospitalCard;
