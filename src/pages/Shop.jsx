import { useState, useMemo } from 'react';
import { useMedicines } from '../context/MedicinesContext';
import MedicineCard from '../components/MedicineCard';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Baby Care', 'Skincare', 'Daily Health', 'Medicines', 'Laboratory'];

export default function Shop() {
  const { medicines, loading } = useMedicines();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || (() => {
        const productCat = (m.category || '').toLowerCase();
        const selectedCat = selectedCategory.toLowerCase();

        // Handle "Medicines" vs "Medicine" pluralization
        if (selectedCat === 'medicines' && productCat === 'medicine') return true;

        return productCat === selectedCat;
      })();

      return matchesSearch && matchesCategory;
    });
  }, [medicines, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Fetching medical inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">

        <div className="lg:mb-6 mb-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 mb-6"
          >
            Explore <span className="text-blue-600">Pharmacy</span>
          </motion.h1>

          <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between">

            <div className="relative flex-1 max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by medicine name, brand, or ingredients..."
                className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-3xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* View Count */}
            <p className="text-sm font-bold text-gray-400 bg-white px-4 py-2 rounded-xl border border-gray-100 self-start md:self-center">
              Showing {filteredMedicines.length} Results
            </p>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mb-10 ">
          {/* Mobile & Tablet Dropdown Layout (Custom Animated) */}
          <div className="lg:hidden relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border-2 border-gray-100 shadow-sm md:w-48 w-full transition-all hover:border-blue-200 focus:outline-none z-10 relative"
            >
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-blue-500" />
                <span className="text-sm font-bold text-gray-800">{selectedCategory}</span>
              </div>
              <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }}>
                <ChevronDown size={16} className="text-gray-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 left-0 md:w-48 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-20"
                >
                  <div className="py-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors ${selectedCategory === cat
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Pills Layout */}
          <div className="hidden lg:flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide min-w-max">
            <div className="p-2 mr-2 text-gray-400">
              <Filter size={20} />
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${selectedCategory === cat
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                  : 'bg-white border-transparent text-gray-500 hover:border-blue-100 hover:text-blue-600 hover:bg-blue-50/30'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <AnimatePresence mode="popLayout">
          {filteredMedicines.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredMedicines.map((medicine) => (
                <motion.div
                  key={medicine.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <MedicineCard medicine={medicine} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm"
            >
              <div className="inline-flex p-6 rounded-full bg-blue-50 mb-6 text-blue-300">
                <Search size={48} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                No matching products found
              </h3>
              <p className="text-gray-400 max-w-sm mx-auto font-medium">
                We couldn't find any items in <span className="text-blue-600">"{selectedCategory}"</span> matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 mx-auto"
              >
                <X size={18} /> Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
