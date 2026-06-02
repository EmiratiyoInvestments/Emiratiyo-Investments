import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import EmiraPage from "./pages/EmiraPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import "./index.css";
import ROICalculator from "./components/ui/ROICalculator";
import { Analytics } from "@vercel/analytics/react";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAgentRoute = location.pathname === "/agent";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  if (isAgentRoute) return children;

  return (
    <>
      <Header />
      {children}
      <Footer />
      <ROICalculator />
    </>
  );
};

const App = () => {

  return (
    <>
      <Router>
        <MainLayout>
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
            <Route path="/agent" element={<EmiraPage />} />
          </Routes>
        </MainLayout>
      </Router>
      <Analytics />
    </>
  );
};

export default App;
