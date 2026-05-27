// src/pages/Logistics.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Logistics.css";

const Logistics = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [counts, setCounts] = useState({
    cities: 0,
    onTimeRate: 0,
    fleet: 0
  });

  const navMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);


  // Logistics solutions
  const logisticsSolutions = [
    {
      icon: 'fa-temperature-low',
      title: 'Cold Chain Logistics',
      description: 'Temperature-controlled transportation for perishable goods with continuous monitoring and quality assurance.',
      features: [
        'Temperature-controlled vehicles',
        'Real-time temperature monitoring',
        'Humidity control systems',
        'Multi-temperature zones'
      ]
    },
    {
      icon: 'fa-shipping-fast',
      title: 'Express Delivery Network',
      description: 'Priority delivery services with guaranteed timelines for time-sensitive business requirements.',
      features: [
        'Same-day delivery options',
        'Next-morning delivery',
        'Dedicated delivery slots',
        'Priority handling'
      ]
    },
    {
      icon: 'fa-warehouse',
      title: 'Storage & Distribution',
      description: 'Strategic warehousing solutions with cross-docking facilities for efficient inventory management.',
      features: [
        'Temperature-controlled warehouses',
        'Cross-docking facilities',
        'Inventory management',
        'Just-in-time delivery'
      ]
    }
  ];

  // Tracking technology features
  const trackingFeatures = [
    {
      icon: 'fa-map-marked-alt',
      title: 'Live GPS Tracking',
      description: 'Track your shipments in real-time with precise location updates and estimated arrival times.',
      stats: [
        { value: '5-min', label: 'Update Interval' },
        { value: '99.8%', label: 'Accuracy' }
      ]
    },
    {
      icon: 'fa-temperature-low',
      title: 'Temperature Monitoring',
      description: 'Continuous temperature monitoring with alerts for any deviations from optimal ranges.',
      stats: [
        { value: '24/7', label: 'Monitoring' },
        { value: '±0.5°C', label: 'Precision' }
      ]
    },
    {
      icon: 'fa-bell',
      title: 'Smart Notifications',
      description: 'Automated alerts for key milestones including dispatch, arrival, and delivery completion.',
      stats: [
        { value: '6+', label: 'Alert Types' },
        { value: 'Instant', label: 'Delivery' }
      ]
    }
  ];

  // Network stats
  const networkStats = [
    { number: '150+', label: 'Cities Covered' },
    { number: '500+', label: 'Delivery Vehicles' },
    { number: '25', label: 'Distribution Centers' },
    { number: '99.2%', label: 'Service Reliability' }
  ];

  // Coverage areas
  const coverageAreas = [
    'Metro Cities',
    'Tier 1 Cities',
    'Tier 2 Cities',
    'Industrial Hubs',
    'Port Cities'
  ];

  // Temperature zones
  const temperatureZones = [
    { icon: 'fa-snowflake', color: '#2d9cdb', title: 'Freezer Zone', temp: '-18°C to 0°C', delay: '0s' },
    { icon: 'fa-thermometer-half', color: '#27ae60', title: 'Chilled Zone', temp: '0°C to 8°C', delay: '-1s' },
    { icon: 'fa-thermometer-quarter', color: '#f2c94c', title: 'Ambient Zone', temp: '8°C to 25°C', delay: '-2s' }
  ];

  // Cold chain features
  const coldChainFeatures = [
    '<strong>Continuous Monitoring:</strong> Real-time temperature tracking with IoT sensors and alerts',
    '<strong>Multi-Zone Vehicles:</strong> Separate temperature zones for different produce types',
    '<strong>Backup Systems:</strong> Redundant cooling systems for uninterrupted operation',
    '<strong>Quality Assurance:</strong> Temperature logs and quality certificates with every delivery',
    '<strong>Rapid Cooling:</strong> Pre-cooling facilities at collection centers'
  ];

  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Animate counters when page loads
    animateCounters();

    // Intersection Observer for cards animation
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

    document.querySelectorAll('.solution-card, .tracking-card, .network-stat-card').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
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
    const targets = { cities: 150, onTimeRate: 99.2, fleet: 500 };
    const durations = { cities: 2000, onTimeRate: 1500, fleet: 2000 };
    
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
            [key]: key === 'onTimeRate' ? target : target
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

  const handleConsultationClick = (e, type) => {
    if (type === 'phone' || type === 'email') {
      if (!confirm('Our logistics team will contact you within 30 minutes for a consultation. Continue?')) {
        e.preventDefault();
      }
    }
  };

  return (
    <>
      

      
      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="logistics-hero">
          <div className="container">
            <div className="logistics-hero-content">
              {/* Text Content */}
              <div className="hero-text-content">
                <h1 className="logistics-hero-title">Advanced Business Logistics Solutions</h1>
                <p className="logistics-hero-subtitle">
                  End-to-end supply chain management with cold chain facilities, real-time tracking, and pan-India delivery network. 
                  Ensure fresh produce reaches your business in perfect condition, every time.
                </p>
                <div className="hero-stats">
                  <div className="hero-stat-item">
                    <span className="hero-stat-number" id="deliveryCities">{counts.cities}+</span>
                    <span className="hero-stat-label">Cities Served</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-number" id="onTimeRate">{counts.onTimeRate}%</span>
                    <span className="hero-stat-label">On-time Delivery Rate</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-number" id="fleetSize">{counts.fleet}+</span>
                    <span className="hero-stat-label">Fleet Vehicles</span>
                  </div>
                </div>
              </div>
              
              {/* Animated Visual Elements */}
              <div className="hero-visual-container" aria-hidden="true">
                <div className="hero-animation-area">
                  {/* Floating Logistics Elements */}
                  <div className="floating-element floating-element-1">
                    <i className="fas fa-shipping-fast"></i>
                  </div>
                  <div className="floating-element floating-element-2">
                    <i className="fas fa-temperature-low"></i>
                  </div>
                  <div className="floating-element floating-element-3">
                    <i className="fas fa-map-marked-alt"></i>
                  </div>
                  <div className="floating-element floating-element-4">
                    <i className="fas fa-boxes"></i>
                  </div>
                  
                  {/* Animated Logistics Routes */}
                  <div className="logistics-route route-1"></div>
                  <div className="logistics-route route-2"></div>
                  <div className="logistics-route route-3"></div>
                  
                  {/* Animated Vehicle Icons */}
                  <div className="vehicle-icon vehicle-1">
                    <i className="fas fa-truck"></i>
                  </div>
                  <div className="vehicle-icon vehicle-2">
                    <i className="fas fa-truck-moving"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logistics Solutions */}
        <section className="logistics-solutions">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Comprehensive Logistics Solutions</h2>
              <p className="section-subtitle">Tailored logistics services designed for different business needs and perishable goods requirements</p>
            </div>
            <div className="solutions-container">
              {logisticsSolutions.map((solution, index) => (
                <div key={index} className="solution-card">
                  <div className="solution-icon">
                    <i className={`fas ${solution.icon}`}></i>
                  </div>
                  <h3 className="solution-title">{solution.title}</h3>
                  <p className="solution-description">{solution.description}</p>
                  <ul className="solution-features">
                    {solution.features.map((feature, idx) => (
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

        {/* Cold Chain Management */}
        <section className="cold-chain">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Advanced Cold Chain Management</h2>
              <p className="section-subtitle">Maintain optimal temperature conditions throughout the supply chain journey</p>
            </div>
            <div className="cold-chain-container">
              <div className="cold-chain-visual">
                <div className="temperature-visual">
                  {/* Temperature Levels */}
                  {temperatureZones.map((zone, index) => (
                    <div key={index} className={`temp-level temp-level-${index + 1}`} style={{ animationDelay: zone.delay }}>
                      <div className="temp-icon" style={{ color: zone.color }}>
                        <i className={`fas ${zone.icon}`}></i>
                      </div>
                      <div className="temp-info">
                        <h4>{zone.title}</h4>
                        <p>{zone.temp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="cold-chain-content">
                <h3>Precision Temperature Control</h3>
                <p>
                  Our advanced cold chain logistics ensure that perishable produce maintains optimal temperature conditions from farm to your business premises. We use state-of-the-art refrigeration technology with multi-zone temperature control capabilities.
                </p>
                
                <ul className="cold-chain-features">
                  {coldChainFeatures.map((feature, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: feature }}></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Technology */}
        <section className="tracking-technology">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Real-Time Tracking Technology</h2>
              <p className="section-subtitle">Complete visibility and control over your shipments with advanced tracking systems</p>
            </div>
            <div className="tracking-container">
              {trackingFeatures.map((feature, index) => (
                <div key={index} className="tracking-card">
                  <div className="tracking-icon">
                    <i className={`fas ${feature.icon}`}></i>
                  </div>
                  <h3 className="tracking-title">{feature.title}</h3>
                  <p className="tracking-description">{feature.description}</p>
                  <div className="tracking-stats">
                    {feature.stats.map((stat, idx) => (
                      <div key={idx} className="tracking-stat">
                        <div className="tracking-stat-number">{stat.value}</div>
                        <div className="tracking-stat-label">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery Network */}
        <section className="delivery-network">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Pan-India Delivery Network</h2>
              <p className="section-subtitle">Extensive logistics network covering major cities and business hubs across India</p>
            </div>
            
            <div className="network-stats">
              {networkStats.map((stat, index) => (
                <div key={index} className="network-stat-card">
                  <div className="network-stat-number">{stat.number}</div>
                  <div className="network-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="network-map">
              <h3>Strategic Network Coverage</h3>
              <p>
                Our strategically located distribution centers and hub-and-spoke model ensure efficient coverage across India with optimal transit times and cost-effective routing.
              </p>
              
              <div className="coverage-list">
                {coverageAreas.map((area, index) => (
                  <div key={index} className="coverage-item">
                    <i className="fas fa-check"></i> {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="logistics-cta" id="logistics-consultation">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Optimize Your Supply Chain</h2>
              <p className="cta-subtitle">Schedule a logistics consultation with our experts to design an efficient supply chain solution for your business</p>
              <div className="cta-buttons">
                <a 
                  href="tel:+919553774933" 
                  className="btn-cta-primary"
                  onClick={(e) => handleConsultationClick(e, 'phone')}
                >
                  <i className="fas fa-phone-alt"></i> Call Logistics Head
                </a>
                <a 
                  href="mailto:logistics@farmvantara.com" 
                  className="btn-cta-secondary"
                  onClick={(e) => handleConsultationClick(e, 'email')}
                >
                  <i className="fas fa-envelope"></i> Email Requirements
                </a>
                <a 
                  href="https://wa.me/919553774933" 
                  className="btn-cta-secondary" 
                  style={{ background: '#25d366', border: 'none' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-whatsapp"></i> WhatsApp Logistics Team
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
        aria-label="Chat with our logistics team"
      >
        <i className="fab fa-whatsapp"></i>
        <span className="whatsapp-text">Logistics Support</span>
      </a>
    </>
  );
};

export default Logistics;