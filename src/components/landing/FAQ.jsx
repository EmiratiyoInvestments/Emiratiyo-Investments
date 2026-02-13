import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
    {
        question: "What does Emiratiyo Investments specialize in?",
        answer: "Emiratiyo Investments is an asset management company focused on helping individuals diversify their portfolios through strategic real estate investments. We offer end-to-end support, from investment advisory and property sourcing to legal guidance and post-purchase assistance."
    },
    {
        question: "Who can invest with Emiratiyo Investments?",
        answer: "Our services are suitable for first-time investors, experienced real estate investors, and high-net-worth individuals. We tailor each investment approach based on your financial goals, risk appetite, and long-term objectives."
    },
    {
        question: "Do I need to be a resident of the UAE to invest?",
        answer: "No. Both UAE residents and international investors can invest through Emiratiyo Investments. We assist non-resident clients with property selection, legal procedures, and documentation to ensure a seamless and compliant process."
    },
    {
        question: "What types of properties do you offer?",
        answer: "We offer a carefully curated range of properties, including off-plan developments, ready properties, apartments, villas, penthouses, and soon-to-be handed-over units. Each property is evaluated for location, quality, and return potential."
    },
    {
        question: "How does Emiratiyo help maximize investment returns?",
        answer: "We combine in-depth market research, financial analysis, and portfolio strategy to identify opportunities with strong rental yields and capital appreciation, while managing risk and focusing on long-term value."
    },
    {
        question: "What is Propeye and how does it work?",
        answer: "Propeye is Emiratiyo’s proprietary AI-powered property intelligence system. It analyzes your investment goals, risk profile, and market data to match you with properties aligned to your portfolio strategy—supporting smarter, data-driven decisions."
    },
    {
        question: "Are off-plan properties a safe investment?",
        answer: "Off-plan properties can offer strong value and growth when selected carefully. Emiratiyo works exclusively with reputable developers and conducts thorough project evaluations to ensure viability, transparency, and long-term potential."
    }
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div
            className={`mb-4 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-white shadow-lg" : "bg-[#f7f7f7]"
                }`}
        >
            <button
                onClick={onClick}
                aria-expanded={isOpen}
                className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
            >
                <span
                    className={`text-lg font-bold transition-colors duration-300 ${isOpen ? "text-[#e83f25]" : "text-[#000000]"
                        }`}
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {question}
                </span>
                <div className={`transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>
                    <Plus
                        className={`w-6 h-6 transition-colors duration-300 ${isOpen ? "text-[#e83f25]" : "text-[#000000]"
                            }`}
                    />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-8 pb-8">
                            <p
                                className="text-[#939393] leading-relaxed"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                {answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2
                        className="text-4xl md:text-5xl font-bold text-[#000000]"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Any questions? <span className="text-[#e83f25]" style={{ fontFamily: 'var(--font-body)' }}>We got you.</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <FAQItem
                            key={index}
                            question={item.question}
                            answer={item.answer}
                            isOpen={openIndex === index}
                            onClick={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
