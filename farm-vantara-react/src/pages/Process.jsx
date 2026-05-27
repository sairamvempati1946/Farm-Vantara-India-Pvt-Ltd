// src/pages/Process.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Process.css";

const Process = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [counts, setCounts] = useState({
    farmers: 0,
    businesses: 0,
    transactions: 0,
    crops: 0
  });

  const navMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);
  const heroRef = useRef(null);
  const processStepsRef = useRef([]);

  // Complete Process Flow Steps based on screenshots
  const processSteps = [
    {
      id: 1,
      title: "1. Registration & Verification",
      description: "Both farmers and businesses start their journey with a simple registration process. We verify all participants to ensure trust and reliability in our ecosystem.",
      farmerDetails: {
        title: "For Farmers",
        points: [
          "Simple Registration - Register with basic details, farm information, and documents. Takes less than 10 minutes.",
          "Farm Verification - Our team verifies farm details, land records, and crop patterns. Verification completed within 24 hours.",
          "App Access - Get access to our farmer app for listing crops, tracking orders, and receiving payments."
        ]
      },
      businessDetails: {
        title: "For Businesses",
        points: [
          "Business Registration - Register your business with GST details, contact information, and procurement requirements.",
          "Document Verification - Business documents and GST verification for compliance and transparency.",
          "Dashboard Access - Access business dashboard for placing orders, tracking deliveries, and managing invoices."
        ]
      },
      icon: "fa-user-check",
      color: "#27ae60"
    },
    {
      id: 2,
      title: "2. Listing & Requirements",
      description: "Farmers list their available crops while businesses post their procurement requirements. Our smart matching algorithm connects the right farmers with suitable buyers.",
      farmerDetails: {
        title: "Crop Listing & Discovery",
        points: [
          "Crop Listing - List available crops with quantity, quality specifications, expected harvest date, and minimum price.",
          "Quality Photos - Upload photos of crops for buyers to assess quality and make informed decisions.",
          "Price Discovery - Get real-time market prices and demand insights to set competitive prices."
        ]
      },
      businessDetails: {
        title: "Requirements & Sourcing",
        points: [
          "Requirements Posting - Post detailed requirements including crop type, quantity, quality specifications, and delivery schedule.",
          "Supplier Search - Search and filter through verified farmers based on location, quality, and pricing.",
          "Quote Comparison - Compare multiple quotes from different farmers to get the best value."
        ]
      },
      icon: "fa-list-ul",
      color: "#f2c94c"
    },
    {
      id: 3,
      title: "3. Transaction & Quality Check",
      description: "Secure transactions with built-in quality assurance. We ensure both parties get what they expect through our rigorous quality checking process.",
      farmerDetails: {
        title: "For Farmers",
        points: [
          "Order Confirmation - Receive order confirmations with buyer details, quantity, and agreed price.",
          "Pre-Harvest Check - Our field officers conduct pre-harvest quality checks to ensure crop meets specifications.",
          "Farm Pickup - Schedule farm pickup with our logistics team. No need for farmers to arrange transportation."
        ]
      },
      businessDetails: {
        title: "For Businesses",
        points: [
          "Place Order - Place orders through secure platform with transparent pricing and terms.",
          "Quality Assurance - Receive quality certificates and inspection reports before delivery.",
          "Real-time Tracking - Track order progress from farm pickup to delivery with real-time updates."
        ]
      },
      icon: "fa-handshake",
      color: "#2d9cdb"
    },
    {
      id: 4,
      title: "4. Delivery & Payment",
      description: "End-to-end logistics with guaranteed timely delivery. Instant payments to farmers and complete documentation for businesses.",
      farmerDetails: {
        title: "For Farmers",
        points: [
          "Logistics Support - Our logistics team handles transportation with cold chain facilities for perishables.",
          "Instant Payment - Receive payment within 24 hours of delivery confirmation. Multiple payment options available.",
          "Rating & Feedback - Rate buyers and provide feedback to help improve the platform experience.",
          "Order Analytics - Access order history, cost analysis, and procurement insights for better planning."
        ]
      },
      businessDetails: {
        title: "For Businesses",
        points: [
          "Doorstep Delivery - Receive quality-checked produce at your location with complete documentation.",
          "GST Invoicing - Receive proper GST invoices, quality certificates, and all necessary documentation.",
          "Analytics Dashboard - Track procurement metrics, cost savings, and supplier performance."
        ]
      },
      icon: "fa-truck",
      color: "#9b59b6"
    }
  ];

  // Platform features
  const platformFeatures = [
    { icon: 'fa-mobile-alt', title: 'Mobile App', description: 'User-friendly mobile app for farmers and businesses to manage everything on the go.' },
    { icon: 'fa-robot', title: 'Smart Matching', description: 'AI-powered matching algorithm that connects the right farmers with suitable buyers.' },
    { icon: 'fa-shield-alt', title: 'Secure Payments', description: 'Bank-grade secure payment gateway with escrow protection for both parties.' },
    { icon: 'fa-chart-line', title: 'Market Insights', description: 'Real-time market prices, demand trends, and crop advisory for informed decisions.' },
    { icon: 'fa-language', title: 'Multi-language', description: 'Platform available in multiple regional languages for better accessibility.' },
    { icon: 'fa-headset', title: '24/7 Support', description: 'Round-the-clock customer support in regional languages for assistance.' }
  ];

  // Benefits
  const benefits = [
    { icon: 'fa-check', title: 'For Farmers', description: 'Earn 30-40% higher income by eliminating middlemen. Get fair prices, instant payments, and access to premium markets.' },
    { icon: 'fa-check', title: 'For Businesses', description: 'Save 20-30% on procurement costs. Get consistent quality, reliable supply, and complete documentation for compliance.' },
    { icon: 'fa-check', title: 'For Consumers', description: 'Access fresh, traceable produce at reasonable prices. Support sustainable farming and local agriculture.' },
    { icon: 'fa-check', title: 'For Economy', description: 'Boost rural economy, reduce food wastage, and create transparent agricultural supply chains.' }
  ];

  // FAQ items
  const faqItems = [
    {
      question: 'How long does the registration process take?',
      answer: 'Registration takes less than 10 minutes. For farmers, we complete verification within 24 hours. For businesses, verification typically takes 2-4 hours during business days.'
    },
    {
      question: 'Are there any registration or membership fees?',
      answer: 'Registration is completely free for both farmers and businesses. We charge a small transaction fee only when a successful trade is completed through our platform.'
    },
    {
      question: 'How does the quality assurance process work?',
      answer: 'Our quality assurance includes three stages: 1) Pre-harvest field inspection, 2) Quality check at farm during pickup, and 3) Final quality verification before delivery to business. We provide quality certificates for all verified produce.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'We support multiple payment methods including bank transfer, UPI, and cash on delivery (for businesses). Farmers receive payments through bank transfer or UPI within 24 hours of delivery confirmation.'
    },
    {
      question: 'Is Farm Vantara available in my region?',
      answer: 'We currently operate in 8 states across India with plans to expand nationwide. Check our coverage map or contact our support team to confirm availability in your specific location.'
    },
    {
      question: 'How does the logistics service work?',
      answer: 'We provide end-to-end logistics including farm pickup, transportation, and doorstep delivery. Our logistics network includes cold chain facilities for perishable items. You can track your shipment in real-time through our app or dashboard.'
    }
  ];

  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for process steps - now observing feature cards and benefit items
    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.feature-card, .benefit-item, .faq-item, .process-step-card').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      stepObserver.observe(el);
    });

    // Hero observer for counters
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(heroRef.current);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (heroRef.current) {
      heroObserver.observe(heroRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      stepObserver.disconnect();
      heroObserver.disconnect();
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

  const animateCounters = () => {
    const targets = { farmers: 5000, businesses: 500, transactions: 25000, crops: 120 };
    const durations = { farmers: 2000, businesses: 1500, transactions: 2500, crops: 1000 };
    
    Object.keys(targets).forEach((key) => {
      const target = targets[key];
      const duration = durations[key];
      let start = 0;
      const increment = target / (duration / 30);
      
      const timer = setInterval(() => {
        start += increment;
        setCounts(prev => ({
          ...prev,
          [key]: Math.floor(start)
        }));
        
        if (start >= target) {
          setCounts(prev => ({
            ...prev,
            [key]: target
          }));
          clearInterval(timer);
        }
      }, 30);
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>

      {/* Main Content */}
      <main id="main-content">
        {/* Process Hero Section - Left Content + Right Stats Only (No floating elements) */}
        <section className="process-hero" ref={heroRef}>
          <div className="container">
            <div className="process-hero-content">
              {/* Left Column: Text & CTA */}
              <div className="hero-text-column">
                <h1 className="process-hero-title">
                  How <span className="gradient-text">Farm Vantara</span> Works
                </h1>
                <p className="process-hero-subtitle">
                  Transforming agricultural trade with technology, transparency, and direct connections. 
                  Our innovative platform bridges the gap between farmers and businesses for mutual growth 
                  and sustainable agricultural development.
                </p>
                <div className="hero-cta-buttons">
                  <Link to="/register" className="btn-hero-primary">
                    <i className="fas fa-play-circle"></i> Start Your Journey
                  </Link>
                  <button className="btn-hero-secondary" onClick={() => scrollToSection('platform-features')}>
                    <i className="fas fa-info-circle"></i> Learn More
                  </button>
                </div>
              </div>

              {/* Right Column: Stats Only */}
              <div className="hero-stats-column">
                <div className="hero-stats-grid">
                  <div className="hero-stat-card">
                    <div className="stat-card-icon">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div className="stat-card-content">
                      <span className="hero-stat-number">{counts.farmers.toLocaleString()}+</span>
                      <span className="hero-stat-label">Farmers Connected</span>
                    </div>
                  </div>
                  
                  <div className="hero-stat-card">
                    <div className="stat-card-icon">
                      <i className="fas fa-building"></i>
                    </div>
                    <div className="stat-card-content">
                      <span className="hero-stat-number">{counts.businesses.toLocaleString()}+</span>
                      <span className="hero-stat-label">Businesses Served</span>
                    </div>
                  </div>
                  
                  <div className="hero-stat-card">
                    <div className="stat-card-icon">
                      <i className="fas fa-exchange-alt"></i>
                    </div>
                    <div className="stat-card-content">
                      <span className="hero-stat-number">{counts.transactions.toLocaleString()}+</span>
                      <span className="hero-stat-label">Transactions Completed</span>
                    </div>
                  </div>
                  
                  <div className="hero-stat-card">
                    <div className="stat-card-icon">
                      <i className="fas fa-seedling"></i>
                    </div>
                    <div className="stat-card-content">
                      <span className="hero-stat-number">{counts.crops.toLocaleString()}+</span>
                      <span className="hero-stat-label">Crop Varieties Listed</span>
                    </div>
                  </div>
                  
                  <div className="hero-stat-card highlight-card">
                    <div className="stat-card-icon">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="stat-card-content">
                      <span className="hero-stat-number">30-40%</span>
                      <span className="hero-stat-label">Higher Income for Farmers</span>
                      <p className="stat-card-description">
                        By eliminating middlemen and providing direct market access
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Process Flow Section */}
        <section className="complete-process-flow">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Complete Process Flow</h2>
              <p className="section-subtitle">From farm to business - A seamless journey powered by technology</p>
            </div>
            
            <div className="process-flow-container">
              {processSteps.map((step, index) => (
                <div key={step.id} className="process-step-card" style={{ '--step-color': step.color }}>
                  <div className="step-header">
                    <div className="step-icon" style={{ backgroundColor: step.color }}>
                      <i className={`fas ${step.icon}`}></i>
                    </div>
                    <h3 className="step-title">{step.title}</h3>
                  </div>
                  <p className="step-description">{step.description}</p>
                  
                  <div className="step-details-grid">
                    <div className="step-farmer-details">
                      <div className="detail-header">
                        <i className="fas fa-user-tie"></i>
                        <h4>{step.farmerDetails.title}</h4>
                      </div>
                      <ul className="detail-list">
                        {step.farmerDetails.points.map((point, i) => (
                          <li key={i}>
                            <i className="fas fa-check-circle" style={{ color: step.color }}></i>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="step-business-details">
                      <div className="detail-header">
                        <i className="fas fa-building"></i>
                        <h4>{step.businessDetails.title}</h4>
                      </div>
                      <ul className="detail-list">
                        {step.businessDetails.points.map((point, i) => (
                          <li key={i}>
                            <i className="fas fa-check-circle" style={{ color: step.color }}></i>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {index < processSteps.length - 1 && (
                    <div className="step-connector">
                      <i className="fas fa-arrow-down"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section className="platform-features-section" id="platform-features">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Platform Features</h2>
              <p className="section-subtitle">Technology-powered features that make agricultural trade simple and efficient</p>
            </div>
            
            <div className="features-grid">
              {platformFeatures.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <i className={`fas ${feature.icon}`}></i>
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Benefits for Everyone</h2>
              <p className="section-subtitle">Creating value for all stakeholders in the agricultural ecosystem</p>
            </div>
            
            <div className="benefits-container">
              <div className="benefits-visual">
                <div className="benefits-image">
                  <img 
                    src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Farm Vantara Benefits" 
                    loading="lazy" 
                  />
                </div>
              </div>
              <div className="benefits-content">
                <ul className="benefit-list">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="benefit-item">
                      <div className="benefit-icon">
                        <i className={`fas ${benefit.icon}`}></i>
                      </div>
                      <h4 className="benefit-title">{benefit.title}</h4>
                      <p className="benefit-description">{benefit.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section" id="faq">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">Find answers to common questions about Farm Vantara</p>
            </div>
            
            <div className="faq-container">
              {faqItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                >
                  <div className="faq-question" onClick={() => toggleFaq(index)}>
                    <h3 className="question-text">{item.question}</h3>
                    <div className="faq-toggle">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                  <div className="faq-answer">
                    <p className="answer-text">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="process-cta-section" id="get-started">
          <div className="container">
            <div className="process-cta-content">
              <h2 className="process-cta-title">Ready to Join the Agricultural Revolution?</h2>
              <p className="process-cta-subtitle">Join thousands of farmers and businesses who are already benefiting from Farm Vantara</p>
              
              <div className="cta-buttons">
                <Link to="/farmers" className="btn-process-primary">
                  <i className="fas fa-user-tie"></i> I'm a Farmer
                </Link>
                <Link to="/business" className="btn-process-primary">
                  <i className="fas fa-building"></i> I'm a Business
                </Link>
                <Link to="/contact" className="btn-process-secondary">
                  <i className="fas fa-question-circle"></i> Need Help Getting Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* WhatsApp Float */}
      <a href="https://wa.me/919553774933" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
        <i className="fab fa-whatsapp"></i>
      </a>
    </>
  );
};

export default Process;