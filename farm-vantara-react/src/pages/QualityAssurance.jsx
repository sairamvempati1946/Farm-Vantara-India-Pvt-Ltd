import React, { useState, useEffect, useRef } from 'react';
import '../styles/QualityAssurance.css';

const QualityAssurance = () => {
  // ---------- State ----------
  const [menuActive, setMenuActive] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [counters, setCounters] = useState({
    qualityScore: 0,
    rejectionRate: 0,
    certifiedFarmers: 0,
  });

  // Refs for Intersection Observers
  const heroRef = useRef(null);
  const tierCardsRef = useRef([]);
  const standardCardsRef = useRef([]);
  const certificationItemsRef = useRef([]);
  const navMenuRef = useRef(null);
  const mobileBtnRef = useRef(null);
  const floatingElementsRef = useRef([]);

  // ---------- Effects ----------

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => setHeaderScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile menu outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuActive &&
        navMenuRef.current &&
        !navMenuRef.current.contains(e.target) &&
        mobileBtnRef.current &&
        !mobileBtnRef.current.contains(e.target)
      ) {
        setMenuActive(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuActive]);

  // Animate counters when hero is in view
  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate tier cards on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 200);
          }
        });
      },
      { threshold: 0.2 }
    );
    tierCardsRef.current.forEach((card) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
      }
    });
    return () => observer.disconnect();
  }, []);

  // Animate standard cards on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 150);
          }
        });
      },
      { threshold: 0.2 }
    );
    standardCardsRef.current.forEach((card) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
      }
    });
    return () => observer.disconnect();
  }, []);

  // Animate certification items on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateX(0)';
            }, index * 200);
          }
        });
      },
      { threshold: 0.2 }
    );
    certificationItemsRef.current.forEach((item) => {
      if (item) {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
      }
    });
    return () => observer.disconnect();
  }, []);

  // Parallax effect for floating elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      floatingElementsRef.current.forEach((el, index) => {
        if (el) {
          const speed = 0.02 + index * 0.005;
          const x = (mouseX * speed * 100) - 50;
          const y = (mouseY * speed * 100) - 50;
          el.style.transform = `translate(${x}px, ${y}px) rotate(${x}deg)`;
        }
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Add orbital stage animations when they come into view
  useEffect(() => {
    const orbitalSystem = document.querySelector('.orbital-system');
    if (!orbitalSystem) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stage1 = document.querySelector('.stage-1');
            const stage2 = document.querySelector('.stage-2');
            const stage3 = document.querySelector('.stage-3');
            if (stage1) stage1.style.animation = 'orbitStage1 25s linear infinite, floatStage 6s ease-in-out infinite';
            if (stage2) stage2.style.animation = 'orbitStage2 20s linear infinite, floatStage 6s ease-in-out infinite 1.5s';
            if (stage3) stage3.style.animation = 'orbitStage3 30s linear infinite, floatStage 6s ease-in-out infinite 3s';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(orbitalSystem);
    return () => observer.disconnect();
  }, []);

  // Pulse central certification periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const central = document.querySelector('.central-certification');
      if (central) {
        central.style.boxShadow = '0 0 40px rgba(242, 201, 76, 0.4)';
        setTimeout(() => {
          central.style.boxShadow = '0 20px 40px rgba(242, 201, 76, 0.3)';
        }, 800);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ---------- Helper Functions ----------
  const animateCounter = (elementId, target, suffix = '', duration = 2000) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = parseFloat(start.toFixed(1)) + suffix;
      }
    }, 16);
  };

  const animateCounters = () => {
    animateCounter('qualityScore', 99.2, '%');
    animateCounter('rejectionRate', 0.3, '%');
    animateCounter('certifiedFarmers', 8500, '+');
  };

  // Hover handlers for orbital stages
  const handleStageMouseEnter = (e, num) => {
    const stage = e.currentTarget;
    stage.style.transform = 'translate(-50%, -50%) scale(1.15)';
    stage.style.zIndex = '15';
    stage.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.25)';
    stage.style.animationPlayState = 'paused';
    const line = document.querySelector(`.line-${num}`);
    if (line) {
      line.style.opacity = '1';
      line.style.boxShadow = '0 0 30px rgba(39, 174, 96, 0.7)';
    }
  };

  const handleStageMouseLeave = (e, num) => {
    const stage = e.currentTarget;
    stage.style.transform = 'translate(-50%, -50%) scale(1)';
    stage.style.zIndex = '5';
    stage.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
    stage.style.animationPlayState = 'running';
    const line = document.querySelector(`.line-${num}`);
    if (line) {
      line.style.opacity = '0.7';
      line.style.boxShadow = '0 0 10px rgba(39, 174, 96, 0.3)';
    }
  };

  const handleCentralMouseEnter = () => {
    document.querySelectorAll('.orbital-path').forEach((path) => {
      path.style.border = '2px solid rgba(39, 174, 96, 0.6)';
      path.style.boxShadow = '0 0 20px rgba(39, 174, 96, 0.3)';
    });
  };

  const handleCentralMouseLeave = () => {
    document.querySelectorAll('.orbital-path').forEach((path) => {
      path.style.border = '2px dashed rgba(39, 174, 96, 0.3)';
      path.style.boxShadow = 'none';
    });
  };

  // ---------- JSX ----------
  return (
    <div className="quality-assurance-page">
      {/* Main Content */}
      <main id="main-content">
        {/* Quality Hero Section */}
        <section className="quality-hero" ref={heroRef}>
          <div className="floating-elements">
            {['fa-award', 'fa-clipboard-check', 'fa-microscope', 'fa-seedling', 'fa-check-circle'].map((icon, idx) => (
              <div
                className="floating-element"
                key={idx}
                ref={(el) => (floatingElementsRef.current[idx] = el)}
              >
                <i className={`fas ${icon}`}></i>
              </div>
            ))}
          </div>

          <div className="container">
            <div className="quality-hero-content">
              <div className="hero-text-content">
                <h1 className="quality-hero-title">Premium Quality Assurance</h1>
                <p className="quality-hero-subtitle">
                  Our comprehensive 3-tier quality verification system ensures that every product meets
                  the highest standards. From farm to business, we guarantee premium quality, safety,
                  and consistency in every transaction.
                </p>
                <div className="hero-stats">
                  <div className="hero-stat-item">
                    <span className="hero-stat-number" id="qualityScore">0</span>
                    <span className="hero-stat-label">Quality Satisfaction Rate</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-number" id="rejectionRate">0</span>
                    <span className="hero-stat-label">Product Rejection Rate</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-number" id="certifiedFarmers">0</span>
                    <span className="hero-stat-label">Certified Farmers</span>
                  </div>
                </div>
              </div>

              <div className="hero-visual-content">
                <div className="quality-visualization">
                  <div className="visualization-container">
                    <div className="orbital-system">
                      <div
                        className="central-certification"
                        onMouseEnter={handleCentralMouseEnter}
                        onMouseLeave={handleCentralMouseLeave}
                      >
                        <i className="fas fa-certificate"></i>
                        <div className="central-text">Quality<br />Assured</div>
                      </div>
                      <div className="orbital-path orbital-path-1"></div>
                      <div className="orbital-path orbital-path-2"></div>
                      <div className="connecting-line line-1"></div>
                      <div className="connecting-line line-2"></div>
                      <div className="connecting-line line-3"></div>
                      <div
                        className="orbital-stage stage-1"
                        onMouseEnter={(e) => handleStageMouseEnter(e, 1)}
                        onMouseLeave={(e) => handleStageMouseLeave(e, 1)}
                      >
                        <i className="fas fa-tractor"></i>
                        <span>Farm Verification</span>
                      </div>
                      <div
                        className="orbital-stage stage-2"
                        onMouseEnter={(e) => handleStageMouseEnter(e, 2)}
                        onMouseLeave={(e) => handleStageMouseLeave(e, 2)}
                      >
                        <i className="fas fa-clipboard-check"></i>
                        <span>Quality Inspection</span>
                      </div>
                      <div
                        className="orbital-stage stage-3"
                        onMouseEnter={(e) => handleStageMouseEnter(e, 3)}
                        onMouseLeave={(e) => handleStageMouseLeave(e, 3)}
                      >
                        <i className="fas fa-award"></i>
                        <span>Certification</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Tier Process Section */}
        <section className="tier-process-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our 3-Tier Quality Process</h2>
              <p className="section-subtitle">Comprehensive verification at every stage of the supply chain</p>
            </div>
            <div className="tiers-container">
              {[
                {
                  icon: 'fa-seedling',
                  title: 'Pre-Harvest Verification',
                  desc: 'Quality begins at the farm. Our field officers verify farming practices, soil conditions, and crop health before harvest.',
                  features: ['Soil testing & analysis', 'Water quality verification', 'Farming practice audit', 'Pesticide & fertilizer check', 'Crop health assessment', 'Harvest timing verification'],
                },
                {
                  icon: 'fa-clipboard-check',
                  title: 'Harvest & Post-Harvest Inspection',
                  desc: 'Rigorous inspection during and after harvest to ensure optimal quality and proper handling.',
                  features: ['Harvest quality assessment', 'Grading & sorting verification', 'Packaging standards check', 'Storage condition audit', 'Temperature control monitoring', 'Handling practice verification'],
                },
                {
                  icon: 'fa-truck',
                  title: 'Delivery & Final Verification',
                  desc: 'Final quality check before delivery and verification upon receipt to ensure customer satisfaction.',
                  features: ['Pre-shipment quality check', 'Transport condition monitoring', 'Cold chain verification', 'Final quality certification', 'Customer acceptance verification', 'Feedback collection & analysis'],
                },
              ].map((tier, idx) => (
                <div
                  className="tier-card"
                  key={idx}
                  ref={(el) => (tierCardsRef.current[idx] = el)}
                >
                  <div className="tier-icon">
                    <i className={`fas ${tier.icon}`}></i>
                  </div>
                  <h3 className="tier-title">{tier.title}</h3>
                  <p className="tier-description">{tier.desc}</p>
                  <ul className="tier-features">
                    {tier.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Standards Section */}
        <section className="standards-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Quality Standards & Parameters</h2>
              <p className="section-subtitle">We measure quality across multiple dimensions to ensure excellence</p>
            </div>
            <div className="standards-container">
              {[
                {
                  icon: 'fa-eye',
                  title: 'Physical Quality Parameters',
                  desc: 'Visual and physical characteristics that determine product appearance and market acceptability.',
                  metrics: [
                    { label: 'Size', value: 'Uniform sizing' },
                    { label: 'Color', value: 'Consistent coloring' },
                    { label: 'Shape', value: 'Proper formation' },
                    { label: 'Texture', value: 'Optimal firmness' },
                  ],
                },
                {
                  icon: 'fa-flask',
                  title: 'Chemical Safety Standards',
                  desc: 'Laboratory testing to ensure products are safe and free from harmful chemical residues.',
                  metrics: [
                    { label: 'Pesticides', value: 'Below MRL limits' },
                    { label: 'Heavy Metals', value: 'Safe levels' },
                    { label: 'Nitrates', value: 'Within limits' },
                    { label: 'Additives', value: 'Approved only' },
                  ],
                },
                {
                  icon: 'fa-apple-alt',
                  title: 'Nutritional Quality Metrics',
                  desc: 'Verification of nutritional content to ensure products deliver optimal health benefits.',
                  metrics: [
                    { label: 'Vitamins', value: 'Optimal levels' },
                    { label: 'Minerals', value: 'Rich content' },
                    { label: 'Antioxidants', value: 'High presence' },
                    { label: 'Freshness', value: 'Peak condition' },
                  ],
                },
              ].map((std, idx) => (
                <div
                  className="standard-card"
                  key={idx}
                  ref={(el) => (standardCardsRef.current[idx] = el)}
                >
                  <div className="standard-header">
                    <div className="standard-icon">
                      <i className={`fas ${std.icon}`}></i>
                    </div>
                    <h3 className="standard-title">{std.title}</h3>
                  </div>
                  <p className="standard-description">{std.desc}</p>
                  <div className="standard-metrics">
                    {std.metrics.map((m, i) => (
                      <div className="metric-item" key={i}>
                        <span className="metric-value">{m.label}</span>
                        <span className="metric-label">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certification Section */}
        <section className="certification-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Quality Certification Program</h2>
              <p className="section-subtitle">Recognizing and rewarding farmers who maintain exceptional quality standards</p>
            </div>
            <div className="certification-container">
              <div className="certification-visual">
                <div className="certification-badge">
                  <div className="badge-circle">
                    <i className="fas fa-award badge-icon"></i>
                    <div className="badge-text">Farm Vantara<br />Quality Certified</div>
                  </div>
                </div>
              </div>
              <div className="certification-content">
                <ul className="certification-list">
                  {[
                    {
                      icon: 'fa-star',
                      title: 'Premium Quality Certification',
                      desc: 'Farmers who consistently exceed quality standards receive our Premium Quality Certification, commanding 15-25% higher prices.',
                    },
                    {
                      icon: 'fa-shield-alt',
                      title: 'Quality Assurance Badge',
                      desc: 'Verified quality badge displayed on all products, giving businesses confidence in their procurement decisions.',
                    },
                    {
                      icon: 'fa-chart-line',
                      title: 'Performance Analytics',
                      desc: 'Detailed quality performance reports help farmers understand their strengths and areas for improvement.',
                    },
                    {
                      icon: 'fa-handshake',
                      title: 'Preferred Partner Status',
                      desc: 'Certified farmers get priority matching with premium businesses and access to exclusive market opportunities.',
                    },
                  ].map((item, idx) => (
                    <li
                      className="certification-item"
                      key={idx}
                      ref={(el) => (certificationItemsRef.current[idx] = el)}
                    >
                      <div className="certification-icon">
                        <i className={`fas ${item.icon}`}></i>
                      </div>
                      <h4 className="certification-title">{item.title}</h4>
                      <p className="certification-description">{item.desc}</p>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '40px' }}>
                  <a href="#get-certified" className="btn-quality-primary">
                    <i className="fas fa-certificate"></i> Apply for Certification
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="quality-benefits-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Benefits of Our Quality System</h2>
              <p className="section-subtitle">Creating value for farmers, businesses, and consumers through quality assurance</p>
            </div>
            <div className="benefits-grid">
              {[
                { icon: 'fa-user-tie', title: 'For Farmers', desc: 'Earn 20-40% higher prices for quality-certified produce. Build reputation and access premium markets with verified quality credentials.' },
                { icon: 'fa-building', title: 'For Businesses', desc: 'Reduce quality inspection costs by 60%. Get consistent, verified quality with complete traceability and compliance documentation.' },
                { icon: 'fa-users', title: 'For Consumers', desc: 'Access safe, high-quality produce with verified nutritional value. Make informed purchasing decisions with transparent quality information.' },
                { icon: 'fa-leaf', title: 'For Environment', desc: 'Promote sustainable farming practices. Reduce food waste through better quality management and optimized supply chains.' },
              ].map((benefit, idx) => (
                <div className="benefit-card" key={idx}>
                  <div className="benefit-icon">
                    <i className={`fas ${benefit.icon}`}></i>
                  </div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Stats Section */}
        <section className="quality-stats-section">
          <div className="container">
            <div className="stats-content">
              <div className="section-header" style={{ color: 'white' }}>
                <h2 className="section-title" style={{ color: 'white' }}>Quality Performance Metrics</h2>
                <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Real results from our comprehensive quality assurance system
                </p>
              </div>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">99.2%</span>
                  <span className="stat-label">Quality Satisfaction Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">0.3%</span>
                  <span className="stat-label">Product Rejection Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">8,500+</span>
                  <span className="stat-label">Certified Farmers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1,200+</span>
                  <span className="stat-label">Quality Inspections Daily</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="quality-cta-section" id="get-certified">
          <div className="container">
            <div className="quality-cta-content">
              <h2 className="quality-cta-title">Commit to Quality Excellence</h2>
              <p className="quality-cta-subtitle">
                Join our quality assurance program and start delivering premium products
                that command better prices and build lasting business relationships.
              </p>
              <div className="cta-buttons">
                <a href="/farmers#quality" className="btn-quality-primary">
                  <i className="fas fa-user-tie"></i> Farmer Quality Program
                </a>
                <a href="/business#procurement" className="btn-quality-primary">
                  <i className="fas fa-building"></i> Business Quality Requirements
                </a>
                <a href="/contact" className="btn-quality-secondary">
                  <i className="fas fa-question-circle"></i> Schedule Quality Audit
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
    </div>
  );
};

export default QualityAssurance;