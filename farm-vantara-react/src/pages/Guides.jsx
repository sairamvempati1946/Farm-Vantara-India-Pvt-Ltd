import React, { useState, useEffect, useRef } from 'react';
import '../styles/Guides.css';

const Guides = () => {
  // ---------- State ----------
  const [menuActive, setMenuActive] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeGuide, setActiveGuide] = useState('registration-guide'); // accordion active
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your farming assistant. How can I help you today?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    activeFarmers: 12847,
    totalTransactions: 482000000,
    incomeIncrease: 42,
    paymentTime: 24,
  });
  const [journeyActiveIndex, setJourneyActiveIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState({ reg: 85, pay: 92, cert: 78 });

  // Refs for animations and observers
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const progressRef = useRef(null);
  const navMenuRef = useRef(null);
  const mobileBtnRef = useRef(null);
  const floatingElementsRef = useRef([]);
  const journeyIntervalRef = useRef(null);
  const processIntervalRef = useRef(null);
  const chatBodyRef = useRef(null);

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

  // Journey animation
  useEffect(() => {
    const activatePoints = () => {
      const interval = setInterval(() => {
        setJourneyActiveIndex((prev) => (prev + 1) % 5);
      }, 4000);
      journeyIntervalRef.current = interval;
      return interval;
    };
    const interval = activatePoints();
    // Reset after full cycle
    const resetInterval = setInterval(() => {
      clearInterval(interval);
      setJourneyActiveIndex(0);
      activatePoints();
    }, 20000);
    return () => {
      clearInterval(interval);
      clearInterval(resetInterval);
    };
  }, []);

  // Progress circle animation when in view
  useEffect(() => {
    if (!progressRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate circles (values already set, but we can trigger a re-render with the same values)
            setProgressPercent({ reg: 85, pay: 92, cert: 78 });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(progressRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate counters when stats section in view
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        activeFarmers: prev.activeFarmers + (Math.random() > 0.7 ? 1 : 0),
        totalTransactions: prev.totalTransactions,
        incomeIncrease: Math.max(40, Math.min(45, prev.incomeIncrease + (Math.random() - 0.5) * 0.5)),
        paymentTime: Math.max(22, Math.min(26, prev.paymentTime + (Math.random() - 0.5) * 2)),
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Process steps animation
  useEffect(() => {
    const interval = setInterval(() => {
      // pulse effect is handled by CSS, but we can trigger a re-render if needed
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Floating elements mouse move
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

  // Auto-show chat after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setChatOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Welcome notification
  useEffect(() => {
    showNotification('Welcome to Farming Guides! Explore step-by-step instructions for success.', 'info');
  }, []);

  // ---------- Helper Functions ----------
  const animateStats = () => {
  const duration = 1500; // 1.5 sec animation

  const startValues = {
    activeFarmers: 0,
    totalTransactions: 0,
    incomeIncrease: 0,
    paymentTime: 0,
  };

  const endValues = {
    activeFarmers: 12847,
    totalTransactions: 482000000,
    incomeIncrease: 42,
    paymentTime: 24,
  };

  const startTime = performance.now();

  const animate = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);

    setStats({
      activeFarmers: Math.floor(progress * endValues.activeFarmers),
      totalTransactions: Math.floor(progress * endValues.totalTransactions),
      incomeIncrease: (progress * endValues.incomeIncrease).toFixed(1),
      paymentTime: Math.floor(progress * endValues.paymentTime),
    });

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

  const formatCurrency = (value) => {
    return '₹' + (value / 10000000).toFixed(1) + 'Cr';
  };

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const toggleGuide = (guideId) => {
    setActiveGuide(activeGuide === guideId ? null : guideId);
  };

  const handleCategoryClick = (guideType) => {
    const guideId = guideType + '-guide';
    setActiveGuide(guideId);
    setTimeout(() => {
      document.getElementById(guideId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    // Simulate bot response
    setTimeout(() => {
      const responses = {
        registration: 'Registration takes about 10 minutes. You need Aadhar card, land documents, and bank details. Our field officer visits within 7 days for verification.',
        listing: 'For effective product listings: 1) Take clear photos 2) Write detailed descriptions 3) Set competitive prices 4) Update regularly',
        payment: 'Payments are processed within 24 hours of delivery confirmation. We support bank transfer, UPI, and checks.',
        logistics: 'We provide logistics support including pickup from farm, quality check, packaging, and delivery to buyers.',
        quality: 'Our 3-tier quality verification ensures premium standards. Quality-certified products earn 15-25% higher prices.',
        help: 'I can help with registration, product listing, buyer connections, payments, logistics, and quality certification.',
      };
      const lower = userMsg.toLowerCase();
      let reply = "I'm here to help with farming guides. You can ask about registration, product listing, payments, or logistics.";
      for (const [key, val] of Object.entries(responses)) {
        if (lower.includes(key)) {
          reply = val;
          break;
        }
      }
      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 1000);
  };

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // ---------- JSX ----------
  return (
    <div className="guides-page">
      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((n) => (
          <div key={n.id} className={`notification notification-${n.type}`}>
            <div className="notification-content">
              <i className={`fas fa-${n.type === 'success' ? 'check-circle' : 'info-circle'}`}></i>
              <span>{n.message}</span>
            </div>
            <button
              className="notification-close"
              onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <main id="main-content">
        {/* Guides Hero Section */}
        <section className="guides-hero" ref={heroRef}>
          <div className="floating-elements">
            {['fa-seedling', 'fa-tractor', 'fa-handshake', 'fa-credit-card', 'fa-truck'].map((icon, idx) => (
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
            <div className="guides-hero-content">
              <h1 className="guides-hero-title">Complete Farming Guides</h1>
              <p className="guides-hero-subtitle">
                Step-by-step guides to help you succeed on Farm Vantara. Learn everything from registration
                to receiving payments, with real-time tools and support throughout your journey.
              </p>

              {/* Animated Farmer Journey */}
              <div className="farmer-journey">
                <div className="journey-track"></div>
                <div className="journey-points">
                  {['Register', 'List Products', 'Connect', 'Transaction', 'Logistics'].map((label, idx) => (
                    <div key={idx} className={`journey-point ${journeyActiveIndex === idx ? 'active' : ''}`}>
                      <div className="point-circle">
                        <i className={`fas fa-${idx === 0 ? 'user-plus' : idx === 1 ? 'list' : idx === 2 ? 'handshake' : idx === 3 ? 'credit-card' : 'truck'}`}></i>
                      </div>
                      <div className="point-label">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="journey-farmer">
                  <div className="farmer-icon">
                    <i className="fas fa-user-tie"></i>
                  </div>
                </div>
              </div>

              {/* Real-time Progress Indicators */}
              <div className="progress-indicators" ref={progressRef}>
                {[
                  { label: 'Registration Success', percent: progressPercent.reg },
                  { label: 'Timely Payments', percent: progressPercent.pay },
                  { label: 'Quality Certified', percent: progressPercent.cert },
                ].map((item, idx) => {
                  const circumference = 251.2; // 2 * π * 40
                  const offset = circumference - (item.percent / 100) * circumference;
                  return (
                    <div className="progress-indicator" key={idx}>
                      <div className="progress-circle">
                        <svg viewBox="0 0 100 100">
                          <circle className="progress-circle-bg" cx="50" cy="50" r="40"></circle>
                          <circle
                            className="progress-circle-fill"
                            cx="50"
                            cy="50"
                            r="40"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                          ></circle>
                        </svg>
                        <div className="progress-value">{item.percent}%</div>
                      </div>
                      <div className="progress-label">{item.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Guide Categories */}
        <section className="guide-categories">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Essential Farming Guides</h2>
              <p className="section-subtitle">Comprehensive resources covering every aspect of your Farm Vantara journey</p>
            </div>

            <div className="categories-grid">
              {[
                { guide: 'registration', icon: 'fa-user-plus', title: 'Registration Process', desc: 'Complete guide to registering on Farm Vantara, document requirements, verification process, and profile setup for maximum visibility.' },
                { guide: 'listing', icon: 'fa-list-alt', title: 'Product Listing Guide', desc: 'Learn how to create compelling product listings, set optimal prices, upload quality photos, and use keywords for better visibility.' },
                { guide: 'buyers', icon: 'fa-handshake', title: 'Connecting with Buyers', desc: 'Strategies for connecting with quality buyers, negotiation best practices, building long-term relationships, and understanding buyer requirements.' },
              ].map((cat, idx) => (
                <div
                  key={idx}
                  className={`category-card ${activeGuide?.startsWith(cat.guide) ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.guide)}
                >
                  <div className="category-icon">
                    <i className={`fas ${cat.icon}`}></i>
                  </div>
                  <h3 className="category-title">{cat.title}</h3>
                  <p className="category-description">{cat.desc}</p>
                  <div className="category-steps">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="step-indicator"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Real-time Farmer Stats */}
        <section className="farmer-stats" ref={statsRef}>
          <div className="container">
            <div className="stats-content">
              <div className="section-header" style={{ color: 'white' }}>
                <h2 className="section-title" style={{ color: 'white' }}>Real-time Farmer Success</h2>
                <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Live statistics showing farmer success on our platform
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon"><i className="fas fa-user-tie"></i></div>
                  <span className="stat-number" id="activeFarmers">{stats.activeFarmers.toLocaleString()}</span>
                  <span className="stat-label">Active Farmers</span>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"><i className="fas fa-rupee-sign"></i></div>
                  <span className="stat-number" id="totalTransactions">{formatCurrency(stats.totalTransactions)}</span>
                  <span className="stat-label">Total Transactions</span>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"><i className="fas fa-percentage"></i></div>
                  <span className="stat-number" id="incomeIncrease">{stats.incomeIncrease}%</span>
                  <span className="stat-label">Avg. Income Increase</span>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"><i className="fas fa-clock"></i></div>
                  <span className="stat-number" id="paymentTime">{stats.paymentTime}hrs</span>
                  <span className="stat-label">Avg. Payment Time</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Guides Section */}
        <section className="detailed-guides">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Step-by-Step Guides</h2>
              <p className="section-subtitle">Detailed instructions for each stage of your Farm Vantara journey</p>
            </div>

            <div className="guide-accordion">
              {/* Guide 1: Registration Process */}
              <div className={`guide-item ${activeGuide === 'registration-guide' ? 'active' : ''}`} id="registration-guide">
                <div className="guide-header" onClick={() => toggleGuide('registration-guide')}>
                  <div className="guide-header-content">
                    <div className="guide-number">1</div>
                    <h3 className="guide-title">Complete Registration Process</h3>
                  </div>
                  <div className="guide-toggle">
                    <i className="fas fa-chevron-down"></i>
                  </div>
                </div>
                <div className="guide-content">
                  <div className="guide-body">
                    <div className="guide-section">
                      <h4 className="guide-section-title">Registration Requirements</h4>
                      <ol className="guide-steps">
                        <li className="guide-step">
                          <div className="step-title">Basic Information</div>
                          <div className="step-description">Full name, contact number, email address, and Aadhar card for verification</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Farm Details</div>
                          <div className="step-description">Land documents (7/12 extract), farm location, size, and soil type information</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Bank Account</div>
                          <div className="step-description">Active bank account details for direct payments (account number, IFSC code)</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Quality Certification</div>
                          <div className="step-description">Optional: Any existing quality certifications or organic farming certificates</div>
                        </li>
                      </ol>
                    </div>
                    <div className="guide-section">
                      <h4 className="guide-section-title">Registration Steps</h4>
                      <ol className="guide-steps">
                        <li className="guide-step">
                          <div className="step-title">Visit Farm Vantara Website/App</div>
                          <div className="step-description">Go to farmvantara.com or download our mobile app from Play Store</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Click "Register as Farmer"</div>
                          <div className="step-description">Fill in basic details and create your account with secure password</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Document Upload</div>
                          <div className="step-description">Upload required documents (Aadhar, land documents, bank details)</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Quality Verification Visit</div>
                          <div className="step-description">Our field officer will visit your farm for verification within 7 days</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Account Activation</div>
                          <div className="step-description">Receive confirmation and start listing your products immediately</div>
                        </li>
                      </ol>
                    </div>
                    <div className="guide-section">
                      <h4 className="guide-section-title">Tips for Successful Registration</h4>
                      <ul style={{ listStyle: 'none', margin: '20px 0' }}>
                        <li style={{ marginBottom: '10px', paddingLeft: '25px', position: 'relative' }}>
                          <i className="fas fa-check-circle" style={{ position: 'absolute', left: 0, color: 'var(--primary-green)' }}></i>
                          <span style={{ color: 'var(--text-light)' }}>Keep all documents ready before starting registration</span>
                        </li>
                        <li style={{ marginBottom: '10px', paddingLeft: '25px', position: 'relative' }}>
                          <i className="fas fa-check-circle" style={{ position: 'absolute', left: 0, color: 'var(--primary-green)' }}></i>
                          <span style={{ color: 'var(--text-light)' }}>Ensure good mobile network for OTP verification</span>
                        </li>
                        <li style={{ marginBottom: '10px', paddingLeft: '25px', position: 'relative' }}>
                          <i className="fas fa-check-circle" style={{ position: 'absolute', left: 0, color: 'var(--primary-green)' }}></i>
                          <span style={{ color: 'var(--text-light)' }}>Choose clear, readable photos for document upload</span>
                        </li>
                        <li style={{ marginBottom: '10px', paddingLeft: '25px', position: 'relative' }}>
                          <i className="fas fa-check-circle" style={{ position: 'absolute', left: 0, color: 'var(--primary-green)' }}></i>
                          <span style={{ color: 'var(--text-light)' }}>Be available for field officer visit during scheduled time</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guide 2: Product Listing */}
              <div className={`guide-item ${activeGuide === 'listing-guide' ? 'active' : ''}`} id="listing-guide">
                <div className="guide-header" onClick={() => toggleGuide('listing-guide')}>
                  <div className="guide-header-content">
                    <div className="guide-number">2</div>
                    <h3 className="guide-title">Product Listing & Pricing Guide</h3>
                  </div>
                  <div className="guide-toggle">
                    <i className="fas fa-chevron-down"></i>
                  </div>
                </div>
                <div className="guide-content">
                  <div className="guide-body">
                    <div className="guide-section">
                      <h4 className="guide-section-title">Creating Effective Product Listings</h4>
                      <ol className="guide-steps">
                        <li className="guide-step">
                          <div className="step-title">Product Photography</div>
                          <div className="step-description">Take clear, well-lit photos from multiple angles. Include scale reference (coin/scale) for size.</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Detailed Description</div>
                          <div className="step-description">Include variety, size, color, freshness, harvesting date, and special features.</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Quality Specifications</div>
                          <div className="step-description">Specify grade (A, B, C), packaging type, minimum order quantity, and shelf life.</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Keywords & Tags</div>
                          <div className="step-description">Use relevant keywords like "organic", "fresh", "premium quality" for better search visibility.</div>
                        </li>
                      </ol>
                    </div>
                    <div className="guide-section">
                      <h4 className="guide-section-title">Pricing Strategy</h4>
                      <ol className="guide-steps">
                        <li className="guide-step">
                          <div className="step-title">Market Research</div>
                          <div className="step-description">Check current market prices on Farm Vantara and local markets for similar products.</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Cost Calculation</div>
                          <div className="step-description">Include all costs: production, labor, packaging, transportation, and platform commission.</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Competitive Pricing</div>
                          <div className="step-description">Set prices 15-25% higher than traditional markets but remain competitive on platform.</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Seasonal Adjustments</div>
                          <div className="step-description">Adjust prices based on seasonality, demand trends, and competitor pricing.</div>
                        </li>
                      </ol>
                    </div>
                    <div className="guide-section">
                      <h4 className="guide-section-title">Listing Best Practices</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        <div style={{ background: 'rgba(39,174,96,0.05)', padding: '20px', borderRadius: '10px' }}>
                          <h5 style={{ color: 'var(--primary-green)', marginBottom: '10px' }}><i className="fas fa-check-circle"></i> Do's</h5>
                          <ul style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                            <li>Update listings regularly</li>
                            <li>Respond to queries quickly</li>
                            <li>Maintain consistent quality</li>
                            <li>Offer bulk discounts</li>
                          </ul>
                        </div>
                        <div style={{ background: 'rgba(242,153,74,0.05)', padding: '20px', borderRadius: '10px' }}>
                          <h5 style={{ color: '#f2994a', marginBottom: '10px' }}><i className="fas fa-times-circle"></i> Don'ts</h5>
                          <ul style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                            <li>Don't use stock photos</li>
                            <li>Don't exaggerate quality</li>
                            <li>Don't ignore buyer reviews</li>
                            <li>Don't delay updates</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guide 3: Connecting with Buyers */}
              <div className={`guide-item ${activeGuide === 'buyers-guide' ? 'active' : ''}`} id="buyers-guide">
                <div className="guide-header" onClick={() => toggleGuide('buyers-guide')}>
                  <div className="guide-header-content">
                    <div className="guide-number">3</div>
                    <h3 className="guide-title">Connecting with Quality Buyers</h3>
                  </div>
                  <div className="guide-toggle">
                    <i className="fas fa-chevron-down"></i>
                  </div>
                </div>
                <div className="guide-content">
                  <div className="guide-body">
                    <div className="guide-section">
                      <h4 className="guide-section-title">Finding the Right Buyers</h4>
                      <ol className="guide-steps">
                        <li className="guide-step">
                          <div className="step-title">Buyer Search & Filter</div>
                          <div className="step-description">Use filters to find buyers by location, purchase volume, product requirements, and ratings.</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Buyer Verification</div>
                          <div className="step-description">Check buyer verification status, transaction history, and reviews from other farmers.</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Direct Communication</div>
                          <div className="step-description">Use in-app messaging to discuss requirements, pricing, and delivery schedules.</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Building Relationships</div>
                          <div className="step-description">Focus on consistent quality and reliability to build long-term buyer relationships.</div>
                        </li>
                      </ol>
                    </div>
                    <div className="guide-section">
                      <h4 className="guide-section-title">Negotiation Strategies</h4>
                      <ol className="guide-steps">
                        <li className="guide-step">
                          <div className="step-title">Know Your Minimum Price</div>
                          <div className="step-description">Calculate your break-even point and set a clear minimum acceptable price.</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Value Proposition</div>
                          <div className="step-description">Highlight your quality advantages, certifications, and reliable supply capability.</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Bulk Discounts</div>
                          <div className="step-description">Offer tiered pricing for larger orders to encourage higher volume purchases.</div>
                        </li>
                        <li className="guide-step">
                          <div className="step-title">Long-term Contracts</div>
                          <div className="step-description">Consider lower prices for guaranteed long-term contracts with reliable buyers.</div>
                        </li>
                      </ol>
                    </div>
                    <div className="guide-section">
                      <h4 className="guide-section-title">Communication Best Practices</h4>
                      <div style={{ background: 'rgba(39,174,96,0.05)', padding: '25px', borderRadius: '15px', marginTop: '20px' }}>
                        <h5 style={{ color: 'var(--primary-green)', marginBottom: '15px' }}><i className="fas fa-comments"></i> Effective Communication Tips</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                          <div>
                            <h6 style={{ color: 'var(--text-dark)', marginBottom: '5px', fontSize: '0.9rem' }}>Response Time</h6>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Respond within 2 hours during business hours</p>
                          </div>
                          <div>
                            <h6 style={{ color: 'var(--text-dark)', marginBottom: '5px', fontSize: '0.9rem' }}>Professional Language</h6>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Use clear, professional communication</p>
                          </div>
                          <div>
                            <h6 style={{ color: 'var(--text-dark)', marginBottom: '5px', fontSize: '0.9rem' }}>Follow-up</h6>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Follow up on inquiries within 24 hours</p>
                          </div>
                          <div>
                            <h6 style={{ color: 'var(--text-dark)', marginBottom: '5px', fontSize: '0.9rem' }}>Documentation</h6>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Keep records of all communications</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-time Process Visualization */}
        <section className="process-visualization">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Real-time Transaction Process</h2>
              <p className="section-subtitle">Visual guide showing how transactions work on Farm Vantara</p>
            </div>

            <div className="process-container">
              <div className="process-circle"></div>

              {/* Step 1 */}
              <div className="process-step">
                <div className="process-step-icon">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <div className="process-step-label">Order Confirmation</div>
              </div>

              {/* Step 2 */}
              <div className="process-step">
                <div className="process-step-icon">
                  <i className="fas fa-truck-loading"></i>
                </div>
                <div className="process-step-label">Harvest & Packing</div>
              </div>

              {/* Step 3 */}
              <div className="process-step">
                <div className="process-step-icon">
                  <i className="fas fa-shipping-fast"></i>
                </div>
                <div className="process-step-label">Quality Check & Dispatch</div>
              </div>

              {/* Step 4 */}
              <div className="process-step">
                <div className="process-step-icon">
                  <i className="fas fa-rupee-sign"></i>
                </div>
                <div className="process-step-label">Payment Processing</div>
              </div>

              {/* Center */}
              <div className="process-center">
                <div className="center-icon">
                  <i className="fas fa-sync-alt"></i>
                </div>
                <div className="center-label">Real-time Tracking</div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Tools Section */}
        <section className="tools-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Interactive Farming Tools</h2>
              <p className="section-subtitle">Practical tools to help you succeed on Farm Vantara</p>
            </div>

            <div className="tools-grid">
              {[
                {
                  icon: 'fa-calculator',
                  title: 'Pricing Calculator',
                  desc: 'Calculate optimal prices based on your costs, market rates, and desired profit margins. Get real-time price suggestions for different crops.',
                  button: 'Try Calculator'
                },
                {
                  icon: 'fa-calendar-alt',
                  title: 'Harvest Planner',
                  desc: 'Plan your harvest schedule based on crop cycles, market demand predictions, and weather forecasts for maximum profitability.',
                  button: 'Start Planning'
                },
                {
                  icon: 'fa-chart-bar',
                  title: 'Market Analytics',
                  desc: 'Access real-time market trends, price fluctuations, and demand predictions for various crops across different regions.',
                  button: 'View Analytics'
                },
              ].map((tool, idx) => (
                <div className="tool-card" key={idx}>
                  <div className="tool-icon"><i className={`fas ${tool.icon}`}></i></div>
                  <h3 className="tool-title">{tool.title}</h3>
                  <p className="tool-description">{tool.desc}</p>
                  <a href="#tool" className="tool-action" onClick={(e) => e.preventDefault()}>
                    {tool.button} <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>



      {/* WhatsApp Float */}
      <a href="https://wa.me/919553774933" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Support Chat */}
      <div className={`support-chat ${chatOpen ? 'active' : ''}`} id="supportChat">
        <div className="chat-header">
          <div className="chat-title">
            <i className="fas fa-robot"></i> Farmer Assistant
          </div>
          <button className="chat-close" onClick={() => setChatOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="chat-body" ref={chatBodyRef}>
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.sender}`}>
              <div className="message-avatar">
                <i className={`fas fa-${msg.sender === 'bot' ? 'robot' : 'user'}`}></i>
              </div>
              <div className="message-content">
                <div className="message-text">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
          />
          <button className="chat-send" onClick={sendChatMessage}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Guides;