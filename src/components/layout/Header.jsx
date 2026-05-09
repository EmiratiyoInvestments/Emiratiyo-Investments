import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useServerStatus } from "../../hooks/useServerStatus";

const menuVariants = {
  closed: {
    scaleY: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.6,
    },
  },
  open: {
    scaleY: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      delay: 0,
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

const ServerDot = () => {
  const { isReady } = useServerStatus();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: isReady ? "#22c55e" : "#9ca3af",
          flexShrink: 0,
          animation: isReady ? "none" : "serverPulse 1.8s ease-in-out infinite",
        }}
      />
      {hovered && (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1f2937",
            color: "#f9fafb",
            fontSize: 11,
            fontWeight: 500,
            padding: "3px 8px",
            borderRadius: 5,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          {isReady ? "Live" : "Connecting..."}
        </span>
      )}
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeClassName = "text-[#e83f25] font-bold";
  const inactiveClassName = "text-black duration-300 hover:text-[#e83f25]";

  const getClassName = ({ isActive }) =>
    `block font-medium text-[13px] transition-all whitespace-nowrap ${isActive ? activeClassName : inactiveClassName}`;

  const getMobileClassName = ({ isActive }) =>
    `block font-medium text-xl text-center transition-all ${isActive ? activeClassName : inactiveClassName}`;

  return (
    <header className="sticky top-0 flex items-center border-b border-gray-300 px-4 sm:px-6 bg-white h-[70px] tracking-wide relative z-[1500]">
      <div className="flex items-center w-full max-w-7xl mx-auto">

        <Link to="/" className="max-sm:hidden relative h-12 w-44 flex-shrink-0">
          <img
            src="/logos/transparent_1.png"
            alt="EMIRATIYO"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-auto max-w-none"
          />
        </Link>

        <Link to="/" className="hidden max-sm:block relative h-10 w-32 flex-shrink-0">
          <img
            src="/logos/transparent_1.png"
            alt="EMIRATIYO"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-auto max-w-none"
          />
        </Link>

        <div className="hidden lg:flex items-center flex-1 ml-6">

          <ul className="flex items-center gap-x-5 xl:gap-x-7">
            <li>
              <NavLink to="/" end className={getClassName}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/services" className={getClassName}>Services</NavLink>
            </li>
            <li>
              <NavLink to="/properties" className={getClassName}>Properties</NavLink>
            </li>
            <li>
              <NavLink to="/market-insights" className={getClassName}>Market Insights</NavLink>
            </li>
            <li>
              <NavLink to="/business-setup" className={getClassName}>Business Setup</NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={getClassName}>Contact</NavLink>
            </li>
          </ul>

          <div className="border-l border-gray-300 h-5 mx-4 xl:mx-6"></div>

          <ul className="flex items-center gap-x-5 xl:gap-x-7">
            <li>
              <NavLink to="/about" className={getClassName}>About Us</NavLink>
            </li>
            <li>
              <NavLink to="/blog" className={getClassName}>Blog</NavLink>
            </li>
          </ul>

          <div className="ml-auto flex items-center gap-3">
            <ServerDot />
            <Link to="/contact" className="px-4 py-2 text-sm rounded-md font-medium text-white bg-[#e83f25] border-2 border-[#e83f25] hover:bg-[#c73519] hover:border-[#c73519] cursor-pointer whitespace-nowrap transition-colors">
              Book Consultation
            </Link>
          </div>
        </div>

        <div className="flex items-center ml-auto gap-3 lg:hidden">
          <ServerDot />
          <Link to="/contact" className="px-3 py-1.5 text-xs rounded-md font-medium text-white bg-[#e83f25] border-2 border-[#e83f25] hover:bg-[#c73519] cursor-pointer transition-colors">
            Book Consultation
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer"
          >
            <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 h-screen bg-white z-[1600] origin-top lg:hidden overflow-y-auto"
            >
              <button
                onClick={() => setIsMenuOpen(false)}
                className="fixed top-6 right-6 z-[1700] rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-black" viewBox="0 0 320.591 320.591">
                  <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" />
                  <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" />
                </svg>
              </button>

              <div className="flex flex-col items-center justify-center min-h-full py-16 px-6">
                <motion.div
                  variants={menuContainerVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="flex flex-col items-center w-full max-w-sm"
                >
                  <motion.div variants={menuLinkVariants} className="mb-8">
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>
                      <img src="/logos/transparent_1.png" alt="EMIRATIYO" className="h-44" />
                    </Link>
                  </motion.div>

                  {[
                    { to: "/", label: "Home", end: true },
                    { to: "/services", label: "Services" },
                    { to: "/properties", label: "Properties" },
                    { to: "/market-insights", label: "Market Insights" },
                    { to: "/business-setup", label: "Business Setup" },
                    { to: "/contact", label: "Contact" },
                    { to: "/about", label: "About Us" },
                    { to: "/blog", label: "Blog" },
                  ].map((item) => (
                    <motion.div
                      key={item.to}
                      variants={menuLinkVariants}
                      className="w-full border-b border-gray-100 py-3"
                    >
                      <NavLink
                        to={item.to}
                        end={item.end}
                        onClick={() => setIsMenuOpen(false)}
                        className={getMobileClassName}
                      >
                        {item.label}
                      </NavLink>
                    </motion.div>
                  ))}

                  <motion.div variants={menuLinkVariants} className="mt-8 w-full">
                    <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block w-full px-6 py-3 text-base text-center rounded-lg font-semibold text-white bg-[#e83f25] hover:bg-[#c73519] cursor-pointer transition-colors">
                      Book Consultation
                    </Link>
                  </motion.div>

                  <motion.div variants={menuLinkVariants} className="mt-4 flex justify-center">
                    <ServerDot />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`
        @keyframes serverPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </header>
  );
};

export default Header;