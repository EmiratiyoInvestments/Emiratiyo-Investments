import React from "react";
import { Check } from "lucide-react";

const WhyDubai = () => {
  const benefits = [
    "Zero Income Tax",
    "Zero Capital Gains Tax",
    "Zero Wealth Tax",
    "10% Average ROI",
    "Golden Visa Eligibility",
    "USD-Pegged Currency Stability",
    "Direct Flights from 97 Countries",
    "Freehold Ownership Available",
  ];

  return (
    <section className="relative md:-mt-25 py-30 z-10 bg-white overflow-hidden">
      {/* Subtle Background Patterns - CORNER ACCENTS ONLY */}
      <div
        className="absolute  right-10 w-40 h-40 opacity-5"
        style={{
          background: "#e83f25",
          clipPath:
            "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
      ></div>

      <div
        className="absolute bottom-20 left-10 w-32 h-32 opacity-5 rounded-full"
        style={{
          background: "#000000",
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* 2-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT COLUMN */}
          <div>
            {/* Section Heading */}
            <p className="text-[#e83f25] font-bold text-sm uppercase tracking-wide mb-3">
              About Us
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#000000] mb-6 leading-tight">
              Why Invest in Dubai?
            </h2>
            <p className="text-base text-[#939393] mb-10 leading-relaxed">
              Our open, flexible workspace encourages interaction and sparks
              inspiration, while dedicated areas provide quiet reflection.
            </p>

            {/* Stats - 3 columns with borders */}
            <div className="grid grid-cols-3 gap-0 mb-10">
              <div className="pr-6 border-r border-gray-300">
                <p className="text-5xl font-bold text-[#e83f25] mb-2">20</p>
                <p className="text-sm text-[#939393]">
                  Year of
                  <br />
                  Experience
                </p>
              </div>

              <div className="px-6 border-r border-gray-300">
                <p className="text-5xl font-bold text-[#e83f25] mb-2">50+</p>
                <p className="text-sm text-[#939393]">
                  Successful
                  <br />
                  Project
                </p>
              </div>

              <div className="pl-6">
                <p className="text-5xl font-bold text-[#e83f25] mb-2">94</p>
                <p className="text-sm text-[#939393]">
                  Trusted
                  <br />
                  Workers
                </p>
              </div>
            </div>

            {/* Bottom Left Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-80">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
                alt="Construction Site"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* Top Right Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-80 mb-10">
              <img
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800"
                alt="Dubai Skyline"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Benefits List */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-8 mt-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#e83f25]/10 rounded-full flex items-center justify-center text-[#e83f25] flex-shrink-0">
                    <Check className="w-5 h-5" strokeWidth={3} />
                  </div>
                  <p className="text-base text-[#000000] font-medium">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDubai;
