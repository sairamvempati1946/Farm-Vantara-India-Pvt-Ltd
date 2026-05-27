import React, { useState, useEffect, useRef } from 'react';
import '../styles/Algorithm.css';

const Algorithm = () => {
  // ---------- State ----------
  const [menuActive, setMenuActive] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [counters, setCounters] = useState({
    matchAccuracy: 0,
    avgTime: 0,
    successRate: 0,
  });

  // Refs for animations and observers
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const navMenuRef = useRef(null);
  const mobileBtnRef = useRef(null);
  const floatingElementsRef = useRef([]);
  const nodeRefs = useRef([]);

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

  // Canvas drawing for connection lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawLines = () => {
      const ctx = canvas.getContext('2d');
      const center = { x: canvas.width / 2, y: canvas.height / 2 };

      // Get node positions relative to canvas
      const nodes = nodeRefs.current;
      const positions = [];
      nodes.forEach((node) => {
        if (node) {
          const rect = node.getBoundingClientRect();
          const canvasRect = canvas.getBoundingClientRect();
          positions.push({
            x: rect.left + rect.width / 2 - canvasRect.left,
            y: rect.top + rect.height / 2 - canvasRect.top,
          });
        }
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw lines from center to each node
      positions.forEach((pos) => {
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Animated pulse along the line
        const dx = pos.x - center.x;
        const dy = pos.y - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const pulseDistance = (Date.now() / 20) % distance;

        const pulseX = center.x + (dx / distance) * pulseDistance;
        const pulseY = center.y + (dy / distance) * pulseDistance;

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#667eea';
        ctx.fill();
      });

      // Draw center glow
      const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 80);
      gradient.addColorStop(0, 'rgba(102, 126, 234, 0.6)');
      gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');
      ctx.beginPath();
      ctx.arc(center.x, center.y, 80, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(drawLines);
    };

    drawLines();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Intersection Observer for process steps and criteria cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.process-step, .criteria-card').forEach((el) => {
      el.classList.add('animate-ready');
      observer.observe(el);
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
          el.style.transform = `translate(${x}px, ${y}px)`;
        }
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Node hover effects (CSS handles scaling, but we can add additional logic if needed)
  // No extra JS needed – we'll rely on CSS :hover in the stylesheet.

  // ---------- Helper Functions ----------
  const animateCounters = () => {
    const targets = { matchAccuracy: 98.5, avgTime: 2.3, successRate: 99.7 };
    const duration = 2000;
    const steps = 60;
    const increment = {
      matchAccuracy: targets.matchAccuracy / steps,
      avgTime: targets.avgTime / steps,
      successRate: targets.successRate / steps,
    };
    let current = { matchAccuracy: 0, avgTime: 0, successRate: 0 };
    const interval = setInterval(() => {
      current.matchAccuracy += increment.matchAccuracy;
      current.avgTime += increment.avgTime;
      current.successRate += increment.successRate;
      if (current.matchAccuracy >= targets.matchAccuracy) {
        setCounters(targets);
        clearInterval(interval);
      } else {
        setCounters({
          matchAccuracy: current.matchAccuracy,
          avgTime: current.avgTime,
          successRate: current.successRate,
        });
      }
    }, duration / steps);
  };

  // ---------- JSX ----------
  return (
    <div className="matching-algorithm-page">
      
      {/* Main Content */}
      <main id="main-content">
        {/* Algorithm Hero Section */}
        <section className="algorithm-hero" ref={heroRef}>
          <div className="floating-elements">
            {['fa-brain', 'fa-cogs', 'fa-microchip', 'fa-chart-network', 'fa-robot'].map((icon, idx) => (
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
            <div className="algorithm-hero-content">
              <h1 className="algorithm-hero-title">AI-Powered Matching Algorithm</h1>
              <p className="algorithm-hero-subtitle">
                Our intelligent matching system analyzes multiple parameters to create optimal connections
                between farmers and businesses, ensuring maximum value for both parties through
                data-driven decisions.
              </p>

              {/* Algorithm Visualization */}
              <div className="algorithm-visualization">
                <div className="visualization-container">
                  {/* Algorithm Center */}
                  <div className="algorithm-center">
                    <i className="fas fa-brain"></i>
                    <span>AI Matching Engine</span>
                  </div>

                  {/* Algorithm Nodes */}
                  <div
                    className="algorithm-node node-farmer"
                    style={{ top: '15%', left: '15%' }}
                    ref={(el) => (nodeRefs.current[0] = el)}
                  >
                    <i className="fas fa-user-tie"></i>
                    <span>Farmer Profile</span>
                  </div>
                  <div
                    className="algorithm-node node-business"
                    style={{ top: '15%', right: '15%' }}
                    ref={(el) => (nodeRefs.current[1] = el)}
                  >
                    <i className="fas fa-building"></i>
                    <span>Business Needs</span>
                  </div>
                  <div
                    className="algorithm-node node-location"
                    style={{ top: '50%', left: '5%' }}
                    ref={(el) => (nodeRefs.current[2] = el)}
                  >
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Location</span>
                  </div>
                  <div
                    className="algorithm-node node-quality"
                    style={{ top: '50%', right: '5%' }}
                    ref={(el) => (nodeRefs.current[3] = el)}
                  >
                    <i className="fas fa-award"></i>
                    <span>Quality Score</span>
                  </div>
                  <div
                    className="algorithm-node node-price"
                    style={{ bottom: '15%', left: '20%' }}
                    ref={(el) => (nodeRefs.current[4] = el)}
                  >
                    <i className="fas fa-tags"></i>
                    <span>Price Match</span>
                  </div>
                  <div
                    className="algorithm-node node-timing"
                    style={{ bottom: '15%', right: '20%' }}
                    ref={(el) => (nodeRefs.current[5] = el)}
                  >
                    <i className="fas fa-clock"></i>
                    <span>Timing</span>
                  </div>

                  {/* Canvas for connection lines */}
                  <canvas ref={canvasRef} id="connectionCanvas" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}></canvas>
                </div>
              </div>

              {/* Stats Row */}
              <div className="stats-grid" style={{ marginTop: '50px' }}>
                <div className="stat-item">
                  <span className="stat-number" id="matchAccuracy">{counters.matchAccuracy.toFixed(1)}%</span>
                  <span className="stat-label">Match Accuracy Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number" id="avgTime">{counters.avgTime.toFixed(1)}</span>
                  <span className="stat-label">Avg. Match Time (seconds)</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number" id="successRate">{counters.successRate.toFixed(1)}%</span>
                  <span className="stat-label">Successful Transactions</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Algorithm Works Section */}
        <section className="algorithm-process-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">How Our Algorithm Works</h2>
              <p className="section-subtitle">A step-by-step breakdown of our intelligent matching process</p>
            </div>

            <div className="process-steps-container">
              <div className="process-timeline">
                {[
                  {
                    number: 1,
                    icon: 'fa-database',
                    title: 'Data Collection & Profiling',
                    desc: 'Our system collects comprehensive data from both farmers and businesses to create detailed profiles. For farmers, we capture crop details, harvest schedules, quality parameters, and location. For businesses, we gather requirements, quality standards, delivery schedules, and payment terms.',
                    features: [
                      { icon: 'fa-user-tie', title: 'Farmer Profile', text: 'Crop history, quality ratings, delivery reliability, pricing patterns' },
                      { icon: 'fa-building', title: 'Business Profile', text: 'Procurement needs, quality requirements, payment history, volume needs' },
                      { icon: 'fa-chart-line', title: 'Market Data', text: 'Real-time pricing, demand trends, seasonal patterns, logistics costs' },
                    ],
                  },
                  {
                    number: 2,
                    icon: 'fa-chart-bar',
                    title: 'Multi-Parameter Analysis',
                    desc: 'The algorithm analyzes multiple parameters simultaneously using weighted scoring. Each match factor is assigned a weight based on its importance, and the system calculates compatibility scores for potential matches.',
                    features: [
                      { icon: 'fa-balance-scale', title: 'Weighted Scoring', text: 'Quality (35%), Price (25%), Location (20%), Timing (15%), History (5%)' },
                      { icon: 'fa-calculator', title: 'Compatibility Score', text: 'Calculated score from 0-100 indicating match quality' },
                      { icon: 'fa-filter', title: 'Dynamic Filtering', text: 'Real-time filtering based on changing requirements and availability' },
                    ],
                  },
                  {
                    number: 3,
                    icon: 'fa-robot',
                    title: 'Intelligent Matching Engine',
                    desc: 'Using machine learning algorithms, our system identifies optimal matches by comparing farmer profiles with business requirements. The algorithm learns from previous successful matches to improve future recommendations.',
                    features: [
                      { icon: 'fa-brain', title: 'Machine Learning', text: 'Continuously learns from transaction outcomes to improve accuracy' },
                      { icon: 'fa-project-diagram', title: 'Pattern Recognition', text: 'Identifies successful match patterns across thousands of transactions' },
                      { icon: 'fa-lightbulb', title: 'Smart Suggestions', text: 'Provides alternative matches when exact requirements aren’t available' },
                    ],
                  },
                  {
                    number: 4,
                    icon: 'fa-check-double',
                    title: 'Verification & Optimization',
                    desc: 'Before presenting matches, the system verifies all parameters and optimizes for logistics efficiency, cost-effectiveness, and relationship building. It also considers historical performance and user feedback.',
                    features: [
                      { icon: 'fa-truck', title: 'Logistics Optimization', text: 'Groups nearby matches to optimize delivery routes and reduce costs' },
                      { icon: 'fa-star', title: 'Reputation Consideration', text: 'Prioritizes farmers/businesses with higher ratings and reliability scores' },
                      { icon: 'fa-sync-alt', title: 'Continuous Improvement', text: 'Algorithm updates based on transaction outcomes and user feedback' },
                    ],
                  },
                  {
                    number: 5,
                    icon: 'fa-handshake',
                    title: 'Match Presentation & Connection',
                    desc: 'Finally, the system presents the best matches with detailed compatibility reports. Both parties receive notifications and can review match details before initiating contact through our secure platform.',
                    features: [
                      { icon: 'fa-chart-pie', title: 'Detailed Reports', text: 'Comprehensive compatibility reports explaining why the match was suggested' },
                      { icon: 'fa-bell', title: 'Smart Notifications', text: 'Instant notifications when high-quality matches are found' },
                      { icon: 'fa-comments', title: 'Secure Communication', text: 'Built-in messaging system for safe and transparent communication' },
                    ],
                  },
                ].map((step) => (
                  <div className="process-step" key={step.number}>
                    <div className="step-number">{step.number}</div>
                    <div className="step-header">
                      <div className="step-icon">
                        <i className={`fas ${step.icon}`}></i>
                      </div>
                      <h3 className="step-title">{step.title}</h3>
                    </div>
                    <p className="step-description">{step.desc}</p>
                    <div className="step-features">
                      {step.features.map((feat, idx) => (
                        <div className="feature-item" key={idx}>
                          <h4 className="feature-title"><i className={`fas ${feat.icon}`}></i> {feat.title}</h4>
                          <p className="feature-desc">{feat.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Matching Criteria Section */}
        <section className="criteria-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Matching Criteria & Parameters</h2>
              <p className="section-subtitle">Our algorithm evaluates multiple dimensions to ensure optimal matches</p>
            </div>

            <div className="criteria-container">
              {[
                { icon: 'fa-award', title: 'Quality Parameters', items: ['Certification standards (Organic, ISO, etc.)', 'Historical quality ratings', 'Crop grade and specifications', 'Packaging and handling standards', 'Compliance with buyer requirements', 'Third-party quality verification'] },
                { icon: 'fa-tags', title: 'Price & Economic Factors', items: ['Market price alignment', 'Volume-based pricing considerations', 'Payment terms compatibility', 'Historical pricing patterns', 'Seasonal price fluctuations', 'Total cost including logistics'] },
                { icon: 'fa-map-marker-alt', title: 'Location & Logistics', items: ['Distance between farmer and business', 'Transportation infrastructure', 'Cold chain availability', 'Delivery time estimates', 'Logistics cost optimization', 'Regional supply-demand balance'] },
                { icon: 'fa-clock', title: 'Timing & Availability', items: ['Harvest schedule alignment', 'Delivery timeline compatibility', 'Seasonal availability matching', 'Business procurement cycles', 'Storage capacity considerations', 'Lead time requirements'] },
                { icon: 'fa-history', title: 'Historical Performance', items: ['Previous transaction success rate', 'User ratings and reviews', 'Reliability score', 'Dispute resolution history', 'Communication responsiveness', 'Contract fulfillment rate'] },
                { icon: 'fa-users', title: 'Relationship Building', items: ['Previous successful partnerships', 'Preferred partner preferences', 'Business relationship duration', 'Repeat transaction patterns', 'Communication style compatibility', 'Cultural and language considerations'] },
              ].map((criteria, idx) => (
                <div className="criteria-card" key={idx}>
                  <div className="criteria-icon"><i className={`fas ${criteria.icon}`}></i></div>
                  <h3 className="criteria-title">{criteria.title}</h3>
                  <ul className="criteria-list">
                    {criteria.items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="algorithm-benefits-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Benefits of Intelligent Matching</h2>
              <p className="section-subtitle">How our algorithm creates value for all stakeholders</p>
            </div>

            <div className="benefits-grid">
              {[
                { icon: 'fa-chart-line', title: 'Higher Efficiency', desc: 'Reduce time spent searching for partners by 90%. Our algorithm processes thousands of profiles in seconds to find the best matches instantly.' },
                { icon: 'fa-money-bill-wave', title: 'Better Prices', desc: 'Farmers get 20-40% better prices while businesses save 15-30% on procurement costs through optimized matches and reduced middlemen.' },
                { icon: 'fa-shield-alt', title: 'Reduced Risk', desc: 'Quality verification, reputation scoring, and historical performance analysis minimize transaction risks for both farmers and businesses.' },
                { icon: 'fa-truck', title: 'Optimized Logistics', desc: 'Location-based matching and route optimization reduce transportation costs by 25-35% and improve delivery reliability.' },
                { icon: 'fa-users', title: 'Stronger Relationships', desc: 'Our algorithm identifies compatible partners for long-term relationships, leading to more stable supply chains and better mutual understanding.' },
                { icon: 'fa-leaf', title: 'Sustainable Impact', desc: 'Optimized matches reduce food waste, lower carbon footprint through efficient logistics, and promote sustainable farming practices.' },
              ].map((benefit, idx) => (
                <div className="benefit-card" key={idx}>
                  <div className="benefit-icon"><i className={`fas ${benefit.icon}`}></i></div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Algorithm Stats Section */}
        <section className="algorithm-stats-section">
          <div className="container">
            <div className="stats-content">
              <div className="section-header" style={{ color: 'white' }}>
                <h2 className="section-title" style={{ color: 'white' }}>Algorithm Performance Metrics</h2>
                <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Real-world results from our intelligent matching system
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">250,000+</span>
                  <span className="stat-label">Successful Matches Made</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">2.3s</span>
                  <span className="stat-label">Average Match Time</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">98.5%</span>
                  <span className="stat-label">User Satisfaction Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">35%</span>
                  <span className="stat-label">Avg. Cost Reduction</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">99.7%</span>
                  <span className="stat-label">Transaction Success Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">85%</span>
                  <span className="stat-label">Repeat Partnership Rate</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="algorithm-cta-section" id="get-started">
          <div className="container">
            <div className="algorithm-cta-content">
              <h2 className="algorithm-cta-title">Experience Intelligent Matching</h2>
              <p className="algorithm-cta-subtitle">
                Join thousands of farmers and businesses who are benefiting from our AI-powered
                matching algorithm. Better matches, better prices, better relationships.
              </p>

              <div className="cta-buttons">
                <a href="/farmers" className="btn-algorithm-primary">
                  <i className="fas fa-user-tie"></i> I'm a Farmer
                </a>
                <a href="/business" className="btn-algorithm-primary">
                  <i className="fas fa-building"></i> I'm a Business
                </a>
                <a href="/contact" className="btn-algorithm-secondary">
                  <i className="fas fa-question-circle"></i> Schedule a Demo
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

export default Algorithm;