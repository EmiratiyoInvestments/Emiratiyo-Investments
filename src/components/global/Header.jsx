import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Framer Motion Variants
const menuVariants = {
  closed: {
    scaleY: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.6, // Wait for children to finish animating out (slower)
    },
  },
  open: {
    scaleY: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      delay: 0, // No delay on open
    },
  },
};

const menuContainerVariants = {
  closed: {
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.07,
      staggerDirection: 1,
    },
  },
};

const menuLinkVariants = {
  closed: {
    y: "30vh",
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeClassName = "text-primary font-bold";
  const inactiveClassName = "text-black  duration-300 hover:text-red-500 dark:hover:text-red-500";

  const getClassName = ({ isActive }) =>
    `block font-medium text-[15px] transition-all ${isActive ? activeClassName : inactiveClassName}`;

  const getMobileClassName = ({ isActive }) =>
    `block font-medium text-2xl text-center transition-all ${isActive ? activeClassName : inactiveClassName}`;

  return (
    <header className="sticky top-0 flex items-center border-b border-gray-300 px-4 sm:px-10 bg-white h-[70px] tracking-wide relative z-50">
      <div className="flex flex-wrap items-center gap-4 w-full max-w-6xl mx-auto">
        {/* Logo - Desktop */}
        <Link to="/" className="max-sm:hidden relative h-12 w-52">
          <img
            src="/logos/transparent_1.png"
            alt="EMIRATIYO"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-auto max-w-none"
          />
        </Link>

        {/* Logo - Mobile */}
        <Link to="/" className="hidden max-sm:block relative h-10 w-32">
          <img
            src="/logos/transparent_1.png"
            alt="EMIRATIYO"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-auto max-w-none"
          />
        </Link>

        {/* Desktop Navigation Menu - Static */}
        <div className="hidden lg:flex lg:flex-auto lg:ml-12">
          <div className="lg:flex lg:flex-auto">
            {/* Main Navigation Links */}
            <ul className="lg:flex lg:gap-x-8">
              <li>
                <NavLink to="/" end className={getClassName}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className={getClassName}>
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/properties" className={getClassName}>
                  Properties
                </NavLink>
              </li>
              <li>
                <NavLink to="/business-setup" className={getClassName}>
                  Business Setup
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={getClassName}>
                  Contact
                </NavLink>
              </li>
            </ul>

            {/* Secondary Links */}
            <ul className="lg:flex lg:items-center ml-auto lg:space-x-8">
              <li>
                <NavLink to="/about" className={getClassName}>
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className={getClassName}>
                  Blog
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Menu - Animated with Framer Motion */}
        <AnimatePresence mode="wait">
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 h-screen bg-white z-[60] origin-top lg:hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="fixed top-6 right-6 z-[100] rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 fill-black"
                  viewBox="0 0 320.591 320.591"
                >
                  <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"></path>
                  <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"></path>
                </svg>
              </button>

              {/* Menu Content */}
              <div className="flex flex-col items-center justify-center h-full px-6">
                <motion.div
                  variants={menuContainerVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="flex flex-col items-center space-y-6 w-full max-w-md"
                >
                  {/* Logo */}
                  <motion.div variants={menuLinkVariants} className="mb-8">
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>
                      <img src="/logos/transparent_1.png" alt="EMIRATIYO" className="h-32" />
                    </Link>
                  </motion.div>

                  {/* Main Navigation Links */}
                  <motion.div variants={menuLinkVariants} className="w-full border-b border-gray-300 pb-4">
                    <NavLink
                      to="/"
                      end
                      onClick={() => setIsMenuOpen(false)}
                      className={getMobileClassName}
                    >
                      Home
                    </NavLink>
                  </motion.div>

                  <motion.div variants={menuLinkVariants} className="w-full border-b border-gray-300 pb-4">
                    <NavLink
                      to="/services"
                      onClick={() => setIsMenuOpen(false)}
                      className={getMobileClassName}
                    >
                      Services
                    </NavLink>
                  </motion.div>

                  <motion.div variants={menuLinkVariants} className="w-full border-b border-gray-300 pb-4">
                    <NavLink
                      to="/properties"
                      onClick={() => setIsMenuOpen(false)}
                      className={getMobileClassName}
                    >
                      Properties
                    </NavLink>
                  </motion.div>

                  <motion.div variants={menuLinkVariants} className="w-full border-b border-gray-300 pb-4">
                    <NavLink
                      to="/business-setup"
                      onClick={() => setIsMenuOpen(false)}
                      className={getMobileClassName}
                    >
                      Business Setup
                    </NavLink>
                  </motion.div>

                  <motion.div variants={menuLinkVariants} className="w-full border-b border-gray-300 pb-4">
                    <NavLink
                      to="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      className={getMobileClassName}
                    >
                      Contact
                    </NavLink>
                  </motion.div>

                  {/* Secondary Links */}
                  <motion.div variants={menuLinkVariants} className="w-full border-b border-gray-300 pb-4 pt-4">
                    <NavLink
                      to="/about"
                      onClick={() => setIsMenuOpen(false)}
                      className={getMobileClassName}
                    >
                      About Us
                    </NavLink>
                  </motion.div>

                  <motion.div variants={menuLinkVariants} className="w-full border-b border-gray-300 pb-4">
                    <NavLink
                      to="/blog"
                      onClick={() => setIsMenuOpen(false)}
                      className={getMobileClassName}
                    >
                      Blog
                    </NavLink>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="border-l border-gray-400 h-6 max-lg:hidden"></div>

        {/* Right Side Actions */}
        <div className="flex items-center ml-auto space-x-4">
          <button className="px-4 py-2 text-sm rounded-md font-medium text-white border-2 bg-[#e83f25] border-[#e83f25] hover:bg-[#c73519] hover:border-[#c73519] cursor-pointer">
            Book Consultation
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden cursor-pointer"
          >
            <svg
              className="w-7 h-7"
              fill="#000"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
