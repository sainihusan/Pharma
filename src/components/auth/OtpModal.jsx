import { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, CircularProgress, Alert, IconButton
} from '@mui/material';
import { MailCheck, X, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema } from '../../schemas/authSchemas';
import authService from '../../api/authService';

const OtpModal = ({ open, email, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [timer, setTimer] = useState(60);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setTimer(60);
    intervalRef.current = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(intervalRef.current);
  }, [open]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const onVerify = async ({ otp }) => {
    setLoading(true);
    setError('');
    try {
      await authService.verifyEmail(email, otp);
      reset();
      onSuccess();
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setResendLoading(true);
    setError('');
    setInfo('');
    try {
      await authService.resendVerificationOtp(email);
      setInfo('A new code has been sent!');
      setTimer(60);
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
      setTimeout(() => setInfo(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 6, p: 2, overflow: 'hidden' }
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton onClick={onCancel} size="small" disabled={loading}>
          <X size={20} />
        </IconButton>
      </Box>

      <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{
            p: 2.5,
            borderRadius: '50%',
            bgcolor: 'primary.50',
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.2)'
          }}>
            <MailCheck size={40} className="text-blue-600" />
          </Box>
        </Box>
        <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: '-0.02em' }}>
          Verify Your Email
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, px: 2, lineHeight: 1.6 }}>
          We've sent a 6-digit verification code to <strong>{email}</strong>
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 2 }}>
        {error && (
          <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 3, fontWeight: 500 }}>
            {error}
          </Alert>
        )}
        {info && (
          <Alert severity="success" variant="filled" sx={{ mb: 3, borderRadius: 3, fontWeight: 500 }}>
            {info}
          </Alert>
        )}

        <form id="otp-form" onSubmit={handleSubmit(onVerify)}>
          <TextField
            {...register('otp')}
            fullWidth
            placeholder="000 000"
            error={!!errors.otp}
            helperText={errors.otp?.message}
            disabled={loading}
            inputProps={{
              maxLength: 6,
              style: {
                textAlign: 'center',
                fontSize: '2rem',
                letterSpacing: '0.75rem',
                fontWeight: 900,
                padding: '20px 0'
              },
            }}
            autoFocus
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                bgcolor: 'grey.50',
                '& fieldset': { borderColor: 'grey.200' },
                '&:hover fieldset': { borderColor: 'primary.main' }
              }
            }}
          />
        </form>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          {timer > 0 ? (
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Resend code in <strong className="text-blue-600">{timer}s</strong>
            </Typography>
          ) : (
            <Button
              variant="text"
              onClick={onResend}
              disabled={resendLoading}
              startIcon={resendLoading ? <CircularProgress size={16} /> : <RefreshCw size={16} />}
              sx={{ fontWeight: 700, textTransform: 'none' }}
            >
              {resendLoading ? 'Sending...' : 'Resend Verification Code'}
            </Button>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, pt: 1, gap: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          type="submit"
          form="otp-form"
          disabled={loading}
          sx={{
            borderRadius: 3.5,
            py: 1.8,
            fontWeight: 800,
            fontSize: '1rem',
            textTransform: 'none',
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)',
            '&:hover': {
              boxShadow: '0 12px 20px -4px rgba(37, 99, 235, 0.5)',
              transform: 'translateY(-1px)'
            }
          }}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Verifying Code...' : 'Connect to Account'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpModal;
