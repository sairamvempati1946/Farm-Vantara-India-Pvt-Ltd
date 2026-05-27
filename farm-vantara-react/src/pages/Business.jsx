// src/pages/Business.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Business.css";

const Business = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [counts, setCounts] = useState({
    business: 0,
    savings: 0,
    supply: 0
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    businessEmail: '',
    businessPhone: '',
    businessType: '',
    gstNumber: '',
    primaryProducts: [],
    monthlyVolume: '',
    deliveryFrequency: '',
    additionalInfo: ''
  });

  const navMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);


  // Flow chart steps
  const flowSteps = [
    {
      icon: 'fa-clipboard-list',
      number: 1,
      title: 'Requirement Analysis',
      description: 'We analyze your business needs, quality specifications, and volume requirements to create a customized procurement plan.',
      highlight: 'Customized Planning',
      position: 'left'
    },
    {
      icon: 'fa-handshake',
      number: 2,
      title: 'Direct Farmer Connection',
      description: 'Connect directly with verified farmers who meet your quality standards. No middlemen, transparent pricing.',
      highlight: 'Transparent Sourcing',
      position: 'right'
    },
    {
      icon: 'fa-clipboard-check',
      number: 3,
      title: 'Quality Assurance',
      description: 'Every batch undergoes rigorous quality checks. Get certified, graded produce meeting industry and export standards.',
      highlight: 'Verified Quality',
      position: 'left'
    },
    {
      icon: 'fa-truck-loading',
      number: 4,
      title: 'Logistics & Delivery',
      description: 'End-to-end logistics with cold chain facilities. Pan-India delivery to your doorstep with real-time tracking.',
      highlight: 'Doorstep Delivery',
      position: 'right'
    },
    {
      icon: 'fa-file-invoice-dollar',
      number: 5,
      title: 'Documentation & Compliance',
      description: 'Complete documentation including GST invoices, quality certificates, traceability records, and compliance reports.',
      highlight: 'Full Compliance',
      position: 'left'
    },
    {
      icon: 'fa-headset',
      number: 6,
      title: 'Ongoing Business Support',
      description: 'Dedicated relationship manager, 24/7 order tracking, market insights, and procurement optimization advice.',
      highlight: 'Personal Manager',
      position: 'right'
    }
  ];

  // Procurement steps
  const procurementSteps = [
    {
      number: 1,
      title: 'Share Requirements',
      description: 'Share your produce requirements, quality specifications, and delivery schedule.'
    },
    {
      number: 2,
      title: 'Get Best Quotes',
      description: 'Receive competitive quotes from verified farmers. Compare prices and quality.'
    },
    {
      number: 3,
      title: 'Place Order',
      description: 'Place order through our secure platform. Get order confirmation and timeline.'
    },
    {
      number: 4,
      title: 'Receive Delivery',
      description: 'Get quality-checked produce delivered to your location with complete documentation.'
    }
  ];

  // Business categories
  const businessCategories = [
    {
      icon: 'fa-utensils',
      title: 'Hotels & Restaurants',
      description: 'Fresh, restaurant-grade produce with daily delivery schedules.',
      features: [
        'Daily/Weekly Delivery',
        'Restaurant Grade Quality',
        'Custom Cutting & Packaging',
        'Seasonal Menu Planning'
      ]
    },
    {
      icon: 'fa-industry',
      title: 'Food Processors',
      description: 'Bulk raw materials with consistent quality for manufacturing.',
      features: [
        'Bulk Quantities',
        'Processing Grade',
        'Quality Certifications',
        'Long-term Contracts'
      ]
    },
    {
      icon: 'fa-store',
      title: 'Retail Chains',
      description: 'Retail-ready packaged produce for supermarkets and stores.',
      features: [
        'Retail Packaging',
        'Branding Options',
        'Supply Chain Management',
        'Inventory Planning'
      ]
    },
    {
      icon: 'fa-plane-departure',
      title: 'Exporters',
      description: 'Export-quality produce meeting international standards.',
      features: [
        'Export Certifications',
        'Cold Chain Logistics',
        'Quality Documentation',
        'Custom Compliance'
      ]
    }
  ];

  // Products showcase
  const products = [
    {
      name: 'Fresh Vegetables',
      price: '₹800 - ₹2,500',
      unit: 'Quintal',
      varieties: '15+ Varieties',
      supply: 'Daily Supply',
      availability: 'Available Pan-India',
      image: 'data:image/jpeg;base64,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'
    },
    {
      name: 'Seasonal Fruits',
      price: '₹1,500 - ₹6,000',
      unit: 'Quintal',
      varieties: '20+ Varieties',
      supply: 'Seasonal',
      availability: 'Export Quality',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Grains & Pulses',
      price: '₹2,000 - ₹4,500',
      unit: 'Quintal',
      varieties: '12+ Varieties',
      supply: 'Year-round',
      availability: 'Bulk Available',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOoBfqluSM4pyta0CZtIQrNX0f1Hp6-pm9wA&s'
    },
    {
      name: 'Organic Produce',
      price: '₹2,500 - ₹5,000',
      unit: 'Quintal',
      varieties: 'Certified Organic',
      supply: 'Limited Stock',
      availability: 'Premium Quality',
      image: 'https://shilliminstitute.org/wp-content/uploads/2023/04/yY8mi7JgYkdx6Lt3WWii8b-890x664.jpg.webp'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "As a restaurant chain, we were struggling with inconsistent vegetable quality and pricing. Farm Vantara provided us with restaurant-grade produce at 25% lower costs and reliable daily delivery.",
      name: 'Raj Malhotra',
      role: 'Owner, Spice Route Restaurants',
      icon: 'fa-utensils'
    },
    {
      quote: "Our food processing unit requires large quantities of consistent quality raw materials. Farm Vantara's direct farmer network and quality assurance system have transformed our supply chain.",
      name: 'Priya Desai',
      role: 'Procurement Head, FoodPro Industries',
      icon: 'fa-industry'
    },
    {
      quote: "Exporting requires strict quality compliance and documentation. Farm Vantara's export-grade produce and complete certification package helped us expand to international markets.",
      name: 'Arun Kumar',
      role: 'Director, Global Agro Exports',
      icon: 'fa-plane-departure'
    }
  ];

  // CTA features
  const ctaFeatures = [
    { icon: 'fa-check-circle', title: 'Free Consultation', description: 'Procurement analysis' },
    { icon: 'fa-check-circle', title: 'Sample Testing', description: 'Free quality samples' },
    { icon: 'fa-check-circle', title: 'Trial Order', description: 'Risk-free first order' },
    { icon: 'fa-check-circle', title: 'Volume Discounts', description: 'Bulk pricing benefits' }
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
    const targets = { business: 500, savings: 25, supply: 99 };
    const durations = { business: 2000, savings: 1500, supply: 1500 };

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
    const { name, value, type, selectedOptions } = e.target;

    if (type === 'select-multiple') {
      const values = Array.from(selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: values
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
    if (!formData.businessName || !formData.contactPerson || !formData.businessEmail || !formData.businessPhone) {
      alert('Please fill in all required fields');
      return;
    }

    // Show success message
    alert('Business Registration Successful! Our procurement team will contact you within 24 hours with customized quotes.');

    // Reset form
    setFormData({
      businessName: '',
      contactPerson: '',
      businessEmail: '',
      businessPhone: '',
      businessType: '',
      gstNumber: '',
      primaryProducts: [],
      monthlyVolume: '',
      deliveryFrequency: '',
      additionalInfo: ''
    });
    setCurrentStep(1);
  };

  return (
    <>
      


      {/* Main Content */}
      <main id="main-content">
        {/* Business Hero Section */}
        <section className="business-hero">
          <div className="container">
            <div className="business-hero-content">
              <div className="business-hero-text">
                <h1 className="business-hero-title">Procure Fresh Farm Produce Directly</h1>
                <p className="business-hero-subtitle">
                  Source high-quality farm produce directly from verified farmers. Eliminate intermediaries,
                  save 20-30% on procurement costs, and ensure consistent supply for your business needs.
                </p>
                <div className="business-cta-buttons">
                  <Link to="/register?role=business" className="btn-business-primary">
                    <i className="fas fa-building"></i> Register Your Business
                  </Link>
                  <a href="tel:+919553774933" className="btn-business-secondary">
                    <i className="fas fa-phone-alt"></i> Request Quote
                  </a>
                </div>
                <div className="business-hero-stats">
                  <div className="business-stat-item">
                    <span className="business-stat-number" id="businessCount">{counts.business}+</span>
                    <span className="business-stat-label">Business Clients</span>
                  </div>
                  <div className="business-stat-item">
                    <span className="business-stat-number" id="savingsCount">{counts.savings}%</span>
                    <span className="business-stat-label">Avg. Cost Savings</span>
                  </div>
                  <div className="business-stat-item">
                    <span className="business-stat-number" id="supplyCount">{counts.supply}%</span>
                    <span className="business-stat-label">Supply Chain Reliability</span>
                  </div>
                </div>
              </div>
              <div className="business-hero-visual" aria-hidden="true">
                <div className="business-visual-container">
                  <div className="business-floating business-floating-1">
                    <i className="fas fa-industry"></i>
                  </div>
                  <div className="business-floating business-floating-2">
                    <i className="fas fa-chart-pie"></i>
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
              <h2 className="section-title">Your Procurement Advantage Journey</h2>
              <p className="section-subtitle">From inquiry to delivery - A streamlined process designed for businesses</p>
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
                        <i className={`fas ${step.icon}`}></i> {step.title}
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

        {/* Procurement Steps Section */}
        <section className="procurement-steps">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Streamlined Procurement Process</h2>
              <p className="section-subtitle">Simple 4-step process for efficient farm produce procurement</p>
            </div>
            <div className="steps-container">
              {procurementSteps.map((step) => (
                <div key={step.number} className="step">
                  <div className="step-number">{step.number}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Categories Section - Single Line Layout */}
        <section className="categories-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Solutions for Every Business Type</h2>
              <p className="section-subtitle">Tailored procurement solutions for different business needs</p>
            </div>
            <div className="categories-container">
              {businessCategories.map((category, index) => (
                <div key={index} className="category-card">
                  <div className="category-icon">
                    <i className={`fas ${category.icon}`}></i>
                  </div>
                  <h3 className="category-title">{category.title}</h3>
                  <p className="category-description">{category.description}</p>
                  <ul className="category-features">
                    {category.features.map((feature, idx) => (
                      <li key={idx}>
                        <i className="fas fa-check"></i> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Showcase */}
        <section className="products-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Premium Farm Produce Available</h2>
              <p className="section-subtitle">Quality produce for your business requirements</p>
            </div>
            <div className="products-grid">
              {products.map((product, index) => (
                <div key={index} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} loading="lazy" />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">{product.price} /{product.unit}</div>
                    <div className="product-specs">
                      <span><i className="fas fa-tags"></i> {product.varieties}</span>
                      <span><i className="fas fa-calendar"></i> {product.supply}</span>
                    </div>
                    <div className="product-availability">{product.availability}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">What Our Business Clients Say</h2>
              <p className="section-subtitle">Trusted by businesses across India for reliable farm produce procurement</p>
            </div>
            <div className="testimonial-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <p className="testimonial-quote">"{testimonial.quote}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <i className={`fas ${testimonial.icon}`}></i>
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

        {/* CTA Section - Single Line Layout */}
        <section className="business-cta-section">
          <div className="container">
            <div className="business-cta-content">
              <h2 className="business-cta-title">Ready to Optimize Your Procurement?</h2>
              <p className="business-cta-subtitle">Join 500+ businesses saving on farm produce procurement with Farm Vantara</p>

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
                <a href="./register.html" className="btn-business-primary btn-white">
                  <i className="fas fa-file-signature"></i> Request Quote
                </a>
                <a href="tel:+919553774933" className="btn-business-secondary btn-outline-white">
                  <i className="fas fa-phone-alt"></i> Call Procurement Head
                </a>
                <a href="https://wa.me/919553774933" className="btn-business-secondary btn-whatsapp" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp"></i> WhatsApp Inquiry
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>


      {/* WhatsApp Float */}
      <a href="https://wa.me/919553774933" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat with our business team">
        <i className="fab fa-whatsapp"></i>
      </a>
    </>
  );
};

export default Business;