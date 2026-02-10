import React from "react";
import Header from "../components/global/Header";
import Hero from "../components/landing/Hero";
import WhyChoseUs from "../components/landing/WhyChoseUs";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Testimonials from "../components/landing/Testimonials";
import Footer from "../components/global/Footer";
import PropertyCarousel from "../components/landing/PropertyCarousel";

const LandingPage = () => {
  return (
    <div >
      <Header />
      <main>
        <div className="min-h-screen flex items-center justify-center">
          <Hero />
        </div>
        <div>
            <PropertyCarousel/>
        </div>
        <div>
          <WhyChoseUs />
        </div>
        <div>
            <Features/>
        </div>
        <div>
            <HowItWorks/>
        </div>
        <div>
            <Testimonials/>
        </div>
        <div>
            <Footer/>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
