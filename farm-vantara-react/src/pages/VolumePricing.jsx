import React, { useState, useEffect, useRef } from 'react';
import '../styles/VolumePricing.css';

const VolumePricing = () => {
  // ---------- State ----------
  const [menuActive, setMenuActive] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [counters, setCounters] = useState({
    clientsServed: 0,
    maxSavings: 0,
    avgDiscount: 0
  });
  const [cardsVisible, setCardsVisible] = useState({
    tier: [],
    discount: [],
    benefit: []
  });

  // Refs for cards
  const tierRefs = useRef([]);
  const discountRefs = useRef([]);
  const benefitRefs = useRef([]);

  // ---------- Mobile Menu Toggle ----------
  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  // ---------- Header Scroll Effect ----------
  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ---------- Animated Counters ----------
  useEffect(() => {
    const animateCounter = (target, key, suffix = '') => {
      let start = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCounters(prev => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 30);
    };

    animateCounter(850, 'clientsServed');
    animateCounter(35, 'maxSavings');
    animateCounter(22, 'avgDiscount');
  }, []);

  // ---------- Intersection Observer for Cards ----------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = entry.target.dataset.index;
            const type = entry.target.dataset.type;
            if (type === 'tier') {
              setCardsVisible(prev => {
                const newVisible = [...prev.tier];
                newVisible[index] = true;
                return { ...prev, tier: newVisible };
              });
            } else if (type === 'discount') {
              setCardsVisible(prev => {
                const newVisible = [...prev.discount];
                newVisible[index] = true;
                return { ...prev, discount: newVisible };
              });
            } else if (type === 'benefit') {
              setCardsVisible(prev => {
                const newVisible = [...prev.benefit];
                newVisible[index] = true;
                return { ...prev, benefit: newVisible };
              });
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    tierRefs.current.forEach(ref => ref && observer.observe(ref));
    discountRefs.current.forEach(ref => ref && observer.observe(ref));
    benefitRefs.current.forEach(ref => ref && observer.observe(ref));

    return () => observer.disconnect();
  }, []);

  // ---------- Quote Request Confirmation ----------
  const handleQuoteClick = (e, href) => {
    if (href.startsWith('tel:') || href.startsWith('mailto:')) {
      if (!confirm('Our pricing team will contact you within 15 minutes with a customized quote. Continue?')) {
        e.preventDefault();
      }
    }
  };

  // ---------- Smooth Scroll for Anchor Links ----------
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href && href.startsWith('#') && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => anchor.addEventListener('click', handleAnchorClick));
    return () => anchors.forEach(anchor => anchor.removeEventListener('click', handleAnchorClick));
  }, []);

  // ---------- JSX ----------
  return (
    <>
      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="pricing-hero">
          <div className="container">
            <div className="pricing-hero-content">
              {/* Text Content */}
              <div className="hero-text-content">
                <h1 className="pricing-hero-title">Volume Pricing for Bulk Procurement</h1>
                <p className="pricing-hero-subtitle">
                  Maximize your savings with our tiered volume pricing structure. The more you order, the more you save.
                  Get competitive pricing for bulk farm produce procurement with transparent cost structures.
                </p>
                <div className="hero-stats">
                  <div className="hero-stat-item">
                    <span className="hero-stat-number" id="clientsServed">{counters.clientsServed}+</span>
                    <span className="hero-stat-label">Businesses Saving</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-number" id="maxSavings">{counters.maxSavings}%</span>
                    <span className="hero-stat-label">Max. Savings</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-number" id="avgDiscount">{counters.avgDiscount}%</span>
                    <span className="hero-stat-label">Avg. Volume Discount</span>
                  </div>
                </div>
              </div>

              {/* Animated Visual Elements */}
              <div className="hero-visual-container" aria-hidden="true">
                <div className="hero-animation-area">
                  {/* Floating Pricing Elements */}
                  <div className="floating-element floating-element-1">
                    <i className="fas fa-chart-bar"></i>
                  </div>
                  <div className="floating-element floating-element-2">
                    <i className="fas fa-percentage"></i>
                  </div>
                  <div className="floating-element floating-element-3">
                    <i className="fas fa-box-open"></i>
                  </div>
                  <div className="floating-element floating-element-4">
                    <i className="fas fa-hand-holding-usd"></i>
                  </div>

                  {/* Animated Price Charts */}
                  <div className="price-chart chart-1">
                    <div className="chart-content">
                      <div className="chart-title">Vegetables</div>
                      <div className="chart-price">₹850/q</div>
                      <div className="chart-savings">Save 25%</div>
                    </div>
                  </div>

                  <div className="price-chart chart-2">
                    <div className="chart-content">
                      <div className="chart-title">Fruits</div>
                      <div className="chart-price">₹1,800/q</div>
                      <div className="chart-savings">Save 30%</div>
                    </div>
                  </div>

                  {/* Savings Arrows */}
                  <div className="savings-arrow arrow-1">
                    <i className="fas fa-arrow-down"></i>
                  </div>
                  <div className="savings-arrow arrow-2">
                    <i className="fas fa-arrow-down"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="pricing-tiers">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Volume Pricing Tiers</h2>
              <p className="section-subtitle">Choose the pricing tier that matches your procurement volume and save accordingly</p>
            </div>
            <div className="tiers-container">
              {/* Basic Tier */}
              <div
                className="tier-card"
                ref={el => (tierRefs.current[0] = el)}
                data-type="tier"
                data-index="0"
                style={{ opacity: cardsVisible.tier[0] ? 1 : 0, transform: cardsVisible.tier[0] ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
              >
                <div className="tier-header">
                  <div className="tier-icon"><i className="fas fa-seedling"></i></div>
                  <h3 className="tier-title">Starter</h3>
                  <p className="tier-description">For small businesses & startups</p>
                </div>
                <div className="tier-price">
                  <div className="price-amount">Market -15%</div>
                  <div className="price-period">Per quintal basis</div>
                </div>
                <div className="tier-features">
                  <ul>
                    <li><i className="fas fa-check"></i> Up to 50 quintals/month</li>
                    <li><i className="fas fa-check"></i> 15% below market rates</li>
                    <li><i className="fas fa-check"></i> Weekly deliveries</li>
                    <li><i className="fas fa-check"></i> Basic quality checks</li>
                    <li><i className="fas fa-check"></i> Email support</li>
                    <li><i className="fas fa-check"></i> Standard packaging</li>
                  </ul>
                </div>
                <div className="tier-cta">
                  <a href="#custom-quote" className="btn-tier btn-tier-secondary">
                    <i className="fas fa-calculator"></i> Calculate Savings
                  </a>
                </div>
              </div>

              {/* Professional Tier */}
              <div
                className="tier-card"
                ref={el => (tierRefs.current[1] = el)}
                data-type="tier"
                data-index="1"
                style={{ opacity: cardsVisible.tier[1] ? 1 : 0, transform: cardsVisible.tier[1] ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
              >
                <div className="tier-header">
                  <div className="tier-popular">Most Popular</div>
                  <div className="tier-icon"><i className="fas fa-industry"></i></div>
                  <h3 className="tier-title">Professional</h3>
                  <p className="tier-description">For medium businesses & chains</p>
                </div>
                <div className="tier-price">
                  <div className="price-amount">Market -25%</div>
                  <div className="price-period">Per quintal basis</div>
                </div>
                <div className="tier-features">
                  <ul>
                    <li><i className="fas fa-check"></i> 50-200 quintals/month</li>
                    <li><i className="fas fa-check"></i> 25% below market rates</li>
                    <li><i className="fas fa-check"></i> Twice weekly deliveries</li>
                    <li><i className="fas fa-check"></i> Advanced quality checks</li>
                    <li><i className="fas fa-check"></i> Phone & email support</li>
                    <li><i className="fas fa-check"></i> Custom packaging options</li>
                  </ul>
                </div>
                <div className="tier-cta">
                  <a href="#custom-quote" className="btn-tier btn-tier-primary">
                    <i className="fas fa-bolt"></i> Get This Tier
                  </a>
                </div>
              </div>

              {/* Enterprise Tier */}
              <div
                className="tier-card"
                ref={el => (tierRefs.current[2] = el)}
                data-type="tier"
                data-index="2"
                style={{ opacity: cardsVisible.tier[2] ? 1 : 0, transform: cardsVisible.tier[2] ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
              >
                <div className="tier-header">
                  <div className="tier-icon"><i className="fas fa-building"></i></div>
                  <h3 className="tier-title">Enterprise</h3>
                  <p className="tier-description">For large businesses & processors</p>
                </div>
                <div className="tier-price">
                  <div className="price-amount">Market -35%</div>
                  <div className="price-period">Per quintal basis</div>
                </div>
                <div className="tier-features">
                  <ul>
                    <li><i className="fas fa-check"></i> 200+ quintals/month</li>
                    <li><i className="fas fa-check"></i> 35% below market rates</li>
                    <li><i className="fas fa-check"></i> Daily deliveries</li>
                    <li><i className="fas fa-check"></i> Premium quality checks</li>
                    <li><i className="fas fa-check"></i> Dedicated account manager</li>
                    <li><i className="fas fa-check"></i> Branded packaging</li>
                  </ul>
                </div>
                <div className="tier-cta">
                  <a href="#custom-quote" className="btn-tier btn-tier-secondary">
                    <i className="fas fa-phone-alt"></i> Contact Sales
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Price Comparison - ALL PRICES IN BLACK */}
        <section className="price-comparison">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Price Comparison Chart</h2>
              <p className="section-subtitle">See how our volume pricing compares with traditional procurement methods</p>
            </div>
            <div className="comparison-container">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Traditional Wholesale</th>
                    <th>Farm Vantara Starter</th>
                    <th>Farm Vantara Professional</th>
                    <th>Farm Vantara Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Fresh Vegetables</td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$1,200/Quintal</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$1,020/Quintal</span>
                        <span className="savings-badge">Save 15%</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$900/Quintal</span>
                        <span className="savings-badge">Save 25%</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$780/Quintal</span>
                        <span className="savings-badge">Save 35%</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Seasonal Fruits</td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$2,500/Quintal</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$2,125/Quintal</span>
                        <span className="savings-badge">Save 15%</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$1,875/Quintal</span>
                        <span className="savings-badge">Save 25%</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$1,625/Quintal</span>
                        <span className="savings-badge">Save 35%</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Grains & Pulses</td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$3,200/Quintal</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$2,720/Quintal</span>
                        <span className="savings-badge">Save 15%</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$2,400/Quintal</span>
                        <span className="savings-badge">Save 25%</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$2,080/Quintal</span>
                        <span className="savings-badge">Save 35%</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Organic Produce</td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$4,000/Quintal</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$3,400/Quintal</span>
                        <span className="savings-badge">Save 15%</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$3,000/Quintal</span>
                        <span className="savings-badge">Save 25%</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      <div className="price-row">
                        <span className="price-value black-price bold-price">$2,600/Quintal</span>
                        <span className="savings-badge">Save 35%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Volume Discounts */}
        <section className="volume-discounts">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Volume Discount Structure</h2>
              <p className="section-subtitle">Our progressive discount model rewards higher procurement volumes</p>
            </div>
            <div className="discounts-container">
              {[
                { icon: 'fa-chart-line', title: 'Progressive Discounts', desc: 'Discount increases progressively as your order volume grows throughout the month.', percent: '5-35%', range: 'Based on monthly volume' },
                { icon: 'fa-calendar-alt', title: 'Quarterly Contracts', desc: 'Commit to quarterly volumes and get additional 5% discount on top of volume pricing.', percent: '+5%', range: 'Quarterly commitment bonus' },
                { icon: 'fa-handshake', title: 'Annual Agreements', desc: 'Sign annual procurement agreements for maximum savings with price lock guarantees.', percent: '+10%', range: 'Annual agreement bonus' }
              ].map((item, idx) => (
                <div
                  className="discount-card"
                  key={idx}
                  ref={el => (discountRefs.current[idx] = el)}
                  data-type="discount"
                  data-index={idx}
                  style={{ opacity: cardsVisible.discount[idx] ? 1 : 0, transform: cardsVisible.discount[idx] ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
                >
                  <div className="discount-icon"><i className={`fas ${item.icon}`}></i></div>
                  <h3 className="discount-title">{item.title}</h3>
                  <p className="discount-description">{item.desc}</p>
                  <div className="discount-percentage">{item.percent}</div>
                  <div className="discount-range">{item.range}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contract Benefits - Modern Style (Second Image) */}
        <section className="contract-benefits">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Benefits of Volume Contracts</h2>
              <p className="section-subtitle">Beyond just pricing - Additional benefits with volume procurement contracts</p>
            </div>
            <div className="benefits-grid">
              {/* Price Lock Guarantee */}
              <div
                className="benefit-card-modern"
                ref={el => (benefitRefs.current[0] = el)}
                data-type="benefit"
                data-index="0"
                style={{ opacity: cardsVisible.benefit[0] ? 1 : 0, transform: cardsVisible.benefit[0] ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
              >
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon-circle" style={{ background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)' }}>
                    <i className="fas fa-lock"></i>
                  </div>
                </div>
                <h3 className="benefit-title-modern">Price Lock Guarantee</h3>
                <p className="benefit-description-modern">
                  Lock in prices for 3-12 months, protecting your business from market fluctuations and seasonal price spikes.
                </p>
              </div>

              {/* Priority Logistics */}
              <div
                className="benefit-card-modern"
                ref={el => (benefitRefs.current[1] = el)}
                data-type="benefit"
                data-index="1"
                style={{ opacity: cardsVisible.benefit[1] ? 1 : 0, transform: cardsVisible.benefit[1] ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
              >
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon-circle" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                    <i className="fas fa-truck"></i>
                  </div>
                </div>
                <h3 className="benefit-title-modern">Priority Logistics</h3>
                <p className="benefit-description-modern">
                  Get priority in our logistics network with guaranteed delivery slots and reduced transit times.
                </p>
              </div>

              {/* Quality Assurance */}
              <div
                className="benefit-card-modern"
                ref={el => (benefitRefs.current[2] = el)}
                data-type="benefit"
                data-index="2"
                style={{ opacity: cardsVisible.benefit[2] ? 1 : 0, transform: cardsVisible.benefit[2] ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
              >
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon-circle" style={{ background: 'linear-gradient(135deg, #F37335 0%, #FDC830 100%)' }}>
                    <i className="fas fa-clipboard-check"></i>
                  </div>
                </div>
                <h3 className="benefit-title-modern">Quality Assurance</h3>
                <p className="benefit-description-modern">
                  Enhanced quality control with batch-wise testing, certifications, and consistency guarantees.
                </p>
              </div>

              {/* Dedicated Support */}
              <div
                className="benefit-card-modern"
                ref={el => (benefitRefs.current[3] = el)}
                data-type="benefit"
                data-index="3"
                style={{ opacity: cardsVisible.benefit[3] ? 1 : 0, transform: cardsVisible.benefit[3] ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
              >
                <div className="benefit-icon-wrapper">
                  <div className="benefit-icon-circle" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <i className="fas fa-headset"></i>
                  </div>
                </div>
                <h3 className="benefit-title-modern">Dedicated Support</h3>
                <p className="benefit-description-modern">
                  24/7 dedicated account manager for order tracking, issue resolution, and procurement optimization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - ALL TEXT IN WHITE */}
        <section className="pricing-cta" id="custom-quote">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Get Your Custom Volume Pricing</h2>
              <p className="cta-subtitle">Share your procurement requirements and get a personalized quote with maximum savings</p>
              <div className="cta-buttons">
                <a href="tel:+919553774933" className="btn-cta-primary" onClick={(e) => handleQuoteClick(e, 'tel:+919553774933')}>
                  <i className="fas fa-phone-alt"></i> Call for Quote
                </a>
                <a href="mailto:pricing@farmvantara.com" className="btn-cta-secondary" onClick={(e) => handleQuoteClick(e, 'mailto:pricing@farmvantara.com')}>
                  <i className="fas fa-envelope"></i> Email Requirements
                </a>
                <a href="https://wa.me/919553774933" className="btn-cta-secondary" style={{ background: '#25d366', border: 'none' }}>
                  <i className="fab fa-whatsapp"></i> WhatsApp Quote
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* WhatsApp Float */}
      <a href="https://wa.me/919553774933" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat with our pricing team">
        <i className="fab fa-whatsapp"></i>
        <span className="whatsapp-text">Get Quote</span>
      </a>
    </>
  );
};

export default VolumePricing;