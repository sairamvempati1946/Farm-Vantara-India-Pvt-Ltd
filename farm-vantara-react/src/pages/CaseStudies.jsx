// src/pages/CaseStudies.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/CaseStudies.css";

const CaseStudies = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [counts, setCounts] = useState({
    businesses: 0,
    savings: 0,
    reliability: 0
  });

  const navMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);


  // Case studies data
  const caseStudies = [
    {
      id: 'spice-route',
      badge: 'HOSPITALITY',
      title: 'Spice Route Restaurants: Farm-to-Table Excellence',
      industry: 'Restaurant Chain',
      results: '25% Savings',
      industryIcon: 'fa-utensils',
      resultsIcon: 'fa-chart-line',
      excerpt: 'Transitioned from traditional wholesale markets to direct farm sourcing. Implemented quality standardization across all 12 outlets with Farm Vantara\'s grading system.',
      highlights: [
        '25% reduction in vegetable procurement costs',
        'Standardized quality across all locations',
        '12-hour farm-to-kitchen delivery cycle',
        'Eliminated 3 intermediaries in supply chain'
      ],
      image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/80/12/97/entree.jpg?w=900&h=500&s=1'
    },
    {
      badge: 'FOOD PROCESSING',
      title: 'FoodPro Industries: Consistent Quality at Scale',
      industry: 'Food Processing',
      results: '30% Savings',
      industryIcon: 'fa-industry',
      resultsIcon: 'fa-chart-line',
      excerpt: 'A medium-scale food processor struggling with inconsistent raw material quality affecting their production efficiency and product consistency.',
      highlights: [
        '30% cost reduction on raw materials',
        '99% consistency in raw material quality',
        'Reduced production waste by 40%',
        'Secured long-term contracts with farmers'
      ],
      image: 'https://media.springernature.com/lw685/springer-static/image/art%3A10.1038%2Fs41538-025-00484-x/MediaObjects/41538_2025_484_Fig6_HTML.png'
    },
    {
      badge: 'EXPORT',
      title: 'Global Agro Exports: Meeting International Standards',
      industry: 'Export Company',
      results: '35% Growth',
      industryIcon: 'fa-plane-departure',
      resultsIcon: 'fa-chart-line',
      excerpt: 'Export company facing challenges in meeting international quality standards and documentation requirements for European and Middle Eastern markets.',
      highlights: [
        '35% increase in export volume',
        '100% compliance with international standards',
        'Reduced rejection rate from 15% to 2%',
        'Expanded to 3 new international markets'
      ],
      image: 'https://www.oecd.org/adobe/dynamicmedia/deliver/dm-aid--2281916e-c364-4e85-9b4e-1c37abbb5f2c/l2---policy-issue---oecd-standards-for-agriculture---shutterstock-2320518933.jpg?preferwebp=true&quality=80'
    },
    {
      badge: 'RETAIL',
      title: 'FreshMart Supermarkets: Retail-Ready Supply Chain',
      industry: 'Retail Chain',
      results: '22% Savings',
      industryIcon: 'fa-store',
      resultsIcon: 'fa-chart-line',
      excerpt: 'Supermarket chain needing retail-ready packaging and consistent supply across 25 stores with variable demand patterns and seasonal fluctuations.',
      highlights: [
        '22% reduction in procurement costs',
        'Reduced food wastage by 60%',
        'Retail-ready packaging at source',
        'Real-time inventory tracking system'
      ],
      image: 'https://lh3.googleusercontent.com/bwIxPZUxIk_Wo-UU8HRgobpoy4eAZ3OyJD3GXr0j3PCo9NU_hmphtMm9Z6Hb4HZqozVeTd-Rc27a9dpi0Z0yELgkRFk=w400-rw'
    },
    {
      badge: 'HOSPITALITY',
      title: 'Grand Hotel Group: Centralized Procurement System',
      industry: 'Hotel Chain',
      results: '28% Savings',
      industryIcon: 'fa-hotel',
      resultsIcon: 'fa-chart-line',
      excerpt: 'Luxury hotel group operating 8 properties needing centralized procurement, quality standardization, and reliable supply for their premium requirements.',
      highlights: [
        '28% savings on F&B procurement',
        'Centralized quality control system',
        'Reduced supplier count from 45 to 12',
        'Enhanced guest satisfaction scores'
      ],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      badge: 'INNOVATION',
      title: 'Organic Bites: Premium Organic Supply Chain',
      industry: 'Organic Food',
      results: '40% Growth',
      industryIcon: 'fa-leaf',
      resultsIcon: 'fa-chart-line',
      excerpt: 'Startup focusing on organic and specialty produce struggling with limited supply, inconsistent quality, and premium pricing challenges.',
      highlights: [
        '40% business growth in 12 months',
        'Certified organic supply chain',
        'Direct farmer partnerships established',
        'Premium quality at competitive prices'
      ],
      image: 'https://m.media-amazon.com/images/I/71DdI6dDw0L.jpg'
    }
  ];

  // Featured case study
  const featuredCase = {
    badge: 'FEATURED CASE STUDY',
    title: 'Spice Route Restaurants: 25% Procurement Cost Reduction Through Direct Farm Sourcing',
    excerpt: 'A premium restaurant chain with 12 outlets across Delhi NCR was struggling with inconsistent vegetable quality and fluctuating prices. By partnering with Farm Vantara, they established direct sourcing from verified farmers, implemented quality standardization, and optimized their supply chain.',
    metrics: [
      { value: '25%', label: 'Cost Reduction' },
      { value: '98%', label: 'Quality Consistency' },
      { value: '12 hrs', label: 'Farm to Kitchen' }
    ],
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/72/44/78/an-array-of-dishes.jpg?w=900&h=500&s=1'
  };

  // Key insights
  const insights = [
    { icon: 'fa-chart-line', title: 'Direct Sourcing Impact', description: 'Businesses eliminating intermediaries save 20-30% on procurement costs while improving quality consistency and traceability.' },
    { icon: 'fa-balance-scale', title: 'Quality Standardization', description: 'Implementing standardized quality grading reduces waste by 40-60% and improves customer satisfaction across retail and hospitality sectors.' },
    { icon: 'fa-network-wired', title: 'Supply Chain Resilience', description: 'Diversified farmer networks and digital tracking increase supply reliability to 99% and reduce dependency on single sources.' },
    { icon: 'fa-handshake', title: 'Farmer Relationships', description: 'Long-term farmer partnerships through fair pricing models ensure consistent supply and quality improvement over time.' },
    { icon: 'fa-clipboard-check', title: 'Compliance & Certification', description: 'Documented traceability and quality certifications open export opportunities and premium market segments for businesses.' },
    { icon: 'fa-recycle', title: 'Sustainable Impact', description: 'Efficient supply chains reduce food wastage by 50-70% while increasing farmer incomes by 15-25%, creating shared value.' }
  ];

  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Animate counters when page loads
    animateCounters();

    // Intersection Observer for case cards animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.case-card').forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });

    // Parallax effect for hero
    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelector('.case-hero');
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleParallax);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleParallax);
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
    const targets = { businesses: 500, savings: 40, reliability: 99 };
    const durations = { businesses: 2000, savings: 1500, reliability: 1500 };
    
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

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>

      {/* Main Content */}
      <main id="main-content">
        {/* Case Studies Hero */}
        <section className="case-hero">
          <div className="container">
            <div className="case-hero-content">
              <h1 className="case-hero-title">AgriTech Transformation: Real Business Success Stories</h1>
              <p className="case-hero-subtitle">
                Discover how businesses across India are revolutionizing their agricultural procurement through 
                Farm Vantara's AgriTech platform. Real stories, measurable results, and sustainable growth.
              </p>
              <div className="case-hero-stats">
                <div className="case-stat-item">
                  <div className="case-stat-number">{counts.businesses}+</div>
                  <div className="case-stat-label">Businesses Transformed</div>
                </div>
                <div className="case-stat-item">
                  <div className="case-stat-number">{counts.savings}-40%</div>
                  <div className="case-stat-label">Average Cost Savings</div>
                </div>
                <div className="case-stat-item">
                  <div className="case-stat-number">{counts.reliability}%</div>
                  <div className="case-stat-label">Supply Reliability</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Case Study */}
        <section className="featured-case-section">
          <div className="container">
            <div className="featured-case-container">
              <div className="featured-case-image">
                <img src={featuredCase.image} alt="Spice Route Restaurant Kitchen" loading="lazy" />
              </div>
              <div className="featured-case-content">
                <span className="case-badge">{featuredCase.badge}</span>
                <h2 className="featured-case-title">{featuredCase.title}</h2>
                <p className="featured-case-excerpt">{featuredCase.excerpt}</p>
                <div className="case-metrics">
                  {featuredCase.metrics.map((metric, index) => (
                    <div key={index} className="metric-item">
                      <h4>{metric.value}</h4>
                      <p>{metric.label}</p>
                    </div>
                  ))}
                </div>
                <a 
                  href="#spice-route-details" 
                  className="btn-cta-primary" 
                  style={{ padding: '15px 30px', fontSize: '15px' }}
                  onClick={(e) => handleSmoothScroll(e, 'spice-route-details')}
                >
                  <i className="fas fa-book-open"></i> Read Full Case Study
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="cases-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Business Transformation Stories</h2>
              <p className="section-subtitle">Explore how different businesses are leveraging AgriTech for sustainable growth</p>
            </div>
            
            <div className="cases-grid">
              {caseStudies.map((study, index) => (
                <div key={index} className="case-card" id={index === 0 ? 'spice-route-details' : ''}>
                  <div className="case-card-badge">{study.badge}</div>
                  <div className="case-card-image">
                    <img src={study.image} alt={study.title} loading="lazy" />
                  </div>
                  <div className="case-card-content">
                    <h3 className="case-card-title">{study.title}</h3>
                    <div className="case-card-meta">
                      <span className="case-card-industry">
                        <i className={`fas ${study.industryIcon}`}></i> {study.industry}
                      </span>
                      <span className="case-card-results">
                        <i className={`fas ${study.resultsIcon}`}></i> {study.results}
                      </span>
                    </div>
                    <p className="case-card-excerpt">{study.excerpt}</p>
                    <div className="case-card-highlights">
                      <h4>Key Results:</h4>
                      <ul>
                        {study.highlights.map((highlight, idx) => (
                          <li key={idx}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Insights Section */}
        <section className="insights-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Key AgriTech Insights</h2>
              <p className="section-subtitle">Lessons learned from 500+ business transformations</p>
            </div>
            
            <div className="insights-grid">
              {insights.map((insight, index) => (
                <div key={index} className="insight-card">
                  <div className="insight-icon">
                    <i className={`fas ${insight.icon}`}></i>
                  </div>
                  <h3 className="insight-title">{insight.title}</h3>
                  <p className="insight-description">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Start Your Success Story</h2>
              <p className="cta-subtitle">
                Join 500+ businesses that have transformed their agricultural procurement 
                with Farm Vantara's AgriTech platform. Let's write your success story.
              </p>
              
              <div className="cta-buttons">
                <Link to="/register?role=business" className="btn-cta-primary">
                  <i className="fas fa-file-signature"></i> Register Your Business
                </Link>
                <Link to="/contact" className="btn-cta-secondary">
                  <i className="fas fa-calendar-alt"></i> Schedule Consultation
                </Link>
                <a href="tel:+919553774933" className="btn-cta-secondary">
                  <i className="fas fa-phone-alt"></i> Call Procurement Head
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

export default CaseStudies;