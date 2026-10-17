import api from './api';

export const studentService = {
  // Fetch currently authenticated student profile from GET /api/students/me
  async getProfile() {
    const response = await api.get('/students/me');
    return response.data;
  },
};

export default studentService;
