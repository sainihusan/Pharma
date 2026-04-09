import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedDeals from '../components/home/FeaturedDeals';
import Features from '../components/home/Features';
import Categories from '../components/home/Categories';
import Stats from '../components/home/Stats';
import Brands from '../components/home/Brands';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <Hero />
      <FeaturedDeals />
      <Categories />
      <Features />
      <Stats />
      <Brands />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;
