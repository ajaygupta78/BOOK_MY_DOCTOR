import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5" style={{ background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' }}>
      <div className="container">
        <div className="row g-4">
          
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4 outfit-font fw-bold text-info" style={{ letterSpacing: '1px' }}>
              <i className="bi bi-heart-pulse-fill me-2"></i> Book My Doctor
            </h5>
            <p className="text-secondary" style={{ fontSize: '0.92rem', lineHeight: '1.7' }}>
              Book My Doctor is a complete online appointment scheduling and medical management system. We bridge the gap between patients, top hospitals, and specialized doctors to offer premium healthcare at your fingertips.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="https://www.facebook.com/share/1DNq7GtDwv/" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}><i className="bi bi-facebook"></i></a>
              <a href="https://x.com/ajaygupta113715" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}><i className="bi bi-twitter-x"></i></a>
              <a href="https://www.instagram.com/innocent__boy242?igsh=dHkxa3o5MXFhNW5s" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}><i className="bi bi-instagram"></i></a>
              <a href="https://www.linkedin.com/in/ajay-gupta18/" className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0 ms-lg-auto">
            <h6 className="text-uppercase mb-4 outfit-font fw-bold text-light" style={{ letterSpacing: '1px' }}>Quick Links</h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
              <li>
                <Link to="/" className="text-secondary text-decoration-none hover-light transition">Home</Link>
              </li>
              <li>
                <Link to="/hospitals" className="text-secondary text-decoration-none hover-light transition">Search Hospitals</Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary text-decoration-none hover-light transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary text-decoration-none hover-light transition">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Medical Specialities Column */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h6 className="text-uppercase mb-4 outfit-font fw-bold text-light" style={{ letterSpacing: '1px' }}>Specialities</h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
              <li className="text-secondary"><i className="bi bi-patch-check me-2 text-info"></i>Cardiology</li>
              <li className="text-secondary"><i className="bi bi-patch-check me-2 text-info"></i>Dermatology</li>
              <li className="text-secondary"><i className="bi bi-patch-check me-2 text-info"></i>Pediatrics</li>
              <li className="text-secondary"><i className="bi bi-patch-check me-2 text-info"></i>Neurology</li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h6 className="text-uppercase mb-4 outfit-font fw-bold text-light" style={{ letterSpacing: '1px' }}>Newsletter</h6>
            <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Subscribe to get latest medical safety updates and doctor schedules.</p>
            <form onSubmit={handleSubscribe} className="mt-3">
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control bg-transparent text-white border-secondary" 
                  placeholder="Enter email..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  style={{ borderRadius: '8px 0 0 8px' }}
                />
                <button className="btn btn-primary-grad" type="submit" style={{ borderRadius: '0 8px 8px 0' }}>
                  <i className="bi bi-send-fill text-white"></i>
                </button>
              </div>
              {subscribed && (
                <div className="text-success mt-2 fw-semibold" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-check-circle-fill me-1"></i> Subscribed successfully!
                </div>
              )}
            </form>
          </div>

        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="row align-items-center">
          <div className="col-md-7 text-center text-md-start">
            <p className="mb-0 text-secondary" style={{ fontSize: '0.85rem' }}>
              &copy; {new Date().getFullYear()} Book My Doctor System. BCA Final Year Project Submission. All Rights Reserved.
            </p>
          </div>
          <div className="col-md-5 text-center text-md-end mt-2 mt-md-0" style={{ fontSize: '0.85rem' }}>
            <span className="text-secondary">Designed By ❤️ Ajay Gupta</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
