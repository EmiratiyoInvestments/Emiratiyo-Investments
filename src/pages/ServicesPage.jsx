import React from "react";

const services = [
    {
        title: "Property Buying Assistance",
        description: "We guide you through the entire property buying journey—from understanding your investment goals to final possession. Our experts help you identify the right opportunities, negotiate confidently, and ensure a smooth, stress-free purchase experience."
    },
    {
        title: "Real Estate Investment Consulting",
        description: "Our consulting services are designed to help investors make data-driven decisions. We analyze market trends, rental yields, capital appreciation potential, and risk factors to build investment strategies aligned with your financial objectives."
    },
    {
        title: "Off-Plan Property Sales",
        description: "Gain early access to high-potential off-plan projects from trusted developers. We help you evaluate project viability, payment plans, and future value, allowing you to enter the market at competitive prices with strong growth prospects."
    },
    {
        title: "Ready Property Sales",
        subtitle: "(Apartments, Villas & Penthouses)",
        description: "For investors seeking immediate ownership or rental income, we offer a curated selection of ready properties. Each option is vetted for location, quality, and return potential, ensuring secure and rewarding investments."
    },
    {
        title: "Soon-to-be Handed Over Properties",
        description: "These properties offer the perfect balance between price advantage and quick possession. We help you identify near-completion projects that minimize waiting time while maximizing appreciation and rental readiness."
    },
    {
        title: "Legal & Documentation Support",
        description: "Our team ensures complete transparency and compliance throughout the transaction. From contracts and title deeds to regulatory approvals, we manage all legal and documentation processes with precision and reliability."
    },
    {
        title: "After-Sales Support",
        description: "Our relationship doesn’t end after the sale. We assist with property handover, leasing, resale, and ongoing support—ensuring your investment continues to perform long after the purchase is complete."
    }
];

const whyChooseItems = [
    {
        title: "Investor-First Approach",
        description: "We prioritize your financial goals over short-term sales, offering solutions that focus on long-term value and sustainable returns."
    },
    {
        title: "Market Expertise",
        description: "With deep knowledge of the real estate and asset management landscape, we provide insights that help you stay ahead in a competitive market."
    },
    {
        title: "End-to-End Support",
        description: "From initial consultation to post-purchase assistance, we manage every step—so you invest with confidence and clarity."
    },
    {
        title: "Transparency & Trust",
        description: "We believe in honest advice, clear documentation, and ethical practices, ensuring complete transparency in every transaction."
    }
];

const ServicesPage = () => {
    return (
        <div className="bg-white min-h-screen">
            <main>
                {/* Hero Section (Top of Page) */}
                <section className="bg-white pt-32 pb-24 px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-[#e83f25] text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                            SERVICES
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black  sm:mb-2 md:mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                            Our Expertise at Your Service
                        </h1>
                        <p className="text-lg text-[#939393] max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                            Discover tailored real estate and investment solutions built to help you grow, protect, and optimize your wealth with confidence.
                        </p>
                    </div>
                </section>

                {/* Services Grid Section */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-[#f7f7f7] p-10 rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-white border-b-4 border-transparent hover:border-[#e83f25] flex flex-col h-full"
                                >
                                    <h3
                                        className="text-2xl font-bold text-black mb-1 leading-tight transition-colors group-hover:text-[#e83f25]"
                                        style={{ fontFamily: 'var(--font-display)' }}
                                    >
                                        {service.title}
                                    </h3>
                                    {service.subtitle && (
                                        <p className="text-sm font-semibold text-[#939393] mb-4 italic" style={{ fontFamily: 'var(--font-body)' }}>
                                            {service.subtitle}
                                        </p>
                                    )}
                                    <p className="text-[#939393] leading-relaxed mt-4 flex-grow" style={{ fontFamily: 'var(--font-body)' }}>
                                        {service.description}
                                    </p>

                                    {/* Bottom visual indicator */}
                                    <div className="mt-8">
                                        <div className="w-12 h-1 bg-[#e83f25]/30 group-hover:w-full group-hover:bg-[#e83f25] transition-all duration-500 rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Emiratiyo Section */}
                <section className="py-20 px-6 bg-black text-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                Why Choose Emiratiyo Investments ?
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {whyChooseItems.map((item, index) => (
                                <div key={index} className="flex flex-col">
                                    <h4 className="text-[#e83f25] font-bold text-xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                                        {item.title}
                                    </h4>
                                    <p className="text-[#939393] text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ServicesPage;
