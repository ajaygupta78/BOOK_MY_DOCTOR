import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="sidebar-layout animated-fade">
      {/* User Status Profile Card */}
      <div className="text-center mb-4 pb-4 border-bottom border-secondary border-opacity-25">
        <div className="bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center rounded-circle mb-3 border border-primary border-opacity-25" style={{ width: '70px', height: '70px' }}>
          <i className="bi bi-person-fill text-primary" style={{ fontSize: '2.2rem' }}></i>
        </div>
        <h6 className="text-white outfit-font fw-bold mb-1 text-truncate px-2">{user.name}</h6>
        <span className="badge bg-secondary text-uppercase fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{user.role}</span>
      </div>

      {/* Navlinks depending on active role */}
      <nav className="d-flex flex-column gap-1">
        
        {/* Patient Dashboard Actions */}
        {user.role === 'patient' && (
          <>
            <NavLink to="/patient-dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
              <i className="bi bi-grid-1x2-fill"></i>
              <span>Dashboard Home</span>
            </NavLink>
            <NavLink to="/hospitals" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-building"></i>
              <span>Search Hospitals</span>
            </NavLink>
            <NavLink to="/doctors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-search-heart"></i>
              <span>Search Doctors</span>
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-calendar2-check-fill"></i>
              <span>My Bookings</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-person-bounding-box"></i>
              <span>Profile Settings</span>
            </NavLink>
          </>
        )}

        {/* Doctor Dashboard Actions */}
        {user.role === 'doctor' && (
          <>
            <NavLink to="/doctor-dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
              <i className="bi bi-calendar3"></i>
              <span>My Appointments</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-person-bounding-box"></i>
              <span>Profile Settings</span>
            </NavLink>
          </>
        )}

        {/* Admin Dashboard Actions */}
        {user.role === 'admin' && (
          <>
            <NavLink to="/admin-dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
              <i className="bi bi-speedometer2"></i>
              <span>Analytics Overview</span>
            </NavLink>
            <NavLink to="/admin-dashboard/hospitals" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-building-gear"></i>
              <span>Manage Hospitals</span>
            </NavLink>
            <NavLink to="/admin-dashboard/doctors" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-person-gear"></i>
              <span>Manage Doctors</span>
            </NavLink>
            <NavLink to="/admin-dashboard/patients" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-people-fill"></i>
              <span>Manage Patients</span>
            </NavLink>
            <NavLink to="/admin-dashboard/appointments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-calendar2-range"></i>
              <span>Global Bookings</span>
            </NavLink>
            <NavLink to="/admin-dashboard/payments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-cash-stack"></i>
              <span>Financial Ledger</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <i className="bi bi-person-bounding-box"></i>
              <span>Profile Settings</span>
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
