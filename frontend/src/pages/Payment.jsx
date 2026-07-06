import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const appointmentId = searchParams.get('appointment_id');
  const amount = searchParams.get('amount') || '0.00';

  // Details states
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Card Payment details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Simulated Processing States
  const [processing, setProcessing] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [submittingOtp, setSubmittingOtp] = useState(false);
  
  // Transaction Success State
  const [txnSuccess, setTxnSuccess] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!appointmentId) {
      navigate('/patient-dashboard');
      return;
    }
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/appointments/${appointmentId}`);
      setAppointment(response.data);
    } catch (err) {
      setErrorMsg('Failed to query appointment parameters.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardNumberChange = (e) => {
    // Format card number with spaces (e.g. xxxx xxxx xxxx xxxx)
    const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(val.slice(0, 19)); // Cap at 16 digits + 3 spaces
  };

  const handleExpiryChange = (e) => {
    // Format expiration date MM/YY
    const val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      setExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
    } else {
      setExpiry(val);
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Input checking
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 16) {
      setErrorMsg('Invalid card details. Please enter a valid 16-digit card number.');
      return;
    }
    if (expiry.length < 5) {
      setErrorMsg('Please specify card expiration MM/YY.');
      return;
    }
    if (cvv.length < 3) {
      setErrorMsg('Please specify 3-digit CVV code.');
      return;
    }

    setProcessing(true);
    
    // Simulate transaction delay
    setTimeout(() => {
      setProcessing(false);
      setOtpSent(true); // Trigger OTP verification layout
    }, 2000);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otpCode !== '123456') {
      setErrorMsg('Invalid OTP code. For this simulation, use mock code: 123456');
      return;
    }

    setSubmittingOtp(true);
    setErrorMsg('');

    try {
      const response = await API.post('/payments/charge', {
        appointment_id: appointmentId,
        amount: amount,
        card_number: cardNumber,
        payment_method: 'Simulated Credit Card'
      });

      setReceiptDetails(response.data.receipt);
      setTxnSuccess(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error occurred while verifying transaction.');
    } finally {
      setSubmittingOtp(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary my-5" role="status">
          <span className="visually-hidden">Syncing billing invoice...</span>
        </div>
      </div>
    );
  }

  // =====================================================================
  // SUCCESS LEDGER SCREEN & DOWNLOADABLE PRINT INVOICE
  // =====================================================================
  if (txnSuccess && receiptDetails) {
    return (
      <div className="container py-5 animated-fade print-container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            
            {/* Success Feedback Alert (Hide when printing) */}
            <div className="alert alert-success border-0 rounded-4 p-4 d-flex align-items-start gap-3 mb-4 no-print" style={{ background: '#ecfdf5', color: '#047857' }}>
              <i className="bi bi-patch-check-fill text-success" style={{ fontSize: '2.5rem' }}></i>
              <div>
                <h5 className="alert-heading fw-bold outfit-font mb-1">Transaction Completed Successfully!</h5>
                <p className="mb-0" style={{ fontSize: '0.88rem', opacity: '0.9' }}>
                  Your dummy card payment of ₹{amount} was authorized by our simulated gateway. The appointment is now approved.
                </p>
              </div>
            </div>

            {/* Printable SVG/HTML Invoice Container */}
            <div className="card border-0 shadow-sm p-4 p-md-5 bg-white rounded-4 invoice-card" style={{ border: '1px solid #e2e8f0' }}>
              
              {/* Invoice Header */}
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 pb-4 mb-4 border-bottom">
                <div>
                  <h3 className="outfit-font fw-extrabold text-info mb-1" style={{ color: '#0d9488' }}>
                    <i className="bi bi-heart-pulse-fill me-2 text-danger"></i>BOOK MY DOCTOR
                  </h3>
                  <span className="text-secondary" style={{ fontSize: '0.82rem' }}>Digital Clinic Consultation Invoice</span>
                </div>
                <div className="text-md-end">
                  <h6 className="outfit-font fw-bold text-dark mb-1">Receipt ID: {receiptDetails.transaction_id.split('_')[3]}</h6>
                  <span className="text-secondary" style={{ fontSize: '0.82rem' }}>Date: {new Date(receiptDetails.payment_date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Patient and Hospital details grid */}
              <div className="row g-4 mb-4">
                <div className="col-sm-6">
                  <h6 className="text-uppercase fw-bold text-secondary mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.5px' }}>Billed Patient</h6>
                  <h6 className="text-dark fw-bold mb-1">{appointment.patient_name}</h6>
                  <p className="text-secondary mb-0" style={{ fontSize: '0.84rem', lineHeight: '1.5' }}>
                    Contact Phone: {appointment.patient_phone} <br />
                    Email: {receiptDetails.patient_email}
                  </p>
                </div>
                <div className="col-sm-6 text-sm-end">
                  <h6 className="text-uppercase fw-bold text-secondary mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.5px' }}>Affiliated Clinic</h6>
                  <h6 className="text-dark fw-bold mb-1">{appointment.hospital_name}</h6>
                  <p className="text-secondary mb-0" style={{ fontSize: '0.84rem', lineHeight: '1.5' }}>
                    Medical Department: {appointment.doctor_specialization} <br />
                    Practitioner: {appointment.doctor_name}
                  </p>
                </div>
              </div>

              {/* Invoice Itemization Grid */}
              <div className="table-responsive mb-4">
                <table className="table table-bordered border-light" style={{ fontSize: '0.9rem' }}>
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">Description</th>
                      <th className="fw-semibold text-center">Date & Time</th>
                      <th className="fw-semibold text-end">Consultation Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <h6 className="mb-0 text-dark fw-semibold" style={{ fontSize: '0.9rem' }}>Doctor Outpatient Consultation</h6>
                        <span className="text-secondary" style={{ fontSize: '0.78rem' }}>Diagnostic checkup: {appointment.reason || 'General routine consultation'}</span>
                      </td>
                      <td className="text-center text-secondary">
                        {appointment.appointment_date} <br />
                        {appointment.appointment_time} hrs
                      </td>
                      <td className="text-end fw-semibold text-dark">₹{amount}</td>
                    </tr>
                    <tr className="table-light">
                      <td colSpan="2" className="text-end fw-bold text-secondary">Net Payable Balance:</td>
                      <td className="text-end fw-extrabold text-success fs-5">₹{amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Info */}
              <div className="bg-light p-3 rounded-3 mb-4" style={{ fontSize: '0.84rem' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Gateway Provider:</span>
                  <span className="fw-semibold text-dark">Simulated Card System</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Transaction ID Reference:</span>
                  <span className="fw-semibold text-dark text-break">{receiptDetails.transaction_id}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary">Ledger Status:</span>
                  <span className="badge bg-success text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>Paid & Completed</span>
                </div>
              </div>

              {/* Bottom Stamp & Signature Mock */}
              <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-4 flex-wrap gap-3">
                <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                  <i className="bi bi-shield-check text-success me-1"></i> Digitally Signed & Approved Document.
                </div>
                <div className="text-center pe-3">
                  <div style={{ width: '90px', height: '90px', border: '3px double #0d9488', borderRadius: '50%', color: '#0d9488', fontSize: '0.62rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', textTransform: 'uppercase', padding: '5px' }}>
                    <span>BMD System</span>
                    <span>Paid</span>
                    <span>Verified</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Print and return triggers (Hide when printing) */}
            <div className="d-flex gap-3 mt-4 no-print justify-content-center">
              <button onClick={handlePrint} className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold">
                <i className="bi bi-printer me-2"></i> Print Invoice Receipt
              </button>
              <button onClick={() => navigate('/patient-dashboard')} className="btn btn-primary-grad rounded-pill px-4 py-2 fw-semibold">
                <i className="bi bi-grid-fill me-2 text-white"></i> Proceed to Dashboard
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================================
  // TRANSACTION GATEWAY RENDER (RAZORPAY STYLE LAYOUT)
  // =====================================================================
  return (
    <div className="container py-5 animated-fade">
      <div className="row justify-content-center">
        
        {/* Checkout detail bar */}
        <div className="col-lg-8 col-xl-7">
          
          <div className="card glass-card border-0 overflow-hidden shadow-lg" style={{ borderRadius: '20px' }}>
            
            {/* Header band */}
            <div className="py-4 text-center text-white" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)' }}>
              <h4 className="outfit-font fw-bold mb-1"><i className="bi bi-wallet2 me-2"></i>Digital Payment Simulator</h4>
              <span className="text-light text-opacity-75" style={{ fontSize: '0.85rem' }}>Secure checkout powered by simulated payment networks</span>
            </div>

            <div className="card-body p-4 p-md-5">
              
              {/* Alert Feedback Notifications */}
              {errorMsg && (
                <div className="alert alert-danger border-0 rounded-3 mb-4 d-flex align-items-center gap-2" role="alert" style={{ background: '#fef2f2', color: '#b91c1c', fontSize: '0.86rem' }}>
                  <i className="bi bi-exclamation-triangle-fill fs-5 text-danger"></i>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Consultation detail receipt */}
              {appointment && (
                <div className="bg-light p-3 rounded-3 mb-4" style={{ fontSize: '0.88rem' }}>
                  <h6 className="outfit-font fw-bold text-dark border-bottom pb-2 mb-3">Billing Consultation Summary</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Doctor Clinician:</span>
                    <span className="fw-semibold text-dark">{appointment.doctor_name} ({appointment.doctor_specialization})</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Hospital Partner:</span>
                    <span className="fw-semibold text-dark">{appointment.hospital_name}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Schedule date/time:</span>
                    <span className="fw-semibold text-dark">{appointment.appointment_date} @ {appointment.appointment_time} hrs</span>
                  </div>
                  <div className="d-flex justify-content-between pt-2 border-top border-secondary border-opacity-10 mt-2">
                    <span className="fw-bold text-dark">Total Fee Payable:</span>
                    <span className="fw-extrabold text-success fs-5">₹{amount}</span>
                  </div>
                </div>
              )}

              {/* 2A. PROCESSING LOADER OVERLAY */}
              {processing ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-teal mb-3" role="status" style={{ width: '3.5rem', height: '3.5rem' }}>
                    <span className="visually-hidden">Authorizing charge...</span>
                  </div>
                  <h5 className="outfit-font fw-bold text-dark">Contacting Bank Gateway...</h5>
                  <p className="text-secondary" style={{ fontSize: '0.88rem' }}>Validating card credentials and processing mock transactional tokens. Please do not close this window.</p>
                </div>
              ) : otpSent ? (
                // 2B. OTP CODE ENTRY SCREEN
                <form onSubmit={handleOtpSubmit} className="animated-fade">
                  <div className="text-center mb-4">
                    <div className="bg-info bg-opacity-10 text-info rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ width: '64px', height: '64px' }}>
                      <i className="bi bi-shield-lock-fill fs-3"></i>
                    </div>
                    <h5 className="outfit-font fw-bold text-dark">Enter OTP Authorization Code</h5>
                    <p className="text-secondary px-3" style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
                      A simulated One-Time Password (OTP) has been dispatched to your mobile. Enter the verification code below to authorize charge of ₹{amount}.
                    </p>
                    <span className="badge bg-warning text-dark px-3 py-2 fw-bold" style={{ fontSize: '0.85rem' }}>
                      MOCK CODE: 123456
                    </span>
                  </div>

                  <div className="mb-4 text-center max-w-sm mx-auto" style={{ maxWidth: '280px' }}>
                    <input 
                      type="text" 
                      className="form-control form-control-custom text-center fw-bold fs-4 tracking-widest" 
                      placeholder="••••••" 
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      maxLength="6"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-accent-grad w-100 rounded-pill py-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                    disabled={submittingOtp}
                  >
                    {submittingOtp ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Authorizing card charge...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-check text-white"></i>
                        <span>Complete Transaction</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                // 2C. PRIMARY CREDIT CARD FORMS (RAZORPAY STYLE CARD SLIDES)
                <form onSubmit={handleCardSubmit}>
                  
                  <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                    <h5 className="outfit-font fw-bold text-dark mb-0">Select Credit / Debit Card</h5>
                    <div className="d-flex gap-2" style={{ fontSize: '1.5rem', color: '#94a3b8' }}>
                      <i className="bi bi-credit-card text-primary"></i>
                      <i className="bi bi-paypal text-info"></i>
                    </div>
                  </div>

                  <div className="row g-3">
                    
                    {/* Cardholder name */}
                    <div className="col-12">
                      <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Cardholder Name *</label>
                      <input 
                        type="text" 
                        className="form-control form-control-custom" 
                        placeholder="e.g. PATRICK JONES"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        required 
                      />
                    </div>

                    {/* Card Number */}
                    <div className="col-12">
                      <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>16-Digit Card Number *</label>
                      <input 
                        type="text" 
                        className="form-control form-control-custom" 
                        placeholder="e.g. 4532 9876 1234 5678"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength="19"
                        required 
                      />
                    </div>

                    {/* Expiry expiration date */}
                    <div className="col-6">
                      <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Expiration *</label>
                      <input 
                        type="text" 
                        className="form-control form-control-custom text-center" 
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        maxLength="5"
                        required 
                      />
                    </div>

                    {/* CVV */}
                    <div className="col-6">
                      <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>CVV Code *</label>
                      <input 
                        type="password" 
                        className="form-control form-control-custom text-center" 
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength="3"
                        required 
                      />
                    </div>

                    {/* Pay button */}
                    <div className="col-12 pt-3">
                      <button type="submit" className="btn btn-primary-grad w-100 rounded-pill py-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2">
                        <i className="bi bi-wallet2 text-white"></i>
                        <span>Authorize Payment of ₹{amount}</span>
                      </button>
                    </div>

                  </div>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment;
