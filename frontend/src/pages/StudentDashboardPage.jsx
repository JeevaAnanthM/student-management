import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import studentService from '../services/studentService';
import { formatDate } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

export const StudentDashboardPage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await studentService.getProfile();
      setProfile(data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load your profile. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container py-4 py-md-5">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm border mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge badge-role-student">
                <i className="bi bi-mortarboard-fill me-1"></i> Student Portal
              </span>
              <span className="badge bg-success-subtle text-success border border-success-subtle">
                <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i> Active Session
              </span>
            </div>
            <h1 className="h2 fw-bold text-dark mb-1">
              Welcome back, <span className="text-primary">{profile?.name || user?.name || 'Student'}</span>!
            </h1>
            <p className="text-muted mb-0">
              Here is your verified academic profile and registration details.
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              onClick={fetchProfile}
              className="btn btn-outline-secondary rounded-3 px-3 py-2"
              disabled={loading}
              title="Refresh profile details"
            >
              <i className={`bi bi-arrow-clockwise me-1 ${loading ? 'spin' : ''}`}></i> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger rounded-3 px-3 py-2"
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {loading ? (
        <LoadingSpinner text="Fetching your student profile from server..." />
      ) : profile ? (
        <div className="row g-4">
          {/* Main Profile Card */}
          <div className="col-lg-8">
            <div className="card border rounded-4 shadow-sm h-100">
              <div className="card-header bg-white border-bottom py-3 px-4">
                <h5 className="mb-0 fw-bold d-flex align-items-center">
                  <i className="bi bi-person-badge-fill text-primary me-2"></i>
                  Student Profile Details
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold">STUDENT ID</label>
                    <p className="fs-5 fw-bold text-dark mb-0">#{profile.id}</p>
                  </div>
                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold">ACCOUNT ROLE</label>
                    <div>
                      <span className="badge badge-role-student fs-6">{profile.role}</span>
                    </div>
                  </div>

                  <div className="col-12"><hr className="my-1 text-muted" /></div>

                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold">FULL NAME</label>
                    <p className="fs-6 fw-semibold text-dark mb-0">{profile.name}</p>
                  </div>

                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold">REGISTERED EMAIL</label>
                    <p className="fs-6 fw-semibold text-dark mb-0">{profile.email}</p>
                  </div>

                  <div className="col-12"><hr className="my-1 text-muted" /></div>

                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold">REGISTRATION DATE</label>
                    <p className="fs-6 text-dark mb-0">
                      <i className="bi bi-calendar3 me-1 text-primary"></i>
                      {formatDate(profile.createdAt)}
                    </p>
                  </div>

                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold">AUTHENTICATION METHOD</label>
                    <p className="fs-6 text-dark mb-0">
                      <i className="bi bi-key-fill me-1 text-success"></i>
                      JWT Stateless Bearer Token
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Info Cards */}
          <div className="col-lg-4">
            <div className="card border rounded-4 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="stat-icon-wrapper bg-primary-subtle text-primary">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Role-Based Security</h6>
                    <small className="text-muted">Spring Security Guarded</small>
                  </div>
                </div>
                <p className="text-muted small mb-0">
                  Your session is signed with a high-entropy JWT. Profile data is fetched strictly using your authenticated token subject.
                </p>
              </div>
            </div>

            <div className="card border rounded-4 shadow-sm">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3 d-flex align-items-center">
                  <i className="bi bi-info-circle-fill text-info me-2"></i>
                  Portal Guidelines
                </h6>
                <ul className="list-unstyled small text-muted mb-0 d-flex flex-column gap-2">
                  <li className="d-flex align-items-start gap-2">
                    <i className="bi bi-check2 text-success mt-1"></i>
                    <span>Student accounts cannot access administrative APIs or views.</span>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <i className="bi bi-check2 text-success mt-1"></i>
                    <span>Always log out when accessing your account from a public workstation.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StudentDashboardPage;
