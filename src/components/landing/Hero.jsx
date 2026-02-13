import React from "react";
import { ArrowRight } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

const Hero = () => {
  const data1 = [
    { v: 30 },
    { v: 50 },
    { v: 45 },
    { v: 70 },
    { v: 65 },
    { v: 85 },
  ];
  const data2 = [
    { v: 40 },
    { v: 35 },
    { v: 55 },
    { v: 50 },
    { v: 70 },
    { v: 90 },
  ];
  const data3 = [
    { v: 20 },
    { v: 45 },
    { v: 40 },
    { v: 60 },
    { v: 55 },
    { v: 75 },
  ];

  return (
    <section
      className="relative w-full overflow-hidden  bg-white"
    >
      {/* Background Image Section with Responsive Height */}
      <div className="relative w-full z-40 h-[90vh] min-h-[600px] sm:min-h-[750px] flex items-center justify-center pt-10 sm:pt-0">
        <img
          src="https://plus.unsplash.com/premium_photo-1661964298224-7747aa0ac10c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury Dubai Property"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10"></div>

        {/* Wave Shape */}
        <div className="absolute bottom-[-1px] z-20 left-0 w-full">
          <svg
            className="w-full block"
            style={{ height: "120px" }}
            viewBox="0 0 1440 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path d="M0 0L720 100L1440 0V150H0V0Z" fill="#f7f7f7" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative cursor-pointer z-30 w-full max-w-5xl px-6 text-center transform translate-y-[-20px] sm:translate-y-0">
          {/* Headline */}
          <h1
            style={{ color: "white" }}
            className="text-3xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight"
          >
            AI-Powered Real Estate Investments
            <br />
            <span
              className="text-[#e83f25]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              in UAE
            </span>
          </h1>

          {/* Description Group */}
          <div className="space-y-2 mb-8 sm:mb-10">
            <p className="text-sm sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Discover luxury real estate investments in UAE's most
              prestigious locations.
            </p>
            <p className="text-sm sm:text-lg md:text-xl text-white leading-relaxed max-w-3xl mx-auto">
              AI-powered insights for smarter investment decisions.
            </p>
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <button className="group px-7 py-4 sm:px-10 sm:py-5 text-base sm:text-lg font-bold text-white bg-[#e83f25] rounded-md hover:bg-[#c73519] transition-all duration-300 shadow-2xl flex items-center gap-3">
              Start Investing
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>


        <div className="absolute bottom-[-120px] sm:bottom-[-80px] left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-2xl p-5 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {/* Stat 1 - Line Chart */}
              <div className="text-center">
                <div className="mb-2">
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={data1}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke="#e83f25"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-4xl sm:text-5xl font-bold text-[#e83f25] mb-1">500+</p>
                <p className="text-xs sm:text-sm text-[#939393] font-semibold uppercase tracking-wider">
                  Properties Sold
                </p>
              </div>

              {/* Stat 2 - Bar Chart */}
              <div className="text-center">
                <div className="mb-2">
                  <ResponsiveContainer width="100%" height={40}>
                    <BarChart data={data2}>
                      <Bar dataKey="v" fill="#e83f25" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-4xl sm:text-5xl font-bold text-[#e83f25] mb-1">1000+</p>
                <p className="text-xs sm:text-sm text-[#939393] font-semibold uppercase tracking-wider">
                  Happy Investors
                </p>
              </div>

              {/* Stat 3 - Area Chart */}
              <div className="text-center">
                <div className="mb-2">
                  <ResponsiveContainer width="100%" height={40}>
                    <AreaChart data={data3}>
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="#e83f25"
                        fill="#e83f25"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-4xl sm:text-5xl font-bold text-[#e83f25] mb-1">18%</p>
                <p className="text-xs sm:text-sm text-[#939393] font-semibold uppercase tracking-wider">
                  Average ROI
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Stats Section with padding for floating card */}
      <div className="bg-[#f7f7f7] pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
        </div>
      </div>

    </section>
  );
};

export default Hero;
