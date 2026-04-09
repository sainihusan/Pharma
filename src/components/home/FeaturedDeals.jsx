import React from 'react';
import { motion } from 'framer-motion';
import { Timer, ArrowRight, Zap, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const deals = [
  {
    id: 1,
    title: "Vitamins Bundle",
    subtitle: "Boost your immunity",
    discount: "30% OFF",
    price: "₹2,499",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop",
    color: "from-blue-600 to-indigo-700",
    icon: <Zap className="w-5 h-5 text-yellow-400" />
  },
  {
    id: 2,
    title: "Organic Skincare",
    subtitle: "Natural glow daily",
    discount: "Free Shipping",
    price: "₹3,999",
    image: "https://plus.unsplash.com/premium_photo-1661770294094-06167872e079?w=600&auto=format&fit=crop",
    color: "from-emerald-600 to-teal-700",
    icon: <Gift className="w-5 h-5 text-pink-300" />
  }
];

const FeaturedDeals = () => {
  return (
    <section className="py-10 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm uppercase tracking-widest mb-3">
              <Timer size={18} className="animate-pulse" />
              <span>Limited Time Offers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              Exclusive Weekly <span className="text-blue-600 font-outline-2">Deals</span>
            </h2>
          </div>
          <Link to="/shop" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 group border-b-2 border-transparent hover:border-blue-600 transition-all pb-1">
            Browse all offers <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-white">
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className={`relative h-[300px] sm:h-[350px] rounded-[3rem] overflow-hidden group shadow-2xl bg-gradient-to-br ${deal.color}`}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover opacity-30 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 sm:p-12 h-full flex flex-col justify-center max-w-sm">
                <div className="flex items-center gap-2 mb-4">
                  {deal.icon}
                  <span className="text-xs font-black uppercase tracking-[0.2em]">{deal.discount}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black mb-2">{deal.title}</h3>
                <p className="text-blue-50 font-medium mb-8">{deal.subtitle}</p>

                <div className="flex items-center gap-6">
                  <Link to="/shop" className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-50 transition-colors">
                    Claim
                  </Link>
                  <p className="text-2xl font-black">Starting {deal.price}</p>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute top-8 right-8 w-24 h-24 border-2 border-white/20 rounded-full flex items-center justify-center animate-spin-slow">
                <div className="w-16 h-16 border border-white/20 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;
