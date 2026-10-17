import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import { formatDate } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

export const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalAdmins: 1, systemStatus: 'ACTIVE' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadDashboardData = useCallback(async (searchQuery = '') => {
    setError('');
    try {
      const [studentsData, statsData] = await Promise.all([
        adminService.getStudents(searchQuery),
        adminService.getStats(),
      ]);
      setStudents(studentsData);
      setStats(statsData);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access Denied: You do not have permission to view administrative records.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch administrative data from backend.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData(searchTerm);
  }, [loadDashboardData]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setRefreshing(true);
    loadDashboardData(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setRefreshing(true);
    loadDashboardData('');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData(searchTerm);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="container-fluid px-md-5 py-4">
      {/* Admin Top Header Banner */}
      <div className="card bg-dark text-white rounded-4 p-4 p-md-5 mb-4 shadow border-0"
           style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge badge-role-admin">
                <i className="bi bi-shield-lock-fill me-1"></i> Admin Console
              </span>
              <span className="badge bg-info-subtle text-info border border-info-subtle">
                PostgreSQL Connected
              </span>
            </div>
            <h1 className="h2 fw-bold text-white mb-1">
              Welcome, <span className="text-info">{user?.name || 'Administrator'}</span>
            </h1>
            <p className="text-secondary mb-0">
              Logged in as <strong className="text-light">{user?.email}</strong>. Manage registered students and monitor system status.
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              onClick={handleRefresh}
              className="btn btn-outline-light rounded-3 px-3 py-2"
              disabled={refreshing}
              title="Refresh student records"
            >
              <i className={`bi bi-arrow-clockwise me-1 ${refreshing ? 'spin' : ''}`}></i>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-danger rounded-3 px-3 py-2"
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>

      <AlertMessage type="danger" message={error} onClose={() => setError('')} />

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        {/* Total Students Card */}
        <div className="col-md-4">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-bold text-uppercase">Total Students</span>
              <h2 className="fw-bold text-dark mb-0 mt-1">{stats.totalStudents}</h2>
              <small className="text-success fw-semibold">
                <i className="bi bi-person-check-fill me-1"></i> Verified registrations
              </small>
            </div>
            <div className="stat-icon-wrapper bg-primary-subtle text-primary">
              <i className="bi bi-people-fill"></i>
            </div>
          </div>
        </div>

        {/* Administrators Card */}
        <div className="col-md-4">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-bold text-uppercase">Authorized Admin</span>
              <h2 className="fw-bold text-dark mb-0 mt-1">{stats.totalAdmins}</h2>
              <small className="text-info fw-semibold">
                <i className="bi bi-shield-shaded me-1"></i> Env-configured account
              </small>
            </div>
            <div className="stat-icon-wrapper bg-warning-subtle text-warning">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
          </div>
        </div>

        {/* System Health Card */}
        <div className="col-md-4">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-bold text-uppercase">System Security</span>
              <h2 className="fw-bold text-success mb-0 mt-1">HEALTHY</h2>
              <small className="text-muted">
                <i className="bi bi-check-circle-fill text-success me-1"></i> JWT Stateless Auth
              </small>
            </div>
            <div className="stat-icon-wrapper bg-success-subtle text-success">
              <i className="bi bi-cpu-fill"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Student List Section */}
      <div className="card border rounded-4 shadow-sm">
        <div className="card-header bg-white border-bottom py-3 px-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <i className="bi bi-table text-primary me-2"></i>
                Registered Students Directory
              </h5>
              <small className="text-muted">
                Displaying {students.length} student {students.length === 1 ? 'record' : 'records'}
              </small>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="d-flex gap-2" style={{ maxWidth: '400px', width: '100%' }}>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search by student name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="btn btn-light border-start-0 border"
                    onClick={handleClearSearch}
                    title="Clear search"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
              <button type="submit" className="btn btn-outline-primary px-3">
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <LoadingSpinner text="Loading student database..." />
          ) : students.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
              <h5 className="mt-3 fw-bold text-secondary">No Students Found</h5>
              <p className="text-muted small">
                {searchTerm
                  ? `No student records matched "${searchTerm}". Try a different search term.`
                  : 'No students have registered in the database yet.'}
              </p>
              {searchTerm && (
                <button onClick={handleClearSearch} className="btn btn-sm btn-outline-primary">
                  Clear Filter
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table custom-table table-hover mb-0">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: '80px' }}>ID</th>
                    <th scope="col">Student Name</th>
                    <th scope="col">Email Address</th>
                    <th scope="col">Assigned Role</th>
                    <th scope="col">Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="fw-bold text-secondary">#{student.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center me-2"
                            style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}
                          >
                            {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <span className="fw-semibold text-dark">{student.name}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted">{student.email}</span>
                      </td>
                      <td>
                        <span className="badge badge-role-student">
                          <i className="bi bi-mortarboard me-1"></i> {student.role}
                        </span>
                      </td>
                      <td>
                        <span className="text-secondary small">
                          <i className="bi bi-calendar3 me-1 text-muted"></i>
                          {formatDate(student.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
