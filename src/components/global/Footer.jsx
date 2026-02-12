import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      {/* CTA Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div
          className="relative overflow-hidden py-12 sm:py-16 px-6 sm:px-10 lg:px-16 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #e83f25 0%, #ff5733 50%, #ff8566 100%)'
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 grid md:grid-cols-2 grid-cols-1 gap-8 items-center">
            <div>
              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Ready to Invest in Dubai Real Estate?
              </h2>
              <p className="text-white/95 text-lg">
                Start your investment journey today with AI-powered property matching
              </p>
            </div>
            <div className="flex items-center justify-start md:justify-end">
              <button className="group relative px-8 py-4 bg-black text-white font-bold text-lg rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                <span className="relative z-10">Book Free Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full py-12 lg:pt-20 lg:pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <div className="mb-8 relative h-12">
                <img
                  src="/logos/transparent_1.png"
                  alt="EMIRATIYO"
                  className="absolute top-1/2 -translate-y-1/2 h-44 w-auto -ml-8 max-w-none"
                />
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Your trusted partner in Dubai real estate investment. We leverage AI technology to match investors with their perfect properties, ensuring maximum ROI and seamless transactions.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 hover:text-[#e83f25] transition-colors duration-300 cursor-pointer">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>+971 4 XXX XXXX</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-[#e83f25] transition-colors duration-300 cursor-pointer">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span>info@emiratiyo.ae</span>
                </div>
                <div className="flex items-start gap-3 text-gray-600 hover:text-[#e83f25] transition-colors duration-300 cursor-pointer">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>Business Bay, Dubai, UAE</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h4 className="font-bold text-black uppercase mb-6 tracking-wider">Quick Links</h4>
              <div className="space-y-3">
                <p>
                  <Link className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" to="/home">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    Home
                  </Link>
                </p>
                <p>
                  <Link className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" to="/services">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    Services
                  </Link>
                </p>
                <p>
                  <Link className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" to="/properties">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    Properties
                  </Link>
                </p>
                <p>
                  <Link className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" to="/business-setup">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    Business Setup
                  </Link>
                </p>
                <p>
                  <Link className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" to="/contact">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    Contact
                  </Link>
                </p>
                <p>
                  <Link className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" to="/about">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    About Us
                  </Link>
                </p>
              </div>
            </div>

            {/* Resources */}
            <div className="col-span-1">
              <h4 className="font-bold text-black uppercase mb-6 tracking-wider">Resources</h4>
              <div className="space-y-3">
                <p>
                  <Link className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" to="/blog">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    Blog & News
                  </Link>
                </p>
                <p>
                  <a className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" href="#market">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    Market Insights
                  </a>
                </p>
                <p>
                  <a className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" href="#calculator">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    ROI Calculator
                  </a>
                </p>
                <p>
                  <a className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" href="#faq">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    FAQ
                  </a>
                </p>
              </div>
            </div>

            {/* Legal */}
            <div className="col-span-1">
              <h4 className="font-bold text-black uppercase mb-6 tracking-wider">Legal</h4>
              <div className="space-y-3">
                <p>
                  <a className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" href="#privacy">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    Privacy Policy
                  </a>
                </p>
                <p>
                  <a className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" href="#terms">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    Terms of Service
                  </a>
                </p>
                <p>
                  <a className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" href="#disclaimer">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    Disclaimer
                  </a>
                </p>
                <p>
                  <a className="text-gray-600 hover:text-[#e83f25] transition-colors duration-300 inline-flex items-center gap-2 group" href="#cookies">
                    <span className="w-0 h-0.5 bg-[#e83f25] group-hover:w-4 transition-all duration-300"></span>
                    Cookie Policy
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              {/* Copyright */}
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600">
                  © {new Date().getFullYear()} <Link to="/" className="hover:text-[#e83f25] transition-colors duration-300 font-semibold text-gray-800">EMIRATIYO</Link>. All rights reserved. Dubai Real Estate Investment Platform.
                </p>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/emiratiyo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 inline-flex justify-center items-center rounded-lg border border-gray-300 text-gray-600 hover:text-white hover:bg-[#e83f25] hover:border-[#e83f25] transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/emiratiyo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 inline-flex justify-center items-center rounded-lg border border-gray-300 text-gray-600 hover:text-white hover:bg-[#e83f25] hover:border-[#e83f25] transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;