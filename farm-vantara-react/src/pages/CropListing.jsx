// src/pages/CropListing.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/CropListing.css";

const CropListing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [priceResult, setPriceResult] = useState({
    visible: false,
    text: '',
    note: ''
  });
  const [calculator, setCalculator] = useState({
    cropType: 'wheat',
    qualityGrade: 'standard',
    quantity: 10
  });

  const navMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);


  // Step data
  const steps = [
    {
      number: 1,
      title: 'Capture Quality Photos',
      description: 'High-quality photos are the most important element of your listing. Buyers can\'t physically inspect your produce, so photos must accurately represent quality.',
      tips: [
        'Take photos in natural daylight (morning or evening)',
        'Show scale by including common objects (coin, hand)',
        'Capture different angles: close-up, field view, harvested batch',
        'Include photos showing healthy plants and ripe produce',
        'Avoid blurred or dark images'
      ]
    },
    {
      number: 2,
      title: 'Write Detailed Descriptions',
      description: 'Provide complete information about your crop. Be specific about variety, size, maturity, and any unique qualities.',
      tips: [
        'Crop variety (e.g., Alphonso mango, Basmati rice 1121)',
        'Harvest date and expected shelf life',
        'Growing method (organic, natural, conventional)',
        'Size/grade specifications',
        'Packing details (boxes, crates, sacks)'
      ]
    },
    {
      number: 3,
      title: 'Set Competitive Pricing',
      description: 'Research current market prices on Farm Vantara and set competitive yet profitable pricing. Consider factors like quality, location, and demand.',
      tips: [
        'Check "Live Market Prices" section daily',
        'Factor in transportation costs',
        'Consider bulk discount options',
        'Price higher for organic/specialty crops',
        'Offer flexible payment terms'
      ]
    },
    {
      number: 4,
      title: 'Specify Quantity & Availability',
      description: 'Clearly state available quantities, minimum order requirements, and delivery timelines. Be realistic about what you can supply.',
      tips: [
        'Specify exact available quantity (in quintals/kg)',
        'Set reasonable minimum order quantities',
        'Indicate if you can supply regularly',
        'Provide accurate harvest schedule',
        'Update availability after each sale'
      ]
    },
    {
      number: 5,
      title: 'Choose Delivery Options',
      description: 'Select appropriate delivery methods based on crop perishability and buyer location. Farm Vantara offers various logistics solutions.',
      tips: [
        'For perishables, prefer Farm Vantara cold chain',
        'Specify who bears transportation cost',
        'Provide accurate pickup location',
        'Estimate delivery time realistically',
        'Consider local pickup options'
      ]
    }
  ];

  // Pricing strategies
  const pricingStrategies = [
    {
      icon: 'fa-chart-line',
      title: 'Market-Based Pricing',
      description: 'Always check current market rates before listing. Farm Vantara provides real-time price data for all major crops across different regions.',
      example: {
        title: 'Example: Wheat Pricing',
        text: 'Current Punjab market: ₹2,450-2,650/quintal. If your wheat is premium quality, you can price at ₹2,600-2,700 with proper justification.'
      }
    },
    {
      icon: 'fa-tags',
      title: 'Quality Premium',
      description: 'Higher quality produce commands premium prices. Document your quality parameters clearly to justify higher pricing.',
      example: {
        title: 'Quality Factors That Add Value:',
        text: 'Organic certification, larger size, better color, higher nutritional content, specific varieties, freshness indicators.'
      }
    },
    {
      icon: 'fa-boxes',
      title: 'Bulk Pricing Strategy',
      description: 'Offer tiered pricing to encourage larger orders. This reduces your per-unit logistics costs and ensures larger sales.',
      example: {
        title: 'Sample Bulk Pricing:',
        text: '1-10 quintals: ₹2,500/quintal, 11-50 quintals: ₹2,400/quintal, 51+ quintals: ₹2,300/quintal. Everyone wins with bulk orders.'
      }
    }
  ];

  // Crop prices for calculator
  const cropPrices = {
    wheat: { standard: 2450, premium: 2650, organic: 2950 },
    rice: { standard: 3200, premium: 3500, organic: 3900 },
    tomato: { standard: 1800, premium: 2200, organic: 2600 },
    potato: { standard: 1200, premium: 1400, organic: 1700 },
    onion: { standard: 2100, premium: 2400, organic: 2800 }
  };

  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Animate step cards on scroll
    const stepCards = document.querySelectorAll('.step-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 200);
        }
      });
    }, { threshold: 0.1 });
    
    stepCards.forEach(card => observer.observe(card));

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
  };

  const handleCalculatorChange = (e) => {
    const { name, value } = e.target;
    setCalculator(prev => ({ ...prev, [name]: value }));
  };

  const calculatePrice = () => {
    const basePrice = cropPrices[calculator.cropType][calculator.qualityGrade];
    const quantity = parseInt(calculator.quantity) || 10;
    
    // Apply quantity discount
    let finalPrice = basePrice;
    if (quantity > 50) {
      finalPrice = Math.round(basePrice * 0.92);
    } else if (quantity > 20) {
      finalPrice = Math.round(basePrice * 0.95);
    } else if (quantity > 10) {
      finalPrice = Math.round(basePrice * 0.97);
    }
    
    // Calculate range
    const lowerRange = finalPrice - 50;
    const upperRange = finalPrice + 100;
    
    // Update result
    let note = '';
    if (quantity > 50) {
      note = `You're getting a bulk discount for ${quantity} quintals. Consider offering even better prices for 100+ quintals to attract large buyers.`;
    } else if (calculator.qualityGrade === 'organic') {
      note = 'Organic certification allows premium pricing. Make sure to mention your certification details in the listing.';
    } else if (calculator.qualityGrade === 'premium') {
      note = 'For premium quality, include photos showing superior size/color and consider getting quality certification for even better pricing.';
    } else {
      note = 'This is competitive market pricing. To get better rates, consider bundling with other crops or offering flexible delivery.';
    }
    
    setPriceResult({
      visible: true,
      text: `₹${lowerRange.toLocaleString()} - ₹${upperRange.toLocaleString()} per quintal`,
      note: note
    });

    // Smooth scroll to result
    setTimeout(() => {
      const resultElement = document.getElementById('priceResult');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handleStartListing = () => {
    // Show loading state
    const btn = document.getElementById('startListingBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i className="fas fa-spinner fa-spin"></i> Redirecting...';
    btn.disabled = true;
    
    // Simulate API call/redirect
    setTimeout(() => {
      alert('Redirecting to crop listing page. Please login or register to continue.');
      // Reset button
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 1500);
  };

  return (
    <>
            {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="guide-hero">
          <div className="container">
            <div className="guide-hero-content">
              <div className="guide-hero-text">
                <h1 className="guide-hero-title">Crop Listing Guide for Farmers</h1>
                <p className="guide-hero-subtitle">
                  Learn how to create effective crop listings that attract more buyers, get better prices, and maximize your sales on India's leading AgriTech platform. This comprehensive guide covers everything from photography tips to pricing strategies.
                </p>
                
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">47%</span>
                    <span className="stat-label">More Buyer Inquiries</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">₹2,100</span>
                    <span className="stat-label">Average Price Increase</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">3.2x</span>
                    <span className="stat-label">Faster Sales</span>
                  </div>
                </div>
              </div>
              <div className="guide-hero-visual">
                <div className="hero-visual-placeholder">
                  <i className="fas fa-store"></i>
                  <i className="fas fa-carrot"></i>
                  <i className="fas fa-apple-alt"></i>
                  <i className="fas fa-tractor"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guide Introduction */}
        <section className="guide-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Why Effective Crop Listings Matter</h2>
              <p className="section-subtitle">
                A well-crafted crop listing is like a digital shop window for your farm. It's the first impression buyers have of your produce, and it can significantly impact your sales and pricing.
              </p>
            </div>
            
            <div className="intro-content">
              <p className="intro-text">
                Based on data from over 5,000 successful farmers on Farm Vantara, we've identified the key factors that make crop listings stand out. Farmers who follow these guidelines typically see <strong>47% more buyer inquiries</strong> and achieve <strong>15-25% better prices</strong> compared to basic listings.
              </p>
              
              <div className="insight-box">
                <h3 className="insight-title">
                  <i className="fas fa-lightbulb"></i> Key Insight
                </h3>
                <p className="insight-text">
                  Buyers are willing to pay premium prices when they can clearly see the quality of your produce and understand your farming practices. Detailed listings build trust and justify higher pricing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="guide-section" style={{ background: 'var(--light-gray)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Step-by-Step Listing Process</h2>
              <p className="section-subtitle">Follow these 5 steps to create compelling crop listings that sell faster</p>
            </div>
            
            <div className="steps-container">
              {steps.map((step, index) => (
                <div key={index} className="step-card" id={`step${step.number}`}>
                  <div className="step-number">{step.number}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                  
                  <div className="step-tips">
                    <h4>Pro Tips:</h4>
                    <ul>
                      {step.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Guidelines */}
        <section className="pricing-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Smart Pricing Strategies</h2>
              <p className="section-subtitle">Learn how to price your crops competitively while maximizing profits</p>
            </div>
            
            <div className="pricing-grid">
              {pricingStrategies.map((strategy, index) => (
                <div key={index} className="pricing-card">
                  <div className="pricing-icon">
                    <i className={`fas ${strategy.icon}`}></i>
                  </div>
                  <h3 className="pricing-title">{strategy.title}</h3>
                  <p className="pricing-description">{strategy.description}</p>
                  
                  <div className="pricing-example">
                    <h4>{strategy.example.title}</h4>
                    <p>{strategy.example.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Price Calculator */}
            <div className="calculator-card">
              <h3 className="calculator-title">
                <i className="fas fa-calculator"></i> Quick Price Calculator
              </h3>
              
              <div className="calculator-form">
                <div className="form-group">
                  <label htmlFor="cropType">Crop Type</label>
                  <select 
                    id="cropType" 
                    name="cropType"
                    value={calculator.cropType}
                    onChange={handleCalculatorChange}
                  >
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                    <option value="tomato">Tomato</option>
                    <option value="potato">Potato</option>
                    <option value="onion">Onion</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="qualityGrade">Quality Grade</label>
                  <select 
                    id="qualityGrade" 
                    name="qualityGrade"
                    value={calculator.qualityGrade}
                    onChange={handleCalculatorChange}
                  >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="organic">Organic Certified</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="quantity">Quantity (Quintal)</label>
                  <input 
                    type="number" 
                    id="quantity" 
                    name="quantity" 
                    min="1" 
                    value={calculator.quantity}
                    onChange={handleCalculatorChange}
                  />
                </div>
              </div>
              
              <div className="calculator-action">
                <button id="calculatePrice" onClick={calculatePrice}>
                  Calculate Suggested Price
                </button>
              </div>
              
              {priceResult.visible && (
                <div id="priceResult" className="price-result">
                  <h4>Suggested Price Range</h4>
                  <p className="result-text">{priceResult.text}</p>
                  <p className="result-note">{priceResult.note}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to List Your Crops?</h2>
              <p className="cta-description">
                Join thousands of successful farmers who are getting better prices and faster sales through Farm Vantara. Our dedicated farmer support team is available to help you create optimal listings.
              </p>
              
              <div className="cta-buttons">
                <button className="btn-cta btn-cta-primary" id="startListingBtn" onClick={handleStartListing}>
                  <i className="fas fa-plus-circle"></i> Start Listing Now
                </button>
                <a href="tel:18001234567" className="btn-cta btn-cta-secondary">
                  <i className="fas fa-phone-alt"></i> Get Listing Help: 1800-123-4567
                </a>
              </div>
              
              <p className="cta-support">
                <i className="fas fa-clock"></i> Farmer support available 7AM-10PM in Hindi, English, Tamil, Telugu & Marathi
              </p>
            </div>
          </div>
        </section>
      </main>

      
    </>
  );
};

export default CropListing;