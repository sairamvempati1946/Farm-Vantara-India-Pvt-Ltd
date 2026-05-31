import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import aboutImg from '../assets/aboutsection.jpg';
import '../styles/Home.css';
import Homeimg from "../assets/registercta.png";
import heroImg from "../assets/FV_Logo.png";

const Home = () => {
  const [currentRole, setCurrentRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(false);
  const [counts, setCounts] = useState({
    farmers: 0,
    cities: 0,
    satisfaction: 0
  });

  // Refs
  const modalRef = useRef(null);
  const navMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);

  // Market prices data
  const marketPrices = [
    { crop: "Wheat", price: "₹2,450", change: "+2.5%", type: "positive" },
    { crop: "Basmati Rice", price: "₹3,200", change: "+1.8%", type: "positive" },
    { crop: "Tomato", price: "₹1,800", change: "-3.2%", type: "negative" },
    { crop: "Potato", price: "₹1,200", change: "+4.1%", type: "positive" },
    { crop: "Onion", price: "₹2,100", change: "+5.2%", type: "positive" },
    { crop: "Carrot", price: "₹1,500", change: "-1.5%", type: "negative" },
    { crop: "Cabbage", price: "₹900", change: "+2.3%", type: "positive" },
    { crop: "Cauliflower", price: "₹1,100", change: "+3.7%", type: "positive" },
    { crop: "Corn", price: "₹1,800", change: "+1.2%", type: "positive" },
    { crop: "Soybean", price: "₹3,500", change: "-2.1%", type: "negative" },
    { crop: "Cotton", price: "₹5,800", change: "+3.5%", type: "positive" },
    { crop: "Sugarcane", price: "₹3,200", change: "+1.2%", type: "positive" }
  ];

  // Farmer data
  const farmers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Punjab, India",
      crops: "Wheat, Rice, Seasonal Vegetables",
      earnings: "12.5L+",
      rating: 95,
      quote: "Farm Vantara doubled my income by connecting me directly with markets in Delhi and Mumbai. No more middlemen exploitation.",
      image: "https://img.freepik.com/premium-photo/young-indian-farmer-green-agriculture-field_75648-6244.jpg?semt=ais_hybrid&w=740&q=80",
      badge: "Top Seller"
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Maharashtra, India",
      crops: "Organic Fruits & Vegetables",
      earnings: "8.2L+",
      rating: 98,
      quote: "Received 30% better prices for my organic produce through Farm Vantara. The platform understands the value of quality farming.",
      image: "https://img.freepik.com/premium-photo/young-indian-woman-farmer-working-wheat-farm-field_136354-2660.jpg",
      badge: "Organic Certified"
    },
    {
      id: 3,
      name: "Arun Patel",
      location: "Gujarat, India",
      crops: "Cotton, Groundnuts, Pulses",
      earnings: "6.7L+",
      rating: 92,
      quote: "The timely payments and market insights have transformed my farming business. I can now plan crops based on demand.",
      image: "https://t3.ftcdn.net/jpg/05/99/59/02/360_F_599590282_rn8nuDZAs1m8tpOA9BpkqDFxGULAQqdx.jpg",
      badge: "Quality Award Winner"
    }
  ];

  // Value propositions
  const valueProps = [
    {
      icon: "fa-handshake",
      title: "No Middlemen Commission",
      description: "Direct farmer-to-buyer connection eliminates intermediaries, ensuring farmers get 30-40% better prices and buyers save 20-25% on procurement.",
      badge: "100% Direct Trade"
    },
    {
      icon: "fa-chart-line",
      title: "Real-Time Market Intelligence",
      description: "Live price discovery, demand forecasting, and market insights help farmers optimize pricing and businesses plan procurement efficiently.",
      badge: "Live Market Data"
    },
    {
      icon: "fa-truck",
      title: "Pan-India Logistics Network",
      description: "End-to-end cold chain logistics from farm pickup to doorstep delivery. Temperature-controlled transport for perishable produce.",
      badge: "Doorstep Delivery"
    },
    {
      icon: "fa-shield-alt",
      title: "Secure & Timely Payments",
      description: "Farmers receive payments within 24 hours of delivery. Multiple secure payment options including UPI, net banking, and digital wallets.",
      badge: "24hr Payment Guarantee"
    }
  ];

  // Sustainability data
  const sustainabilityItems = [
    {
      icon: "fa-users",
      title: "Farmer Empowerment",
      description: "Direct market access increases farmer incomes by 30-40%, reducing rural poverty and improving livelihoods across India.",
      badge: "250+ Farmers"
    },
    {
      icon: "fa-recycle",
      title: "Sustainable Practices",
      description: "Promoting organic farming, reducing food miles, and minimizing post-harvest losses through efficient supply chains.",
      badge: "Eco-Friendly"
    },
    {
      icon: "fa-balance-scale",
      title: "Ethical Trade",
      description: "Transparent pricing ensures fair compensation for farmers while maintaining competitive prices for consumers.",
      badge: "Fair Trade"
    },
    {
      icon: "fa-city",
      title: "Rural Economy Boost",
      description: "Creating employment opportunities in rural areas and strengthening local agricultural ecosystems.",
      badge: "250+ Villages"
    }
  ];

  // Process steps
  const processSteps = [
    {
      number: 1,
      title: "Farmers List Produce",
      description: "Farmers register and list their crops with quality specifications, quantity available, and location details on our platform."
    },
    {
      number: 2,
      title: "Buyers Place Orders",
      description: "Businesses and consumers browse listings, compare prices, and place orders directly with farmers."
    },
    {
      number: 3,
      title: "Quality Verification",
      description: "Our team verifies produce quality at source and arranges efficient logistics for transportation."
    },
    {
      number: 4,
      title: "Delivery & Payment",
      description: "Produce delivered to buyers. Farmers receive payment within 24 hours. Complete transparency maintained."
    }
  ];

  // Features for CTA
  const ctaFeatures = [
    "Free Registration for Farmers",
    "Zero Commission on First 10 Orders",
    "Dedicated Support in Regional Languages",
    "24/7 Buyer & Seller Support"
  ];

  useEffect(() => {
    // Animate counters
    animateCounter('farmers', 5000, 2000);
    animateCounter('cities', 250, 1500);
    animateCounter('satisfaction', 98, 1000);

    // Header scroll effect
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Check cookie consent
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent) {
      setCookieConsent(true);
    }

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('.value-card, .farmer-card, .process-step').forEach((card) => {
      observer.observe(card);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Handle click outside for mobile menu
    const handleClickOutside = (event) => {
      if (
        navMenuRef.current &&
        !navMenuRef.current.contains(event.target) &&
        mobileMenuBtnRef.current &&
        !mobileMenuBtnRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    // Handle ESC key for modal
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isModalOpen]);

  const animateCounter = (type, target, duration) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      setCounts(prev => {
        if (type === 'farmers') return { ...prev, farmers: Math.floor(start) };
        if (type === 'cities') return { ...prev, cities: Math.floor(start) };
        if (type === 'satisfaction') return { ...prev, satisfaction: Math.floor(start) };
        return prev;
      });

      if (start >= target) {
        setCounts(prev => {
          if (type === 'farmers') return { ...prev, farmers: target };
          if (type === 'cities') return { ...prev, cities: target };
          if (type === 'satisfaction') return { ...prev, satisfaction: target };
          return prev;
        });
        clearInterval(timer);
      }
    }, 16);
  };

  const openRegistration = (role = null) => {
    if (role) {
      setCurrentRole(role);
    }
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
    setCurrentRole(null);
    document.body.style.overflow = 'auto';
  };

  const selectRole = (role) => {
    setCurrentRole(role);
    setTimeout(() => {
      setCurrentStep(2);
    }, 300);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const password = form.querySelector('#password').value;
    const confirmPassword = form.querySelector('#confirmPassword').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span className="loading-spinner"></span> Processing...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      alert(`Registration successful! Welcome to Farm Vantara as a ${currentRole}.`);
      closeModal();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  };

  const generateRegistrationForm = () => {
    const commonFields = (
      <>
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input type="text" id="fullName" name="fullName" required autoComplete="name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input type="email" id="email" name="email" required autoComplete="email" />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input type="tel" id="phone" name="phone" required autoComplete="tel" />
        </div>
        <div className="form-group">
          <label htmlFor="state">State *</label>
          <select id="state" name="state" required>
            <option value="">Select State</option>
            <option value="punjab">Punjab</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="gujarat">Gujarat</option>
            <option value="up">Uttar Pradesh</option>
            <option value="tamilnadu">Tamil Nadu</option>
          </select>
        </div>
      </>
    );

    let roleFields = null;

    if (currentRole === 'farmer') {
      roleFields = (
        <>
          <div className="form-group">
            <label htmlFor="farmSize">Farm Size (Acres) *</label>
            <input type="number" id="farmSize" name="farmSize" required min="1" />
          </div>
          <div className="form-group">
            <label htmlFor="crops">Main Crops *</label>
            <input type="text" id="crops" name="crops" required placeholder="e.g., Wheat, Rice, Vegetables" />
          </div>
          <div className="form-group">
            <label htmlFor="annualProduction">Annual Production (Quintal) *</label>
            <input type="number" id="annualProduction" name="annualProduction" required min="1" />
          </div>
        </>
      );
    } else if (currentRole === 'business') {
      roleFields = (
        <>
          <div className="form-group">
            <label htmlFor="businessName">Business Name *</label>
            <input type="text" id="businessName" name="businessName" required />
          </div>
          <div className="form-group">
            <label htmlFor="businessType">Business Type *</label>
            <select id="businessType" name="businessType" required>
              <option value="">Select Type</option>
              <option value="retailer">Retailer</option>
              <option value="wholesaler">Wholesaler</option>
              <option value="restaurant">Restaurant/Hotel</option>
              <option value="processor">Food Processor</option>
              <option value="exporter">Exporter</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="monthlyRequirement">Monthly Requirement (Quintal) *</label>
            <input type="number" id="monthlyRequirement" name="monthlyRequirement" required min="1" />
          </div>
        </>
      );
    } else if (currentRole === 'consumer') {
      roleFields = (
        <>
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input type="text" id="city" name="city" required />
          </div>
          <div className="form-group">
            <label htmlFor="pincode">Pincode *</label>
            <input type="text" id="pincode" name="pincode" required pattern="[0-9]{6}" />
          </div>
          <div className="form-group">
            <label htmlFor="preferredProduce">Preferred Produce</label>
            <input type="text" id="preferredProduce" name="preferredProduce" placeholder="e.g., Vegetables, Fruits, Dairy" />
          </div>
        </>
      );
    }

    return (
      <form id="registrationForm" onSubmit={handleFormSubmit}>
        {commonFields}
        {roleFields}
        <div className="form-group">
          <label htmlFor="password">Create Password *</label>
          <input type="password" id="password" name="password" required minLength="8" autoComplete="new-password" />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required autoComplete="new-password" />
        </div>
        <div className="form-group checkbox-group">
          <input type="checkbox" id="terms" name="terms" required />
          <label htmlFor="terms">
            I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link> *
          </label>
        </div>
        <button type="submit" className="btn-register" style={{ width: '100%', marginTop: '20px' }}>
          <i className="fas fa-user-plus"></i> Register Now
        </button>
      </form>
    );
  };

  const handleCookieAccept = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({ type: 'all', date: new Date().toISOString() }));
    setCookieConsent(false);
  };

  const handleCookieReject = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({ type: 'essential', date: new Date().toISOString() }));
    setCookieConsent(false);
  };

  return (
    <>
      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section - Modern Stylish Layout */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-grid">
              {/* Left side - Text Content */}
              <div className="hero-text-wrapper">
                <div className="hero-badge">
                  <span className="badge-icon">🌾</span>
                  <span>India's Leading AgriTech Platform</span>
                </div>
                <h1 className="hero-title">
                  Farm Vantara – India's Trusted <span className="highlight">Farm-to-Market</span> AgriTech Platform
                </h1>
                <p className="hero-subtitle">
                  Direct, transparent, and fair farm-to-market trade platform. Empowering farmers with direct access to verified B2B & B2C buyers. Eliminate middlemen, ensure fair prices, fresh produce.
                </p>
                <div className="cta-buttons-group">
                  <button
                    className="btn-hero btn-farmer"
                    onClick={() => openRegistration('farmer')}
                  >
                    <i className="fas fa-tractor"></i>
                    <div className="btn-text">
                      <span>Join as Farmer</span>
                      <small>Earn 40% More</small>
                    </div>
                  </button>
                  <button
                    className="btn-hero btn-business"
                    onClick={() => openRegistration('business')}
                  >
                    <i className="fas fa-building"></i>
                    <div className="btn-text">
                      <span>Buy as Business</span>
                      <small>Bulk Procurement</small>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right side - Image Visual */}
              <div className="hero-visual-wrapper">
                <div className="hero-image-container">
                  <div className="image-glow"></div>
                  <img
                    src={heroImg}
                    alt="Farm Vantara Logo"
                    className="hero-main-image"
                    loading="eager"
                  />
                  <div className="floating-card card-1">
                    <i className="fas fa-tractor"></i>
                    <span>250+ Farmers</span>
                  </div>
                  <div className="floating-card card-2">
                    <i className="fas fa-chart-line"></i>
                    <span>40% Higher Income</span>
                  </div>
                  <div className="floating-card card-3">
                    <i className="fas fa-clock"></i>
                    <span>24hr Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-wave">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>
        </section>

        {/* Stats Section - Moved from Hero */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-tractor"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">{counts.farmers.toLocaleString()}+</span>
                  <span className="stat-label">Farmers Connected</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-city"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">{counts.cities.toLocaleString()}+</span>
                  <span className="stat-label">Cities Served</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-smile"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">{counts.satisfaction}%</span>
                  <span className="stat-label">Satisfaction Rate</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Farm Vantara Section */}
        <section className="about-section" id="about">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">About Farm Vantara</h2>
              <p className="section-subtitle">India's Leading AgriTech Platform Transforming Agriculture</p>
            </div>
            <div className="about-grid">
              <div className="about-text">
                <p><strong>Farm Vantara is India's premier B2B & B2C AgriTech marketplace</strong> that connects farmers directly with businesses and consumers. We're revolutionizing agricultural trade by eliminating intermediaries and creating a transparent, efficient supply chain.</p>
                
                <div className="about-features">
                  <div className="about-feature">
                    <i className="fas fa-check-circle"></i>
                    <span>Fair prices for farmers through direct selling</span>
                  </div>
                  <div className="about-feature">
                    <i className="fas fa-check-circle"></i>
                    <span>Quality assurance for buyers with verified farmers</span>
                  </div>
                  <div className="about-feature">
                    <i className="fas fa-check-circle"></i>
                    <span>Transparent transactions with real-time tracking</span>
                  </div>
                  <div className="about-feature">
                    <i className="fas fa-check-circle"></i>
                    <span>Sustainable agricultural practices</span>
                  </div>
                </div>
                <Link to="/about" className="btn-about">
                  <i className="fas fa-leaf"></i> Know More About Farm Vantara
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
              <div className="about-image">
                <div className="image-wrapper">
                  <img src={aboutImg} alt="Indian farmer harvesting fresh crops" loading="lazy" />
                  <div className="image-overlay"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="value-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Why Choose Farm Vantara?</h2>
              <p className="section-subtitle">India's most transparent and efficient agricultural marketplace</p>
            </div>
            <div className="value-grid">
              {valueProps.map((prop, index) => (
                <div className="value-card" key={index}>
                  <div className="value-icon">
                    <i className={`fas ${prop.icon}`}></i>
                  </div>
                  <h3 className="value-title">{prop.title}</h3>
                  <p className="value-description">{prop.description}</p>
                  <div className="value-badge">{prop.badge}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="process-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">How Farm Vantara Works</h2>
              <p className="section-subtitle">Simple 4-step process for seamless agricultural trade</p>
            </div>
            <div className="process-steps">
              {processSteps.map((step) => (
                <div className="process-step" key={step.number}>
                  <div className="step-number">{step.number}</div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Market Prices Ticker */}
        <section className="market-ticker" aria-label="Live market prices">
          <div className="container">
            <div className="ticker-header">
              <h3><i className="fas fa-chart-line"></i> Live Agricultural Market Prices Today</h3>
              <Link to="/market-prices" className="view-all">
                View All Crops <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="ticker-container">
              <div className="ticker-track">
                {marketPrices.map((price, index) => (
                  <div className="ticker-item" key={index}>
                    <span className="ticker-crop">{price.crop}</span>
                    <span className="ticker-price">{price.price}</span>
                    <span className={`ticker-change ${price.type}`}>
                      <i className={`fas fa-arrow-${price.type === 'positive' ? 'up' : 'down'}`}></i>
                      {price.change}
                    </span>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {marketPrices.map((price, index) => (
                  <div className="ticker-item" key={`dup-${index}`}>
                    <span className="ticker-crop">{price.crop}</span>
                    <span className="ticker-price">{price.price}</span>
                    <span className={`ticker-change ${price.type}`}>
                      <i className={`fas fa-arrow-${price.type === 'positive' ? 'up' : 'down'}`}></i>
                      {price.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Farmers Section */}
        <section className="farmers-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Meet Our Farmer Champions</h2>
              <p className="section-subtitle">Real stories of transformation and success from Indian farmers</p>
            </div>
            <div className="farmers-grid">
              {farmers.map((farmer) => (
                <div className="farmer-card" key={farmer.id}>
                  <div className="farmer-image">
                    <img src={farmer.image} alt={farmer.name} loading="lazy" />
                    <div className="farmer-badge">{farmer.badge}</div>
                  </div>
                  <div className="farmer-info">
                    <h3 className="farmer-name">{farmer.name}</h3>
                    <p className="farmer-location"><i className="fas fa-map-marker-alt"></i> {farmer.location}</p>
                    <p className="farmer-crops"><i className="fas fa-seedling"></i> {farmer.crops}</p>
                    <div className="farmer-stats">
                      <div className="stat">
                        <span className="stat-value">₹{farmer.earnings}</span>
                        <span className="stat-label">Annual Earnings</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{farmer.rating}%</span>
                        <span className="stat-label">Buyer Rating</span>
                      </div>
                    </div>
                    <blockquote className="farmer-quote">
                      "{farmer.quote}"
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sustainability & Impact Section */}
        <section className="sustainability-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Sustainability & Impact</h2>
              <p className="section-subtitle">Creating positive change in Indian agriculture</p>
            </div>
            <div className="sustainability-grid">
              {sustainabilityItems.map((item, index) => (
                <div className="sustainability-card" key={index}>
                  <div className="sustainability-icon">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3 className="sustainability-title">{item.title}</h3>
                  <p className="sustainability-description">{item.description}</p>
                  <div className="sustainability-badge">{item.badge}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Registration CTA Section - Redesigned like Hero Section */}
        <section className="registration-cta">
          <div className="container">
            <div className="cta-hero-grid">
              {/* Left side - Text Content */}
              <div className="cta-text-wrapper">
                <div className="cta-badge">
                  <span className="badge-icon">🚀</span>
                  <span>Limited Time Offer</span>
                </div>
                <h2 className="cta-hero-title">
                  Ready to Transform Your <span className="highlight">Agricultural Journey</span>?
                </h2>
                <p className="cta-hero-subtitle">
                  Join thousands of farmers and businesses already benefiting from India's most transparent farm-to-market platform. Get started today and experience the difference.
                </p>
                <div className="cta-features-list">
                  {ctaFeatures.map((feature, index) => (
                    <div className="cta-feature-item" key={index}>
                      <i className="fas fa-check-circle"></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="cta-buttons-group">
                  <a href="tel:18001234567" className="btn-cta-hero btn-cta-call">
                    <i className="fas fa-phone-alt"></i>
                    <div className="btn-text">
                      <span>Call for Assistance</span>
                      <small>Toll Free Support</small>
                    </div>
                  </a>
                  <a href="https://wa.me/919553774933" className="btn-cta-hero btn-cta-whatsapp" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-whatsapp"></i>
                    <div className="btn-text">
                      <span>Chat on WhatsApp</span>
                      <small>Quick Response</small>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right side - Image Visual */}
              <div className="cta-visual-wrapper">
                <div className="cta-image-container">
                  <div className="cta-image-glow"></div>
                  <img
                    src={Homeimg}
                    alt="Happy Indian farmer with fresh harvest"
                    className="cta-main-image"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed WhatsApp Button */}
<a 
  href="https://wa.me/919553774933" 
  className="whatsapp-float" 
  target="_blank" 
  rel="noopener noreferrer" 
  aria-label="Chat on WhatsApp"
>
  <i className="fab fa-whatsapp"></i>
</a>

      {/* Cookie Consent Banner */}
      {cookieConsent && (
        <div id="cookieConsent" className="cookie-consent show">
          <div className="cookie-content">
            <h3>🍪 We Use Cookies</h3>
            <p>We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.</p>
            <div className="cookie-buttons">
              <button className="btn-cookie btn-accept" onClick={handleCookieAccept}>Accept All</button>
              <button className="btn-cookie btn-reject" onClick={handleCookieReject}>Reject Non-Essential</button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="modal" id="registrationModal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>&times;</button>
            
            <div className="registration-flow">
              {currentStep === 1 && (
                <div className="registration-step active">
                  <h2>Join Farm Vantara</h2>
                  <p className="step-subtitle">Select your role to get started</p>
                  
                  <div className="role-selection">
                    <div className="role-option" onClick={() => selectRole('farmer')}>
                      <div className="role-icon"><i className="fas fa-tractor"></i></div>
                      <div className="role-info">
                        <h3>I'm a Farmer</h3>
                        <p>List and sell your farm produce directly to buyers across India</p>
                      </div>
                    </div>
                    
                    <div className="role-option" onClick={() => selectRole('business')}>
                      <div className="role-icon"><i className="fas fa-building"></i></div>
                      <div className="role-info">
                        <h3>I'm a Business</h3>
                        <p>Procure fresh farm produce directly from verified farmers</p>
                      </div>
                    </div>
                    
                    <div className="role-option" onClick={() => selectRole('consumer')}>
                      <div className="role-icon"><i className="fas fa-shopping-basket"></i></div>
                      <div className="role-info">
                        <h3>I'm a Consumer</h3>
                        <p>Buy fresh farm produce directly from farmers in your city</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="registration-step active">
                  <h2>Register as {currentRole && currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}</h2>
                  {generateRegistrationForm()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;