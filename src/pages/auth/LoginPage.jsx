import { useState } from 'react';
import {
  Box, Typography, TextField, Button,
  CircularProgress, Alert, InputAdornment, IconButton, Link, Divider,
} from '@mui/material';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../schemas/authSchemas';
import OtpModal from '../../components/auth/OtpModal';

export default function LoginPage({ onBack, onSwitch, onForgotPassword }) {
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user?.role?.toLowerCase() === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('verify')) {
        setPendingEmail(getValues('email'));
        setPendingVerification(true);
      } else {
        setError(msg || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = () => {
    setPendingVerification(false);
    setError('');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.role?.toLowerCase() === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      <IconButton onClick={onBack} sx={{ position: 'absolute', top: 16, left: 16 }}>
        <ArrowLeft size={24} />
      </IconButton>

      <Box sx={{ width: '100%', maxWidth: '400px', mx: 'auto', display: 'flex', flexDirection: 'column', pt: 6 }}>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{
            display: 'inline-flex',
            p: 2,
            borderRadius: '1.25rem',
            bgcolor: 'primary.50',
            mb: 2,
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.2)'
          }}>
            <LogIn size={28} className="text-blue-600" />
          </Box>
          <Typography variant="h5" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.02em', color: 'gray.900' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
            Sign in to manage your health and prescriptions
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            variant="filled"
            sx={{ mb: 4, borderRadius: 3, fontWeight: 500, bgcolor: 'error.main', boxShadow: '0 4px 12px -2px rgba(239, 68, 68, 0.3)' }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              {...register('email')}
              fullWidth
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
              InputProps={{
                sx: { borderRadius: 3, bgcolor: 'grey.50' }
              }}
            />

            <Box>
              <TextField
                {...register('password')}
                fullWidth
                label="Password"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
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
              <Box sx={{ mt: 1, textAlign: 'right' }}>
                <Link
                  component="button"
                  type="button"
                  onClick={onForgotPassword}
                  variant="caption"
                  sx={{
                    textDecoration: 'none',
                    fontWeight: 700,
                    color: 'primary.main',
                    '&:hover': { color: 'primary.dark' }
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>

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
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 4, mb: 1 }}>
          <Divider sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ px: 2, fontWeight: 500 }}>
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              New to PharmaCare?{' '}
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
                Create an account
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      <OtpModal
        open={pendingVerification}
        email={pendingEmail}
        onSuccess={handleVerified}
        onCancel={() => setPendingVerification(false)}
      />
    </>
  );
}
