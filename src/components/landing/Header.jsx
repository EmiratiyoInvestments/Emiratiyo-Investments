import React from "react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 flex border-b border-gray-300 py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50">
      <div className="flex flex-wrap items-center gap-4 w-full max-w-6xl mx-auto">
        {/* Logo - Desktop */}
        <a href="/" className="max-sm:hidden">
          <h1
            className="text-3xl font-bold"
          >
            EMIRATIYO
          </h1>
        </a>

        {/* Logo - Mobile (Short) */}
        <a href="/" className="hidden max-sm:block">
          <h1
            className="text-2xl font-bold"
          >
            EMI
          </h1>
        </a>

        {/* Navigation Menu */}
        <div
          id="collapseMenu"
          className="lg:!flex lg:flex-auto lg:ml-12 max-lg:hidden max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
        >
          {/* Close Button (Mobile) */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border border-gray-200 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 fill-black"
              viewBox="0 0 320.591 320.591"
            >
              <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"></path>
              <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"></path>
            </svg>
          </button>

          <div className="lg:!flex lg:flex-auto max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
            {/* Main Navigation Links */}
            <ul className="lg:flex lg:gap-x-8 max-lg:space-y-2">
              <li className="mb-6 hidden max-lg:block">
                <a href="/">
                  <h1
                    className="text-2xl font-bold"
                  >
                    EMIRATIYO
                  </h1>
                </a>
              </li>
              <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3">
                <a
                  href="#home"
                  className="hover:text-[#e83f25] text-[#e83f25] block font-medium text-[15px]"
                >
                  Home
                </a>
              </li>
              <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3">
                <a
                  href="#services"
                  className="hover:text-[#e83f25] text-slate-900 block font-medium text-[15px]"
                >
                  Services
                </a>
              </li>
              <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3">
                <a
                  href="#properties"
                  className="hover:text-[#e83f25] text-slate-900 block font-medium text-[15px]"
                >
                  Properties
                </a>
              </li>
              <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3">
                <a
                  href="#contact"
                  className="hover:text-[#e83f25] text-slate-900 block font-medium text-[15px]"
                >
                  Contact
                </a>
              </li>
            </ul>

            {/* Secondary Links */}
            <ul className="lg:flex lg:items-center ml-auto max-lg:block lg:space-x-8">
              <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 max-lg:mt-2">
                <a
                  href="#about"
                  className="hover:text-[#e83f25] text-slate-900 block font-medium text-[15px]"
                >
                  About Us
                </a>
              </li>
              <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 max-lg:mt-2">
                <a
                  href="#blog"
                  className="hover:text-[#e83f25] text-slate-900 block font-medium text-[15px]"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

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
