import React from 'react';

const About = () => {
  return (
    <div className="container py-5 animated-fade">
      
      {/* 1. HERO HEADER */}
      <div className="text-center max-w-lg mx-auto mb-5">
        <span className="badge bg-teal bg-opacity-10 text-teal border border-success border-opacity-25 px-3 py-2 rounded-pill fw-semibold outfit-font mb-2" style={{ color: '#0d9488', backgroundColor: '#e6fffa' }}>
          Who We Are
        </span>
        <h1 className="outfit-font fw-bold text-dark display-5">About Book My Doctor</h1>
        <p className="lead text-secondary" style={{ fontSize: '1.05rem' }}>
          Revolutionizing e-healthcare management through seamless digital doctor booking frameworks.
        </p>
      </div>

      {/* 2. VISION & MISSION CARDS */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card glass-card h-100 border-0 p-4">
            <div className="card-body">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '56px', height: '56px' }}>
                <i className="bi bi-eye-fill fs-4"></i>
              </div>
              <h3 className="outfit-font fw-bold text-dark mb-3">Our Vision</h3>
              <p className="text-secondary" style={{ lineHeight: '1.7', fontSize: '0.94rem' }}>
                To become a globally accessible, unified digital health channel where scheduling medical diagnoses and consulting specialist physicians requires just a single tap. We aim to decrease hospital wait queues and optimize outpatient operations globally.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card glass-card h-100 border-0 p-4">
            <div className="card-body">
              <div className="bg-teal bg-opacity-10 text-teal rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '56px', height: '56px', backgroundColor: '#e6fffa', color: '#0d9488' }}>
                <i className="bi bi-bullseye fs-4"></i>
              </div>
              <h3 className="outfit-font fw-bold text-dark mb-3">Our Mission</h3>
              <p className="text-secondary" style={{ lineHeight: '1.7', fontSize: '0.94rem' }}>
                To empower patients and physicians by delivering a secure, highly transparent, and robust scheduler system. We integrate doctor specialized search, visual city lookups, secure transactional payment simulations, and dashboard trackers to achieve clinic management excellence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CORE HEALTHCARE VALUES */}
      <div className="bg-white rounded-4 p-5 shadow-sm border border-light mb-5">
        <div className="text-center mb-5">
          <h2 className="outfit-font fw-bold text-dark">Our Healthcare Principles</h2>
          <p className="text-secondary">Core values guiding our system operations and physician standards.</p>
        </div>

        <div className="row g-4 text-center">
          
          <div className="col-md-3 col-sm-6">
            <div className="p-3">
              <div className="text-teal mb-3" style={{ color: '#0d9488' }}><i className="bi bi-shield-heart-fill fs-1"></i></div>
              <h5 className="outfit-font fw-bold text-dark">Compassionate Care</h5>
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Placing patient clinical comfort and mental relief at the absolute core of our system logic.</p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="p-3">
              <div className="text-primary mb-3"><i className="bi bi-fingerprint fs-1"></i></div>
              <h5 className="outfit-font fw-bold text-dark">High Integrity</h5>
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Encrypted security keys, strict role decorators, and absolute data protection.</p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="p-3">
              <div className="text-warning mb-3"><i className="bi bi-lightning-charge-fill fs-1"></i></div>
              <h5 className="outfit-font fw-bold text-dark">Immediate Access</h5>
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Zero patient scheduling lags, automated schedule updates, and instant invoice generation.</p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="p-3">
              <div className="text-success mb-3"><i className="bi bi-graph-up-arrow fs-1"></i></div>
              <h5 className="outfit-font fw-bold text-dark">Operational Quality</h5>
              <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Rich dashboards, real-time analytics calculations, and integrated feedback portals.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default About;
