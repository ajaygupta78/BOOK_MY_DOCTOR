import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="animated-fade">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="py-5 text-white position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', minHeight: '650px', display: 'flex', alignItems: 'center' }}>
        {/* Absolute Background Circles for Aesthetic */}
        <div className="position-absolute" style={{ width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(2,132,199,0.15) 0%, rgba(0,0,0,0) 70%)', top: '-10%', right: '-10%' }}></div>
        <div className="position-absolute" style={{ width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, rgba(0,0,0,0) 70%)', bottom: '-10%', left: '-10%' }}></div>

        <div className="container position-relative">
          <div className="row align-items-center g-5">
            
            {/* Hero Left Content */}
            <div className="col-lg-6">
              <span className="badge bg-teal bg-opacity-10 text-info border border-info border-opacity-25 mb-3 px-3 py-2 rounded-pill fw-semibold outfit-font" style={{ fontSize: '0.85rem' }}>
                <i className="bi bi-shield-plus me-1 text-info"></i> Modern E-Healthcare Solution
              </span>
              <h1 className="display-4 outfit-font fw-extrabold text-white mb-3" style={{ lineHeight: '1.2' }}>
                Your Health, Our Priority. <br />
                <span className="text-info" style={{ background: 'linear-gradient(90deg, #38bdf8 0%, #2dd4bf 100%)', WebkitBackgroundClip: 'text', WebkitTextFill_color: 'transparent', WebkitTextFillColor: 'transparent' }}>Book Top Doctors</span> Online
              </h1>
              <p className="lead text-secondary mb-4" style={{ fontSize: '1.08rem', lineHeight: '1.7' }}>
                Connect with highly certified physicians, schedule real-time clinical slots, make secure cashless consultation transactions, and manage all your medical records through one seamless portal.
              </p>
              
              <div className="d-flex flex-wrap gap-3">
                <Link to="/doctors" className="btn btn-accent-grad btn-lg rounded-pill px-4 fw-semibold text-white">
                  <i className="bi bi-search-heart me-2"></i> Find Doctor
                </Link>
                <Link to="/hospitals" className="btn btn-outline-light btn-lg rounded-pill px-4 fw-semibold">
                  <i className="bi bi-building me-2"></i> View Hospitals
                </Link>
              </div>

              {/* Stat Quick Badges */}
              <div className="d-flex gap-4 mt-5 pt-4 border-top border-secondary border-opacity-25" style={{ fontSize: '0.9rem' }}>
                <div>
                  <h4 className="text-white outfit-font fw-bold mb-0">150+</h4>
                  <span className="text-muted">Certified Doctors</span>
                </div>
                <div className="border-end border-secondary border-opacity-25"></div>
                <div>
                  <h4 className="text-white outfit-font fw-bold mb-0">20+</h4>
                  <span className="text-muted">Top Hospitals</span>
                </div>
                <div className="border-end border-secondary border-opacity-25"></div>
                <div>
                  <h4 className="text-white outfit-font fw-bold mb-0">99.8%</h4>
                  <span className="text-muted">Satisfaction Rate</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visuals */}
            <div className="col-lg-6 d-none d-lg-block">
              <div className="position-relative float-card">
                <div className="glass-card p-4 position-absolute shadow-lg" style={{ top: '10%', left: '-5%', width: '220px', zIndex: '2' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-success bg-opacity-10 p-2 rounded-circle"><i className="bi bi-calendar2-check-fill text-success fs-4"></i></div>
                    <div>
                      <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '0.9rem' }}>20K+ Bookings</h6>
                      <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Successfully Handled</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-4 position-absolute shadow-lg" style={{ bottom: '15%', right: '-5%', width: '220px', zIndex: '2' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-circle"><i className="bi bi-credit-card-2-front-fill text-primary fs-4"></i></div>
                    <div>
                      <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '0.9rem' }}>Secured Payments</h6>
                      <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Simulated Ledgers</span>
                    </div>
                  </div>
                </div>

                {/* Main Aesthetic Healthcare Graphic Representation */}
                <div className="rounded-4 overflow-hidden border border-secondary border-opacity-25 bg-secondary bg-opacity-10 p-5 d-flex align-items-center justify-content-center shadow" style={{ height: '420px', backdropFilter: 'blur(5px)' }}>
                  <div className="text-center">
                    <i className="bi bi-heart-pulse-fill pulse-heart text-info mb-4" style={{ fontSize: '7rem' }}></i>
                    <h3 className="outfit-font fw-bold text-white mb-2">Book My Doctor</h3>
                    <p className="text-secondary px-4">Instant medical booking engine. Choose your city, select specialities, and schedule clinical slots.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE SPECIALITIES GRID */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center max-w-lg mx-auto mb-5">
            <h2 className="outfit-font fw-bold text-dark">Explore Medical Specialities</h2>
            <p className="text-secondary">Consult top-tier certified specialists for your diagnostic requirements.</p>
          </div>

          <div className="row g-4">
            {/* Speciality 1 */}
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm glass-card text-center p-4">
                <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <i className="bi bi-heart-fill fs-3"></i>
                </div>
                <h5 className="outfit-font fw-bold mb-2">Cardiology</h5>
                <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Advanced cardiovascular assessment and valve management services.</p>
              </div>
            </div>
            {/* Speciality 2 */}
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm glass-card text-center p-4">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <i className="bi bi-palette-fill fs-3"></i>
                </div>
                <h5 className="outfit-font fw-bold mb-2">Dermatology</h5>
                <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Clinical diagnostics and modern cosmetic skin therapies.</p>
              </div>
            </div>
            {/* Speciality 3 */}
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm glass-card text-center p-4">
                <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <i className="bi bi-people-fill fs-3"></i>
                </div>
                <h5 className="outfit-font fw-bold mb-2">Pediatrics</h5>
                <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Attentive, specialized healthcare for infants, toddlers, and teens.</p>
              </div>
            </div>
            {/* Speciality 4 */}
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm glass-card text-center p-4">
                <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <i className="bi bi-activity fs-3"></i>
                </div>
                <h5 className="outfit-font fw-bold mb-2">Neurology</h5>
                <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Therapies addressing spinal, neural, and complex brain conditions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TESTIMONIALS SECTION */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="outfit-font fw-bold text-dark">What Our Patients Say</h2>
            <p className="text-secondary">Read actual reviews from patients who booked consultations through our network.</p>
          </div>

          <div className="row g-4">
            {/* Testimonial 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="quote-card h-100">
                <p className="text-secondary mb-4" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                  "Booking a cardiac checkup through Book My Doctor was effortless. I was able to find Dr. Robert Smith at Apollo, make a secure dummy card payment, and get instant booking approval."
                </p>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center outfit-font fw-bold" style={{ width: '45px', height: '45px' }}>PJ</div>
                  <div>
                    <h6 className="mb-0 text-dark fw-bold">Patrick Jones</h6>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Chennai, Patient</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="quote-card h-100">
                <p className="text-secondary mb-4" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                  "The interface is so clean! Being able to filter doctors by city and hospital makes doctor search very intuitive. I downloaded my appointment invoice immediately after booking. Recommended BCA project!"
                </p>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-teal text-white rounded-circle d-flex align-items-center justify-content-center outfit-font fw-bold" style={{ width: '45px', height: '45px', backgroundColor: '#0d9488' }}>SD</div>
                  <div>
                    <h6 className="mb-0 text-dark fw-bold">Sarah Doe</h6>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Delhi, Patient</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="col-lg-4 col-md-6 d-md-none d-lg-block">
              <div className="quote-card h-100">
                <p className="text-secondary mb-4" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                  "As a doctor, the doctor-dashboard is excellent. I can quickly toggle my weekly schedules and approve or cancel appointments on a single screen. Excellent UX design."
                </p>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center outfit-font fw-bold" style={{ width: '45px', height: '45px', backgroundColor: '#0284c7' }}>RS</div>
                  <div>
                    <h6 className="mb-0 text-dark fw-bold">Dr. Robert Smith</h6>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Cardiologist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQS ACCORDION SECTION */}
      <section className="py-5 bg-white">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="text-center mb-5">
            <h2 className="outfit-font fw-bold text-dark">Frequently Asked Questions</h2>
            <p className="text-secondary">Got questions? We have answers to help you navigate our healthcare ecosystem.</p>
          </div>

          <div className="accordion faq-accordion" id="faqAccordion">
            
            <div className="accordion-item">
              <h2 className="accordion-header" id="faqHeadingOne">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseOne" aria-expanded="true" aria-controls="faqCollapseOne">
                  How do I book a doctor's appointment?
                </button>
              </h2>
              <div id="faqCollapseOne" className="accordion-collapse collapse show" aria-labelledby="faqHeadingOne" data-bs-parent="#faqAccordion">
                <div className="accordion-body text-secondary" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                  To book an appointment, first create a patient account or log in. Head over to the "Search Doctors" tab, look up your desired physician by specialization, choose an available date and timeslot, fill out your consultation reason, and proceed through the card payment simulation.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faqHeadingTwo">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseTwo" aria-expanded="false" aria-controls="faqCollapseTwo">
                  What is the payment simulation module?
                </button>
              </h2>
              <div id="faqCollapseTwo" className="accordion-collapse collapse" aria-labelledby="faqHeadingTwo" data-bs-parent="#faqAccordion">
                <div className="accordion-body text-secondary" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                  Since this is a simulated academic project, we do not charge real credit cards. We have implemented a high-fidelity visual Razorpay-style payment interface. It simulates transaction parameters (16-digit card validation, cardholder name, CVV, OTP codes) and creates an official payment ledger entry, issuing a downloadable invoice receipt.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faqHeadingThree">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapseThree" aria-expanded="false" aria-controls="faqCollapseThree">
                  Can doctors modify their slot schedules?
                </button>
              </h2>
              <div id="faqCollapseThree" className="accordion-collapse collapse" aria-labelledby="faqHeadingThree" data-bs-parent="#faqAccordion">
                <div className="accordion-body text-secondary" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                  Yes. Doctors can log in with their secure credential details, visit the doctor-dashboard, and access their availability controls. Here, they can append availability records for any weekday (Monday - Sunday), specify custom hours, or delete slot schedules instantly.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
