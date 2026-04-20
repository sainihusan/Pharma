import apiClient from './apiClient';

const authService = {

  signup: ({ username, email, password, dateOfBirth, gender }) =>
    apiClient('/auth/signup', { body: { username, email, password, dateOfBirth, gender } }),


  verifyEmail: (email, otp) =>
    apiClient('/auth/verify-email', { body: { email, otp } }),


  resendVerificationOtp: (email) =>
    apiClient('/auth/resend-verification-otp', { body: { email } }),


  login: (email, password) =>
    apiClient('/auth/login', { body: { email, password } }),

  logout: () =>
    apiClient('/auth/logout', { method: 'POST' }),

  forgotPassword: (email) =>
    apiClient('/auth/forgot-password', { body: { email } }),

  resetPassword: (email, otp, newPassword) =>
    apiClient('/auth/reset-password', { body: { email, otp, newPassword } }),

  getMe: () =>
    apiClient('/auth/me', { method: 'GET' }),
};

export default authService;
