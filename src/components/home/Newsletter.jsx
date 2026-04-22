import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { Button, CircularProgress } from '@mui/material';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');

  useEffect(() => {
    const texts = [
      "Enter your email address...",
      "Join our weekly newsletter...",
      "Get exclusive health tips...",
      "Stay updated with new offers..."
    ];
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let typingSpeed = 100;
    let timeout;

    const type = () => {
      const fullText = texts[currentIndex];

      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
        typingSpeed = 50;
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
        typingSpeed = 100;
      }

      setPlaceholderText(currentText);

      if (!isDeleting && currentText === fullText) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % texts.length;
        typingSpeed = 500;
      }

      timeout = setTimeout(type, typingSpeed);
    };

    timeout = setTimeout(type, 500);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setEmail('');
      }, 1500);
    }
  };

  return (
    <section className="py-6 bg-white overflow-hidden relative">

      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-100 rounded-full blur-[100px] opacity-40 -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-indigo-100 rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-blue-600 rounded-[3rem] p-8 sm:p-12 lg:p-12 text-center text-white shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Patterns */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 border-4 border-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 border-4 border-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stay Informed, Stay Healthy
            </h2>
            <p className="mt-4 text-blue-100 text-lg">
              Get the latest health tips, prescription reminders, and exclusive offers delivered to your inbox every week.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholderText}
                  className="flex-1 px-6 py-4 rounded-full border-0 bg-white text-black placeholder-black/50 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-white outline-none font-bold"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: 'white',
                    color: 'black',
                    px: 4,
                    py: 2,
                    borderRadius: 99,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s'
                  }}
                  endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Send size={18} />}
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-10 flex items-center justify-center gap-3 text-blue-50 font-bold text-xl"
              >
                <CheckCircle size={28} />
                <span>You're all set! Check your inbox soon.</span>
              </motion.div>
            )}

            <p className="mt-4 text-xs text-blue-200">
              Your data is secured. No spam, we promise.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
