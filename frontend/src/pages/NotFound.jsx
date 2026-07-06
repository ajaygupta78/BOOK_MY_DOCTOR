import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center text-center p-4 bg-light-gradient" style={{ marginTop: '50px' }}>
      <div className="card border-0 shadow-lg p-5 rounded-4 bg-white glassmorphic" style={{ maxWidth: '600px' }}>
        {/* Heartbeat EKG Animation Container */}
        <div className="mb-4 d-flex justify-content-center">
          <svg className="ekg-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="100%" style={{ maxHeight: '150px' }}>
            {/* Grid Lines */}
            <path className="grid" d="M0,50 L300,50 M0,25 L300,25 M0,75 L300,75" stroke="#f1f3f7" strokeWidth="1" strokeDasharray="5,5" />
            
            {/* Pulsing EKG Heartbeat Line */}
            <path className="heartbeat" d="M 0,50 L 90,50 L 100,20 L 110,80 L 120,40 L 125,55 L 130,50 L 140,50 L 150,10 L 160,95 L 170,40 L 175,55 L 180,50 L 300,50" 
              fill="none" 
              stroke="#04b875" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>

        <h1 className="fw-extrabold text-navy display-3 mb-2">404</h1>
        <h3 className="fw-bold text-secondary mb-3">Heartbeat Lost... Page Not Found</h3>
        
        <p className="text-muted mb-4 fs-6">
          The medical record or diagnostic link you are trying to reach seems to be flatlining or has been removed from our directories.
        </p>

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm">
            <i className="bi bi-house-door-fill me-2"></i>Return Home
          </Link>
          <Link to="/contact" className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-bold">
            <i className="bi bi-envelope me-2"></i>Report Incident
          </Link>
        </div>
      </div>

      {/* Styled Heartbeat Keyframe Styles */}
      <style>{`
        .ekg-svg {
          background: #fafbfc;
          border-radius: 16px;
          padding: 10px;
          border: 2px solid #eef1f6;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .heartbeat {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawPulse 4s linear infinite;
        }
        @keyframes drawPulse {
          0% {
            stroke-dashoffset: 1000;
          }
          60% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  );
}
