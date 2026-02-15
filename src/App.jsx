import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ServicesPage from "./pages/ServicesPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailsPage";
import MarketInsightsPage from "./pages/MarketInsightsPage";
import BusinessSetupPage from "./pages/BusinessSetupPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogsDetailsPage";
import Header from "./components/global/Header";
import Footer from "./components/global/Footer";
import "./index.css";
import ROICalculator from "./components/global/ROICalculator";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/blog" element={<BlogsPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/market-insights" element={<MarketInsightsPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:slug" element={<PropertyDetailPage />} />
        <Route path="/business-setup" element={<BusinessSetupPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
      <ROICalculator /> 
    </Router>
  );
};

export default App;
