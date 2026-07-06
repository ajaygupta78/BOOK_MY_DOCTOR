import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom sticky-top">
      <div className="container">
        {/* Brand Logo with dynamic routing */}
        <Link className="navbar-brand navbar-brand-custom outfit-font" to="/">
          <i className="bi bi-heart-pulse-fill pulse-heart text-danger"></i>
          <span>BOOK MY DOCTOR</span>
        </Link>

        {/* Responsive Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links Navigation Collapsible Container */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2 mt-3 mt-lg-0">
            {/* Standard Guest Links */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/hospitals">Hospitals</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/about">About Us</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/contact">Contact</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-outline-primary rounded-pill px-4 fw-semibold" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary-grad px-4 fw-semibold text-white" to="/register">Register</Link>
                </li>
              </>
            )}

            {/* Authenticated Patient Links */}
            {user && user.role === 'patient' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/patient-dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/hospitals">Find Hospital</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/doctors">Find Doctor</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/history">My Bookings</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/profile">Profile</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <button onClick={handleLogout} className="btn btn-danger rounded-pill px-4 fw-semibold">
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </li>
              </>
            )}

            {/* Authenticated Doctor Links */}
            {user && user.role === 'doctor' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/doctor-dashboard">Doctor Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/profile">Profile</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <button onClick={handleLogout} className="btn btn-danger rounded-pill px-4 fw-semibold">
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </li>
              </>
            )}

            {/* Authenticated Admin Links */}
            {user && user.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/admin-dashboard">Admin Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold px-3" to="/profile">Profile</Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <button onClick={handleLogout} className="btn btn-danger rounded-pill px-4 fw-semibold">
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
