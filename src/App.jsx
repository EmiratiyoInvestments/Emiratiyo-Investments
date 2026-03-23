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

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAgentRoute = location.pathname === "/agent";

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
  useEffect(() => {
    // Silent pre-warm ping to wake up the backend server (Fly.io cold start)
    const pingBackend = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_API;
        if (backendUrl) {
          // console.log("🚀 [Cold Start Fix] Attempting to wake up backend at:", backendUrl);
          const startTime = Date.now();
          const response = await fetch(`${backendUrl}/api/health`);
          const endTime = Date.now();
          // console.log(`[Cold Start Fix] Backend is awake! (Time taken: ${endTime - startTime}ms, Status: ${response.status})`);
        } else {
          // console.warn("[Cold Start Fix] VITE_BACKEND_API is not defined. Ping skipped.");
        }
      } catch (error) {
        // console.error("[Cold Start Fix] Ping failed (this is expected if server is still sleeping):", error.message);
      }
    };
    pingBackend();
  }, []);

  return (
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
  );
};

export default App;
