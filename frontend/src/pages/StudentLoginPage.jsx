import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import AlertMessage from '../components/AlertMessage';

export const StudentLoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!credentials.email.trim()) {
      errors.email = 'Email address is required.';
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

      // Save user session
      login(response.token, {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
      });

      // Role-based routing
      if (response.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setErrorMessage('Invalid email or password. Please verify your credentials.');
        } else {
          setErrorMessage(err.response.data?.message || 'Login failed. Please try again.');
        }
      } else {
        setErrorMessage('Cannot connect to server. Please verify backend is running on http://localhost:8081');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper student-auth-bg">
      <div className="auth-card p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-light text-primary mb-3 shadow-sm">
            <i className="bi bi-person-circle fs-2"></i>
          </div>
          <h2 className="fw-bold mb-1">Student Login</h2>
          <p className="text-muted small">Sign in to view your profile and course details</p>
        </div>

        <AlertMessage type="danger" message={errorMessage} onClose={() => setErrorMessage('')} />

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold small text-secondary">
              Email Address <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white text-muted">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                name="email"
                className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                placeholder="student@example.com"
                value={credentials.email}
                onChange={handleChange}
                disabled={loading}
              />
              {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold small text-secondary">
              Password <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
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
            className="btn btn-primary-gradient w-100 py-2 d-flex align-items-center justify-content-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing In...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i> Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation Links */}
        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted small mb-2">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-primary fw-semibold text-decoration-none">
              Register here
            </Link>
          </p>
          <div className="mt-2">
            <Link to="/admin/login" className="text-secondary small text-decoration-none">
              <i className="bi bi-shield-lock me-1"></i> Switch to Administrator Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;
