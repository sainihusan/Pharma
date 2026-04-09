import apiClient from './apiClient';

const authService = {

  signup: ({ username, email, password, dateOfBirth, gender }) =>
    apiClient('/signup', { body: { username, email, password, dateOfBirth, gender } }),


  verifyEmail: (email, otp) =>
    apiClient('/verify-email', { body: { email, otp } }),


  resendVerificationOtp: (email) =>
    apiClient('/resend-verification-otp', { body: { email } }),


  login: (email, password) =>
    apiClient('/login', { body: { email, password } }),

  logout: () =>
    apiClient('/logout', { method: 'POST' }),

  forgotPassword: (email) =>
    apiClient('/forgot-password', { body: { email } }),

  resetPassword: (email, otp, newPassword) =>
    apiClient('/reset-password', { body: { email, otp, newPassword } }),

  getMe: () =>
    apiClient('/me', { method: 'GET' }),
};

export default authService;
