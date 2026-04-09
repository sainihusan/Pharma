import { useState } from 'react';
import {
  Paper, Box, Typography, TextField, Button,
  CircularProgress, Alert, InputAdornment, IconButton, Container, Link
} from '@mui/material';
import { User, Lock, Eye, EyeOff, ShieldAlert, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../api/authService';

const adminSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    if (data.email !== 'sainihusan02@gmail.com') {
      setErrorMsg('Unauthorized: Only specific administrators can access this portal.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await authService.login(data.email, data.password);
      const resData = res.data || res;
      const { token, user: userData } = resData;

      const adminUser = {
        ...userData,
        role: 'admin'
      };

      setUser(adminUser);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.removeItem('adminSession');

      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      position: 'relative',
      overflow: 'hidden',
      py: 6
    }}>
      {/* Abstract background shapes */}
      <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', bgcolor: 'indigo.100', borderRadius: '45% 55% 70% 30% / 30% 60% 40% 70%', opacity: 0.4, filter: 'blur(80px)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: '-5%', right: '-5%', width: '35%', height: '35%', bgcolor: 'blue.100', borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40%', opacity: 0.4, filter: 'blur(80px)', zIndex: 0 }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Box sx={{
            display: 'inline-flex',
            p: 2.5,
            borderRadius: '1.5rem',
            bgcolor: 'white',
            mb: 3,
            boxShadow: '0 12px 24px -6px rgba(79, 70, 229, 0.25)',
            border: '1px solid',
            borderColor: 'indigo.50'
          }}>
            <ShieldAlert size={36} className="text-indigo-600" />
          </Box>
          <Typography variant="h4" fontWeight={900} gutterBottom sx={{ color: 'slate.900', letterSpacing: '-0.025em' }}>
            Admin Portal
          </Typography>
          <p className="text-slate-500 font-medium">Secured administrative access only</p>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: 6,
            border: '1px solid',
            borderColor: 'slate.200',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
            bgcolor: 'white'
          }}
        >
          {errorMsg && (
            <Alert
              severity="error"
              variant="filled"
              sx={{ mb: 4, borderRadius: 3, fontWeight: 600, bgcolor: 'error.main', boxShadow: '0 4px 12px -2px rgba(239, 68, 68, 0.3)' }}
            >
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                {...register('email')}
                fullWidth
                label="Administrator Email"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={loading}
                InputProps={{

                  sx: { borderRadius: 3, bgcolor: '#fbfcfd' }
                }}
              />

              <TextField
                {...register('password')}
                fullWidth
                label="Access Key"
                type={showPwd ? 'text' : 'password'}
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
                  sx: { borderRadius: 3, bgcolor: '#fbfcfd' }
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
                  py: 1.8,
                  borderRadius: 3,
                  fontWeight: 800,
                  fontSize: '1rem',
                  textTransform: 'none',
                  bgcolor: 'indigo.600',
                  boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)',
                  '&:hover': {
                    bgcolor: 'indigo.700',
                    boxShadow: '0 12px 20px -3px rgba(79, 70, 229, 0.5)',
                    transform: 'translateY(-1px)'
                  }
                }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ShieldAlert size={20} />}
              >
                {loading ? 'Verifying Credentials...' : 'Sign In as Administrator'}
              </Button>
            </Box>
          </form>
        </Paper>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="text"
            startIcon={<ChevronLeft size={18} />}
            onClick={() => navigate('/')}
            sx={{
              color: 'slate.500',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: 'indigo.50', color: 'indigo.600' }
            }}
          >
            Return to Store
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
