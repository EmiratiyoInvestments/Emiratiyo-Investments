import React from "react";

const HowItWorks = () => {
  return (
    <section className="max-w-6xl mx-auto py-10 sm:py-20 md:-mt-30 lg:py-28 px-4">
      {/* Section Heading */}
      <div className="text-center mb-16 sm:mb-20">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-4">
          Your Investment <span className="text-[#e83f25]">Journey</span>
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          From consultation to ownership, we guide you every step of the way
        </p>
      </div>

      {/* Timeline */}
      <div>
        {/* Step 1: Free Consultation */}
        <div className="flex flex-row">
          <div className="hidden md:flex flex-col items-center">
            <div className="w-32 py-5 border-2 border-[#e83f25] rounded mr-4 uppercase flex flex-col items-center justify-center bg-white hover:bg-[#e83f25] hover:text-white transition-colors duration-300 group">
              <div className="text-3xl font-black text-[#e83f25] group-hover:text-white">
                01
              </div>
              <div className="text-gray-600 text-sm font-semibold group-hover:text-white">
                Step 1
              </div>
            </div>
            <div className="h-full border-l-4 border-transparent">
              <div className="border-l-4 mr-4 h-full border-gray-300 border-dashed"></div>
            </div>
          </div>
          <div className="flex-auto border-2 rounded border-gray-200 hover:border-[#e83f25] hover:shadow-lg transition-all duration-300">
            <div className="flex md:flex-row flex-col items-center">
              <div className="flex-auto">
                <div className="md:hidden text-sm font-normal uppercase pt-3 pl-3 text-gray-500">
                  <span className="font-black text-[#e83f25]">Step 1</span>
                </div>
                <div className="p-6 text-2xl sm:text-3xl text-black font-bold">
                  Free Consultation
                </div>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  Share your investment goals with our experts. We'll understand
                  your budget, preferences, and investment strategy to create a
                  personalized plan.
                </div>
              </div>
              <div className="md:w-40 w-full p-8 flex items-center justify-center">
                {/* Consultation Icon */}
                <svg
                  className="w-24 h-24 text-[#e83f25]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Connector 1-2 */}
        <div className="flex items-start flex-row">
          <div className="border-t-4 border-r-4 border-transparent">
            <div className="w-16 ml-16 h-16 border-l-4 border-gray-300 border-dashed border-b-4 rounded-bl-full"></div>
          </div>
          <div className="border-t-4 border-transparent flex-auto">
            <div className="h-16 border-b-4 border-gray-300 border-dashed"></div>
          </div>
          <div className="w-16 mt-16 mr-16 h-16 border-r-4 border-gray-300 border-dashed border-t-4 rounded-tr-full"></div>
        </div>

        {/* Step 2: AI-Powered Matching */}
        <div className="flex flex-row-reverse">
          <div className="hidden md:flex flex-col items-center">
            <div className="w-32 py-5 border-2 border-[#e83f25] rounded ml-4 uppercase flex flex-col items-center justify-center bg-white hover:bg-[#e83f25] hover:text-white transition-colors duration-300 group">
              <div className="text-3xl font-black text-[#e83f25] group-hover:text-white">
                02
              </div>
              <div className="text-gray-600 text-sm font-semibold group-hover:text-white">
                Step 2
              </div>
            </div>
            <div className="h-full border-r-4 border-transparent">
              <div className="border-l-4 ml-4 h-full border-gray-300 border-dashed"></div>
            </div>
          </div>
          <div className="flex-auto border-2 rounded border-gray-200 hover:border-[#e83f25] hover:shadow-lg transition-all duration-300">
            <div className="flex md:flex-row flex-col items-center">
              <div className="flex-auto">
                <div className="md:hidden text-sm font-normal uppercase pt-3 pl-3 text-gray-500">
                  <span className="font-black text-[#e83f25]">Step 2</span>
                </div>
                <div className="p-6 text-2xl sm:text-3xl text-black font-bold">
                  Propeye: AI-Powered Property Matching
                </div>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  Propeye combines market intelligence, predictive analysis, and portfolio logic to match you with properties designed for higher returns and lower risk.
                </div>
              </div>
              <div className="md:w-40 w-full p-8 flex items-center justify-center">
                {/* AI Matching Icon */}
                <svg
                  className="w-24 h-24 text-[#e83f25]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                  <circle cx="12" cy="10" r="2" strokeWidth="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M16 10h.01"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Connector 2-3 */}
        <div className="flex items-start flex-row-reverse">
          <div className="border-t-4 border-l-4 border-transparent">
            <div className="w-16 mr-16 h-16 border-r-4 border-gray-300 border-dashed border-b-4 rounded-br-full"></div>
          </div>
          <div className="border-t-4 border-transparent flex-auto">
            <div className="h-16 border-b-4 border-gray-300 border-dashed"></div>
          </div>
          <div className="w-16 mt-16 ml-16 h-16 border-l-4 border-gray-300 border-dashed border-t-4 rounded-tl-full"></div>
        </div>

        {/* Step 3: Legal Support */}
        <div className="flex flex-row">
          <div className="hidden md:flex flex-col items-center">
            <div className="w-32 py-5 border-2 border-[#e83f25] rounded mr-4 uppercase flex flex-col items-center justify-center bg-white hover:bg-[#e83f25] hover:text-white transition-colors duration-300 group">
              <div className="text-3xl font-black text-[#e83f25] group-hover:text-white">
                03
              </div>
              <div className="text-gray-600 text-sm font-semibold group-hover:text-white">
                Step 3
              </div>
            </div>
            <div className="h-full border-l-4 border-transparent">
              <div className="border-l-4 mr-4 h-full border-gray-300 border-dashed"></div>
            </div>
          </div>
          <div className="flex-auto border-2 rounded border-gray-200 hover:border-[#e83f25] hover:shadow-lg transition-all duration-300">
            <div className="flex md:flex-row flex-col items-center">
              <div className="flex-auto">
                <div className="md:hidden text-sm font-normal uppercase pt-3 pl-3 text-gray-500">
                  <span className="font-black text-[#e83f25]">Step 3</span>
                </div>
                <div className="p-6 text-2xl sm:text-3xl text-black font-bold">
                  Legal Support
                </div>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  Complete documentation and legal assistance. Our team handles
                  all paperwork, contracts, and regulatory requirements for a
                  smooth transaction.
                </div>
              </div>
              <div className="md:w-40 w-full p-8 flex items-center justify-center">
                {/* Document Icon */}
                <svg
                  className="w-24 h-24 text-[#e83f25]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Connector 3-4 */}
        <div className="flex items-start flex-row">
          <div className="border-t-4 border-r-4 border-transparent">
            <div className="w-16 ml-16 h-16 border-l-4 border-gray-300 border-dashed border-b-4 rounded-bl-full"></div>
          </div>
          <div className="border-t-4 border-transparent flex-auto">
            <div className="h-16 border-b-4 border-gray-300 border-dashed"></div>
          </div>
          <div className="w-16 mt-16 mr-16 h-16 border-r-4 border-gray-300 border-dashed border-t-4 rounded-tr-full"></div>
        </div>

        {/* Step 4: After-Sales Care */}
        <div className="flex flex-row-reverse">
          <div className="hidden md:flex flex-col items-center">
            <div className="w-32 py-5 border-2 border-[#e83f25] rounded ml-4 uppercase flex flex-col items-center justify-center bg-white hover:bg-[#e83f25] hover:text-white transition-colors duration-300 group">
              <div className="text-3xl font-black text-[#e83f25] group-hover:text-white">
                04
              </div>
              <div className="text-gray-600 text-sm font-semibold group-hover:text-white">
                Step 4
              </div>
            </div>
          </div>
          <div className="flex-auto border-2 rounded border-gray-200 hover:border-[#e83f25] hover:shadow-lg transition-all duration-300">
            <div className="flex md:flex-row flex-col items-center">
              <div className="flex-auto">
                <div className="md:hidden text-sm font-normal uppercase pt-3 pl-3 text-gray-500">
                  <span className="font-black text-[#e83f25]">Step 4</span>
                </div>
                <div className="p-6 text-2xl sm:text-3xl text-black font-bold">
                  After-Sales Care
                </div>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  Ongoing support and property management. We provide continuous
                  assistance, maintenance coordination, and investment tracking.
                </div>
              </div>
              <div className="md:w-40 w-full p-8 flex items-center justify-center">
                {/* Key/House Icon */}
                <svg
                  className="w-24 h-24 text-[#e83f25]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-6">
          Ready to start your investment journey?
        </p>
        <button className="px-8 py-3 text-base rounded-md font-semibold text-white bg-[#e83f25] hover:bg-[#c73519] transition-colors duration-300 shadow-lg hover:shadow-xl">
          Schedule Free Consultation
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
