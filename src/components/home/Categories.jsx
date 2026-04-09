import React from 'react';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  Baby,
  Sparkles,
  Stethoscope,
  Microscope,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Prescriptions',
    icon: <HeartPulse className="w-8 h-8" />,
    count: '1.2k+ Products',
    color: 'bg-blue-50 text-blue-600',
    hover: 'hover:bg-blue-600 hover:text-white'
  },
  {
    name: 'Baby Care',
    icon: <Baby className="w-8 h-8" />,
    count: '450+ Products',
    color: 'bg-pink-50 text-pink-600',
    hover: 'hover:bg-pink-600 hover:text-white'
  },
  {
    name: 'Skincare',
    icon: <Sparkles className="w-8 h-8" />,
    count: '800+ Products',
    color: 'bg-purple-50 text-purple-600',
    hover: 'hover:bg-purple-600 hover:text-white'
  },
  {
    name: 'Daily Health',
    icon: <Stethoscope className="w-8 h-8" />,
    count: '600+ Products',
    color: 'bg-emerald-50 text-emerald-600',
    hover: 'hover:bg-emerald-600 hover:text-white'
  },
  {
    name: 'Vitamins',
    icon: <Zap className="w-8 h-8" />,
    count: '320+ Products',
    color: 'bg-amber-50 text-amber-600',
    hover: 'hover:bg-amber-600 hover:text-white'
  },
  {
    name: 'Laboratory',
    icon: <Microscope className="w-8 h-8" />,
    count: '150+ Products',
    color: 'bg-cyan-50 text-cyan-600',
    hover: 'hover:bg-cyan-600 hover:text-white'
  },
];

const Categories = () => {
  return (
    <section className="py-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Browse by Needs</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Popular Categories
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-gray-500 text-lg">
            Find exactly what you need from our wide range of medically certified categories.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to="/shop" className="group block">
                <div className={`p-8 rounded-3xl transition-all duration-300 flex flex-col items-center text-center ${cat.color} ${cat.hover} shadow-sm hover:shadow-xl`}>
                  <div className="mb-4 transform transition-transform group-hover:scale-110 duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-sm mb-1">{cat.name}</h3>
                  <p className="text-[10px] opacity-70 font-medium uppercase tracking-wider">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
