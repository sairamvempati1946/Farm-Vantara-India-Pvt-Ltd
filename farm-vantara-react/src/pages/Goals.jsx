import React, { useState, useEffect, useRef } from 'react';
import '../styles/Goals.css';

const Goals = () => {
  // ---------- State ----------
  const [menuActive, setMenuActive] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [stats, setStats] = useState({
    waterSaved: 0,
    carbonReduced: 0,
    wasteReduced: 0,
    farmersTrained: 0,
  });
  const [carbonPercent, setCarbonPercent] = useState(0);
  const [carbonStats, setCarbonStats] = useState({ current: 0, target: 25, offset: 0 });
  const [notifications, setNotifications] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // Refs for Intersection Observers
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const carbonRef = useRef(null);
  const roadmapRef = useRef(null);
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

  // Animate stats when in view
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
            startRealTimeUpdates();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate carbon tracker when in view
  useEffect(() => {
    if (!carbonRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCarbonTracker();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(carbonRef.current);
    return () => observer.disconnect();
  }, []);

  // Generate floating leaves periodically
  useEffect(() => {
    const leafIcons = ['fa-leaf', 'fa-seedling', 'fa-tree', 'fa-spa'];
    const interval = setInterval(() => {
      const newLeaf = {
        id: Date.now(),
        icon: leafIcons[Math.floor(Math.random() * leafIcons.length)],
        left: Math.random() * 100,
        fontSize: Math.random() * 20 + 15,
        color: `rgba(39, 174, 96, ${Math.random() * 0.4 + 0.3})`,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
      };
      setLeaves((prev) => [...prev, newLeaf]);
      // Remove after animation (30s)
      setTimeout(() => {
        setLeaves((prev) => prev.filter((l) => l.id !== newLeaf.id));
      }, 30000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Initial leaves
  useEffect(() => {
    const initialLeaves = [];
    for (let i = 0; i < 10; i++) {
      initialLeaves.push({
        id: i,
        icon: 'fa-leaf',
        left: Math.random() * 100,
        fontSize: Math.random() * 20 + 15,
        color: `rgba(39, 174, 96, ${Math.random() * 0.4 + 0.3})`,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
      });
    }
    setLeaves(initialLeaves);
  }, []);

  // Welcome notification
  useEffect(() => {
    showNotification("Welcome to Farm Vantara Sustainability! 🌍 Together we're building a greener future.");
  }, []);

  // Periodic achievement notifications
  useEffect(() => {
    const achievements = [
      "🌱 1,000 tons of carbon offset this month!",
      "💧 Saved 500,000 liters of water today",
      "🌳 100 new trees planted this week",
      "♻️ Reduced farm waste by 15% this quarter",
      "☀️ 50 farms switched to solar power",
      "🌾 200 farmers trained in sustainable practices",
    ];
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const random = achievements[Math.floor(Math.random() * achievements.length)];
        showNotification(random);
      }
    }, 30000);
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

  // Earth sphere hover effects
  useEffect(() => {
    const earth = document.querySelector('.earth-sphere');
    const points = document.querySelectorAll('.sustainability-point');
    if (!earth) return;
    const handleMouseEnter = () => {
      earth.style.animationDuration = '80s';
      points.forEach((p) => (p.style.animationDuration = '3s'));
    };
    const handleMouseLeave = () => {
      earth.style.animationDuration = '40s';
      points.forEach((p) => (p.style.animationDuration = '6s'));
    };
    earth.addEventListener('mouseenter', handleMouseEnter);
    earth.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      earth.removeEventListener('mouseenter', handleMouseEnter);
      earth.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Points hover
  useEffect(() => {
    const points = document.querySelectorAll('.sustainability-point');
    const handleMouseEnter = (e) => {
      e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.3)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
    };
    const handleMouseLeave = (e) => {
      e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
    };
    points.forEach((p) => {
      p.addEventListener('mouseenter', handleMouseEnter);
      p.addEventListener('mouseleave', handleMouseLeave);
    });
    return () => {
      points.forEach((p) => {
        p.removeEventListener('mouseenter', handleMouseEnter);
        p.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // ---------- Helper Functions ----------
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const animateCounter = (element, target, suffix = '') => {
    let start = 0;
    const increment = target / (2000 / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = formatNumber(target) + suffix;
        clearInterval(timer);
      } else {
        element.textContent = formatNumber(Math.floor(start)) + suffix;
      }
    }, 16);
  };

  const animateStats = () => {
    const targets = { water: 2800000, carbon: 15200, waste: 85, farmers: 8500 };
    animateCounter(document.getElementById('waterSaved'), targets.water);
    animateCounter(document.getElementById('carbonReduced'), targets.carbon);
    animateCounter(document.getElementById('wasteReduced'), targets.waste, '%');
    animateCounter(document.getElementById('farmersTrained'), targets.farmers, '+');
  };

  const animateCarbonTracker = () => {
    let current = 0;
    const target = 68;
    const interval = setInterval(() => {
      current += 1;
      setCarbonPercent(current);
      if (current >= target) {
        clearInterval(interval);
        startCarbonUpdates();
      }
    }, 30);
  };

  const startCarbonUpdates = () => {
    setInterval(() => {
      setCarbonPercent((prev) => {
        const variation = (Math.random() - 0.5) * 0.5;
        const newVal = Math.max(65, Math.min(70, prev + variation));
        return Math.round(newVal * 10) / 10;
      });
    }, 15000);
  };

  const startRealTimeUpdates = () => {
    setInterval(() => {
      if (Math.random() > 0.7) {
        setStats((prev) => ({ ...prev, waterSaved: prev.waterSaved + 1000 }));
      }
      setStats((prev) => ({ ...prev, carbonReduced: prev.carbonReduced + 5 }));
      if (Math.random() > 0.8) {
        setStats((prev) => ({ ...prev, farmersTrained: prev.farmersTrained + 1 }));
      }
    }, 10000);
  };

  const showNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  // ---------- JSX ----------
  return (
    <div className="sustainability-page">
      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((n) => (
          <div key={n.id} className="sustainability-notification">
            <div className="notification-content">
              <i className="fas fa-award"></i>
              <span>{n.message}</span>
            </div>
            <button className="notification-close" onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Floating Leaves */}
      <div className="impact-leaves">
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className="impact-leaf"
            style={{
              left: `${leaf.left}vw`,
              fontSize: `${leaf.fontSize}px`,
              color: leaf.color,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
            }}
          >
            <i className={`fas ${leaf.icon}`}></i>
          </div>
        ))}
      </div>

      {/* Sustainability Hero Section */}
      <section className="sustainability-hero" ref={heroRef}>
        <div className="floating-elements">
          {['fa-leaf', 'fa-tint', 'fa-solar-panel', 'fa-recycle', 'fa-seedling'].map((icon, idx) => (
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
          <div className="hero-content">
            <h1 className="hero-title">Sustainability Goals & Impact</h1>
            <p className="hero-subtitle">
              Committed to transforming agriculture through sustainable practices, environmental conservation,
              and social responsibility. Join us in creating a greener future for generations to come.
            </p>

            {/* Animated Earth Visualization */}
            <div className="earth-visualization">
              <div className="earth-container">
                <div className="earth-sphere"></div>
                <div className="sustainability-orbit orbit-1"></div>
                <div className="sustainability-orbit orbit-2"></div>
                <div className="sustainability-point point-1"><i className="fas fa-tint"></i></div>
                <div className="sustainability-point point-2"><i className="fas fa-solar-panel"></i></div>
                <div className="sustainability-point point-3"><i className="fas fa-recycle"></i></div>
                <div className="sustainability-point point-4"><i className="fas fa-seedling"></i></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Impact Stats */}
      <section className="impact-stats" ref={statsRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Real-time Sustainability Impact</h2>
            <p className="section-subtitle">Tracking our progress towards a sustainable agricultural future</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-tint"></i></div>
              <span className="stat-number" id="waterSaved">0</span>
              <span className="stat-label">Liters of Water Saved</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-leaf"></i></div>
              <span className="stat-number" id="carbonReduced">0</span>
              <span className="stat-label">Tons CO₂ Reduced</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-recycle"></i></div>
              <span className="stat-number" id="wasteReduced">0%</span>
              <span className="stat-label">Waste Reduction</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-users"></i></div>
              <span className="stat-number" id="farmersTrained">0+</span>
              <span className="stat-label">Farmers Trained</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Pillars */}
      <section className="pillars-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Sustainability Pillars</h2>
            <p className="section-subtitle">Three interconnected pillars driving our sustainable agriculture mission</p>
          </div>

          <div className="pillars-container">
            {[
              {
                class: 'pillar-1',
                icon: 'fa-globe-asia',
                title: 'Environmental Stewardship',
                desc: 'Protecting and enhancing natural resources through sustainable farming practices, biodiversity conservation, and climate action initiatives.',
                goals: ['Reduce carbon footprint by 40% by 2030', 'Implement 100% renewable energy on farms', 'Restore 10,000 hectares of degraded land', 'Eliminate single-use plastics by 2025'],
              },
              {
                class: 'pillar-2',
                icon: 'fa-hands-helping',
                title: 'Social Responsibility',
                desc: 'Empowering farming communities, ensuring fair practices, and promoting education and health for sustainable rural development.',
                goals: ['Increase farmer income by 50% by 2027', 'Provide training to 25,000 farmers', 'Ensure 100% fair trade practices', 'Improve access to education in 500 villages'],
              },
              {
                class: 'pillar-3',
                icon: 'fa-chart-line',
                title: 'Economic Sustainability',
                desc: 'Building resilient agricultural economies through innovation, market access, and sustainable business models.',
                goals: ['Create 10,000 new green jobs by 2026', 'Reduce post-harvest losses to under 10%', 'Increase organic farming by 300%', 'Launch 500 farmer-owned enterprises'],
              },
            ].map((pillar, idx) => (
              <div key={idx} className={`pillar-card ${pillar.class}`}>
                <div className="pillar-icon"><i className={`fas ${pillar.icon}`}></i></div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-description">{pillar.desc}</p>
                <ul className="pillar-goals">
                  {pillar.goals.map((goal, i) => (
                    <li key={i}>{goal}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Carbon Footprint Tracker */}
      <section className="carbon-tracker" ref={carbonRef}>
        <div className="container">
          <div className="tracker-content">
            <div className="section-header" style={{ color: 'white' }}>
              <h2 className="section-title" style={{ color: 'white' }}>Carbon Footprint Tracker</h2>
              <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Real-time tracking of carbon emissions reduction across our network
              </p>
            </div>

            <div className="carbon-meter">
              <svg className="meter-circle" viewBox="0 0 100 100">
                <circle className="meter-background" cx="50" cy="50" r="45"></circle>
                <circle
                  className="meter-progress"
                  cx="50"
                  cy="50"
                  r="45"
                  style={{ strokeDasharray: 2 * Math.PI * 45, strokeDashoffset: 2 * Math.PI * 45 * (1 - carbonPercent / 100) }}
                ></circle>
              </svg>
              <div className="meter-center">
                <span className="carbon-value" id="carbonPercent">{carbonPercent}%</span>
                <span className="carbon-unit">Reduction</span>
                <div className="carbon-label">2025 Target: 75%</div>
              </div>
            </div>

            <div className="carbon-stats">
              <div className="carbon-stat">
                <span className="carbon-stat-number" id="currentCarbon">{100 - carbonPercent}%</span>
                <span className="carbon-stat-label">Current Carbon Footprint</span>
              </div>
              <div className="carbon-stat">
                <span className="carbon-stat-number" id="targetCarbon">25%</span>
                <span className="carbon-stat-label">2025 Target</span>
              </div>
              <div className="carbon-stat">
                <span className="carbon-stat-number" id="carbonOffset">{formatNumber(15200 + carbonPercent * 100)}</span>
                <span className="carbon-stat-label">Tons Offset</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Roadmap Section - Newly Added */}
      <section className="roadmap-section" ref={roadmapRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sustainability Roadmap</h2>
            <p className="section-subtitle">Our journey towards sustainable agriculture excellence</p>
          </div>

          <div className="roadmap-timeline">
            {/* 2025 */}
            <div className="roadmap-card">
              <div className="roadmap-year">2025</div>
              <div className="roadmap-content">
                <h3 className="roadmap-title">Foundational Initiatives</h3>
                <ul className="roadmap-list">
                  <li>Launched water conservation programs</li>
                  <li>Implemented basic sustainable farming scaling</li>
                  <li>Established our first solar-powered farm communities</li>
                </ul>
              </div>
            </div>

            {/* 2026 */}
            <div className="roadmap-card">
              <div className="roadmap-year">2026</div>
              <div className="roadmap-content">
                <h3 className="roadmap-title">Scale & Expansion</h3>
                <ul className="roadmap-list">
                  <li>Expanded organic farming initiatives</li>
                  <li>Introduced carbon credit programs for farmers</li>
                  <li>Launched waste management systems across 500+ farms</li>
                </ul>
              </div>
            </div>

            {/* 2027 */}
            <div className="roadmap-card">
              <div className="roadmap-year">2027</div>
              <div className="roadmap-content">
                <h3 className="roadmap-title">Innovation Phase</h3>
                <ul className="roadmap-list">
                  <li>Implementing AI-driven precision farming</li>
                  <li>Launching circular economy models</li>
                  <li>Establishing biodiversity corridors across agricultural regions</li>
                </ul>
              </div>
            </div>

            {/* 2028-2030 */}
            <div className="roadmap-card roadmap-card-featured">
              <div className="roadmap-year">2028-2030</div>
              <div className="roadmap-content">
                <h3 className="roadmap-title">Transformation Goals</h3>
                <ul className="roadmap-list">
                  <li>Achieve carbon neutrality</li>
                  <li>Establish 100% sustainable supply chains</li>
                  <li>Create self-sustaining agricultural ecosystems across India</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Practices */}
      <section className="practices-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sustainable Farming Practices</h2>
            <p className="section-subtitle">Innovative techniques driving environmental and economic sustainability</p>
          </div>

          <div className="practices-grid">
            {[
              { icon: 'fa-tint', title: 'Water Conservation', desc: 'Implementing drip irrigation, rainwater harvesting, and moisture-sensing technology to reduce water usage by up to 70% while maintaining crop yield.', impacts: { label1: 'Less Water', value1: '70%', label2: 'Higher Yield', value2: '25%' } },
              { icon: 'fa-solar-panel', title: 'Renewable Energy', desc: 'Solar-powered irrigation, biogas from agricultural waste, and clean energy microgrids reducing carbon emissions and energy costs for farmers.', impacts: { label1: 'Clean Energy', value1: '90%', label2: 'Cost Savings', value2: '60%' } },
              { icon: 'fa-recycle', title: 'Circular Economy', desc: 'Zero-waste farming through composting, crop residue management, and closed-loop systems that turn waste into valuable resources.', impacts: { label1: 'Waste Reduced', value1: '85%', label2: 'Organic Inputs', value2: '100%' } },
            ].map((practice, idx) => (
              <div className="practice-card" key={idx}>
                <div className="practice-icon"><i className={`fas ${practice.icon}`}></i></div>
                <h3 className="practice-title">{practice.title}</h3>
                <p className="practice-description">{practice.desc}</p>
                <div className="practice-impact">
                  <div className="impact-item">
                    <span className="impact-value">{practice.impacts.value1}</span>
                    <span className="impact-label">{practice.impacts.label1}</span>
                  </div>
                  <div className="impact-item">
                    <span className="impact-value">{practice.impacts.value2}</span>
                    <span className="impact-label">{practice.impacts.label2}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section" id="join">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Join the Sustainable Agriculture Movement</h2>
            <p className="cta-subtitle">
              Together, we can create a greener, more sustainable future for agriculture.
              Whether you're a farmer, business, or consumer, your choices matter.
            </p>

            <div className="cta-buttons">
              <a href="/farmers#sustainability" className="btn-cta btn-cta-primary">
                <i className="fas fa-user-tie"></i> Farmers: Go Sustainable
              </a>
              <a href="/business#sustainability" className="btn-cta btn-cta-primary">
                <i className="fas fa-building"></i> Businesses: Source Sustainably
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Float */}
      <a href="https://wa.me/919553774933" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat about sustainability">
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default Goals;