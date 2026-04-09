import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const heroImages = [
    "https://media.istockphoto.com/id/1392605355/photo/senior-woman-in-hospital-bed.webp?a=1&b=1&s=612x612&w=0&k=20&c=O6mZEI4ueq-swuS-Yh54HJI1JwsT0ZE76vLm4FyFWnM=",
    "https://plus.unsplash.com/premium_photo-1661769786626-8025c37907ae?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop",
    "https://plus.unsplash.com/premium_photo-1661770294094-06167872e079?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    "https://plus.unsplash.com/premium_photo-1663047392930-7c1c31d7b785?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580281657529-557a6abb6387?q=80&w=1170&auto=format&fit=crop"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative isolate overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [30, 35, 30],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-200 to-indigo-300 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 pt-10 sm:pb-10 sm:pt-10 lg:flex lg:py-14 relative">
        <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-xl lg:shrink-0 lg:pt-5 text-center lg:text-left">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-600 ring-1 ring-inset ring-blue-500/20 shadow-sm mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Now Serving Nationwide
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-[1.1]"
          >
            Your Health, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-gradient">
              Our Priority.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-lg sm:text-xl leading-relaxed text-gray-600 max-w-xl mx-auto lg:mx-0 font-medium"
          >
            Experience the future of pharmacy. Secure, fast, and professional healthcare essentials delivered to your doorstep with unmatched care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
          >
            <Link
              to="/shop"
              className="w-full sm:w-auto group relative rounded-2xl bg-gray-900 px-8 py-4 text-sm font-bold text-white shadow-2xl hover:bg-blue-600 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              Start Shopping
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/about"
              className="w-full sm:w-auto text-sm font-bold leading-6 text-gray-900 hover:text-blue-600 transition-all border-b-2 border-transparent hover:border-blue-600"
            >
              Learn our story <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-16 lg:ml-12 lg:mt-0 w-full max-w-2xl lg:max-w-none lg:w-1/2 flex justify-center lg:justify-end relative"
        >
          {/* Floating UI Badges */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -left-6 z-20 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/20 hidden sm:flex items-center gap-3 scale-90 lg:scale-100"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <span className="font-bold">✓</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Certified</p>
              <p className="text-sm font-black text-gray-900">100% Genuine</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-2/3 -right-8 z-20 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/20 hidden sm:flex items-center gap-3 scale-90 lg:scale-100"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <span className="font-bold">🚀</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Express</p>
              <p className="text-sm font-black text-gray-900">2hr Delivery</p>
            </div>
          </motion.div>

          {/* Main Image Stack */}
          <div className="relative w-full sm:w-[90%] lg:w-full lg:max-w-[42rem] aspect-[4/3] sm:aspect-square lg:aspect-[16/11] overflow-hidden rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(37,99,235,0.2)] ring-1 ring-gray-900/10 group transition-all duration-500">
            {heroImages.map((img, index) => (
              <img
                key={img}
                src={img}
                alt={`Pharmacy Hero ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${index === currentImageIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-110'
                  }`}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent z-[1]" />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${index === currentImageIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}