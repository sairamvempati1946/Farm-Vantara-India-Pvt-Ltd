// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import FAQ from "./pages/FAQ";
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
// import FarmerDashboard from "./pages/FarmerDashboard";
// import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
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