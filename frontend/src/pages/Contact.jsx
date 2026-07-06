import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setLoading(true);
    // Simulate API Network lag
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="container py-5 animated-fade">
      
      {/* 1. HERO HEADER */}
      <div className="text-center max-w-lg mx-auto mb-5">
        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill fw-semibold outfit-font mb-2">
          Get in Touch
        </span>
        <h1 className="outfit-font fw-bold text-dark display-5">Contact Support</h1>
        <p className="lead text-secondary" style={{ fontSize: '1.05rem' }}>
          Have inquiries regarding our network or need platform assistance? Drop us a line.
        </p>
      </div>

      <div className="row g-5 align-items-stretch">
        
        {/* 2. CONTACT METADATA CARDS */}
        <div className="col-lg-5">
          <div className="d-flex flex-column gap-4 h-100 justify-content-between">
            
            {/* Headquarters Card */}
            <div className="card glass-card border-0 p-4 flex-grow-1">
              <div className="card-body d-flex align-items-start gap-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary"><i className="bi bi-geo-alt-fill fs-3"></i></div>
                <div>
                  <h5 className="outfit-font fw-bold text-dark mb-1">Corporate Headquarters</h5>
                  <p className="text-secondary mb-0" style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
                    Healthcare Tech Park, Sector-62, <br />
                    Noida, Uttar Pradesh - 201301, India.
                  </p>
                </div>
              </div>
            </div>

            {/* Helpline Card */}
            <div className="card glass-card border-0 p-4 flex-grow-1">
              <div className="card-body d-flex align-items-start gap-3">
                <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success"><i className="bi bi-telephone-fill fs-3"></i></div>
                <div>
                  <h5 className="outfit-font fw-bold text-dark mb-1">24/7 Helpline Support</h5>
                  <p className="text-secondary mb-1" style={{ fontSize: '0.88rem' }}>Toll Free: 1800-419-5000</p>
                  <p className="text-secondary mb-0" style={{ fontSize: '0.88rem' }}>Landline: +91-120-4962200</p>
                </div>
              </div>
            </div>

            {/* Support Email Card */}
            <div className="card glass-card border-0 p-4 flex-grow-1">
              <div className="card-body d-flex align-items-start gap-3">
                <div className="bg-info bg-opacity-10 p-3 rounded-3 text-info"><i className="bi bi-envelope-fill fs-3"></i></div>
                <div>
                  <h5 className="outfit-font fw-bold text-dark mb-1">Support Email Accounts</h5>
                  <p className="text-secondary mb-1" style={{ fontSize: '0.88rem' }}>support@bookmydoctor.com</p>
                  <p className="text-secondary mb-0" style={{ fontSize: '0.88rem' }}>inquiry@bookmydoctor.com</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. CONTACT INTERACTIVE FORM */}
        <div className="col-lg-7">
          <div className="card glass-card border-0 p-4 p-md-5 h-100">
            <div className="card-body">
              <h3 className="outfit-font fw-bold text-dark mb-4"><i className="bi bi-chat-left-dots me-2 text-primary"></i>Send Message</h3>
              
              {submitted && (
                <div className="alert alert-success border-0 rounded-3 d-flex align-items-center gap-3 animated-fade" role="alert" style={{ background: '#ecfdf5', color: '#047857' }}>
                  <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                  <div>
                    <h6 className="alert-heading mb-0 fw-bold outfit-font">Inquiry Dispatched Successfully!</h6>
                    <span style={{ fontSize: '0.84rem' }}>A simulated support ticket has been registered. We will reply within 24 hours.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  
                  {/* Name field */}
                  <div className="col-md-6">
                    <label className="form-label text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="form-control form-control-custom" 
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  {/* Email field */}
                  <div className="col-md-6">
                    <label className="form-label text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      className="form-control form-control-custom" 
                      placeholder="e.g. john@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  {/* Subject field */}
                  <div className="col-12">
                    <label className="form-label text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>Subject Topic</label>
                    <input 
                      type="text" 
                      name="subject" 
                      className="form-control form-control-custom" 
                      placeholder="e.g. Appointment rescheduling assistance"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Message field */}
                  <div className="col-12">
                    <label className="form-label text-secondary fw-semibold" style={{ fontSize: '0.85rem' }}>Detailed Message</label>
                    <textarea 
                      name="message" 
                      rows="4" 
                      className="form-control form-control-custom" 
                      placeholder="Type details of your query..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  {/* Submit button */}
                  <div className="col-12 pt-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary-grad w-100 rounded-pill py-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>Dispatching message...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill text-white"></i>
                          <span>Transmit Message</span>
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

    </div>
  );
};

export default Contact;
