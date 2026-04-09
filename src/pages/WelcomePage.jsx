import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { Navigate, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, LogIn, UserPlus, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';
import ForgotPasswordView from './auth/ForgotPassword';

function WelcomeOptions({ setMode }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm mx-auto flex flex-col gap-8"
    >
      <div className="text-center">
        <Typography variant="h3" fontWeight={900} className="text-gray-900 tracking-tight">
          Welcome
        </Typography>
        <Typography variant="body1" className="text-gray-500 font-medium">
          Log in or create a new account to access your personalized pharmacy.
        </Typography>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          onClick={() => setMode('login')}
          variant="contained"
          size="large"
          fullWidth
          startIcon={<LogIn size={20} />}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: 800,
            fontSize: '1rem',
            textTransform: 'none',
            boxShadow: '0 8px 20px -6px rgba(37, 99, 235, 0.4)',
            '&:hover': {
              boxShadow: '0 12px 25px -6px rgba(37, 99, 235, 0.5)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s'
          }}
        >
          Sign In
        </Button>

        <Button
          onClick={() => setMode('signup')}
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<UserPlus size={20} />}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: 800,
            fontSize: '1rem',
            textTransform: 'none',
            borderWidth: '2px',
            borderColor: 'grey.300',
            color: 'grey.800',
            '&:hover': {
              borderWidth: '2px',
              borderColor: 'primary.main',
              backgroundColor: 'rgba(37, 99, 235, 0.04)'
            }
          }}
        >
          Create Account
        </Button>
      </div>

      <div className="text-center">
        <Typography variant="caption" className="text-gray-400 font-medium">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Typography>
      </div>

    </motion.div>
  );
}

export default function WelcomePage() {
  const { user } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.mode || 'welcome');
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  }

  if (user) {
    if (user.role?.toLowerCase() === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      <div className="hidden lg:flex lg:w-[60%] h-full relative flex-col justify-between p-16 shrink-0">
        <div className="absolute inset-0 z-0">
          <img
            src="https://plus.unsplash.com/premium_photo-1661769786626-8025c37907ae?w=600&auto=format&fit=crop"
            alt="Pharmacy Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent" />
        </div>

        <div className="relative z-10 flex text-white justify-start">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 drop-shadow-lg cursor-pointer"
            onClick={goToHome}
          >
            <HeartPulse size={48} className="text-white" />
            <Typography variant="h3" fontWeight={900} className="tracking-tight">
              PharmaCare
            </Typography>
          </motion.div>
        </div>

        <div className="relative z-10 mt-auto pt-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography variant="h2" fontWeight={900} className="text-white mb-6 leading-tight drop-shadow-md">
              Your Health, <br />
              <span className="text-blue-300">Delivered Fast.</span>
            </Typography>
            <Typography variant="h6" className="text-blue-50 font-normal max-w-xl leading-relaxed drop-shadow-sm">
              Experience the modern pharmacy. Get your prescriptions and daily health essentials delivered fast, with complete privacy and exceptional customer support right at your fingertips.
            </Typography>
          </motion.div>
        </div>
      </div>


      <div className="w-full lg:w-[40%] h-full bg-white flex flex-col lg:justify-center items-center px-4 py-8 sm:px-8 lg:px-12 shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.1)] relative z-20 overflow-y-auto">


        <div className="flex lg:hidden items-center gap-3 w-full max-w-sm mx-auto mb-8 justify-center">
          <HeartPulse size={40} className="text-blue-600" />
          <Typography variant="h4" fontWeight={900} className="tracking-tight text-gray-900">
            PharmaCare
          </Typography>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'welcome' && <WelcomeOptions setMode={setMode} />}
          {mode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <LoginPage
                onBack={() => setMode('welcome')}
                onSwitch={() => setMode('signup')}
                onForgotPassword={() => setMode('forgot-password')}
              />
            </motion.div>
          )}
          {mode === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <SignupPage
                onBack={() => setMode('welcome')}
                onSwitch={() => setMode('login')}
              />
            </motion.div>
          )}
          {mode === 'forgot-password' && (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <ForgotPasswordView
                onBack={() => setMode('login')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

