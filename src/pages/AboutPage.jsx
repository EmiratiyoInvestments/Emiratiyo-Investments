import React from "react";
import { CheckCircle, Shield, TrendingUp, Users, Target, Building2, BarChart3, Briefcase } from "lucide-react";

const AboutPage = () => {
    return (
        <div className="bg-[#f7f7f7] min-h-screen">
            <main>
                {/* ==================== HERO SECTION ==================== */}
                <section className="relative w-full h-[45vh] lg:h-[60vh] flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{
                            backgroundImage: 'url("/images/real estate.jpg")',
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10"></div>

                    <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                        <h1
                            style={{ fontFamily: "var(--font-display)" }}
                            className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 tracking-tight"
                        >
                            About Emiratiyo Investments
                        </h1>
                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-white/90 text-base sm:text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
                        >
                            Built for Investors Who Value Time, Clarity, and Control
                        </p>
                    </div>
                </section>

                {/* ==================== INTRO SECTION ==================== */}
                <section className="relative z-30 px-4 sm:px-6 -mt-16 lg:-mt-24 mb-16 lg:mb-24">
                    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-8 sm:p-10 lg:p-14">
                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base sm:text-lg text-[#000000] leading-relaxed mb-6"
                        >
                            Emiratiyo Investments is a Dubai-based real estate investment firm
                            focused on building structured, income-generating property
                            portfolios for serious investors.
                        </p>

                        <div className="border-l-4 border-[#e83f25] pl-5 sm:pl-6 my-8">
                            <p
                                style={{ fontFamily: "var(--font-body)" }}
                                className="text-lg sm:text-xl font-bold text-[#000000] mb-1"
                            >
                                We do not sell properties.
                            </p>
                            <p
                                style={{ fontFamily: "var(--font-body)" }}
                                className="text-lg sm:text-xl font-bold text-[#e83f25]"
                            >
                                We build investment strategies.
                            </p>
                        </div>

                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base sm:text-lg text-[#939393] leading-relaxed"
                        >
                            In a market filled with noise, hype, and commission-driven
                            selling, Emiratiyo was created to bring clarity, discipline, and
                            long-term thinking to Dubai real estate.
                        </p>
                    </div>
                </section>

                {/* ==================== OUR PHILOSOPHY ==================== */}
                <section className="py-16 lg:py-24 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-[#e83f25] font-bold text-sm uppercase tracking-widest mb-3"
                        >
                            Our Philosophy
                        </p>
                        <h2
                            style={{ fontFamily: "var(--font-display)" }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000000] mb-6 leading-tight"
                        >
                            Opportunity With Structure
                        </h2>
                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base sm:text-lg text-[#939393] leading-relaxed mb-10 max-w-3xl"
                        >
                            Dubai real estate is one of the most dynamic markets in the
                            world. But opportunity without structure becomes speculation.
                        </p>

                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base font-semibold text-[#000000] mb-6"
                        >
                            We focus on:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10">
                            {[
                                { icon: TrendingUp, text: "Income-generating rental assets" },
                                { icon: Target, text: "Strategic off-plan entries" },
                                { icon: BarChart3, text: "Portfolio diversification" },
                                { icon: Briefcase, text: "Exit-driven planning" },
                                { icon: Shield, text: "Risk-managed growth" },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 bg-[#f7f7f7] rounded-xl p-4 sm:p-5 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-[#e83f25]/20 group"
                                >
                                    <div className="w-10 h-10 bg-[#e83f25]/10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                        <item.icon className="w-5 h-5 text-[#e83f25]" />
                                    </div>
                                    <p
                                        style={{ fontFamily: "var(--font-body)" }}
                                        className="text-sm sm:text-base text-[#000000] font-medium"
                                    >
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base sm:text-lg text-[#939393] leading-relaxed"
                        >
                            Every acquisition is evaluated not as a transaction, but as part
                            of a long-term capital allocation strategy.
                        </p>
                    </div>
                </section>

                {/* ==================== WHAT WE ACTUALLY DO ==================== */}
                <section className="py-16 lg:py-24 bg-[#f7f7f7]">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-[#e83f25] font-bold text-sm uppercase tracking-widest mb-3"
                        >
                            What We Do
                        </p>
                        <h2
                            style={{ fontFamily: "var(--font-display)" }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000000] mb-6 leading-tight"
                        >
                            Portfolio Managers in Dubai Property
                        </h2>
                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base sm:text-lg text-[#939393] leading-relaxed mb-10 max-w-3xl"
                        >
                            We act as portfolio managers in the Dubai property market.
                        </p>

                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base font-semibold text-[#000000] mb-6"
                        >
                            Our services include:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
                            {[
                                "Property sourcing and acquisition",
                                "Rental strategy and yield optimization",
                                "Tenant placement coordination",
                                "Exit timing and resale strategy",
                                "Fractional ownership structuring",
                                "Investor reporting and performance tracking",
                            ].map((service, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className="w-6 h-6 mt-0.5 flex-shrink-0">
                                        <CheckCircle className="w-6 h-6 text-[#e83f25]" />
                                    </div>
                                    <p
                                        style={{ fontFamily: "var(--font-body)" }}
                                        className="text-base text-[#000000]"
                                    >
                                        {service}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl p-6 sm:p-8 border-l-4 border-[#e83f25]">
                            <p
                                style={{ fontFamily: "var(--font-body)" }}
                                className="text-base sm:text-lg text-[#939393] leading-relaxed"
                            >
                                For clients who do not have time to monitor the market daily, we
                                operate as their{" "}
                                <span className="font-bold text-[#000000]">
                                    on-ground investment arm in Dubai
                                </span>
                                .
                            </p>
                        </div>
                    </div>
                </section>

                {/* ==================== WHO WE WORK WITH ==================== */}
                <section className="py-16 lg:py-24 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-[#e83f25] font-bold text-sm uppercase tracking-widest mb-3"
                        >
                            Our Clients
                        </p>
                        <h2
                            style={{ fontFamily: "var(--font-display)" }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000000] mb-6 leading-tight"
                        >
                            Who We Work With
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-10">
                            {[
                                {
                                    icon: Briefcase,
                                    title: "Professionals",
                                    desc: "Building international assets",
                                },
                                {
                                    icon: TrendingUp,
                                    title: "Entrepreneurs",
                                    desc: "Diversifying capital",
                                },
                                {
                                    icon: Target,
                                    title: "First-time Investors",
                                    desc: "Entering Dubai strategically",
                                },
                                {
                                    icon: Building2,
                                    title: "Overseas Clients",
                                    desc: "Seeking structured exposure",
                                },
                            ].map((client, idx) => (
                                <div
                                    key={idx}
                                    className="bg-[#f7f7f7] rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="w-12 h-12 bg-[#e83f25]/10 rounded-full flex items-center justify-center mb-4">
                                        <client.icon className="w-6 h-6 text-[#e83f25]" />
                                    </div>
                                    <h3
                                        style={{ fontFamily: "var(--font-body)" }}
                                        className="text-lg font-bold text-[#000000] mb-2"
                                    >
                                        {client.title}
                                    </h3>
                                    <p
                                        style={{ fontFamily: "var(--font-body)" }}
                                        className="text-sm sm:text-base text-[#939393]"
                                    >
                                        {client.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base sm:text-lg text-[#939393] leading-relaxed"
                        >
                            We are selective with clients because{" "}
                            <span className="font-bold text-[#000000]">
                                capital deserves discipline
                            </span>
                            .
                        </p>
                    </div>
                </section>

                {/* ==================== WHY EMIRATIYO ==================== */}
                <section className="py-16 lg:py-24 bg-[#000000] text-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-[#e83f25] font-bold text-sm uppercase tracking-widest mb-3"
                        >
                            Why Choose Us
                        </p>
                        <h2
                            style={{ fontFamily: "var(--font-display)" }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                        >
                            Why Emiratiyo
                        </h2>
                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base sm:text-lg text-white/60 leading-relaxed mb-12 max-w-3xl"
                        >
                            There are thousands of brokers in Dubai. Very few think like asset
                            managers. Emiratiyo was built on three core principles:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {[
                                {
                                    number: "01",
                                    title: "Structure over hype",
                                    desc: "We focus on numbers, not narratives.",
                                },
                                {
                                    number: "02",
                                    title: "Long-term relationships over quick commissions",
                                    desc: "Repeat investors are our real metric of success.",
                                },
                                {
                                    number: "03",
                                    title: "Capital protection before capital growth",
                                    desc: "Preserve first. Scale second.",
                                },
                            ].map((principle, idx) => (
                                <div
                                    key={idx}
                                    className="border border-white/10 rounded-xl p-6 sm:p-8 hover:border-[#e83f25]/50 transition-colors duration-300"
                                >
                                    <span
                                        style={{ fontFamily: "var(--font-display)" }}
                                        className="text-4xl sm:text-5xl font-bold text-[#e83f25]/30 block mb-4"
                                    >
                                        {principle.number}
                                    </span>
                                    <h3
                                        style={{ fontFamily: "var(--font-body)" }}
                                        className="text-lg sm:text-xl font-bold text-white mb-3"
                                    >
                                        {principle.title}
                                    </h3>
                                    <p
                                        style={{ fontFamily: "var(--font-body)" }}
                                        className="text-sm sm:text-base text-white/50 leading-relaxed"
                                    >
                                        {principle.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ==================== OUR APPROACH TO DUBAI ==================== */}
                <section className="py-16 lg:py-24 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-[#e83f25] font-bold text-sm uppercase tracking-widest mb-3"
                        >
                            Our Approach
                        </p>
                        <h2
                            style={{ fontFamily: "var(--font-display)" }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000000] mb-6 leading-tight"
                        >
                            Our Approach to Dubai
                        </h2>

                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base sm:text-lg text-[#939393] leading-relaxed mb-4"
                        >
                            Dubai is not just a city.{" "}
                            <span className="font-bold text-[#000000]">
                                It is a global capital hub.
                            </span>
                        </p>
                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base sm:text-lg text-[#939393] leading-relaxed mb-10"
                        >
                            We operate within one of the most investor-friendly real estate
                            environments in the world, regulated by authorities such as:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
                            {[
                                {
                                    icon: Building2,
                                    name: "Dubai Land Department",
                                },
                                {
                                    icon: Shield,
                                    name: "Real Estate Regulatory Agency",
                                },
                            ].map((authority, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 bg-[#f7f7f7] rounded-xl p-5 sm:p-6 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-[#e83f25]/20 group"
                                >
                                    <div className="w-12 h-12 bg-[#e83f25] rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                        <authority.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <p
                                        style={{ fontFamily: "var(--font-body)" }}
                                        className="text-base sm:text-lg font-bold text-[#000000]"
                                    >
                                        {authority.name}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base sm:text-lg text-[#939393] leading-relaxed mb-4"
                        >
                            This regulatory structure allows for transparency, security, and
                            international participation at scale.
                        </p>
                        <p
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-base sm:text-lg text-[#939393] leading-relaxed"
                        >
                            We leverage this ecosystem to create{" "}
                            <span className="font-bold text-[#000000]">
                                structured entry points
                            </span>{" "}
                            for our investors.
                        </p>
                    </div>
                </section>

                {/* ==================== OUR COMMITMENT ==================== */}
                <section className="py-16 lg:py-24 bg-[#f7f7f7]">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <div className="bg-white rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] p-8 sm:p-10 lg:p-16 text-center">
                            <p
                                style={{ fontFamily: "var(--font-body)" }}
                                className="text-[#e83f25] font-bold text-sm uppercase tracking-widest mb-3"
                            >
                                Our Commitment
                            </p>
                            <h2
                                style={{ fontFamily: "var(--font-display)" }}
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000000] mb-6 leading-tight"
                            >
                                Strategy Over Sentiment
                            </h2>

                            <p
                                style={{ fontFamily: "var(--font-body)" }}
                                className="text-base sm:text-lg text-[#939393] leading-relaxed mb-6 max-w-3xl mx-auto"
                            >
                                We believe wealth is built with patience, clarity, and
                                intelligent risk management.
                            </p>

                            <p
                                style={{ fontFamily: "var(--font-body)" }}
                                className="text-base sm:text-lg text-[#000000] leading-relaxed mb-10 max-w-3xl mx-auto"
                            >
                                At Emiratiyo Investments, our role is simple:{" "}
                                <span className="font-bold text-[#e83f25]">
                                    To convert Dubai real estate into a disciplined financial
                                    instrument for our clients.
                                </span>
                            </p>

                            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                                {[
                                    "No hype.",
                                    "No emotional selling.",
                                    "No short-term thinking.",
                                    "Just strategy.",
                                ].map((line, idx) => (
                                    <span
                                        key={idx}
                                        style={{ fontFamily: "var(--font-body)" }}
                                        className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold ${idx === 3
                                            ? "bg-[#e83f25] text-white"
                                            : "bg-[#f7f7f7] text-[#000000]"
                                            }`}
                                    >
                                        {line}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AboutPage;
