import React from "react";

const PropertyCarousel = () => {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&q=80",
      title: "Invest in Dubai's Most Profitable Market",
      subtitle: "AI-powered matching • Guaranteed ROI • Legal support included"
    },
    {
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80",
      title: "Your Dream Property Awaits",
      subtitle: "2,500+ satisfied investors • $500M+ properties sold"
    },
    {
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80",
      title: "Smart Investing Made Simple",
      subtitle: "From consultation to ownership in 30 days"
    }
  ];

  // Duplicate slides for seamless infinite loop
  const duplicatedSlides = [...slides, ...slides, ...slides];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-100">
      <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Infinite Scrolling Container */}
        <div className="flex h-[400px] sm:h-[500px] lg:h-[600px] animate-infinite-scroll gap-6">
          {duplicatedSlides.map((slide, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-[80vw] sm:w-[70vw] lg:w-[60vw] h-full rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-end pb-16 sm:pb-20 lg:pb-24">
                <div className="w-full px-6 sm:px-8 lg:px-12">
                  <div className="max-w-4xl">
                    <h2 style={{ color:"white" }} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-white/90">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes infinite-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-80vw * 3 - 4.5rem));
            }
          }

          @media (min-width: 640px) {
            @keyframes infinite-scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-70vw * 3 - 4.5rem));
              }
            }
          }

          @media (min-width: 1024px) {
            @keyframes infinite-scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-60vw * 3 - 4.5rem));
              }
            }
          }

          .animate-infinite-scroll {
            animation: infinite-scroll 25s linear infinite;
          }

          .animate-infinite-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  );
};

export default PropertyCarousel;