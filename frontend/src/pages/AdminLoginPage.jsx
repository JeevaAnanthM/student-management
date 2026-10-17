import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import AlertMessage from '../components/AlertMessage';

export const AdminLoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!credentials.email.trim()) {
      errors.email = 'Admin email is required.';
    }
    if (!credentials.password) {
      errors.password = 'Password is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await authService.login(credentials);

      // Verify that the authenticated account strictly holds the ADMIN role
      if (response.role !== 'ADMIN') {
        logout();
        setErrorMessage('Access Denied: This account does not possess administrator privileges.');
        return;
      }

      // Save admin session
      login(response.token, {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
      });

      navigate('/admin/dashboard');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setErrorMessage('Invalid administrator credentials. Please check your email and password.');
        } else {
          setErrorMessage(err.response.data?.message || 'Authentication failed. Please try again.');
        }
      } else {
        setErrorMessage('Cannot connect to server. Please verify backend is running on http://localhost:8081');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper admin-auth-bg">
      <div className="auth-card auth-card-admin p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-dark text-info mb-3 shadow">
            <i className="bi bi-shield-lock-fill fs-2"></i>
          </div>
          <h2 className="fw-bold mb-1 text-white">Administrator Portal</h2>
          <p className="text-secondary small">
            Restricted access. Authorized personnel with configured admin credentials only.
          </p>
        </div>

        <AlertMessage type="danger" message={errorMessage} onClose={() => setErrorMessage('')} />

        <form onSubmit={handleSubmit} noValidate>
          {/* Admin Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold small text-light">
              Admin Email <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-info">
                <i className="bi bi-envelope-at"></i>
              </span>
              <input
                type="email"
                name="email"
                className={`form-control form-control-admin ${fieldErrors.email ? 'is-invalid' : ''}`}
                placeholder="admin@example.com"
                value={credentials.email}
                onChange={handleChange}
                disabled={loading}
              />
              {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold small text-light">
              Password <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-info">
                <i className="bi bi-key"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-control form-control-admin ${fieldErrors.password ? 'is-invalid' : ''}`}
                placeholder="Enter admin password"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-outline-secondary text-light"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
              {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-admin-gradient w-100 py-2 d-flex align-items-center justify-content-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Authenticating Admin...
              </>
            ) : (
              <>
                <i className="bi bi-shield-check me-2"></i> Access Admin Console
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <Link to="/login" className="text-info small text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i> Return to Student Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
