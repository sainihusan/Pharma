import { useState } from 'react';
import {
  Box, Typography, TextField, Button,
  CircularProgress, Alert, InputAdornment, IconButton, Link, MenuItem
} from '@mui/material';
import { Eye, EyeOff, UserPlus, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { signupSchema } from '../../schemas/authSchemas';
import authService from '../../api/authService';
import OtpModal from '../../components/auth/OtpModal';
import { useAuth } from '../../context/AuthContext';

export default function SignupPage({ onBack, onSwitch }) {
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async ({ firstName, lastName, email, password, dateOfBirth, gender }) => {
    const username = `${firstName} ${lastName}`;
    setLoading(true);
    setError('');
    try {
      await authService.signup({ username, email, password, dateOfBirth, gender });
      setRegisteredEmail(email);
      setRegisteredPassword(password);
      setShowOtp(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = async () => {
    setShowOtp(false);
    try {
      await login(registeredEmail, registeredPassword);
    } catch (err) {
      console.error('Auto login failed', err);
    }
    setSuccess(true);
    setTimeout(() => navigate('/', { replace: true }), 2500);
  };

  if (success) {
    return (
      <Box sx={{ width: '100%', maxWidth: '400px', mx: 'auto', textAlign: 'center', pt: 8 }}>
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
        <Typography variant="h5" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
          Account Created!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, mb: 4 }}>
          Your account is ready. We're logging you in and redirecting to the home page...
        </Typography>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <>
      <IconButton onClick={onBack} sx={{ position: 'absolute', top: 16, left: 16 }}>
        <ArrowLeft size={24} />
      </IconButton>

      <Box sx={{ width: '100%', maxWidth: '400px', mx: 'auto', py: 6 }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Box sx={{
            display: 'inline-flex',
            p: 2,
            borderRadius: '1.25rem',
            bgcolor: 'primary.50',
            mb: 2,
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.2)'
          }}>
            <UserPlus size={28} className="text-blue-600" />
          </Box>
          <Typography variant="h5" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
            Get medicines and care delivered to your doorstep
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            variant="filled"
            sx={{ mb: 3, borderRadius: 3, fontWeight: 500, boxShadow: '0 4px 12px -2px rgba(239, 68, 68, 0.3)' }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                {...register('firstName')}
                fullWidth
                label="First Name"
                placeholder="John"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                disabled={loading}
                InputProps={{ sx: { borderRadius: 3, bgcolor: 'grey.50' } }}
              />
              <TextField
                {...register('lastName')}
                fullWidth
                label="Last Name"
                placeholder="Doe"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                disabled={loading}
                InputProps={{ sx: { borderRadius: 3, bgcolor: 'grey.50' } }}
              />
            </Box>

            <TextField
              {...register('email')}
              fullWidth
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
              InputProps={{ sx: { borderRadius: 3, bgcolor: 'grey.50' } }}
            />

            <TextField
              {...register('dateOfBirth')}
              fullWidth
              label="Date of Birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth?.message}
              disabled={loading}
              InputProps={{ sx: { borderRadius: 3, bgcolor: 'grey.50' } }}
            />

            <TextField
              {...register('gender')}
              fullWidth
              select
              label="Gender"
              defaultValue=""
              error={!!errors.gender}
              helperText={errors.gender?.message}
              disabled={loading}
              InputProps={{ sx: { borderRadius: 3, bgcolor: 'grey.50' } }}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </TextField>

            <TextField
              {...register('password')}
              fullWidth
              label="Password"
              type={showPwd ? 'text' : 'password'}
              error={!!errors.password}
              helperText={errors.password?.message || 'Must be 8+ characters'}
              disabled={loading}
              InputProps={{
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
              {...register('confirmPassword')}
              fullWidth
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={loading}
              InputProps={{
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
                mt: 1,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)',
                '&:hover': {
                  boxShadow: '0 12px 20px -3px rgba(37, 99, 235, 0.5)',
                  transform: 'translateY(-1px)'
                }
              }}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Creating Account...' : 'Get Started Now'}
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Already have an account?{' '}
            <Link
              component="button"
              onClick={onSwitch}
              sx={{
                textDecoration: 'none',
                fontWeight: 800,
                color: 'primary.main',
                ml: 0.5,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>

      <OtpModal
        open={showOtp}
        email={registeredEmail}
        onSuccess={handleVerified}
        onCancel={() => setShowOtp(false)}
      />
    </>
  );
}
