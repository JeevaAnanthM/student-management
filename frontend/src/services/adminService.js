import api from './api';

export const adminService = {
  // Fetch all registered students with optional search filter
  async getStudents(search = '') {
    const params = {};
    if (search && search.trim() !== '') {
      params.search = search.trim();
    }
    const response = await api.get('/admin/students', { params });
    return response.data;
  },

  // Fetch admin dashboard summary statistics
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

export default adminService;
