import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import Dashboard from './pages/admin/Dashboard';


import WelcomePage from './pages/WelcomePage';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ProfilePage from './pages/Profile';


import ProtectedRoute from './components/auth/ProtectedRoute';


import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MedicinesProvider } from './context/MedicinesContext';
import { OrdersProvider } from './context/OrdersContext';

import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    secondary: { main: '#f43f5e' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 13.5,
    h1: { fontSize: '2.5rem' },
    h2: { fontSize: '2rem' },
    h3: { fontSize: '1.75rem' },
    body1: { fontSize: '0.925rem' },
    body2: { fontSize: '0.825rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
});

export default function App() {
  const location = useLocation();
  const hideLayoutRoutes = ['/welcome', '/forgot-password'];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MedicinesProvider>
          <CartProvider>
            <OrdersProvider>
              <ScrollToTop />
              <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900 text-[14px]">
                {!shouldHideLayout && <Navbar />}

                <main className="flex-1 flex flex-col relative">
                  {/* Global Background Decorations */}
                  <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-100/40 blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-100/30 blur-[120px] animate-pulse delay-1000" />
                  </div>

                  <PageTransition>
                    <Routes location={location} key={location.pathname}>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

                      <Route path="/welcome" element={<WelcomePage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                      <Route path="/orders" element={
                        <ProtectedRoute><OrderHistory /></ProtectedRoute>
                      } />

                      <Route path="/profile" element={
                        <ProtectedRoute><ProfilePage /></ProtectedRoute>
                      } />

                      <Route path="/admin/dashboard" element={
                        <ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>
                      } />

                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </PageTransition>
                </main>

                {!shouldHideLayout && <Footer />}
              </div>
            </OrdersProvider>
          </CartProvider>
        </MedicinesProvider>
      </AuthProvider>
    </MuiThemeProvider>
  );
}
