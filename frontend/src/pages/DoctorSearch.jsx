import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import DoctorCard from '../components/DoctorCard';

const DoctorSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search parameters
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  
  // Filter States
  const [selectedSpec, setSelectedSpec] = useState(searchParams.get('specialization_id') || '');
  const [selectedHosp, setSelectedHosp] = useState(searchParams.get('hospital_id') || '');
  const [searchName, setSearchName] = useState(searchParams.get('name') || '');
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Extract Pre-applied names if passing from HospitalCard views
  const preAppliedHospName = searchParams.get('hospital_name') || '';

  useEffect(() => {
    fetchFilters();
    executeSearch();
  }, [searchParams]);

  const fetchFilters = async () => {
    try {
      const [specRes, hospRes] = await Promise.all([
        API.get('/doctors/specializations'),
        API.get('/hospitals')
      ]);
      setSpecializations(specRes.data);
      setHospitals(hospRes.data);
    } catch (err) {
      console.error('Error fetching filter categories:', err);
    }
  };

  const executeSearch = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const spec = searchParams.get('specialization_id') || '';
      const hosp = searchParams.get('hospital_id') || '';
      const name = searchParams.get('name') || '';

      let url = '/doctors/search?';
      if (spec) url += `specialization_id=${spec}&`;
      if (hosp) url += `hospital_id=${hosp}&`;
      if (name) url += `name=${encodeURIComponent(name)}&`;

      const response = await API.get(url);
      setDoctors(response.data);
    } catch (err) {
      setErrorMsg('Failed to query doctor listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    // Sync state values directly to route searchParams
    const params = {};
    if (selectedSpec) params.specialization_id = selectedSpec;
    if (selectedHosp) params.hospital_id = selectedHosp;
    if (searchName) params.name = searchName;

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSelectedSpec('');
    setSelectedHosp('');
    setSearchName('');
    setSearchParams({});
  };

  return (
    <div className="container py-5 animated-fade">
      
      {/* 1. LOOKUP HERO BANNER */}
      <div className="bg-dark text-white p-5 rounded-4 mb-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #1e293b 100%)' }}>
        <div className="position-absolute" style={{ width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)', top: '-10%', right: '-10%' }}></div>
        <h1 className="outfit-font fw-extrabold text-white mb-2">Find a Specialized Doctor</h1>
        <p className="text-light text-opacity-75 mb-0">
          {preAppliedHospName 
            ? `Displaying physicians operating under "${preAppliedHospName}"` 
            : 'Locate physician clinicians by specialization, name, or hospital networks.'}
        </p>
      </div>

      <div className="row g-4">
        
        {/* 2. ADVANCED FILTERS PANEL */}
        <div className="col-lg-4">
          <div className="card glass-card border-0 p-4 sticky-lg-top" style={{ top: '100px', zIndex: '1' }}>
            <h5 className="outfit-font fw-bold text-dark mb-4 d-flex align-items-center justify-content-between">
              <span><i className="bi bi-sliders me-2 text-primary"></i>Refine Filters</span>
              {(selectedSpec || selectedHosp || searchName) && (
                <button onClick={handleClearFilters} className="btn btn-link text-danger p-0 text-decoration-none fw-semibold" style={{ fontSize: '0.82rem' }}>
                  Clear All
                </button>
              )}
            </h5>

            <form onSubmit={handleFilterSubmit}>
              {/* Doctor Name Search */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Doctor Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted border-end-0" style={{ borderRadius: '10px 0 0 10px' }}><i className="bi bi-person"></i></span>
                  <input 
                    type="text" 
                    className="form-control form-control-custom border-start-0 ps-0" 
                    placeholder="Search name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    style={{ borderRadius: '0 10px 10px 0' }}
                  />
                </div>
              </div>

              {/* Specialization Filter */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Medical Speciality</label>
                <select 
                  className="form-select form-control-custom"
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                >
                  <option value="">All Specialities</option>
                  {specializations.map((spec) => (
                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                  ))}
                </select>
              </div>

              {/* Hospital Filter */}
              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.82rem' }}>Hospital Branch</label>
                <select 
                  className="form-select form-control-custom"
                  value={selectedHosp}
                  onChange={(e) => setSelectedHosp(e.target.value)}
                >
                  <option value="">All Hospitals</option>
                  {hospitals.map((hosp) => (
                    <option key={hosp.id} value={hosp.id}>{hosp.name} ({hosp.city})</option>
                  ))}
                </select>
              </div>

              {/* Filter CTA */}
              <button type="submit" className="btn btn-primary-grad w-100 rounded-pill py-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2">
                <i className="bi bi-search text-white"></i>Apply Parameters
              </button>
            </form>
          </div>
        </div>

        {/* 3. RESULT GRID LIST */}
        <div className="col-lg-8">
          {loading ? (
            <div className="text-center my-5 py-5">
              <div className="spinner-border text-teal" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Locating doctors...</span>
              </div>
              <p className="text-secondary mt-3 fw-semibold">Consulting active clinical rosters...</p>
            </div>
          ) : errorMsg ? (
            <div className="alert alert-danger border-0 p-4 rounded-3 text-center" role="alert" style={{ background: '#fef2f2', color: '#b91c1c' }}>
              <i className="bi bi-exclamation-octagon-fill fs-2 mb-2 d-block"></i>
              <h5>Clinical Query Failure</h5>
              <span style={{ fontSize: '0.9rem' }}>{errorMsg}</span>
            </div>
          ) : doctors.length === 0 ? (
            <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-4">
              <i className="bi bi-heart-break fs-1 text-muted mb-3"></i>
              <h4 className="outfit-font fw-bold text-dark">No Physicians Match</h4>
              <p className="text-secondary mb-0">We could not locate any registered doctors meeting these filter options. Try adjusting your query fields.</p>
            </div>
          ) : (
            <div className="row g-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="col-md-6">
                  <DoctorCard doctor={doctor} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DoctorSearch;
