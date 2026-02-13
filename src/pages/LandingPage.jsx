import React from "react";
import Hero from "../components/landing/Hero";
import WhyChoseUs from "../components/landing/WhyChoseUs";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Testimonials from "../components/landing/Testimonials";
import PropertyCarousel from "../components/landing/PropertyCarousel";
import FAQ from "../components/landing/FAQ";

const LandingPage = () => {
  return (
    <div>
      <main>
        <div className="min-h-screen flex items-center justify-center">
          <Hero />
        </div>
        <div>
          <PropertyCarousel />
        </div>
        <div>
          <WhyChoseUs />
        </div>
        <div>
          <Features />
        </div>
        <div>
          <HowItWorks />
        </div>
        <div>
          <Testimonials />
        </div>
        <FAQ />
      </main>
    </div>
  );
};

export default LandingPage;
