// src/pages/Impact.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Impact.css";

const Impact = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({});

  const navMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);
  const statsRef = useRef([]);



  // Impact stats
  const impactStats = [
    { number: '5,000+', label: 'Farmers Empowered', value: 5000, suffix: '+' },
    { number: '40%', label: 'Average Income Increase', value: 40, suffix: '%' },
    { number: '250+', label: 'Villages Transformed', value: 250, suffix: '+' },
    { number: '₹50Cr+', label: 'Additional Farmer Income', value: 50, suffix: 'Cr+' }
  ];

  // Impact areas cards
  const impactAreas = [
    {
      icon: 'fa-hand-holding-usd',
      title: 'Economic Empowerment',
      description: 'Direct market access and fair pricing have transformed farmer incomes and rural economies.',
      highlights: [
        '30-40% higher prices for farmers',
        '24-hour payment guarantee',
        'Zero middleman commission',
        'Access to premium markets'
      ]
    },
    {
      icon: 'fa-leaf',
      title: 'Sustainable Agriculture',
      description: 'Promoting eco-friendly farming practices and reducing environmental footprint.',
      highlights: [
        '30% reduction in food waste',
        'Promotion of organic farming',
        'Water conservation initiatives',
        'Carbon footprint reduction'
      ]
    },
    {
      icon: 'fa-graduation-cap',
      title: 'Knowledge & Technology',
      description: 'Equipping farmers with modern techniques and digital tools for better decision-making.',
      highlights: [
        'Digital literacy programs',
        'Market intelligence access',
        'Modern farming techniques',
        'Weather advisory services'
      ]
    },
    {
      icon: 'fa-users',
      title: 'Community Development',
      description: 'Strengthening rural communities through collective growth and support systems.',
      highlights: [
        'Women farmer empowerment',
        'Youth employment in agri-tech',
        'Community infrastructure',
        'Healthcare initiatives'
      ]
    }
  ];

  // Success stories
  const successStories = [
    {
      title: 'From Struggle to Success',
      location: 'Punjab',
      description: 'Rajesh Kumar was struggling with middlemen and inconsistent prices. After joining Farm Vantara, he gained direct access to premium markets in Delhi and Mumbai.',
      quote: 'Farm Vantara changed my life. I went from worrying about prices to focusing on quality.',
      stats: [
        { value: '250%', label: 'Income Growth' },
        { value: '2x', label: 'Land Expansion' }
      ],
      image: 'https://www.agrifarming.in/wp-content/uploads/2021/07/agriculture-1793398_1920.jpg'
    },
    {
      title: 'Organic Farming Pioneer',
      location: 'Maharashtra',
      description: 'Priya Sharma converted to organic farming but struggled to find buyers willing to pay premium prices. Farm Vantara connected her with health-conscious consumers across India.',
      quote: 'Finally, my organic produce gets the recognition and price it deserves.',
      stats: [
        { value: '3.5x', label: 'Price Realization' },
        { value: '15', label: 'Cities Served' }
      ],
      image: 'https://vikalpsangam.org/wp-content/uploads/migrate/Perspectives/amit_khurana_dte_persp_on_organic_farming_inadequacy_in_india.jpg'
    },
    {
      title: 'Digital Farming Revolution',
      location: 'Gujarat',
      description: 'Arun Patel embraced technology through Farm Vantara\'s platform, using data analytics to optimize crop selection and timing for maximum profitability.',
      quote: 'Data-driven farming has made me more profitable than ever before.',
      stats: [
        { value: '40%', label: 'Yield Increase' },
        { value: '60%', label: 'Cost Reduction' }
      ],
      image: 'https://eng.ruralvoice.in/uploads/images/2024/09/image_750x_66d864decc1a8.jpg'
    }
  ];

  // Environmental metrics
  const environmentalMetrics = [
    { value: '35%', label: 'Reduced Food Waste' },
    { value: '40%', label: 'Lower Carbon Footprint' },
    { value: '1,200+', label: 'Acres of Organic Farming' },
    { value: '60%', label: 'Water Conservation' }
  ];

  // Environmental initiatives
  const environmentalInitiatives = [
    'Promotion of organic and natural farming methods',
    'Reduction of food miles through local market connections',
    'Minimization of post-harvest losses through efficient logistics',
    'Water conservation and efficient irrigation support',
    'Reduction in chemical fertilizer and pesticide usage'
  ];

  // Partners
  const partners = [
    { icon: 'fa-university' },
    { icon: 'fa-handshake' },
    { icon: 'fa-leaf' },
    { icon: 'fa-globe-asia' },
    { icon: 'fa-seedling' }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: 'Farm Vantara has revolutionized how we think about agricultural trade in India. Their impact on rural economies is truly remarkable.',
      name: 'Dr. Anil Sharma',
      role: 'Agricultural Economist'
    },
    {
      quote: 'As a restaurant chain, we value consistent quality and reliable supply. Farm Vantara delivers both while supporting farmers directly.',
      name: 'Sanjay Mehta',
      role: 'CEO, FreshBite Restaurants'
    },
    {
      quote: 'The training programs and market access provided by Farm Vantara have transformed our village\'s agricultural practices.',
      name: 'Sarita Devi',
      role: 'Women Farmer Collective Leader'
    }
  ];

  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for stats animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statElement = entry.target.querySelector('.stat-number');
            if (statElement && !animatedStats[statElement.dataset.index]) {
              const index = statElement.dataset.index;
              const targetStat = impactStats[index];
              const targetValue = targetStat.value;
              const suffix = targetStat.suffix || '';
              
              animateCounter(statElement, targetValue, suffix, 1500);
              
              setAnimatedStats(prev => ({
                ...prev,
                [index]: true
              }));
            }
            entry.target.classList.add('animated');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('.impact-stat').forEach((stat) => {
      observer.observe(stat);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [animatedStats]);

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

  const animateCounter = (element, target, suffix, duration) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start) + suffix;
      }
    }, 16);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
  };

  return (
    <>

      
      {/* Main Content */}
      <main id="main-content">
        {/* Impact Hero Section */}
        <section className="impact-hero">
          <div className="container">
            <div className="impact-hero-content">
              <h1>Transforming Agriculture. Empowering Farmers.</h1>
              <p>At Farm Vantara, we measure our success not just in transactions, but in the positive impact we create across India's agricultural ecosystem. Discover how we're revolutionizing farming and rural communities.</p>
              
              <div className="impact-stats">
                {impactStats.map((stat, index) => (
                  <div key={index} className="impact-stat" ref={el => statsRef.current[index] = el}>
                    <div className="stat-number" data-index={index}>
                      {stat.number}
                    </div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Impact Areas Section */}
        <section className="impact-areas">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Impact Areas</h2>
              <p className="section-subtitle">Creating sustainable change across multiple dimensions of Indian agriculture</p>
            </div>
            
            <div className="impact-grid">
              {impactAreas.map((area, index) => (
                <div key={index} className="impact-card">
                  <div className="impact-icon">
                    <i className={`fas ${area.icon}`}></i>
                  </div>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                  <ul className="impact-highlights">
                    {area.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="success-stories" id="stories">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Success Stories</h2>
              <p className="section-subtitle">Real transformations from farmers across India</p>
            </div>
            
            <div className="stories-grid">
              {successStories.map((story, index) => (
                <div key={index} className="story-card">
                  <div className="story-image">
                    <img src={story.image} alt={story.title} loading="lazy" />
                  </div>
                  <div className="story-content">
                    <h3 className="story-title">{story.title}</h3>
                    <div className="story-location">
                      <i className="fas fa-map-marker-alt"></i> {story.location}
                    </div>
                    <p>{story.description}</p>
                    <blockquote className="story-quote">
                      "{story.quote}"
                    </blockquote>
                    <div className="story-stats">
                      {story.stats.map((stat, idx) => (
                        <div key={idx} className="story-stat">
                          <div className="story-stat-value">{stat.value}</div>
                          <div className="story-stat-label">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Environmental Impact Section */}
        <section className="environmental-impact">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Environmental Sustainability</h2>
              <p className="section-subtitle">Reducing agriculture's environmental footprint while increasing productivity</p>
            </div>
            
            <div className="environment-content">
              <div className="environment-text">
                <h3>Our Green Commitment</h3>
                <p>At Farm Vantara, we believe sustainable agriculture is essential for our planet's future. We're working to reduce the environmental impact of farming while maintaining high productivity.</p>
                
                <h3>Key Environmental Initiatives</h3>
                <ul className="impact-highlights">
                  {environmentalInitiatives.map((initiative, index) => (
                    <li key={index}>{initiative}</li>
                  ))}
                </ul>
                
                <div className="environment-metrics">
                  {environmentalMetrics.map((metric, index) => (
                    <div key={index} className="metric-item">
                      <div className="metric-value">{metric.value}</div>
                      <div className="metric-label">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="environment-image">
                <img 
                  src="https://www.commsbusiness.co.uk/media/4rqbq1l0/environmental.jpeg?width=1002&height=668&bgcolor=White&v=1daea36b0ac5af0" 
                  alt="Sustainable farming practices in action"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Partnerships Section */}
        <section className="partnerships">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Partners in Impact</h2>
              <p className="section-subtitle">Collaborating with organizations to amplify our positive impact</p>
            </div>
            
            <div className="partners-grid">
              {partners.map((partner, index) => (
                <div key={index} className="partner-logo">
                  <i className={`fas ${partner.icon} fa-3x`}></i>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">What Our Community Says</h2>
              <p className="section-subtitle">Hear from farmers, partners, and agricultural experts</p>
            </div>
            
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-quote">
                    "{testimonial.quote}"
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <i className="fas fa-user fa-2x"></i>
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

        {/* Get Involved CTA */}
        <section className="get-involved">
          <div className="container">
            <h2>Be Part of the Change</h2>
            <p>Whether you're a farmer, business, consumer, or supporter, you can contribute to transforming Indian agriculture.</p>
            
            <div className="involved-buttons">
              <Link to="/register?role=farmer" className="btn-involved btn-involved-primary">
                <i className="fas fa-user-plus"></i> Join as Farmer
              </Link>
              <Link to="/contact" className="btn-involved btn-involved-secondary">
                <i className="fas fa-handshake"></i> Partner with Us
              </Link>
            </div>
          </div>
        </section>
      </main>

    
    </>
  );
};

export default Impact;