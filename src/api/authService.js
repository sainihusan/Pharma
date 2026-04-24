import apiClient from './apiClient';

const authService = {
  signup: (userData) => apiClient.post('/auth/signup', userData),

  verifyEmail: (email, otp) => apiClient.post('/auth/verify-email', { email, otp }),

  resendVerificationOtp: (email) => apiClient.post('/auth/resend-verification-otp', { email }),

  login: (email, password) => apiClient.post('/auth/login', { email, password }),

  logout: () => apiClient.post('/auth/logout'),

  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (email, otp, newPassword) =>
    apiClient.post('/auth/reset-password', { email, otp, newPassword }),

  getMe: () => apiClient.get('/auth/me'),
};

export default authService;
