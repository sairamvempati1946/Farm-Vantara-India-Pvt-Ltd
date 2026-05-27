import React, { useState, useEffect, useRef } from 'react';
import '../styles/Blog.css';

const Blog = () => {
  // ---------- State ----------
  const [menuActive, setMenuActive] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [articles, setArticles] = useState([]);
  const [displayCount, setDisplayCount] = useState(3);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalArticle, setModalArticle] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [subscribers, setSubscribers] = useState(25000);
  const [openRate, setOpenRate] = useState(78);

  // ---------- Refs ----------
  const heroRef = useRef(null);
  const navMenuRef = useRef(null);
  const mobileBtnRef = useRef(null);
  const floatingElementsRef = useRef([]);
  const articleRefs = useRef([]);

  // ---------- Data ----------
  const categories = [
    { id: 'agritech', name: 'AgriTech Innovation', count: 45, icon: 'fa-robot' },
    { id: 'sustainability', name: 'Sustainable Farming', count: 38, icon: 'fa-leaf' },
    { id: 'market', name: 'Market Insights', count: 32, icon: 'fa-chart-line' },
    { id: 'quality', name: 'Quality Management', count: 28, icon: 'fa-award' },
    { id: 'success', name: 'Success Stories', count: 42, icon: 'fa-trophy' },
    { id: 'policy', name: 'Policy & Regulations', count: 25, icon: 'fa-balance-scale' }
  ];

  const allArticles = [
    {
      id: 1,
      category: 'agritech',
      trending: false,
      title: 'IoT Solutions for Small-Scale Farmers: Cost-Effective Implementation',
      excerpt: 'Discover affordable IoT solutions that help small farmers monitor soil moisture, weather conditions, and crop health in real-time. Learn how to implement these technologies with minimal investment.',
      author: 'Sanjay Kumar',
      date: 'March 12, 2025',
      readTime: '8 min',
      image: 'https://www.digi.com/getattachment/Blog/post/IoT-in-Agriculture/GettyImages-2167394255-1080x720.jpg?lang=en-US'
    },
    {
      id: 2,
      category: 'sustainability',
      trending: false,
      title: 'Transitioning to Organic Farming: A 12-Month Implementation Guide',
      excerpt: 'Step-by-step guide for farmers looking to transition from conventional to organic farming. Includes soil preparation, certification process, and market access strategies.',
      author: 'Priya Mehta',
      date: 'March 10, 2025',
      readTime: '10 min',
      image: 'https://cdn.sanity.io/images/h6kk644c/production/6b460776ac6fa81637092c9b824b757134d38273-2000x1050.png?w=3840&q=75&fit=clip&auto=format'
    },
    {
      id: 3,
      category: 'market',
      trending: false,
      title: '2025 Agricultural Market Outlook: Opportunities for Indian Farmers',
      excerpt: 'Analysis of emerging market trends, export opportunities, and domestic demand patterns for various crops. Learn which crops show highest profit potential this year.',
      author: 'Anil Sharma',
      date: 'March 8, 2025',
      readTime: '6 min',
      image: 'https://beehiiv-images-production.s3.amazonaws.com/uploads/asset/file/adb577fa-6e0a-41af-8920-0f9d4cc24d60/f3b719e9-e3c6-4851-8d64-8f7e7dfaac88_1792x1024.jpg?t=1716722272'
    },
    {
      id: 4,
      category: 'quality',
      trending: true,
      title: 'Post-Harvest Management Techniques to Reduce Losses by 40%',
      excerpt: 'Practical techniques for proper harvesting, storage, and transportation to minimize post-harvest losses. Includes low-cost storage solutions and quality preservation methods.',
      author: 'Dr. Ramesh Khanna',
      date: 'March 5, 2025',
      readTime: '9 min',
      image: 'https://cdn.felixinstruments.com/app/uploads/2022/12/25025741/blog-size-1400.jpg.webp'
    },
    {
      id: 5,
      category: 'success',
      trending: true,
      title: 'From Struggle to Success: How a Farmer Tripled Income Using Farm Vantara',
      excerpt: 'Inspiring story of Ravi Patel from Maharashtra who transformed his farming business by adopting technology and connecting directly with businesses through our platform.',
      author: 'Ravi Patel',
      date: 'March 3, 2025',
      readTime: '11 min',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      category: 'agritech',
      trending: false,
      title: 'Drone Technology in Agriculture: Applications and ROI Analysis',
      excerpt: 'Comprehensive guide to using drones for crop monitoring, spraying, and mapping. Includes cost-benefit analysis and government subsidy information for farmers.',
      author: 'Vikram Mehta',
      date: 'March 1, 2025',
      readTime: '7 min',
      image: 'https://wp.technologyreview.com/wp-content/uploads/2016/07/fotolia88050102subscriptionmonthlym-7.jpg?resize=854,569'
    }
  ];

  const trendingTopics = [
    { rank: 1, title: 'Climate-Resilient Crop Varieties', description: 'Exploring drought-resistant and flood-tolerant crops for changing climate patterns.', views: '15.2K', comments: 342 },
    { rank: 2, title: 'Direct-to-Consumer Farming Models', description: 'How farmers are bypassing traditional supply chains to reach consumers directly.', views: '12.8K', comments: 289 },
    { rank: 3, title: 'Smart Irrigation Systems', description: 'Water conservation through automated and sensor-based irrigation technologies.', views: '11.5K', comments: 215 }
  ];

  const contributors = [
    { initials: 'RK', name: 'Dr. Rajesh Kumar', role: 'AgriTech Specialist', bio: 'Former agricultural scientist with 20+ years experience in farm technology innovation and implementation across India.', articles: 42, followers: '8.7K' },
    { initials: 'PM', name: 'Priya Mehta', role: 'Sustainable Agriculture Expert', bio: 'Organic farming consultant helping farmers transition to sustainable practices while maintaining profitability.', articles: 35, followers: '6.2K' },
    { initials: 'AS', name: 'Anil Sharma', role: 'Market Analyst', bio: 'Agricultural economist specializing in market trends, price forecasting, and export opportunities for Indian farmers.', articles: 28, followers: '5.4K' }
  ];

  // ---------- Effects ----------
  useEffect(() => {
    setArticles(allArticles);
  }, []);

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

  // Animate hero stats when visible
  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter('totalArticles', 250, '+');
            animateCounter('expertContributors', 45, '+');
            animateCounter('monthlyReaders', 50000, 'K+');
            animateCounter('avgReadTime', 7, ' min');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Real-time newsletter stats update
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) setSubscribers((prev) => prev + 1);
      const variation = (Math.random() - 0.5) * 2;
      setOpenRate((prev) => Math.max(75, Math.min(82, Math.round(prev + variation))));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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

  // Animate article cards on mount
  useEffect(() => {
    articleRefs.current.forEach((card, index) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 100 + index * 100);
      }
    });
  }, [articles, displayCount, activeFilter]);

  // ---------- Helper Functions ----------
  const animateCounter = (elementId, target, suffix = '') => {
    const el = document.getElementById(elementId);
    if (!el) return;
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        if (suffix === 'K+') {
          el.textContent = Math.floor(current / 1000) + suffix;
        } else if (suffix === '+') {
          el.textContent = Math.floor(current) + suffix;
        } else {
          el.textContent = parseFloat(current.toFixed(1)) + suffix;
        }
      }
    }, 30);
  };

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = () => {
    if (!validateEmail(newsletterEmail)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setNewsletterEmail('');
      setSubscribers((prev) => prev + 1);
      showNotification('Successfully subscribed to newsletter!', 'success');
    }, 2000);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setDisplayCount(6);
  };

  const filteredArticles = articles.filter((article) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'trending') return article.trending;
    return article.category === activeFilter;
  });

  const displayedArticles = filteredArticles.slice(0, displayCount);

  const handleLoadMore = () => {
    if (displayCount < filteredArticles.length) {
      setDisplayCount((prev) => Math.min(prev + 3, filteredArticles.length));
      showNotification(`Loaded ${displayCount + 3} of ${filteredArticles.length} articles`, 'info');
    } else {
      showNotification('All articles loaded!', 'success');
    }
  };

  const openArticleModal = (article) => {
    setModalArticle(article);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalArticle(null);
    document.body.style.overflow = 'auto';
  };

  const handleCategoryClick = (categoryId) => {
    handleFilterChange(categoryId);
    document.querySelector('.articles-section').scrollIntoView({ behavior: 'smooth' });
  };

  // ---------- JSX ----------
  return (
    <>
      {/* Main Content */}
      <main id="main-content">
        {/* Blog Hero Section */}
        <section className="blog-hero" ref={heroRef}>
          <div className="floating-elements">
            {['fa-pen-fancy', 'fa-lightbulb', 'fa-book-open', 'fa-seedling', 'fa-chart-line'].map((icon, idx) => (
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
            <div className="blog-hero-content">
              <h1 className="blog-hero-title">Farm Vantara Blog & Articles</h1>
              <p className="blog-hero-subtitle">
                Discover the latest insights, trends, and knowledge about agriculture, farming technology,
                market dynamics, and sustainable practices. Empowering farmers and businesses with actionable information.
              </p>

              <div className="blog-stats">
                <div className="blog-stat-item">
                  <span className="blog-stat-number" id="totalArticles">250+</span>
                  <span className="blog-stat-label">Articles Published</span>
                </div>
                <div className="blog-stat-item">
                  <span className="blog-stat-number" id="expertContributors">45+</span>
                  <span className="blog-stat-label">Expert Contributors</span>
                </div>
                <div className="blog-stat-item">
                  <span className="blog-stat-number" id="monthlyReaders">50K+</span>
                  <span className="blog-stat-label">Monthly Readers</span>
                </div>
                <div className="blog-stat-item">
                  <span className="blog-stat-number" id="avgReadTime">7 min</span>
                  <span className="blog-stat-label">Avg. Read Time</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Article Section */}
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Article</h2>
              <p className="section-subtitle">Discover our most insightful and popular content</p>
            </div>

            <div className="featured-article">
              <div className="featured-image">
                <div className="featured-badge">Editor's Pick</div>
                <img
                  src="https://images.unsplash.com/photo-1599598177991-ec67b5c37318?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Precision Agriculture Technology"
                />
              </div>

              <div className="featured-content">
                <span className="featured-category">AgriTech Innovation</span>
                <h3 className="featured-title">Revolutionizing Indian Agriculture with Precision Farming Technology</h3>
                <p className="featured-excerpt">
                  Explore how precision farming technologies are transforming traditional agriculture in India.
                  Learn about IoT sensors, drone monitoring, AI-powered analytics, and how small-scale farmers
                  can benefit from these innovations to increase yields by 30-40%.
                </p>

                <div className="featured-meta">
                  <div className="meta-item">
                    <i className="fas fa-user"></i>
                    <span>Dr. Rajesh Kumar</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-calendar"></i>
                    <span>March 15, 2025</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <span>12 min read</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-eye"></i>
                    <span>5.2K views</span>
                  </div>
                </div>

                <a href="#read-article" className="btn-read" onClick={(e) => e.preventDefault()}>
                  <i className="fas fa-book-open"></i> Read Full Article
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Categories */}
        <section className="categories-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle">Explore articles organized by topics that matter to you</p>
            </div>

            <div className="categories-grid">
              {categories.map((cat) => (
                <div
                  className="category-card"
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <div className="category-icon">
                    <i className={`fas ${cat.icon}`}></i>
                  </div>
                  <h3 className="category-title">{cat.name}</h3>
                  <span className="category-count">{cat.count} Articles</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid Section */}
        <section className="articles-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Latest Articles</h2>
              <p className="section-subtitle">Fresh insights and knowledge from our expert contributors</p>
            </div>

            <div className="articles-filters">
              {['all', 'agritech', 'sustainability', 'market', 'quality', 'trending'].map((filter) => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  data-filter={filter}
                  onClick={() => handleFilterChange(filter)}
                >
                  {filter === 'all' ? 'All Articles' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div className="articles-grid" id="articlesGrid">
              {displayedArticles.map((article, idx) => (
                <div
                  className="article-card"
                  key={article.id}
                  data-category={article.category}
                  data-trending={article.trending ? 'true' : 'false'}
                  onClick={() => openArticleModal(article)}
                  ref={(el) => (articleRefs.current[idx] = el)}
                >
                  <div className="article-image">
                    <div className="article-category">
                      {categories.find((c) => c.id === article.category)?.name || article.category}
                    </div>

                    <div className="article-read-time">
                      <i className="fas fa-clock"></i> {article.readTime}
                    </div>

                    <img src={article.image} alt={article.title} loading="lazy" />
                  </div>

                  <div className="article-content">
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-excerpt">{article.excerpt}</p>

                    <div className="article-meta">
                      <div className="author-info">
                        <div className="author-avatar">
                          {article.author.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="author-name">{article.author}</div>
                      </div>

                      <div className="article-date">{article.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayCount < filteredArticles.length && (
              <div className="load-more">
                <button className="btn-load-more" id="loadMore" onClick={handleLoadMore}>
                  <i className="fas fa-plus"></i> Load More Articles
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section" id="subscribe">
          <div className="container">
            <div className="newsletter-content">
              <h2 className="newsletter-title">Stay Updated with AgriTech Insights</h2>
              <p className="newsletter-subtitle">
                Subscribe to our weekly newsletter and receive the latest articles, market insights,
                and farming tips directly in your inbox.
              </p>

              <div className="newsletter-form">
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button
                  className="btn-subscribe"
                  onClick={handleSubscribe}
                  disabled={subscribing}
                >
                  {subscribing ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}{' '}
                  Subscribe Now
                </button>
              </div>

              <div className="newsletter-stats">
                <div className="newsletter-stat">
                  <span className="newsletter-stat-number" id="subscribers">
                    {subscribers.toLocaleString()}+
                  </span>
                  <span className="newsletter-stat-label">Subscribers</span>
                </div>
                <div className="newsletter-stat">
                  <span className="newsletter-stat-number" id="openRate">
                    {openRate}%
                  </span>
                  <span className="newsletter-stat-label">Open Rate</span>
                </div>
                <div className="newsletter-stat">
                  <span className="newsletter-stat-number" id="weekly">
                    Weekly
                  </span>
                  <span className="newsletter-stat-label">Updates</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Topics Section */}
        <section className="trending-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Trending Topics</h2>
              <p className="section-subtitle">What our readers are most interested in right now</p>
            </div>

            <div className="trending-grid">
              {trendingTopics.map((topic) => (
                <div className="trending-card" key={topic.rank}>
                  <div className="trending-rank">{topic.rank}</div>
                  <h3 className="trending-topic">{topic.title}</h3>
                  <p>{topic.description}</p>
                  <div className="trending-stats">
                    <div className="trending-stat">
                      <i className="fas fa-eye"></i> {topic.views} views
                    </div>
                    <div className="trending-stat">
                      <i className="fas fa-comments"></i> {topic.comments} comments
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contributors Section */}
        <section className="contributors-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Meet Our Expert Contributors</h2>
              <p className="section-subtitle">Learn from industry experts, successful farmers, and agricultural scientists</p>
            </div>

            <div className="contributors-grid">
              {contributors.map((contributor) => (
                <div className="contributor-card" key={contributor.name}>
                  <div className="contributor-avatar">{contributor.initials}</div>
                  <h3 className="contributor-name">{contributor.name}</h3>
                  <p className="contributor-role">{contributor.role}</p>
                  <p className="contributor-bio">{contributor.bio}</p>
                  <div className="contributor-stats">
                    <div className="contributor-stat">
                      <span className="contributor-stat-number">{contributor.articles}</span>
                      <span className="contributor-stat-label">Articles</span>
                    </div>
                    <div className="contributor-stat">
                      <span className="contributor-stat-number">{contributor.followers}</span>
                      <span className="contributor-stat-label">Followers</span>
                    </div>
                  </div>
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

      {/* Notifications */}
      {notifications.map((notif) => (
        <div key={notif.id} className={`notification notification-${notif.type}`}>
          <div className="notification-content">
            <i className={`fas fa-${notif.type === 'success' ? 'check-circle' : notif.type === 'error' ? 'exclamation-circle' : 'info-circle'}`}></i>
            <span>{notif.message}</span>
          </div>
          <button className="notification-close" onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}

      {/* Article Modal */}
      {modalOpen && modalArticle && (
        <div className="article-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="close-modal" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </div>
            <div className="modal-header">
              <span className="article-category">
                {categories.find((c) => c.id === modalArticle.category)?.name || modalArticle.category}
              </span>
              <h2>{modalArticle.title}</h2>
              <div className="article-meta">
                <div className="author-info">
                  <div className="author-avatar">
                    {modalArticle.author.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="author-name">{modalArticle.author}</div>
                </div>
                <div className="article-date">{modalArticle.date}</div>
                <div className="article-read-time">{modalArticle.readTime}</div>
              </div>
            </div>
            <div className="modal-body">
              <img src={modalArticle.image} alt={modalArticle.title} />
              <p>{modalArticle.excerpt}</p>
              <p style={{ marginTop: '20px' }}>
                In this comprehensive article, we explore the latest developments in agricultural technology and how they're
                transforming traditional farming practices across India. We'll cover:
              </p>
              <ul style={{ margin: '20px 0 20px 30px', color: 'var(--text-light)' }}>
                <li>Practical implementation strategies for small-scale farmers</li>
                <li>Cost-benefit analysis of different technologies</li>
                <li>Case studies from successful implementations</li>
                <li>Government subsidies and support programs</li>
                <li>Future trends and opportunities</li>
              </ul>
              <p>Stay tuned for detailed insights and actionable advice that can help you improve your farming operations and increase profitability.</p>

              <div className="author-section">
                <h3>About the Author</h3>
                <div className="author-details">
                  <div className="author-avatar-large">
                    {modalArticle.author.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4>{modalArticle.author}</h4>
                    <p>Expert in agricultural technology with over 15 years of experience helping farmers adopt innovative solutions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;