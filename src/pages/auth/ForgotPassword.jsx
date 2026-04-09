import { useState } from 'react';
import {
  Paper, Box, Typography, TextField, Button, CircularProgress,
  Alert, InputAdornment, Link, Container, Divider, IconButton,
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Send, KeyRound, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { forgotPasswordSchema, resetPasswordSchema } from '../../schemas/authSchemas';
import authService from '../../api/authService';

export default function ForgotPasswordView({ onBack }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const emailForm = useForm({ resolver: zodResolver(forgotPasswordSchema) });
  const resetForm = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSendOtp = async ({ email: inputEmail }) => {
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(inputEmail);
      setEmail(inputEmail);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async ({ otp, newPassword }) => {
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(email, otp, newPassword);
      setSuccess(true);
      if (onBack) {
        setTimeout(() => onBack(), 2500);
      } else {
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP or OTP expired. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setError('');
      resetForm.reset();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ p: { xs: 4, sm: 4 }, textAlign: 'center' }}>
        <Box sx={{
          display: 'inline-flex',
          p: 3,
          borderRadius: '50%',
          bgcolor: 'success.50',
          mb: 4,
          boxShadow: '0 8px 16px -4px rgba(34, 197, 94, 0.2)'
        }}>
          <CheckCircle2 size={48} className="text-green-500" />
        </Box>
        <Typography variant="h4" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.02em', color: 'gray.900' }}>
          Password Reset!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8, mb: 4 }}>
          Your password has been updated. You can now sign in with your new password.
        </Typography>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '400px', mx: 'auto', display: 'flex', flexDirection: 'column', pt: 2 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{
          display: 'inline-flex',
          p: 2,
          borderRadius: '1.25rem',
          bgcolor: step === 1 ? 'primary.50' : 'warning.50',
          mb: 2.5,
          boxShadow: step === 1 ? '0 8px 16px -4px rgba(37, 99, 235, 0.2)' : '0 8px 16px -4px rgba(245, 158, 11, 0.2)'
        }}>
          {step === 1 ? <Mail size={32} className="text-blue-600" /> : <KeyRound size={32} className="text-amber-500" />}
        </Box>
        <Typography variant="h4" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.02em', color: 'gray.900' }}>
          {step === 1 ? 'Forgot Password?' : 'Reset Password'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
          {step === 1
            ? "Don't worry, we'll help you get back into your account."
            : <>We've sent a 6-digit code to <strong>{email}</strong></>
          }
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          variant="filled"
          sx={{ mb: 4, borderRadius: 3, fontWeight: 500, boxShadow: '0 4px 12px -2px rgba(239, 68, 68, 0.3)' }}
        >
          {error}
        </Alert>
      )}

      {step === 1 && (
        <form onSubmit={emailForm.handleSubmit(onSendOtp)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              {...emailForm.register('email')}
              fullWidth
              label="Email Address"
              placeholder="Enter your registered email"
              error={!!emailForm.formState.errors.email}
              helperText={emailForm.formState.errors.email?.message}
              disabled={loading}
              InputProps={{
                sx: { borderRadius: 3, bgcolor: 'grey.50' }
              }}
            />

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.8,
                borderRadius: 3,
                fontWeight: 800,
                textTransform: 'none',
                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)',
                '&:hover': {
                  boxShadow: '0 12px 20px -3px rgba(37, 99, 235, 0.5)',
                  transform: 'translateY(-1px)'
                }
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
            >
              {loading ? 'Sending Request...' : 'Send Verification Code'}
            </Button>
          </Box>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={resetForm.handleSubmit(onResetPassword)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              {...resetForm.register('otp')}
              fullWidth
              label="Verification Code"
              placeholder="000 000"
              error={!!resetForm.formState.errors.otp}
              helperText={resetForm.formState.errors.otp?.message}
              disabled={loading}
              inputProps={{
                maxLength: 6,
                style: { textAlign: 'center', fontSize: '1.75rem', letterSpacing: '0.75rem', fontWeight: 900 },
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'grey.50' } }}
              autoFocus
            />

            <TextField
              {...resetForm.register('newPassword')}
              fullWidth
              label="New Password"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              error={!!resetForm.formState.errors.newPassword}
              helperText={resetForm.formState.errors.newPassword?.message}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} className="text-gray-400 mr-2" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPwd(!showPwd)} edge="end" size="small">
                      {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, bgcolor: 'grey.50' }
              }}
            />

            <TextField
              {...resetForm.register('confirmPassword')}
              fullWidth
              label="Confirm New Password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              error={!!resetForm.formState.errors.confirmPassword}
              helperText={resetForm.formState.errors.confirmPassword?.message}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} className="text-gray-400 mr-2" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small">
                      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, bgcolor: 'grey.50' }
              }}
            />

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.8,
                borderRadius: 3,
                fontWeight: 800,
                textTransform: 'none',
                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)',
                '&:hover': {
                  boxShadow: '0 12px 20px -3px rgba(37, 99, 235, 0.5)',
                  transform: 'translateY(-1px)'
                }
              }}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={onResendOtp}
              disabled={loading}
              sx={{ mt: 1, color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}
            >
              Didn't receive code? Resend
            </Button>
          </Box>
        </form>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          onClick={onBack}
          startIcon={<ChevronLeft size={18} />}
          sx={{
            color: 'slate.500',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { bgcolor: 'transparent', color: 'primary.main', textDecoration: 'underline' }
          }}
        >
          Back to Sign In
        </Button>
      </Box>
    </Box>
  );
}
