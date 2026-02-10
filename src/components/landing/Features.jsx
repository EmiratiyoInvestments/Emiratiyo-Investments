import React from "react";

const AIFeatures = () => {
  return (
    <section className="relative py-9 sm:py-20 md:-mt-25 lg:py-28 bg-white overflow-hidden">
      {/* Decorative geometric background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          className="absolute top-[-100px] right-[-50px] w-[300px] h-[300px] bg-[#e83f25] opacity-30"
          style={{
            clipPath:
              "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
        ></div>
        <div
          className="absolute bottom-[-150px] left-[-80px] w-[400px] h-[400px] bg-black opacity-20"
          style={{
            clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
          }}
        ></div>
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-4">
            Invest Smarter with{" "}
            <span className="text-[#e83f25]">AI Technology</span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Harness the power of artificial intelligence to make data-driven
            investment decisions in Dubai's dynamic real estate market
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Card 1: AI Property Matcher */}
          <FeatureCard
            title="AI Property Matcher"
            description="Our AI algorithm analyzes your investment goals and matches you with perfect properties tailored to your portfolio strategy"
            ctaText="Try Now"
            ctaLink="#"
            imageSrc="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
            imageAlt="Dubai Luxury Real Estate"
          />

          {/* Card 2: ROI Predictor */}
          <FeatureCard
            title="ROI Predictor"
            description="Predict your returns with our machine learning models based on comprehensive market data and historical trends"
            ctaText="Calculate ROI"
            ctaLink="#"
            imageSrc="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
            imageAlt="Modern Dubai Architecture"
          />

          {/* Card 3: Market Intelligence */}
          <FeatureCard
            title="Market Intelligence"
            description="Real-time Dubai market insights powered by AI analytics to keep you ahead of market trends and opportunities"
            ctaText="View Insights"
            ctaLink="#"
            imageSrc="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80"
            imageAlt="Dubai Marina Skyline"
          />
        </div>

        {/* Bottom Info */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-wider mb-4">
            Powered by Advanced Machine Learning
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#e83f25] rounded-full"></div>
              <span className="text-sm text-gray-600">Real-Time Data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#e83f25] rounded-full"></div>
              <span className="text-sm text-gray-600">
                Predictive Analytics
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#e83f25] rounded-full"></div>
              <span className="text-sm text-gray-600">Smart Automation</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
};

const FeatureCard = ({
  title,
  description,
  ctaText,
  ctaLink,
  imageSrc,
  imageAlt,
}) => {
  return (
    <div className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 cursor-pointer overflow-hidden">
      <div className="h-48 sm:h-56 lg:h-64 relative overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Card Content */}
      <div className="p-6 lg:p-8">
        <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
        <a
          href={ctaLink}
          className="relative inline-flex items-center gap-2 font-semibold tracking-wide uppercase text-sm text-black hover:text-[#e83f25] transition-colors duration-300 group/link"
        >
          {ctaText}
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#e83f25] transition-all duration-300 group-hover/link:w-full"></span>
        </a>
      </div>
    </div>
  );
};

export default AIFeatures;
