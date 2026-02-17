import React from "react";
import { CheckCircle } from "lucide-react";

const BusinessSetupPage = () => {
  return (
    <div className="w-full bg-[#f7f7f7]">
      <section className="relative w-full overflow-hidden">

        {/* HERO SECTION */}
        <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center">
          <img
            src="/images/museum.jpg"
            alt="Dubai Urban City"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Build Smart. Launch Fast.
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              From idea to operation in just 48 hours
            </p>
          </div>
        </div>

        {/* CONTENT CARD */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-20 z-20">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* LEFT SIDE */}
              <div className="bg-[#f7f7f7] p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#000000] mb-6">
                  Get Started with Confidence
                </h2>

                <div className="space-y-4">
                  <Feature text="Dubai-based Business Setup Experts" />
                  <Feature text="Real Estate Focused Licensing" />
                  <Feature text="Fast-track setup within 48 hours" />
                </div>
              </div>

              {/* RIGHT SIDE – FORM */}
              <div className="p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-[#000000] mb-6">
                  Start Your Business Setup
                </h2>

                <form
                  className="space-y-5"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Input
                    label="Full Name"
                    id="fullName"
                    placeholder="Enter your full name"
                    required
                  />

                  <Input
                    label="Email Address"
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />

                  <Input
                    label="Mobile Number"
                    id="mobile"
                    type="tel"
                    placeholder="+971 50 123 4567"
                    required
                  />

                  <Input
                    label="Country of Residence"
                    id="country"
                    placeholder="e.g. United Arab Emirates"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full bg-[#e83f25] text-white font-bold py-4 px-6 rounded-md hover:bg-[#c73519] transition-colors duration-300 shadow-lg mt-4"
                  >
                    Start My Business Setup
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

/* ---------- Reusable Components ---------- */

const Feature = ({ text }) => (
  <div className="flex items-start gap-3">
    <CheckCircle className="w-6 h-6 text-[#e83f25] flex-shrink-0 mt-1" />
    <p className="text-[#000000] text-base md:text-lg">{text}</p>
  </div>
);

const Input = ({
  label,
  id,
  type = "text",
  placeholder,
  required = false,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-[#000000] mb-2"
    >
      {label}
      {!required && (
        <span className="text-gray-400 ml-1">(optional)</span>
      )}
    </label>

    <input
      type={type}
      id={id}
      name={id}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e83f25] focus:border-transparent outline-none transition-all text-[#000000]"
    />
  </div>
);

export default BusinessSetupPage;