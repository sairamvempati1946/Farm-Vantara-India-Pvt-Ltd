// App.jsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Farmers from "./pages/Farmers";
import Business from "./pages/Business";
import Impact from "./pages/Impact";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Process from "./pages/Process";
import MarketPrices from "./pages/MarketPrices";
import CropListing from "./pages/CropListing";
import VolumePricing from "./pages/VolumePricing";
import Blog from "./pages/Blog";
import FAQ from "./pages/Faq";
import Payments from "./pages/Payments";
import Logistics from "./pages/Logistics";
import BusinessSolutions from "./pages/BusinessSolutions";
import CaseStudies from "./pages/CaseStudies";
import QualityAssurance from "./pages/QualityAssurance";
import ScrollToTop from "./components/ScrollToTop";

// Comment out imports for pages that don't exist yet
import Login from "./pages/Login";
import Research from "./pages/Research";
import BuyerDashboard from "./pages/BuyerDashboard";
import Guides from "./pages/Guides";
import Goals from "./pages/Goals";
import FarmerDashboard from "./pages/FarmerDashboard";
import Algorithm from "./pages/Algorithm";
import AdminDashboard from "./pages/AdminDashboard";

function PageTitleManager() {
  const location = useLocation();

  useEffect(() => {
    const titleMap = {
      "/": "Home | Farm Vantara - Connecting Farmers to Markets",
      "/register": "Register & Get Started | Farm Vantara",
      "/farmers": "For Farmers | Farm Vantara",
      "/business": "For Business Buyers | Farm Vantara",
      "/impact": "Our Ecological & Economic Impact | Farm Vantara",
      "/contact": "Contact Us | Farm Vantara",
      "/about": "About Us & Our Core Mission | Farm Vantara",
      "/shop": "Shop Farm-Fresh Produce | Farm Vantara",
      "/process": "Our Sustainable Process | Farm Vantara",
      "/market-prices": "Live Market Prices & Analytics | Farm Vantara",
      "/crop-listing": "Crop Listing Catalog | Farm Vantara",
      "/pricing": "Volume Pricing & Procurement | Farm Vantara",
      "/blog": "Blog & Agricultural Insights | Farm Vantara",
      "/faq": "Frequently Asked Questions | Farm Vantara",
      "/payments": "Secure Payment Solutions | Farm Vantara",
      "/logistics": "Logistics & Supply Chain Network | Farm Vantara",
      "/business-solutions": "Business Sourcing Solutions | Farm Vantara",
      "/case-studies": "Success Stories & Case Studies | Farm Vantara",
      "/researchpapers": "Agricultural & Environmental Research Papers | Farm Vantara",
      "/login": "Secure Account Login | Farm Vantara",
      "/buyer-dashboard": "Buyer Dashboard | Farm Vantara",
      "/guides": "Farming Guides & Best Practices | Farm Vantara",
      "/goals": "Our Vision & Environmental Goals | Farm Vantara",
      "/farmer-dashboard": "Farmer Dashboard | Farm Vantara",
      "/algorithm": "Pricing Matching Algorithm | Farm Vantara",
      "/quality": "Quality Assurance & Standards | Farm Vantara",
      "/admin": "Admin Control Panel | Farm Vantara",
    };

    const currentTitle = titleMap[location.pathname] || "Farm Vantara - Connecting Farmers to Markets";
    document.title = currentTitle;
  }, [location]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <PageTitleManager />
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Active routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/farmers" element={<Farmers />} />
        <Route path="/business" element={<Business />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/process" element={<Process />} />
        <Route path="/market-prices" element={<MarketPrices />} />
        <Route path="/crop-listing" element={<CropListing />} />
        <Route path="/pricing" element={<VolumePricing />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/logistics" element={<Logistics />} />
        <Route path="/business-solutions" element={<BusinessSolutions />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/researchpapers" element={<Research />} />

        <Route path="/login" element={<Login />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/algorithm" element={<Algorithm />} />
        <Route path="/quality" element={<QualityAssurance />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;