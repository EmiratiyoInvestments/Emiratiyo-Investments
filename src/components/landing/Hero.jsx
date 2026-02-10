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
      className="relative w-full overflow-hidden bg-white"
      style={{ backgroundColor: "white" }}
    >
      {/* Background Image Section - TALLER */}
      <div className="relative w-full z-40" style={{ height: "100vh" }}>
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920"
          alt="Luxury Dubai Property"
          className="w-full h-full object-cover"
        />

        {/* DARKER Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

         {/* Wave Shape */}
        <div className="absolute bottom-[-10px] z-40 left-0 w-full">
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
        <div className="absolute inset-0 flex items-center justify-center pb-14">
          <div className="w-full max-w-5xl px-6 text-center">
            {/* Headline */}
            <h1
              style={{ color: "white" }}
              className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-1 leading-tight"
            >
              AI-Powered Real Estate Investments
              <br />
              <span
                className="text-[#e83f25]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                in Dubai{" "}
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white mb-4 leading-relaxed max-w-3xl mx-auto">
              Discover luxury real estate investments in Dubai's most
              prestigious locations.
            </p>
            <p className="text-lg sm:text-xl text-white mb-12 leading-relaxed max-w-3xl mx-auto">
              AI-powered insights for smarter investment decisions.
            </p>

            {/* Button */}
            <div className="flex justify-center">
              <button className="group px-10 py-5 text-lg font-bold text-white bg-[#e83f25] rounded-md hover:bg-[#c73519] transition-all duration-300 shadow-2xl flex items-center gap-3">
                Start Investing
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-80px] left-1/2  transform -translate-x-1/2 z-50 w-full max-w-6xl px-6">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Stat 1 - Line Chart */}
              <div className="text-center">
                <div className="mb-3">
                  <ResponsiveContainer width="100%" height={50}>
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
                <p className="text-5xl font-bold text-[#e83f25] mb-2">500+</p>
                <p className="text-sm text-[#939393] font-medium">
                  Properties Sold
                </p>
              </div>

              {/* Stat 2 - Bar Chart */}
              <div className="text-center">
                <div className="mb-3">
                  <ResponsiveContainer width="100%" height={50}>
                    <BarChart data={data2}>
                      <Bar dataKey="v" fill="#e83f25" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-5xl font-bold text-[#e83f25] mb-2">1000+</p>
                <p className="text-sm text-[#939393] font-medium">
                  Happy Investors
                </p>
              </div>

              {/* Stat 3 - Area Chart */}
              <div className="text-center">
                <div className="mb-3">
                  <ResponsiveContainer width="100%" height={50}>
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
                <p className="text-5xl font-bold text-[#e83f25] mb-2">10%</p>
                <p className="text-sm text-[#939393] font-medium">
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
