// src/pages/BusinessSolutions.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/BusinessSolutions.css";

const BusinessSolutions = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hospitality');
  const [counts, setCounts] = useState({
    clients: 0,
    savings: 0,
    success: 0
  });

  const navMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);


  // Overview cards
  const overviewCards = [
    {
      icon: 'fa-utensils',
      title: 'Hospitality & Food Service',
      description: 'Custom solutions for hotels, restaurants, catering services, and institutional kitchens with daily delivery schedules and restaurant-grade quality.'
    },
    {
      icon: 'fa-industry',
      title: 'Food Processing & Manufacturing',
      description: 'Bulk procurement solutions for food processors with consistent quality, certifications, and long-term supply contracts.'
    },
    {
      icon: 'fa-store',
      title: 'Retail & Supermarkets',
      description: 'Retail-ready packaging, branding options, and supply chain management for supermarkets and grocery chains.'
    }
  ];

  // Industry tabs data
  const industryTabs = [
    { id: 'hospitality', icon: 'fa-utensils', label: 'Hospitality' },
    { id: 'food-processing', icon: 'fa-industry', label: 'Food Processing' },
    { id: 'retail', icon: 'fa-store', label: 'Retail' },
    { id: 'export', icon: 'fa-plane-departure', label: 'Export' }
  ];

  // Industry content
  const industryContent = {
    hospitality: {
      icon: 'fa-utensils',
      title: 'Hospitality Industry Solutions',
      subtitle: 'Custom procurement solutions for hotels, restaurants, catering services, and institutional kitchens',
      description: 'Our hospitality solutions ensure you receive fresh, restaurant-grade produce with consistent quality and reliable delivery schedules. We understand the critical importance of timing and presentation in the hospitality industry.',
      features: [
        { title: 'Daily Delivery Schedules', description: 'Flexible delivery options including early morning deliveries to ensure fresh produce is ready for breakfast service.' },
        { title: 'Restaurant-Grade Quality', description: 'Hand-picked produce meeting international restaurant standards with consistent sizing and appearance.' },
        { title: 'Custom Cutting & Preparation', description: 'Pre-cut vegetables, custom portions, and specialized preparations to reduce kitchen preparation time.' },
        { title: 'Seasonal Menu Planning', description: 'Consultation on seasonal availability and pricing to optimize menu planning and cost management.' }
      ]
    },
    'food-processing': {
      icon: 'fa-industry',
      title: 'Food Processing Industry Solutions',
      subtitle: 'Bulk procurement and supply chain solutions for food manufacturers and processors',
      description: 'We provide consistent, high-quality raw materials for food processing units with volume guarantees, quality certifications, and reliable delivery schedules that align with your production cycles.',
      features: [
        { title: 'Volume Guarantees', description: 'Secure long-term contracts with volume guarantees ensuring uninterrupted supply for your production lines.' },
        { title: 'Processing-Specific Grading', description: 'Produce graded specifically for processing requirements with consistent size, ripeness, and quality parameters.' },
        { title: 'Quality Certifications', description: 'Complete documentation including FSSAI, ISO, and other quality certifications required for food processing.' },
        { title: 'Supply Chain Integration', description: 'Seamless integration with your existing supply chain systems for efficient inventory management.' }
      ]
    },
    retail: {
      icon: 'fa-store',
      title: 'Retail Industry Solutions',
      subtitle: 'Complete retail solutions for supermarkets, grocery chains, and specialty stores',
      description: 'Transform your retail produce section with our retail-ready solutions featuring attractive packaging, consistent quality, and efficient supply chain management that reduces waste and increases profitability.',
      features: [
        { title: 'Retail-Ready Packaging', description: 'Attractive, durable packaging designed for retail shelves with proper ventilation and extended shelf life.' },
        { title: 'Private Label Branding', description: 'Custom branding options including private label packaging to build your store\'s brand identity.' },
        { title: 'Inventory Management', description: 'Advanced inventory planning and demand forecasting to reduce waste and optimize stock levels.' },
        { title: 'Quality Consistency', description: 'Consistent quality across all batches ensuring customer satisfaction and repeat purchases.' }
      ]
    },
    export: {
      icon: 'fa-plane-departure',
      title: 'Export Industry Solutions',
      subtitle: 'International quality produce with complete export documentation and logistics support',
      description: 'Expand your international reach with our export solutions featuring international quality standards, complete documentation, and end-to-end logistics support including cold chain facilities.',
      features: [
        { title: 'Export Certifications', description: 'Full suite of export certifications including phytosanitary, origin, and quality certificates for international markets.' },
        { title: 'Cold Chain Logistics', description: 'Complete cold chain management from farm to port ensuring product quality during transit.' },
        { title: 'Customs Compliance', description: 'Expert guidance on customs regulations, documentation, and compliance requirements for target markets.' },
        { title: 'Quality Assurance', description: 'Rigorous quality checks meeting international standards for size, color, ripeness, and packaging.' }
      ]
    }
  };

  // Value propositions
  const valueProps = [
    {
      icon: 'fa-money-bill-wave',
      title: 'Cost Savings',
      description: 'Direct farmer connections eliminate middlemen, resulting in 20-30% cost savings compared to traditional procurement channels.'
    },
    {
      icon: 'fa-clipboard-check',
      title: 'Quality Assurance',
      description: 'Rigorous quality checks at multiple stages ensure consistent quality meeting industry and international standards.'
    },
    {
      icon: 'fa-shipping-fast',
      title: 'Reliable Supply',
      description: 'Diversified farmer network across regions ensures consistent supply regardless of seasonal variations or local disruptions.'
    },
    {
      icon: 'fa-headset',
      title: 'Dedicated Support',
      description: 'Each business client gets a dedicated relationship manager for personalized support and procurement optimization.'
    }
  ];

  // Process steps - EXACT MATCH WITH IMAGE
  const processSteps = [
    { 
      number: 1, 
      title: 'Needs Assessment', 
      description: 'Detailed analysis of your current procurement, quality requirements, and business goals.' 
    },
    { 
      number: 2, 
      title: 'Solution Design', 
      description: 'Custom solution design including procurement strategy, quality parameters, and delivery schedule.' 
    },
    { 
      number: 3, 
      title: 'Implementation', 
      description: 'Phase-wise implementation with farmer onboarding, quality systems, and logistics setup.' 
    },
    { 
      number: 4, 
      title: 'Optimization', 
      description: 'Continuous monitoring and optimization based on performance metrics and feedback.' 
    }
  ];

  // Case studies
  const caseStudies = [
    {
      title: 'Spice Route Restaurants',
      subtitle: 'Multi-location Restaurant Chain',
      description: 'Facing inconsistent quality and fluctuating prices from multiple suppliers, Spice Route Restaurants implemented our hospitality solution.',
      results: [
        { icon: 'fa-check', text: '<strong>25% Cost Reduction</strong> in vegetable procurement' },
        { icon: 'fa-check', text: '<strong>99% On-time Delivery</strong> across 12 locations' },
        { icon: 'fa-check', text: '<strong>Zero Quality Rejections</strong> in 6 months' },
        { icon: 'fa-check', text: '<strong>30% Reduction</strong> in kitchen preparation time' }
      ]
    },
    {
      title: 'FoodPro Industries',
      subtitle: 'Food Processing Unit',
      description: 'Struggling with inconsistent raw material quality affecting production, FoodPro Industries adopted our food processing solution.',
      results: [
        { icon: 'fa-check', text: '<strong>40% Reduction</strong> in raw material waste' },
        { icon: 'fa-check', text: '<strong>Consistent Quality</strong> across production batches' },
        { icon: 'fa-check', text: '<strong>18% Increase</strong> in production efficiency' },
        { icon: 'fa-check', text: '<strong>Full Traceability</strong> from farm to factory' }
      ]
    }
  ];

  // Floating elements for hero animation
  const floatingElements = [
    { icon: 'fa-chart-line', className: 'floating-element-1' },
    { icon: 'fa-handshake', className: 'floating-element-2' },
    { icon: 'fa-truck', className: 'floating-element-3' },
    { icon: 'fa-boxes', className: 'floating-element-4' }
  ];

  // Data flow lines
  const dataFlows = [
    { className: 'flow-1' },
    { className: 'flow-2' },
    { className: 'flow-3' }
  ];

  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Animate counters when page loads
    animateCounters();

    // Intersection Observer for value cards animation
    const observer = new IntersectionObserver(
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

    document.querySelectorAll('.value-card').forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });

    // Add animation delays to floating elements
    const floatingEls = document.querySelectorAll('.floating-element');
    floatingEls.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.5}s`;
    });

    const dataFlowEls = document.querySelectorAll('.data-flow');
    dataFlowEls.forEach((flow, index) => {
      flow.style.animationDelay = `${index * 0.3}s`;
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

  const animateCounters = () => {
    const targets = { clients: 750, savings: 28, success: 95 };
    const durations = { clients: 2000, savings: 1500, success: 1500 };
    
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

  const handleConsultationClick = (e) => {
    if (!confirm('Our business solutions team will call you within 30 minutes. Continue?')) {
      e.preventDefault();
    }
  };

  return (
    <>
      
      
      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="solutions-hero">
          <div className="container">
            <div className="solutions-hero-content">
              {/* Text Content */}
              <div className="hero-text-content">
                <h1 className="solutions-hero-title">Tailored Business Solutions for Enterprise Procurement</h1>
                <p className="solutions-hero-subtitle">
                  Streamline your farm produce procurement with customized solutions designed for your business needs. 
                  From hotels to exporters, we provide end-to-end supply chain solutions that ensure quality, reliability, and cost savings.
                </p>
                <div className="hero-stats">
                  <div className="hero-stat-item">
                    <span className="hero-stat-number" id="solutionClients">{counts.clients}+</span>
                    <span className="hero-stat-label">Business Clients Served</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-number" id="avgSavings">{counts.savings}%</span>
                    <span className="hero-stat-label">Average Cost Savings</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-number" id="solutionSuccess">{counts.success}%</span>
                    <span className="hero-stat-label">Solution Success Rate</span>
                  </div>
                </div>
              </div>
              
              {/* Animated Visual Elements */}
              <div className="hero-visual-container" aria-hidden="true">
                <div className="hero-animation-area">
                  {/* Floating Business Elements */}
                  {floatingElements.map((element, index) => (
                    <div key={index} className={`floating-element ${element.className}`}>
                      <i className={`fas ${element.icon}`}></i>
                    </div>
                  ))}
                  
                  {/* Animated Data Flow Lines */}
                  {dataFlows.map((flow, index) => (
                    <div key={index} className={`data-flow ${flow.className}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Overview */}
        <section className="solutions-overview">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Comprehensive Business Solutions</h2>
              <p className="section-subtitle">We understand that every business has unique requirements. Our solutions are tailored to meet specific industry needs.</p>
            </div>
            <div className="overview-container">
              {overviewCards.map((card, index) => (
                <div key={index} className="overview-card">
                  <div className="overview-icon">
                    <i className={`fas ${card.icon}`}></i>
                  </div>
                  <h3 className="overview-title">{card.title}</h3>
                  <p className="overview-description">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Solutions */}
        <section className="industry-solutions">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Industry-Specific Solutions</h2>
              <p className="section-subtitle">Select your industry to explore customized procurement solutions</p>
            </div>
            
            <div className="industry-tabs">
              {industryTabs.map(tab => (
                <div 
                  key={tab.id}
                  className={`industry-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveTab(tab.id)}
                >
                  <i className={`fas ${tab.icon}`}></i>
                  <span>{tab.label}</span>
                </div>
              ))}
            </div>

            {/* Industry Content */}
            {Object.keys(industryContent).map(key => (
              <div 
                key={key}
                className={`industry-content ${activeTab === key ? 'active' : ''}`}
                id={`${key}-content`}
              >
                <div className="industry-details">
                  <div className="industry-header">
                    <div className="industry-header-icon">
                      <i className={`fas ${industryContent[key].icon}`}></i>
                    </div>
                    <div className="industry-header-text">
                      <h3>{industryContent[key].title}</h3>
                      <p>{industryContent[key].subtitle}</p>
                    </div>
                  </div>
                  
                  <p>{industryContent[key].description}</p>
                  
                  <div className="industry-features">
                    {industryContent[key].features.map((feature, idx) => (
                      <div key={idx} className="industry-feature">
                        <h4>{feature.title}</h4>
                        <p>{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Value Proposition */}
        <section className="value-proposition">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Value Proposition</h2>
              <p className="section-subtitle">Why businesses choose Farm Vantara for their procurement needs</p>
            </div>
            <div className="value-cards">
              {valueProps.map((prop, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">
                    <i className={`fas ${prop.icon}`}></i>
                  </div>
                  <h3 className="value-title">{prop.title}</h3>
                  <p className="value-description">{prop.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Flow - FIXED VERSION */}
        <section className="process-flow">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Solution Implementation Process</h2>
              <p className="section-subtitle">A structured approach to implementing your customized procurement solution</p>
            </div>
            <div className="process-steps-container">
              <div className="process-steps">
                {processSteps.map((step, index) => (
                  <div key={index} className="process-step">
                    <div className="step-number">{step.number}</div>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="case-studies">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Success Stories</h2>
              <p className="section-subtitle">Real businesses achieving results with our tailored solutions</p>
            </div>
            <div className="case-studies-grid">
              {caseStudies.map((study, index) => (
                <div key={index} className="case-study-card">
                  <div className="case-study-header">
                    <h3>{study.title}</h3>
                    <p>{study.subtitle}</p>
                  </div>
                  <div className="case-study-body">
                    <p>{study.description}</p>
                    <div className="case-study-results">
                      <h4>Results Achieved:</h4>
                      <ul>
                        {study.results.map((result, idx) => (
                          <li key={idx}>
                            <i className={`fas ${result.icon}`}></i>
                            <span dangerouslySetInnerHTML={{ __html: result.text }}></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="solutions-cta" id="consultation">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Transform Your Procurement?</h2>
              <p className="cta-subtitle">Schedule a free consultation with our business solutions team to discuss your specific requirements</p>
              <div className="cta-buttons">
                <a 
                  href="tel:+919553774933" 
                  className="btn-cta-primary"
                  onClick={handleConsultationClick}
                >
                  <i className="fas fa-phone-alt"></i> Schedule Consultation
                </a>
                <a 
                  href="mailto:b2b@farmvantara.com" 
                  className="btn-cta-secondary"
                >
                  <i className="fas fa-envelope"></i> Email Requirements
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      
      {/* WhatsApp Float */}
      <a 
        href="https://wa.me/919553774933" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Chat with our business team"
      >
        <i className="fab fa-whatsapp"></i>
        <span className="whatsapp-text">Business Support</span>
      </a>
    </>
  );
};

export default BusinessSolutions;