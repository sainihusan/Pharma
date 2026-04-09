import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
  LocalPharmacy
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t pt-10 pb-5 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 gap-6 mb-12">

          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
              <LocalPharmacy className="text-3xl" />
              <span>PharmaCare</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Your trusted partner in healthcare. Providing quality medicines,
              wellness products, and expert advice to ensure a healthier tomorrow for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all" target="_blank">
                <Facebook fontSize="small" />
              </a>
              <a href="https://x.com/" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all " target='_blank'>
                <Twitter fontSize="small" />
              </a>
              <a href="https://www.instagram.com/" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all" target="_blank">
                <Instagram fontSize="small" />
              </a>
              <a href="https://in.linkedin.com/" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all" target="_blank">
                <LinkedIn fontSize="small" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Shop Medicines</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">Customer Care</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/profile" className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block">My Account</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Order History</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Shopping Cart</Link>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 hover:translate-x-1 transition-all inline-block">FAQ & Help</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <a href='https://maps.app.goo.gl/KaXyjHuSpwzsxmUr7' target='_blank'>
                  <LocationOn className="text-blue-600 mt-1" />
                </a>
                <p>121, ambala road, rajpura <br />punjab, india</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-blue-600" />
                <p>+91 9876543210</p>
              </div>
              <div className="flex items-center gap-3">
                <a href='https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox' target='_blank'>
                  <Email className="text-blue-600" />
                </a>
                <p>support@pharmacare.com</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-12  flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} PharmaCare. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
