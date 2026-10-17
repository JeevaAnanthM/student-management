import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import AlertMessage from '../components/AlertMessage';

export const StudentRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please provide a valid email address.';
      }
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');
    setServerSuccess('');

    try {
      const response = await authService.register(formData);
      setServerSuccess('Registration successful! Redirecting to your dashboard...');

      // Save session and redirect to student dashboard
      setTimeout(() => {
        login(response.token, {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role,
        });
        navigate('/student/dashboard');
      }, 1000);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          setServerError(err.response.data?.message || 'This email address is already registered.');
        } else if (err.response.data?.validationErrors) {
          setFieldErrors(err.response.data.validationErrors);
          setServerError(err.response.data.message || 'Please correct the highlighted errors.');
        } else {
          setServerError(err.response.data?.message || 'Registration failed. Please try again.');
        }
      } else {
        setServerError('Cannot connect to server. Please verify the backend is running.');
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
            <i className="bi bi-mortarboard-fill fs-2"></i>
          </div>
          <h2 className="fw-bold mb-1">Create Student Account</h2>
          <p className="text-muted small">Register as a student to access your academic dashboard</p>
        </div>

        <AlertMessage type="danger" message={serverError} onClose={() => setServerError('')} />
        <AlertMessage type="success" message={serverSuccess} />

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold small text-secondary">
              Full Name <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white text-muted">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                name="name"
                className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
              {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
            </div>
          </div>

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
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
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
                placeholder="Minimum 8 characters"
                value={formData.password}
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

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold small text-secondary">
              Confirm Password <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white text-muted">
                <i className="bi bi-shield-check"></i>
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className={`form-control ${fieldErrors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
              {fieldErrors.confirmPassword && (
                <div className="invalid-feedback">{fieldErrors.confirmPassword}</div>
              )}
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="btn btn-primary-gradient w-100 py-2 d-flex align-items-center justify-content-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : (
              <>
                <i className="bi bi-check2-circle me-2"></i> Register as Student
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted small mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-primary fw-semibold text-decoration-none">
              Sign in to Student Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentRegisterPage;
