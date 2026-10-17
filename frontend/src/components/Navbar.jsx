import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    const wasAdmin = isAdmin;
    logout();
    if (wasAdmin) {
      navigate('/admin/login');
    } else {
      navigate('/login');
    }
  };

  const isAdminTheme = isAdmin || location.pathname.startsWith('/admin');

  return (
    <nav
      className={`navbar navbar-expand-lg sticky-top ${
        isAdminTheme ? 'navbar-dark app-navbar-admin' : 'navbar-light app-navbar'
      }`}
    >
      <div className="container">
        {/* Brand Logo */}
        <Link
          className="navbar-brand d-flex align-items-center fw-bold fs-4"
          to={isAdmin ? '/admin/dashboard' : isAuthenticated ? '/student/dashboard' : '/login'}
        >
          {isAdminTheme ? (
            <>
              <i className="bi bi-shield-lock-fill text-info me-2 fs-3"></i>
              <span className="text-white">Edu<span className="text-info">Admin</span></span>
            </>
          ) : (
            <>
              <i className="bi bi-mortarboard-fill text-primary me-2 fs-3"></i>
              <span className="text-dark">Edu<span className="text-primary">Portal</span></span>
            </>
          )}
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links & User Action */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className={`nav-link px-3 ${location.pathname === '/login' ? 'active fw-bold' : ''}`}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i> Student Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className={`nav-link px-3 ${location.pathname === '/register' ? 'active fw-bold' : ''}`}
                  >
                    <i className="bi bi-person-plus me-1"></i> Register
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link
                    to="/admin/login"
                    className="btn btn-sm btn-outline-info rounded-pill px-3 py-1"
                  >
                    <i className="bi bi-shield-lock me-1"></i> Admin Portal
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Active Role Dashboard Link */}
                <li className="nav-item">
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active fw-bold' : ''}`}
                    >
                      <i className="bi bi-speedometer2 me-1"></i> Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/student/dashboard"
                      className={`nav-link ${location.pathname === '/student/dashboard' ? 'active fw-bold' : ''}`}
                    >
                      <i className="bi bi-person-workspace me-1"></i> My Dashboard
                    </Link>
                  )}
                </li>

                {/* User Info Badge */}
                <li className="nav-item d-flex align-items-center px-2 py-1">
                  <span className={`badge ${isAdmin ? 'badge-role-admin' : 'badge-role-student'}`}>
                    <i className={`bi ${isAdmin ? 'bi-shield-check' : 'bi-mortarboard'} me-1`}></i>
                    {user?.name || user?.email} ({user?.role})
                  </span>
                </li>

                {/* Logout Button */}
                <li className="nav-item ms-lg-2">
                  <button
                    onClick={handleLogout}
                    className={`btn btn-sm rounded-pill px-3 py-1 ${
                      isAdminTheme ? 'btn-outline-danger' : 'btn-outline-secondary'
                    }`}
                  >
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
