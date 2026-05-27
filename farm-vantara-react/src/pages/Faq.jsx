import React, { useState, useEffect, useRef } from 'react';
import '../styles/Faq.css';

const Faq = () => {
  // ---------- State ----------
  const [menuActive, setMenuActive] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItemId, setOpenItemId] = useState(1); // first item open by default
  const [typingVisible, setTypingVisible] = useState(false);
  const [stats, setStats] = useState({
    answeredQuestions: 0,
    responseTime: 0,
    satisfactionRate: 0,
    activeSupport: '24/7'
  });

  // ---------- FAQ Data ----------
  const categories = [
    { id: 'farmers', name: 'For Farmers', icon: 'fa-user-tie', count: 15 },
    { id: 'business', name: 'For Businesses', icon: 'fa-building', count: 12 },
    { id: 'quality', name: 'Quality Assurance', icon: 'fa-award', count: 10 },
    { id: 'payments', name: 'Payments & Pricing', icon: 'fa-credit-card', count: 8 },
    { id: 'logistics', name: 'Logistics & Delivery', icon: 'fa-truck', count: 7 },
    { id: 'account', name: 'Account & Settings', icon: 'fa-user-circle', count: 6 }
  ];

  const faqItems = [
    {
      id: 1,
      category: 'farmers',
      question: 'How does Farm Vantara benefit farmers compared to traditional markets?',
      answer: (
        <>
          <p>Farm Vantara offers several key benefits for farmers:</p>
          <ul>
            <li><strong>Better Prices:</strong> Eliminate middlemen to earn 20-40% higher prices for your produce</li>
            <li><strong>Direct Market Access:</strong> Connect directly with businesses, restaurants, and retailers</li>
            <li><strong>Quality Premiums:</strong> Earn additional income through our quality certification program</li>
            <li><strong>Transparent Pricing:</strong> Know exactly what you'll earn before harvest</li>
            <li><strong>Timely Payments:</strong> Receive payments within 24 hours of delivery verification</li>
            <li><strong>Market Insights:</strong> Get data-driven recommendations on what to grow and when</li>
          </ul>
        </>
      )
    },
    {
      id: 2,
      category: 'farmers',
      question: 'What is the registration process for farmers?',
      answer: (
        <>
          <p>The registration process is simple and takes less than 10 minutes:</p>
          <ol>
            <li>Visit our website or download the Farm Vantara app</li>
            <li>Click "Register as Farmer" and provide basic information</li>
            <li>Submit land documents and farming details</li>
            <li>Complete the quality verification process (our team will visit your farm)</li>
            <li>Get approved and start listing your produce</li>
          </ol>
          <p>Our field officers will guide you through every step of the process.</p>
        </>
      )
    },
    {
      id: 3,
      category: 'business',
      question: 'How can businesses ensure consistent quality through Farm Vantara?',
      answer: (
        <>
          <p>Farm Vantara ensures consistent quality through:</p>
          <ul>
            <li><strong>3-Tier Quality Verification:</strong> Farm inspection, harvest check, and final certification</li>
            <li><strong>Quality Standards:</strong> All produce meets predefined quality parameters</li>
            <li><strong>Certified Farmers:</strong> Work only with farmers who maintain quality standards</li>
            <li><strong>Real-time Tracking:</strong> Monitor quality metrics throughout the supply chain</li>
            <li><strong>Quality Guarantee:</strong> We stand behind the quality of every product</li>
            <li><strong>Feedback System:</strong> Continuous improvement based on business feedback</li>
          </ul>
        </>
      )
    },
    {
      id: 4,
      category: 'business',
      question: 'What types of businesses can benefit from Farm Vantara?',
      answer: (
        <>
          <p>Farm Vantara serves a wide range of businesses including:</p>
          <ul>
            <li><strong>Restaurants & Hotels:</strong> Source fresh, quality ingredients directly</li>
            <li><strong>Retail Chains:</strong> Stock fresh produce with complete traceability</li>
            <li><strong>Food Processors:</strong> Procure raw materials with consistent quality</li>
            <li><strong>Catering Services:</strong> Get reliable supply for events and functions</li>
            <li><strong>Institutions:</strong> Schools, hospitals, and corporate cafeterias</li>
            <li><strong>Exporters:</strong> Access export-quality produce with certification</li>
          </ul>
        </>
      )
    },
    {
      id: 5,
      category: 'quality',
      question: 'What is the 3-tier quality verification process?',
      answer: (
        <>
          <p>Our comprehensive quality verification includes:</p>
          <ol>
            <li><strong>Tier 1: Pre-Harvest Verification</strong>
              <ul>
                <li>Soil testing and analysis</li>
                <li>Water quality verification</li>
                <li>Farming practice audit</li>
                <li>Crop health assessment</li>
              </ul>
            </li>
            <li><strong>Tier 2: Harvest & Post-Harvest Inspection</strong>
              <ul>
                <li>Harvest quality grading</li>
                <li>Packaging standards check</li>
                <li>Storage condition audit</li>
                <li>Temperature control monitoring</li>
              </ul>
            </li>
            <li><strong>Tier 3: Delivery & Final Verification</strong>
              <ul>
                <li>Pre-shipment quality check</li>
                <li>Transport condition monitoring</li>
                <li>Final quality certification</li>
                <li>Customer acceptance verification</li>
              </ul>
            </li>
          </ol>
        </>
      )
    },
    {
      id: 6,
      category: 'payments',
      question: 'How and when do farmers get paid?',
      answer: (
        <>
          <p>Farm Vantara ensures timely and transparent payments:</p>
          <ul>
            <li><strong>Payment Timeline:</strong> Farmers receive payment within 24 hours of delivery verification</li>
            <li><strong>Payment Methods:</strong> Direct bank transfer, UPI, or check as per preference</li>
            <li><strong>Transparent Pricing:</strong> Farmers know the exact price before agreeing to sell</li>
            <li><strong>Quality Premiums:</strong> Additional payment for certified quality produce</li>
            <li><strong>No Hidden Charges:</strong> Clear commission structure with no surprises</li>
            <li><strong>Payment Protection:</strong> Secure escrow system ensures payment security</li>
          </ul>
          <p>We process payments every weekday, with weekend deliveries paid on Monday.</p>
        </>
      )
    },
    {
      id: 7,
      category: 'logistics',
      question: 'How does the logistics and delivery system work?',
      answer: (
        <>
          <p>Our efficient logistics system ensures fresh delivery:</p>
          <ol>
            <li><strong>Collection:</strong> Our logistics team collects produce from farms</li>
            <li><strong>Quality Check:</strong> Final verification at our collection centers</li>
            <li><strong>Packaging:</strong> Proper packaging for freshness and safety</li>
            <li><strong>Transport:</strong> Temperature-controlled vehicles for perishables</li>
            <li><strong>Tracking:</strong> Real-time tracking available for businesses</li>
            <li><strong>Delivery:</strong> Timely delivery to business locations</li>
          </ol>
          <p>We have partnerships with leading logistics providers to ensure reliable delivery across India.</p>
        </>
      )
    },
    {
      id: 8,
      category: 'account',
      question: 'How do I manage my account and settings?',
      answer: (
        <>
          <p>Account management is easy through our platform:</p>
          <ul>
            <li><strong>Profile Management:</strong> Update personal and business information anytime</li>
            <li><strong>Notification Settings:</strong> Customize alerts for orders, payments, and updates</li>
            <li><strong>Payment Preferences:</strong> Set preferred payment methods and bank details</li>
            <li><strong>Communication Preferences:</strong> Choose how you want to be contacted</li>
            <li><strong>Document Management:</strong> Upload and manage required documents securely</li>
            <li><strong>Privacy Settings:</strong> Control what information is visible to others</li>
          </ul>
          <p>All account settings can be managed through the dashboard on our website or mobile app.</p>
        </>
      )
    }
  ];

  // ---------- Derived data ----------
  const filteredItems = faqItems.filter(item =>
    (activeCategory === 'all' || item.category === activeCategory) &&
    (searchTerm === '' ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof item.answer === 'string' ? item.answer.toLowerCase().includes(searchTerm.toLowerCase()) : true))
  );

  // ---------- Refs ----------
  const headerRef = useRef(null);
  const navMenuRef = useRef(null);
  const mobileBtnRef = useRef(null);
  const heroRef = useRef(null);
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

  // Animate hero stats when in view
  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {

            animateValue("answeredQuestions", 0, 2500, 1500);
            animateValue("responseTime", 0, 2.9, 1500, true);
            animateValue("satisfactionRate", 0, 98.7, 1500, true);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(heroRef.current);

    return () => observer.disconnect();
  }, []);


  const animateValue = (key, start, end, duration, isDecimal = false) => {
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      let value = Math.min(start + (end - start) * (progress / duration), end);

      setStats(prev => ({
        ...prev,
        [key]: isDecimal ? Number(value.toFixed(1)) : Math.floor(value)
      }));

      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };
  // Real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        responseTime: Math.max(1.5, Math.min(4, prev.responseTime + (Math.random() - 0.5) * 0.3)),
        activeSupport: new Date().getHours() >= 6 && new Date().getHours() < 22 ? 'Online Now' : '24/7'
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Simulate typing indicator occasionally
  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7 && !typingVisible) {
        setTypingVisible(true);
        setTimeout(() => setTypingVisible(false), 1500);
      }
    }, 10000);
    return () => clearInterval(typingInterval);
  }, [typingVisible]);

  // Floating elements mouse move effect
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

  // Keyboard navigation for FAQ items
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredItems.length === 0) return;
        const currentIndex = filteredItems.findIndex(item => item.id === openItemId);
        let nextIndex;
        if (e.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % filteredItems.length;
        } else {
          nextIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        }
        if (currentIndex !== -1) {
          setOpenItemId(filteredItems[nextIndex].id);
          const element = document.getElementById(`faq-${filteredItems[nextIndex].id}`);
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, openItemId]);

  // ---------- Handlers ----------
  const toggleFaq = (id) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchTerm('');
    document.querySelector('.faq-accordion-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setActiveCategory('all');
  };

  const handleStartChat = (e) => {
    e.preventDefault();
    setTypingVisible(true);
    setTimeout(() => {
      setTypingVisible(false);
      window.open('https://wa.me/919553774933', '_blank');
    }, 2000);
  };

  // ---------- JSX ----------
  return (
    <>
      {/* Main Content */}
      <main id="main-content">
        {/* FAQ Hero Section */}
        <section className="faq-hero" ref={heroRef}>
          <div className="floating-elements">
            {['fa-question-circle', 'fa-lightbulb', 'fa-comments', 'fa-hands-helping', 'fa-headset'].map((icon, idx) => (
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
            <div className="faq-hero-content">
              <h1 className="faq-hero-title">Frequently Asked Questions</h1>
              <p className="faq-hero-subtitle">
                Find answers to common questions about Farm Vantara. Can't find what you're looking for?
                Our support team is ready to help you 24/7.
              </p>

              {/* FAQ Stats */}
              <div className="faq-stats">
                <div className="faq-stat-item">
                  <span className="faq-stat-number" id="answeredQuestions">{stats.answeredQuestions}+</span>
                  <span className="faq-stat-label">Questions Answered</span>
                </div>
                <div className="faq-stat-item">
                  <span className="faq-stat-number" id="responseTime">{stats.responseTime.toFixed(1)}</span>
                  <span className="faq-stat-label">Avg. Response Time (min)</span>
                </div>
                <div className="faq-stat-item">
                  <span className="faq-stat-number" id="satisfactionRate">{stats.satisfactionRate}%</span>
                  <span className="faq-stat-label">User Satisfaction</span>
                </div>
                <div className="faq-stat-item">
                  <span className="faq-stat-number" id="activeSupport">{stats.activeSupport}</span>
                  <span className="faq-stat-label">Support Available</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Search Section */}
        <section className="faq-search-section">
          <div className="container">
            <div className="search-container">
              <input
                type="text"
                className="faq-search"
                id="faqSearch"
                placeholder="Search for answers... (e.g., 'payment', 'quality', 'registration')"
                value={searchTerm}
                onChange={handleSearch}
              />
              <i className="fas fa-search search-icon"></i>
              <p className="search-hint">Type your question above or browse categories below</p>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="faq-categories">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle">Find answers organized by topics that matter to you</p>
            </div>

            <div className="categories-grid">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`category-card ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <div className="category-icon">
                    <i className={`fas ${cat.icon}`}></i>
                  </div>
                  <h3 className="category-title">{cat.name}</h3>
                  <span className="category-count">{cat.count} Questions</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="faq-accordion-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Most Common Questions</h2>
              <p className="section-subtitle">Answers to questions our users ask most frequently</p>
            </div>

            <div className="faq-accordion" id="faqAccordion">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  id={`faq-${item.id}`}
                  className={`faq-item ${openItemId === item.id ? 'active' : ''}`}
                  data-category={item.category}
                >
                  <div className="faq-question" onClick={() => toggleFaq(item.id)}>
                    <span className="question-text">{item.question}</span>
                    <div className="question-icon">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                  <div className="faq-answer">
                    <div className="answer-content">{item.answer}</div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>No matching questions found.</p>
              )}
            </div>
          </div>
        </section>

        {/* Live Support Section */}
        <section className="live-support-section">
          <div className="live-chat-indicator">
            <div className="chat-bubble">
              <div className="chat-dots">
                <div className="chat-dot"></div>
                <div className="chat-dot"></div>
                <div className="chat-dot"></div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="support-content">
              <h2 className="support-title">Still Have Questions?</h2>
              <p className="support-subtitle">
                Our support team is available 24/7 to help you with any questions or concerns.
                Get real-time assistance through chat, phone, or email.
              </p>

              <div className="support-stats">
                <div className="support-stat">
                  <span className="support-stat-number">24/7</span>
                  <span className="support-stat-label">Support Available</span>
                </div>
                <div className="support-stat">
                  <span className="support-stat-number">2.5 min</span>
                  <span className="support-stat-label">Avg Response Time</span>
                </div>
                <div className="support-stat">
                  <span className="support-stat-number">98.7%</span>
                  <span className="support-stat-label">Satisfaction Rate</span>
                </div>
              </div>

              <div className="support-buttons">
                <a href="https://wa.me/919553774933" className="btn-support btn-support-primary" target="_blank" rel="noopener noreferrer" id="startChat" onClick={handleStartChat}>
                  <i className="fab fa-whatsapp"></i> Start Live Chat
                </a>
                <a href="tel:+919553774933" className="btn-support btn-support-secondary">
                  <i className="fas fa-phone"></i> Call Now
                </a>
                <a href="mailto:support@farmvantara.com" className="btn-support btn-support-secondary">
                  <i className="fas fa-envelope"></i> Email Support
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="community-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Join Our Growing Community</h2>
              <p className="section-subtitle">Connect with thousands of farmers and businesses using Farm Vantara</p>
            </div>

            <div className="community-grid">
              <div className="community-card">
                <div className="community-icon"><i className="fas fa-users"></i></div>
                <h3 className="community-title">Farmer Community</h3>
                <p className="community-description">
                  Connect with other farmers, share experiences, and learn best practices
                  from successful farming communities across India.
                </p>
                <div className="community-metrics">
                  <div className="community-metric">
                    <span className="metric-number">12,500+</span>
                    <span className="metric-label">Active Farmers</span>
                  </div>
                  <div className="community-metric">
                    <span className="metric-number">85%</span>
                    <span className="metric-label">Income Increase</span>
                  </div>
                </div>
              </div>
              <div className="community-card">
                <div className="community-icon"><i className="fas fa-building"></i></div>
                <h3 className="community-title">Business Network</h3>
                <p className="community-description">
                  Join our network of businesses and restaurants that value quality,
                  transparency, and reliable supply chains.
                </p>
                <div className="community-metrics">
                  <div className="community-metric">
                    <span className="metric-number">2,800+</span>
                    <span className="metric-label">Business Partners</span>
                  </div>
                  <div className="community-metric">
                    <span className="metric-number">30%</span>
                    <span className="metric-label">Cost Savings</span>
                  </div>
                </div>
              </div>
              <div className="community-card">
                <div className="community-icon"><i className="fas fa-graduation-cap"></i></div>
                <h3 className="community-title">Learning Hub</h3>
                <p className="community-description">
                  Access training materials, webinars, and resources to improve your
                  farming practices or business operations.
                </p>
                <div className="community-metrics">
                  <div className="community-metric">
                    <span className="metric-number">500+</span>
                    <span className="metric-label">Resources</span>
                  </div>
                  <div className="community-metric">
                    <span className="metric-number">95%</span>
                    <span className="metric-label">Satisfaction Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


      {/* WhatsApp Float */}
      <a href="https://wa.me/919553774933" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Typing Indicator */}
      <div className={`typing-indicator ${typingVisible ? 'active' : ''}`} id="typingIndicator">
        <div className="typing-text">Support agent is typing...</div>
        <div className="typing-dots">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </>
  );
};

export default Faq;