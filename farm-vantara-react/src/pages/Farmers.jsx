// src/pages/Farmers.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Farmers.css";

const Farmers = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [counts, setCounts] = useState({
    farmers: 0,
    earnings: 0,
    payments: 0
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    state: '',
    language: 'hindi',
    farmName: '',
    landArea: '',
    primaryCrop: ''
  });

  const navMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);


  // Flow chart steps
  const flowSteps = [
    {
      icon: 'fa-user-plus',
      number: 1,
      title: 'Easy Registration',
      description: 'Start with simple free registration. Provide basic farm details and get verified in less than 24 hours. No complicated paperwork required.',
      highlight: 'Free & Simple Registration',
      position: 'left'
    },
    {
      icon: 'fa-chart-line',
      number: 2,
      title: 'Direct Market Access',
      description: 'Connect directly with verified buyers, restaurants, and retailers. Get real-time market prices and demand insights to make informed decisions.',
      highlight: 'Eliminate Middlemen',
      position: 'right'
    },
    {
      icon: 'fa-truck',
      number: 3,
      title: 'Complete Logistics Support',
      description: 'We handle everything from farm pickup to buyer delivery. Cold chain facilities for perishables, quality checks, and secure transportation.',
      highlight: 'Doorstep Pickup & Delivery',
      position: 'left'
    },
    {
      icon: 'fa-money-bill-wave',
      number: 4,
      title: 'Guaranteed Instant Payments',
      description: 'Receive payments within 24 hours of delivery. Multiple payment options including bank transfer, UPI, and cash pickup at your convenience.',
      highlight: '24-Hour Payment Guarantee',
      position: 'right'
    },
    {
      icon: 'fa-headset',
      number: 5,
      title: 'Ongoing Farmer Support',
      description: '24/7 support in your regional language. Crop planning advice, weather alerts, market trends, and farming best practices to maximize your yield.',
      highlight: 'Always Available Support',
      position: 'left'
    },
    {
      icon: 'fa-chart-bar',
      number: 6,
      title: 'Sustainable Growth & Success',
      description: 'Join thousands of successful farmers earning 30-40% more. Access to premium markets, export opportunities, and long-term business partnerships.',
      highlight: '40% Higher Earnings',
      position: 'right'
    }
  ];

  // How it works steps
  const howItWorksSteps = [
    {
      number: 1,
      title: 'Register Your Farm',
      description: 'Complete free registration with basic details and farm documents. Takes less than 10 minutes.',
      action: 'Free Registration',
      icon: 'fa-user-plus'
    },
    {
      number: 2,
      title: 'List Your Crops',
      description: 'Add your available crops with quantity, quality specifications, and expected price.',
      action: 'Easy Listing',
      icon: 'fa-plus-circle'
    },
    {
      number: 3,
      title: 'Receive Orders',
      description: 'Get direct orders from verified buyers. Negotiate prices through our secure platform.',
      action: 'Direct Orders',
      icon: 'fa-shopping-cart'
    },
    {
      number: 4,
      title: 'Sell & Get Paid',
      description: 'We arrange pickup, quality check, and delivery. Receive payment within 24 hours.',
      action: 'Instant Payment',
      icon: 'fa-rupee-sign'
    }
  ];

  // Top selling crops
  const topCrops = [
    {
      name: 'Organic Tomatoes',
      price: '₹1,800 - ₹2,200',
      unit: 'Quintal',
      location: 'Pan-India Demand',
      season: 'Year-round',
      demand: 'High Demand',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Basmati Rice',
      price: '₹3,200 - ₹3,800',
      unit: 'Quintal',
      location: 'Export Quality',
      season: 'Seasonal',
      demand: 'Premium Price',
      image: 'https://cpimg.tistatic.com/11014135/b/4/Indian-Basmati-Rice..jpg'
    },
    {
      name: 'Alphonso Mangoes',
      price: '₹4,500 - ₹6,000',
      unit: 'Quintal',
      location: 'International Market',
      season: 'Summer Season',
      demand: 'Export Opportunity',
      image: 'https://www.quicklly.com/upload_images/blog/1712186243-alphonso-mangoes:-where-to-find-health-benefits-important-facts.jpg'
    },
    {
      name: 'Organic Vegetables',
      price: '₹2,500 - ₹3,500',
      unit: 'Quintal',
      location: 'Urban Markets',
      season: 'Year-round',
      demand: 'Growing Market',
      image: 'https://d1hm90tax3m3th.cloudfront.net/web/vegetables.jpg'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "I was earning ₹3-4 lakh annually through local traders. After joining Farm Vantara, my income increased to ₹8 lakh in the first year itself. The direct market access changed everything.",
      name: 'Rajesh Kumar',
      role: 'Wheat & Rice Farmer, Punjab',
      image: 'https://img.freepik.com/premium-photo/young-indian-farmer-green-agriculture-field_75648-6244.jpg?semt=ais_hybrid&w=740&q=80'
    },
    {
      quote: "The 24-hour payment guarantee is a game-changer. Earlier, I had to wait for weeks to get paid. Now I get my money instantly and can plan my next crop cycle better.",
      name: 'Priya Sharma',
      role: 'Organic Vegetable Farmer, Maharashtra',
      image: 'https://img.freepik.com/premium-photo/young-indian-woman-farmer-working-wheat-farm-field_136354-2660.jpg'
    },
    {
      quote: "The market insights helped me switch from traditional crops to high-demand organic vegetables. My earnings increased by 60% in just 8 months. Best decision of my farming career.",
      name: 'Arun Patel',
      role: 'Cotton & Pulses Farmer, Gujarat',
      image: 'https://t3.ftcdn.net/jpg/05/99/59/02/360_F_599590282_rn8nuDZAs1m8tpOA9BpkqDFxGULAQqdx.jpg'
    }
  ];

  // CTA features
  const ctaFeatures = [
    { icon: 'fa-check-circle', title: 'Free Registration', description: 'No hidden charges' },
    { icon: 'fa-check-circle', title: 'Zero Commission', description: 'On first 10 orders' },
    { icon: 'fa-check-circle', title: 'Regional Support', description: 'In your local language' },
    { icon: 'fa-check-circle', title: 'Quality Training', description: 'Free farming workshops' }
  ];

  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Animate counters
    animateCounters();

    // Intersection Observer for flow steps
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

    document.querySelectorAll('.flow-step-content').forEach((step) => {
      step.style.opacity = '0';
      step.style.transform = 'translateY(20px)';
      step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(step);
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
    const targets = { farmers: 5000, earnings: 40, payments: 99 };
    const durations = { farmers: 2000, earnings: 1500, payments: 1500 };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.fullName || !formData.mobileNumber || !formData.state) {
      alert('Please fill in all required fields');
      return;
    }

    // Show success message
    alert('Registration Successful! Our team will contact you within 24 hours to complete the verification process.');

    // Reset form
    setFormData({
      fullName: '',
      mobileNumber: '',
      state: '',
      language: 'hindi',
      farmName: '',
      landArea: '',
      primaryCrop: ''
    });
    setCurrentStep(1);
  };

  return (
    <>
      {/* Main Content */}
      <main id="main-content">
        {/* Farmer Hero Section */}
        <section className="farmer-hero">
          <div className="container">
            <div className="farmer-hero-content">
              <div className="farmer-hero-text">
                <h1 className="farmer-hero-title">Sell Your Crops Directly, Earn 40% More</h1>
                <p className="farmer-hero-subtitle">
                  Eliminate middlemen, get fair market prices,
                  and receive payments within 24 hours. Join 5,000+ farmers already transforming their lives with Farm Vantara.
                </p>
                <div className="farmer-cta-buttons">
                  <Link to="/register?role=farmer" className="btn-farmer-primary">
                    <i className="fas fa-user-plus"></i> Register Your Farm Free
                  </Link>
                  <a href="tel:+919553774933" className="btn-farmer-secondary">
                    <i className="fas fa-phone-alt"></i> Call for Assistance
                  </a>
                </div>
                <div className="farmer-hero-stats">
                  <div className="farmer-stat-item">
                    <span className="farmer-stat-number" id="farmerCount">{counts.farmers}+</span>
                    <span className="farmer-stat-label">Farmers Connected</span>
                  </div>
                  <div className="farmer-stat-item">
                    <span className="farmer-stat-number" id="earningCount">+{counts.earnings}%</span>
                    <span className="farmer-stat-label">Avg. Extra Earnings</span>
                  </div>
                  <div className="farmer-stat-item">
                    <span className="farmer-stat-number" id="paymentCount">{counts.payments}%</span>
                    <span className="farmer-stat-label">Payment Success Rate</span>
                  </div>
                </div>
              </div>
              <div className="farmer-hero-visual" aria-hidden="true">
                <div className="farmer-visual-container">
                  <div className="farmer-floating farmer-floating-1">
                    <i className="fas fa-rupee-sign"></i>
                  </div>
                  <div className="farmer-floating farmer-floating-2">
                    <i className="fas fa-chart-line"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Flow Chart */}
        <section className="benefits-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Your Journey to Better Farming</h2>
              <p className="section-subtitle">Follow our proven success path - From registration to increased earnings</p>
            </div>

            <div className="flow-chart-container">
              <div className="flow-chart">
                {flowSteps.map((step, index) => (
                  <div key={index} className={`flow-step ${step.position === 'right' ? 'reverse' : ''}`}>
                    <div className="flow-icon">
                      <i className={`fas ${step.icon}`}></i>
                      <div className="flow-step-number">{step.number}</div>
                    </div>
                    <div className="flow-step-content">
                      <h3 className="flow-step-title">
                        {step.title}
                      </h3>
                      <p className="flow-step-description">{step.description}</p>
                      <span className="flow-step-highlight">{step.highlight}</span>
                    </div>
                    {index < flowSteps.length - 1 && (
                      <>
                        <div className="flow-connector horizontal-connector"></div>
                        <div className="flow-connector vertical-connector"></div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">How It Works - Simple 4 Steps</h2>
              <p className="section-subtitle">Start selling your crops in less than 30 minutes</p>
            </div>
            <div className="steps-container">
              {howItWorksSteps.map((step) => (
                <div key={step.number} className="step">
                  <div className="step-number">{step.number}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                  <div className="step-action">
                    <i className={`fas ${step.icon}`}></i> {step.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Selling Crops Section */}
        <section className="crops-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Top Selling Crops on Farm Vantara</h2>
              <p className="section-subtitle">Get premium prices for these high-demand crops</p>
            </div>
            <div className="crops-grid">
              {topCrops.map((crop, index) => (
                <div key={index} className="crop-card">
                  <div className="crop-image">
                    <img src={crop.image} alt={crop.name} loading="lazy" />
                  </div>
                  <div className="crop-info">
                    <h3 className="crop-name">{crop.name}</h3>
                    <div className="crop-price">{crop.price} /{crop.unit}</div>
                    <div className="crop-specs">
                      <span><i className="fas fa-map-marker-alt"></i> {crop.location}</span>
                      <span><i className="fas fa-clock"></i> {crop.season}</span>
                    </div>
                    <div className="crop-demand">{crop.demand}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Farmer Testimonials */}
        <section className="testimonials-section" id="testimonials">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Farmer Success Stories</h2>
              <p className="section-subtitle">Real farmers, real transformation with Farm Vantara</p>
            </div>
            <div className="testimonial-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <p className="testimonial-quote">"{testimonial.quote}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <img src={testimonial.image} alt={testimonial.name} loading="lazy" />
                    </div>
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="farmer-cta-section">
          <div className="container">
            <div className="farmer-cta-content">
              <h2 className="farmer-cta-title">Ready to Transform Your Farming Journey?</h2>
              <p className="farmer-cta-subtitle">Join thousands of successful farmers who are earning more with Farm Vantara</p>

              {/* CTA Features in Single Line */}
              <div className="cta-features-container">
                {ctaFeatures.map((feature, index) => (
                  <div key={index} className="cta-feature">
                    <i className={`fas ${feature.icon}`}></i>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="cta-button-group">
                <Link to="/register" className="btn-farmer-primary btn-white">
                  <i className="fas fa-user-plus"></i> Start Selling Now
                </Link>
                <a href="tel:+919553774933" className="btn-farmer-secondary btn-outline-white">
                  <i className="fas fa-phone-alt"></i> Call: +91 95537 74933
                </a>
                <a href="https://wa.me/919553774933" className="btn-farmer-secondary btn-whatsapp" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                </a>
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

export default Farmers;