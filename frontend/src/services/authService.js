import api from './api';

export const authService = {
  // Register a new student
  async register(data) {
    const response = await api.post('/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    return response.data;
  },

  // Authenticate student or admin
  async login(credentials) {
    const response = await api.post('/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  },

  // Clear local credentials
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Read stored user
  getStoredUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Read stored JWT
  getStoredToken() {
    return localStorage.getItem('token');
  },

  // Store credentials
  setSession(token, user) {
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
  },
};

export default authService;
