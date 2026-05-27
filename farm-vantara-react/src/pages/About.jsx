import React, { useEffect, useRef, useState } from 'react';
import '../styles/About.css';

const About = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const timelineRefs = useRef([]);
  const statsRef = useRef(null);
  const navMenuRef = useRef(null);
  const mobileBtnRef = useRef(null);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuActive(prev => !prev);
  };

  // Close menu when clicking outside
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuActive(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href && href.startsWith('#') && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          if (window.innerWidth <= 768) {
            setMenuActive(false);
          }
        }
      }
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => anchor.addEventListener('click', handleAnchorClick));
    return () => anchors.forEach(anchor => anchor.removeEventListener('click', handleAnchorClick));
  }, []);

  // Animate stats on scroll
  useEffect(() => {
    if (!statsRef.current || statsAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach((stat) => {
              stat.classList.add('animated');
              const target = parseInt(stat.getAttribute('data-count'), 10);
              let current = 0;
              const increment = target / 50;
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  stat.textContent = target.toLocaleString() + '+';
                  clearInterval(timer);
                } else {
                  stat.textContent = Math.floor(current).toLocaleString();
                }
              }, 30);
            });
            setStatsAnimated(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsAnimated]);

  // Animate timeline items on scroll
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
      { threshold: 0.3 }
    );

    timelineRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });
    return () => observer.disconnect();
  }, []);

  // Lazy load images
  useEffect(() => {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.add('loaded');
            }
            imageObserver.unobserve(img);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('img[data-src]').forEach((img) => imageObserver.observe(img));
    return () => imageObserver.disconnect();
  }, []);

  // Optional: register service worker (you may keep or remove)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => console.log('SW registered:', reg))
        .catch((err) => console.log('SW failed:', err));
    }
  }, []);

  return (
    <>
      

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Transforming Indian Agriculture Through Technology</h1>
              <p className="hero-subtitle">
                Farm Vantara is India's premier AgriTech platform, connecting farmers directly with markets.
                We're on a mission to revolutionize agricultural trade by eliminating intermediaries,
                ensuring fair prices, and creating a transparent, efficient supply chain.
              </p>
              <a href="#our-story" className="btn btn-primary">
                <i className="fas fa-play-circle"></i> Watch Our Story
              </a>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-vision" id="mission">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Mission & Vision</h2>
              <p className="section-subtitle">Driving agricultural transformation through innovation and technology</p>
            </div>

            <div className="mv-grid">
              <div className="mv-card">
                <div className="mv-icon">
                  <i className="fas fa-bullseye"></i>
                </div>
                <h3 className="mv-title">Our Mission</h3>
                <p className="mv-description">
                  To empower Indian farmers with direct market access, eliminate intermediaries,
                  and ensure fair pricing through technology-driven solutions. We aim to increase
                  farmer incomes by 30-40% while providing consumers with fresh, traceable produce.
                </p>
              </div>

              <div className="mv-card">
                <div className="mv-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <h3 className="mv-title">Our Vision</h3>
                <p className="mv-description">
                  To become India's most trusted agricultural ecosystem, connecting 1 million farmers
                  with markets by 2025. We envision a future where every farmer gets fair value for
                  their produce and every consumer accesses fresh, sustainable agricultural products.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story (Timeline) */}
        <section className="timeline-section" id="our-story">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Journey</h2>
              <p className="section-subtitle">From a simple idea to India's leading AgriTech platform</p>
            </div>

            <div className="timeline">
              {[
                {
                  year: '2020',
                  title: 'The Beginning',
                  desc: 'Founded by agricultural engineers and tech entrepreneurs who witnessed the challenges faced by farmers in rural Maharashtra. Started as a small pilot project connecting 50 farmers in Nashik district.',
                  icon: 'fa-seedling',
                },
                {
                  year: '2021',
                  title: 'Platform Launch',
                  desc: 'Launched the Farm Vantara digital platform with seed funding. Expanded to 5 states, onboarded 1,000+ farmers, and processed ₹5 crore in transactions.',
                  icon: 'fa-rocket',
                },
                {
                  year: '2022',
                  title: 'National Expansion',
                  desc: 'Expanded operations to 15 states, onboarded 10,000+ farmers. Introduced cold chain logistics and quality assurance programs. Recognized as "Most Innovative AgriTech Startup" by NITI Aayog.',
                  icon: 'fa-expand-arrows-alt',
                },
                {
                  year: '2023',
                  title: 'Market Leadership',
                  desc: 'Crossed 50,000 farmers on platform, expanded to B2B and B2C segments. Launched mobile app with regional language support. Processed ₹100+ crore in transactions annually.',
                  icon: 'fa-trophy',
                },
                {
                  year: '2024',
                  title: 'Future Roadmap',
                  desc: 'Targeting 1 million farmers by 2025. Introducing AI-powered crop advisory, blockchain-based traceability, and sustainable farming initiatives. Expanding to international markets.',
                  icon: 'fa-chart-line',
                },
              ].map((item, index) => (
                <div
                  className="timeline-item"
                  key={index}
                  ref={(el) => (timelineRefs.current[index] = el)}
                >
                  <div className="timeline-marker">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <div className="timeline-content">
                    <span className="timeline-year">{item.year}</span>
                    <h3 className="timeline-title">{item.title}</h3>
                    <p className="timeline-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="values-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Core Values</h2>
              <p className="section-subtitle">The principles that guide everything we do</p>
            </div>

            <div className="values-grid">
              {[
                { icon: 'fa-handshake', title: 'Farmer First', desc: 'Every decision we make prioritizes farmer welfare. We believe in empowering farmers with technology, knowledge, and fair market access.' },
                { icon: 'fa-shield-alt', title: 'Transparency', desc: 'Complete visibility in pricing, transactions, and supply chain. No hidden charges, no middlemen exploitation.' },
                { icon: 'fa-leaf', title: 'Sustainability', desc: 'Promoting eco-friendly farming practices, reducing food miles, and minimizing agricultural waste through efficient supply chains.' },
                { icon: 'fa-users', title: 'Community', desc: 'Building strong agricultural communities where farmers support each other, share knowledge, and grow together.' },
                { icon: 'fa-lightbulb', title: 'Innovation', desc: 'Continuously evolving our technology to solve real agricultural problems and create better outcomes for all stakeholders.' },
                { icon: 'fa-heart', title: 'Impact', desc: 'Measuring success by the positive impact we create - increased farmer incomes, reduced food waste, and happier consumers.' },
              ].map((value, idx) => (
                <div className="value-card" key={idx}>
                  <div className="value-icon">
                    <i className={`fas ${value.icon}`}></i>
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="team-section" id="team">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Meet Our Leadership</h2>
              <p className="section-subtitle">The passionate team driving agricultural transformation</p>
            </div>

            <div className="team-grid">
              {[
                {
                  name: 'Arjun Sharma',
                  role: 'Founder & CEO',
                  bio: 'Former agricultural engineer with IIT background. 15+ years experience in agricultural technology and rural development.',
                  img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  social: { linkedin: '#', twitter: '#', instagram: '#' },
                },
                {
                  name: 'Priya Patel',
                  role: 'Chief Technology Officer',
                  bio: 'Tech lead with experience at leading tech companies. Passionate about using technology to solve agricultural challenges.',
                  img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  social: { linkedin: '#', twitter: '#', github: '#' },
                },
                {
                  name: 'Rajesh Kumar',
                  role: 'Head of Farmer Relations',
                  bio: 'Third-generation farmer turned agricultural entrepreneur. Leads our farmer onboarding and support initiatives across India.',
                  img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  social: { linkedin: '#', facebook: '#', whatsapp: '#' },
                },
                {
                  name: 'Anjali Mehta',
                  role: 'Chief Operations Officer',
                  bio: 'Supply chain expert with experience in FMCG and agriculture. Manages logistics, quality control, and operations nationwide.',
                  img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  social: { linkedin: '#', twitter: '#', email: '#' },
                },
              ].map((member, idx) => (
                <div className="team-card" key={idx}>
                  <div className="team-image">
                    <img data-src={member.img} src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" loading="lazy" alt={member.name} />
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                    <p className="team-bio">{member.bio}</p>
                    <div className="social-links">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} aria-label={`LinkedIn profile of ${member.name}`}><i className="fab fa-linkedin-in"></i></a>
                      )}
                      {member.social.twitter && (
                        <a href={member.social.twitter} aria-label={`Twitter profile of ${member.name}`}><i className="fab fa-twitter"></i></a>
                      )}
                      {member.social.instagram && (
                        <a href={member.social.instagram} aria-label={`Instagram profile of ${member.name}`}><i className="fab fa-instagram"></i></a>
                      )}
                      {member.social.github && (
                        <a href={member.social.github} aria-label={`GitHub profile of ${member.name}`}><i className="fab fa-github"></i></a>
                      )}
                      {member.social.facebook && (
                        <a href={member.social.facebook} aria-label={`Facebook profile of ${member.name}`}><i className="fab fa-facebook-f"></i></a>
                      )}
                      {member.social.whatsapp && (
                        <a href={member.social.whatsapp} aria-label={`WhatsApp contact for ${member.name}`}><i className="fab fa-whatsapp"></i></a>
                      )}
                      {member.social.email && (
                        <a href={`mailto:${member.social.email}`} aria-label={`Email ${member.name}`}><i className="fas fa-envelope"></i></a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-section" ref={statsRef}>
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number" data-count="50000">0</div>
                <div className="stat-label">Farmers Empowered</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" data-count="100">0</div>
                <div className="stat-label">Annual Transactions (₹Cr+)</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" data-count="25">0</div>
                <div className="stat-label">States Covered</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" data-count="40">0</div>
                <div className="stat-label">Avg. Income Increase %</div>
              </div>
            </div>
          </div>
        </section>

        {/* Awards */}
        <section className="mission-vision">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Awards & Recognition</h2>
              <p className="section-subtitle">Recognized for our impact and innovation</p>
            </div>

            <div className="values-grid">
              {[
                {
                  icon: 'fa-award',
                  bg: 'var(--gradient-yellow)',
                  title: 'Best AgriTech Startup 2023',
                  desc: 'Awarded by NITI Aayog for innovative approach to farmer empowerment and agricultural digitization.',
                },
                {
                  icon: 'fa-trophy',
                  bg: 'var(--gradient-blue)',
                  title: 'Social Impact Award',
                  desc: 'Recognized by Confederation of Indian Industry (CII) for significant positive impact on rural communities.',
                },
                {
                  icon: 'fa-star',
                  bg: 'var(--gradient-primary)',
                  title: 'Digital India Award',
                  desc: 'Honored by Ministry of Electronics & IT for excellence in digital innovation for agricultural transformation.',
                },
              ].map((award, idx) => (
                <div className="value-card" key={idx}>
                  <div className="value-icon" style={{ background: award.bg }}>
                    <i className={`fas ${award.icon}`}></i>
                  </div>
                  <h3 className="value-title">{award.title}</h3>
                  <p className="value-description">{award.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2 className="cta-title">Join the Agricultural Revolution</h2>
              <p className="cta-description">
                Whether you're a farmer looking for better markets, a business seeking quality produce,
                or someone passionate about transforming Indian agriculture - there's a place for you
                in the Farm Vantara community.
              </p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/register-farmer" className="btn btn-primary">
                  <i className="fas fa-tractor"></i> Join as Farmer
                </a>
                <a href="/register-business" className="btn" style={{ background: 'var(--accent-yellow)', color: 'var(--text-dark)' }}>
                  <i className="fas fa-building"></i> Register Business
                </a>
                <a href="/careers" className="btn" style={{ background: 'var(--light-gray)', color: 'var(--text-dark)' }}>
                  <i className="fas fa-users"></i> Join Our Team
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;