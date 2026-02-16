import React from "react";
import { CheckCircle } from "lucide-react";

const BusinessSetupPage = () => {
    return (
        <div className="w-full bg-[#f7f7f7]">
            <section className="relative w-full overflow-hidden">
                <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center">
                    <img
                        src="/images/museum.jpg"
                        alt="Dubai Urban City"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>

                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                        <h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Build Smart. Launch Fast.
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                            From idea to operation in just 48 hours
                        </p>
                    </div>
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-20 z-20">
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                            <div className="bg-[#f7f7f7] p-8 md:p-12 flex flex-col justify-center">
                                <h2 className="text-2xl md:text-3xl font-bold text-[#000000] mb-6">
                                    Get Started with Confidence
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-[#e83f25] flex-shrink-0 mt-1" />
                                        <p className="text-[#000000] text-base md:text-lg">
                                            Dubai-based Business Setup Experts
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-[#e83f25] flex-shrink-0 mt-1" />
                                        <p className="text-[#000000] text-base md:text-lg">
                                            Real Estate Focused Licensing
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-[#e83f25] flex-shrink-0 mt-1" />
                                        <p className="text-[#000000] text-base md:text-lg">
                                            Fast-track setup within 48 hours
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 md:p-12">
                                <h2 className="text-2xl md:text-3xl font-bold text-[#000000] mb-6">
                                    Start Your Business Setup
                                </h2>

                                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-semibold text-[#000000] mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            required
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e83f25] focus:border-transparent outline-none transition-all text-[#000000]"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-[#000000] mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            placeholder="name@example.com"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e83f25] focus:border-transparent outline-none transition-all text-[#000000]"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="mobile" className="block text-sm font-semibold text-[#000000] mb-2">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="mobile"
                                            name="mobile"
                                            required
                                            placeholder="+971 50 123 4567"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e83f25] focus:border-transparent outline-none transition-all text-[#000000]"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-sm font-semibold text-[#000000] mb-2">
                                            Country of Residence
                                        </label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            required
                                            placeholder="e.g. United Arab Emirates"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e83f25] focus:border-transparent outline-none transition-all text-[#000000]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#000000] mb-3">
                                            Preferred Contact Method
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="contactMethod"
                                                    value="WhatsApp"
                                                    defaultChecked
                                                    className="w-4 h-4 text-[#e83f25] focus:ring-[#e83f25]"
                                                />
                                                <span className="text-[#000000]">WhatsApp</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="contactMethod"
                                                    value="Call"
                                                    className="w-4 h-4 text-[#e83f25] focus:ring-[#e83f25]"
                                                />
                                                <span className="text-[#000000]">Call</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="contactMethod"
                                                    value="Email"
                                                    className="w-4 h-4 text-[#e83f25] focus:ring-[#e83f25]"
                                                />
                                                <span className="text-[#000000]">Email</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#000000] mb-3">
                                            Business Setup Timeline
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="timeline"
                                                    value="Immediately"
                                                    defaultChecked
                                                    className="w-4 h-4 text-[#e83f25] focus:ring-[#e83f25]"
                                                />
                                                <span className="text-[#000000]">Immediately (48 hrs)</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="timeline"
                                                    value="Within 1 week"
                                                    className="w-4 h-4 text-[#e83f25] focus:ring-[#e83f25]"
                                                />
                                                <span className="text-[#000000]">Within 1 week</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="timeline"
                                                    value="Exploring"
                                                    className="w-4 h-4 text-[#e83f25] focus:ring-[#e83f25]"
                                                />
                                                <span className="text-[#000000]">Exploring</span>
                                            </label>
                                        </div>
                                    </div>

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

export default BusinessSetupPage;
