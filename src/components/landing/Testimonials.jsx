import React from "react";

const Testimonials = () => {
  const testimonialsData = [
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      name: 'Ahmed Al-Rashid',
      role: 'Property Investor',
      location: 'Dubai Marina',
      rating: 5,
      text: 'The AI matching system found me the perfect investment property in Downtown Dubai. ROI exceeded my expectations!',
    },
    {
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      name: 'Sarah Johnson',
      role: 'International Investor',
      location: 'Palm Jumeirah',
      rating: 5,
      text: 'Seamless process from start to finish. The legal team handled everything while I was abroad. Highly recommended!',
    },
    {
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
      name: 'Michael Chen',
      role: 'Real Estate Developer',
      location: 'Business Bay',
      rating: 5,
      text: 'Their market intelligence tools helped me identify emerging hotspots before the competition. Game changer!',
    },
    {
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
      name: 'Fatima Al-Mansoori',
      role: 'Portfolio Manager',
      location: 'Dubai Hills',
      rating: 5,
      text: 'Best real estate investment platform in Dubai. The ROI predictor was incredibly accurate for my portfolio.',
    },
    {
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      name: 'James Wilson',
      role: 'Luxury Investor',
      location: 'Emirates Hills',
      rating: 5,
      text: 'Exceptional service and expertise. Found my dream villa within 2 weeks. The after-sales support is outstanding.',
    },
    {
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      name: 'Layla Hassan',
      role: 'First-time Buyer',
      location: 'JBR',
      rating: 5,
      text: 'As a first-time investor, the team guided me through every step. Now I own a beachfront apartment!',
    },
  ];

  const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white p-6 rounded-lg mx-4 shadow-lg hover:shadow-2xl transition-all duration-300 w-80 shrink-0 border-t-4 border-[#e83f25] group hover:-translate-y-1">
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, index) => (
          <svg
            key={index}
            className="w-5 h-5 fill-[#e83f25]"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-700 leading-relaxed mb-6 italic">
        "{testimonial.text}"
      </p>

      {/* User Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <img
          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
          src={testimonial.image}
          alt={testimonial.name}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-black text-sm">{testimonial.name}</p>
            <svg
              className="w-4 h-4 fill-[#e83f25]"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-500">{testimonial.role}</p>
          <p className="text-xs text-[#e83f25] font-medium">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-gray-50 overflow-hidden">
      {/* Section Heading */}
      <div className="text-center mb-12 sm:mb-16 px-4">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-4">
          What Our <span className="text-[#e83f25]">Investors Say</span>
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Join thousands of satisfied investors who found their perfect Dubai property with us
        </p>
      </div>

      {/* Marquee Animations */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          animation: marqueeScroll 40s linear infinite;
        }

        .marquee-reverse {
          animation-direction: reverse;
        }

        .marquee-inner:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* First Row - Left to Right */}
      <div className="marquee-row w-full mx-auto overflow-hidden relative mb-8">
        <div className="absolute left-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
        <div className="marquee-inner flex transform-gpu min-w-[200%] py-4">
          {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
            <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
      </div>

      {/* Second Row - Right to Left */}
      <div className="marquee-row w-full mx-auto overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-gray-50 to-transparent"></div>
        <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] py-4">
          {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
            <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-gray-50 to-transparent"></div>
      </div>

      {/* Bottom Stats */}
      <div className="mt-16 text-center px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-[#e83f25]">2,500+</div>
            <div className="text-sm text-gray-600 mt-2">Happy Investors</div>
          </div>
          <div className="hidden sm:block w-px h-16 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-[#e83f25]">4.9/5</div>
            <div className="text-sm text-gray-600 mt-2">Average Rating</div>
          </div>
          <div className="hidden sm:block w-px h-16 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-[#e83f25]">$500M+</div>
            <div className="text-sm text-gray-600 mt-2">Properties Sold</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;