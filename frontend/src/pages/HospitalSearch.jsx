import React, { useState, useEffect } from 'react';
import API from '../services/api';
import HospitalCard from '../components/HospitalCard';

const HospitalSearch = () => {
  const [hospitals, setHospitals] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchCities();
    fetchHospitals();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await API.get('/hospitals/cities');
      setCities(response.data);
    } catch (err) {
      console.error('Error fetching unique cities:', err);
    }
  };

  const fetchHospitals = async (city = '') => {
    setLoading(true);
    setErrorMsg('');
    try {
      const url = city ? `/hospitals?city=${encodeURIComponent(city)}` : '/hospitals';
      const response = await API.get(url);
      setHospitals(response.data);
    } catch (err) {
      setErrorMsg('Failed to query hospitals data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    fetchHospitals(city);
  };

  return (
    <div className="container py-5 animated-fade">
      
      {/* Search Header Banner */}
      <div className="bg-dark text-white p-5 rounded-4 mb-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="position-absolute" style={{ width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(2,132,199,0.15) 0%, rgba(0,0,0,0) 70%)', top: '-20%', right: '-10%' }}></div>
        
        <div className="row align-items-center position-relative">
          <div className="col-md-7">
            <h1 className="outfit-font fw-extrabold text-white mb-2">Find Healthcare Partner</h1>
            <p className="text-secondary mb-0">Search certified corporate multi-speciality hospitals by city.</p>
          </div>
          
          {/* Dynamic Filter dropdown */}
          <div className="col-md-5 mt-4 mt-md-0">
            <div className="glass-card p-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <label className="form-label text-light fw-semibold" style={{ fontSize: '0.82rem' }}>Filter by City</label>
              <select 
                className="form-select form-control-custom border-secondary text-white" 
                value={selectedCity} 
                onChange={handleCityChange}
                style={{ background: '#1e293b', border: '1px solid #475569' }}
              >
                <option value="">All Locations</option>
                {cities.map((city) => (
                  <option key={city} value={city} style={{ background: '#1e293b' }}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Results Container */}
      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-teal" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Querying hospitals...</span>
          </div>
          <p className="text-secondary mt-3 fw-semibold">Consulting location coordinates...</p>
        </div>
      ) : errorMsg ? (
        <div className="alert alert-danger border-0 p-4 rounded-3 text-center" role="alert" style={{ background: '#fef2f2', color: '#b91c1c' }}>
          <i className="bi bi-exclamation-octagon-fill fs-2 mb-2 d-block"></i>
          <h5>Query Interruption</h5>
          <span style={{ fontSize: '0.9rem' }}>{errorMsg}</span>
        </div>
      ) : hospitals.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-4">
          <i className="bi bi-building-fill-slash fs-1 text-muted mb-3"></i>
          <h4 className="outfit-font fw-bold text-dark">No Hospitals Found</h4>
          <p className="text-secondary mb-0">We could not locate any registered hospitals in "{selectedCity}". Please try a different location.</p>
        </div>
      ) : (
        <div className="row g-4">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="col-lg-4 col-md-6">
              <HospitalCard hospital={hospital} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default HospitalSearch;
