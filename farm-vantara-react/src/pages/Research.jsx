import React, { useState, useEffect, useRef } from 'react';
import '../styles/Research.css';

const Research = () => {
  // ---------- State ----------
  const [currentYear] = useState(new Date().getFullYear());
  const [menuActive, setMenuActive] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [stats, setStats] = useState({
    totalPapers: 0,
    totalCitations: 0,
    researchTeam: 0,
    collaborations: 0
  });
  const [researchData] = useState([
    { id: 1, title: "Soil Organic Carbon Dynamics in Regenerative Farming Systems", authors: "Kumar, R., Sharma, P., Singh, A.", category: "sustainable", year: 2024, citations: 142, status: "published", impact: 4.2 },
    { id: 2, title: "Machine Learning for Early Detection of Wheat Rust", authors: "Patel, A., Gupta, N., Reddy, S.", category: "precision", year: 2024, citations: 89, status: "published", impact: 3.8 },
    { id: 3, title: "Genetic Markers for Drought Tolerance in Rice Varieties", authors: "Choudhary, M., Verma, R., Joshi, K.", category: "genetics", year: 2023, citations: 156, status: "published", impact: 4.5 },
    { id: 4, title: "Economic Impact of Precision Farming Technologies", authors: "Sharma, S., Mehta, D., Kapoor, R.", category: "economics", year: 2023, citations: 78, status: "published", impact: 3.9 },
    { id: 5, title: "Water Use Efficiency in Drip-Irrigated Cotton", authors: "Reddy, A., Kumar, S., Patel, M.", category: "sustainable", year: 2023, citations: 67, status: "published", impact: 3.7 },
    { id: 6, title: "AI-Driven Yield Prediction for Smallholder Farms", authors: "Singh, R., Yadav, P., Mishra, A.", category: "precision", year: 2023, citations: 94, status: "published", impact: 4.1 },
    { id: 7, title: "Biofortification of Millet with Iron and Zinc", authors: "Gupta, P., Sharma, M., Tiwari, R.", category: "genetics", year: 2022, citations: 123, status: "published", impact: 4.3 },
    { id: 8, title: "Climate Risk Insurance for Farmers", authors: "Mehta, S., Joshi, A., Kumar, V.", category: "economics", year: 2022, citations: 56, status: "published", impact: 3.6 },
    { id: 9, title: "Circular Economy in Agricultural Waste Management", authors: "Yadav, S., Singh, M., Reddy, K.", category: "sustainable", year: 2022, citations: 88, status: "published", impact: 4.0 },
    { id: 10, title: "IoT-Based Smart Greenhouse Management System", authors: "Verma, A., Patel, S., Sharma, R.", category: "precision", year: 2021, citations: 145, status: "published", impact: 4.4 }
  ]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingTable, setLoadingTable] = useState(false);
  const [notification, setNotification] = useState(null);
  const [citationTimer, setCitationTimer] = useState(null);
  const [achievementTimer, setAchievementTimer] = useState(null);

  // Milestones data
  const milestones = [
    {
      date: "Nov 2025",
      title: "Foundation of Research Wing",
      description: "Established Farm Ventures Research Institute with focus on sustainable agriculture and climate resilience. Published first 5 research papers in peer-reviewed journals.",
      icon: "fa-building"
    },
    {
      date: "Jan 2026",
      title: "Climate Resilience Research",
      description: "Launched multi-year study on climate-resilient crop varieties. Published influential paper on carbon farming that influenced national agricultural policy.",
      icon: "fa-leaf"
    },
    {
      date: "Dec 2025",
      title: "Precision Agriculture Initiative",
      description: "Launched IoT-based farming research with 100 pilot farms. Published breakthrough paper on AI-driven pest detection with 92% accuracy.",
      icon: "fa-microchip"
    },
    {
      date: "Dec 2026",
      title: "International Collaborations",
      description: "Partnered with 15 international research institutions. Published 42 papers with 1,000+ citations. Won 'Best Agricultural Research Award.'",
      icon: "fa-globe"
    }
  ];

  // Research Partners Data
  const researchPartners = [
    { name: "Government Institutions", logo: "🌾"},
    { name: "Research Organizations", logo: "🌱"},
    { name: "Universities", logo: "🎓"},
    { name: "Agricultural organizations", logo: "🐮"},
    { name: "Environmental Boards", logo: "🔬"},
    { name: "Gcc Trade Councils", logo: "🍚" },
    { name: "University of Cambridge", logo: "📚" },
    { name: "CSIRO", logo: "🇦🇺"}
  ];

  const itemsPerPage = 5;

  // Refs for animation
  const statsRef = useRef(null);
  const floatingElementsRef = useRef([]);
  const navMenuRef = useRef(null);
  const mobileBtnRef = useRef(null);

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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
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

  // Filter and search data
  useEffect(() => {
    let filtered = [...researchData];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(term) ||
          item.authors.toLowerCase().includes(term) ||
          item.category.includes(term)
      );
    }
    if (currentFilter !== 'all') {
      filtered = filtered.filter(item => item.category === currentFilter);
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, currentFilter, researchData]);

  // Simulate loading table data
  useEffect(() => {
    setLoadingTable(true);
    const timer = setTimeout(() => setLoadingTable(false), 800);
    return () => clearTimeout(timer);
  }, [filteredData, currentPage]);

  // Periodic notifications
  useEffect(() => {
    const achievements = [
      "📚 New paper published: AI in Precision Farming",
      "🔬 Research grant awarded: Climate Resilience Study",
      "🌾 Dataset released: Soil Health Indicators 2024",
      "📊 Paper reached 100+ citations",
      "🤝 New collaboration: International Agriculture Institute",
      "🏆 Research award: Best Paper in Sustainable Agriculture"
    ];
    const timer = setInterval(() => {
      if (Math.random() > 0.7) {
        const random = achievements[Math.floor(Math.random() * achievements.length)];
        showNotification(random);
      }
    }, 30000);
    setAchievementTimer(timer);
    return () => clearInterval(timer);
  }, []);

  // Real-time citation updates
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.9) {
        setFilteredData(prev =>
          prev.map(item => ({
            ...item,
            citations: item.citations + Math.floor(Math.random() * 3)
          }))
        );
      }
    }, 30000);
    setCitationTimer(timer);
    return () => clearInterval(timer);
  }, []);

  // Welcome notification
  useEffect(() => {
    showNotification("Welcome to Farm Vantara Research Portal! 🎓 Access 150+ agricultural research papers.");
  }, []);

  // ---------- Helper Functions ----------
  const animateStats = () => {
    const target = { totalPapers: 157, totalCitations: 4200, researchTeam: 68, collaborations: 42 };
    const duration = 2000;
    const steps = 50;
    const increment = {
      totalPapers: target.totalPapers / steps,
      totalCitations: target.totalCitations / steps,
      researchTeam: target.researchTeam / steps,
      collaborations: target.collaborations / steps
    };
    let current = { totalPapers: 0, totalCitations: 0, researchTeam: 0, collaborations: 0 };
    const timer = setInterval(() => {
      current.totalPapers += increment.totalPapers;
      current.totalCitations += increment.totalCitations;
      current.researchTeam += increment.researchTeam;
      current.collaborations += increment.collaborations;
      if (current.totalPapers >= target.totalPapers) {
        setStats(target);
        clearInterval(timer);
      } else {
        setStats({
          totalPapers: Math.floor(current.totalPapers),
          totalCitations: Math.floor(current.totalCitations),
          researchTeam: Math.floor(current.researchTeam),
          collaborations: Math.floor(current.collaborations)
        });
      }
    }, duration / steps);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getCategoryIcon = (category) => {
    const icons = {
      sustainable: '<i class="fas fa-leaf" style="color: #27ae60;"></i>',
      precision: '<i class="fas fa-robot" style="color: #2d9cdb;"></i>',
      genetics: '<i class="fas fa-dna" style="color: #9b51e0;"></i>',
      economics: '<i class="fas fa-chart-line" style="color: #f2994a;"></i>'
    };
    return icons[category] || '<i class="fas fa-file-alt"></i>';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      sustainable: 'Sustainable',
      precision: 'Precision',
      genetics: 'Genetics',
      economics: 'Economics'
    };
    return labels[category] || 'Other';
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // search is already reactive via useEffect
  };

  // Download simulation
  const handleDownload = (paperTitle) => {
    showNotification(`📥 Downloading: ${paperTitle.substring(0, 50)}...`);
    setTimeout(() => {
      showNotification("✅ Paper downloaded successfully!");
    }, 1500);
  };

  // ---------- JSX ----------
  return (
    <div className="research-page">
      {/* Research Hero Section */}
      <section className="research-hero">
        <div className="floating-elements">
          {['fa-microscope', 'fa-flask', 'fa-chart-bar', 'fa-seedling', 'fa-book-open'].map((icon, idx) => (
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
            <h1 className="hero-title">Research Papers & Agricultural Studies</h1>
            <p className="hero-subtitle">
              Access groundbreaking research, scientific studies, and data-driven insights
              that are transforming agriculture. Our publications span sustainable farming,
              precision agriculture, climate resilience, and agricultural innovation.
            </p>

            {/* Animated Research Visualization */}
            <div className="research-visualization">
              <div className="research-container">
                <div className="research-sphere"></div>
                <div className="research-orbit orbit-1"></div>
                <div className="research-orbit orbit-2"></div>
                <div className="research-point point-1"><i className="fas fa-seedling"></i></div>
                <div className="research-point point-2"><i className="fas fa-tint"></i></div>
                <div className="research-point point-3"><i className="fas fa-solar-panel"></i></div>
                <div className="research-point point-4"><i className="fas fa-chart-line"></i></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Stats */}
      <section className="research-stats" ref={statsRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Research Impact Metrics</h2>
            <p className="section-subtitle">Quantifying our contribution to agricultural science and innovation</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-file-alt"></i></div>
              <span className="stat-number" id="totalPapers">{formatNumber(stats.totalPapers)}</span>
              <span className="stat-label">Published Papers</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-quote-right"></i></div>
              <span className="stat-number" id="totalCitations">{formatNumber(stats.totalCitations)}</span>
              <span className="stat-label">Research Citations</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-users"></i></div>
              <span className="stat-number" id="researchTeam">{stats.researchTeam}</span>
              <span className="stat-label">Research Scientists</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fas fa-globe"></i></div>
              <span className="stat-number" id="collaborations">{stats.collaborations}</span>
              <span className="stat-label">Global Collaborations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Research Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Research Categories</h2>
            <p className="section-subtitle">Explore our comprehensive research areas driving agricultural innovation</p>
          </div>

          <div className="categories-grid">
            {[
              { class: 'category-1', icon: 'fa-seedling', title: 'Sustainable Agriculture', desc: 'Research on organic farming, soil health, water conservation, and climate-resilient agricultural practices.', papers: ['Carbon Sequestration in Indian Soils', 'Water-Use Efficiency in Arid Regions', 'Organic Pest Management Systems', 'Soil Microbiome Studies'] },
              { class: 'category-2', icon: 'fa-robot', title: 'Precision Agriculture', desc: 'Studies on IoT sensors, drones, AI algorithms, and data analytics for optimized farming operations.', papers: ['AI-Driven Crop Yield Prediction', 'Drone-Based Crop Health Monitoring', 'Smart Irrigation Systems', 'Satellite Imagery Analysis'] },
              { class: 'category-3', icon: 'fa-dna', title: 'Crop Science & Genetics', desc: 'Research on crop improvement, genetic engineering, and developing climate-resilient varieties.', papers: ['Drought-Resistant Crop Varieties', 'Nutritional Enhancement in Staples', 'Disease Resistance Mechanisms', 'Genomic Selection in Breeding'] },
              { class: 'category-4', icon: 'fa-industry', title: 'Agricultural Economics', desc: 'Studies on market systems, value chains, farmer livelihoods, and sustainable business models.', papers: ['Farmer Income Optimization', 'Supply Chain Efficiency Models', 'Climate Risk Insurance', 'Digital Market Platforms'] }
            ].map((cat, idx) => (
              <div className={`category-card ${cat.class}`} key={idx}>
                <div className="category-icon"><i className={`fas ${cat.icon}`}></i></div>
                <h3 className="category-title">{cat.title}</h3>
                <p className="category-description">{cat.desc}</p>
                <ul className="category-papers">
                  {cat.papers.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Research Papers */}
      <section className="papers-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Research Papers</h2>
            <p className="section-subtitle">Groundbreaking studies with significant impact on agricultural practices</p>
          </div>

          <div className="papers-grid">
            {[
              { category: 'Sustainable Agriculture', title: 'Carbon Sequestration Potential in Indian Agricultural Soils', authors: 'Dr. Rajesh Kumar, Dr. Priya Sharma, et al.', abstract: 'This study quantifies the carbon sequestration potential of different agricultural practices across 500 Indian farms over 3 years. Results show sustainable practices can increase soil organic carbon by 35% while improving crop yields by 22%.', highlight: 'Regenerative farming practices sequester 2.5 tons of CO₂ per hectare annually.', date: 'March 2024', citations: 142 },
              { category: 'Precision Agriculture', title: 'AI-Powered Crop Disease Detection Using Drone Imagery', authors: 'Dr. Amit Patel, Dr. Neha Gupta, et al.', abstract: 'Development of a convolutional neural network that analyzes drone-captured multispectral imagery to detect crop diseases with 94% accuracy, 3 weeks before visible symptoms appear.', highlight: 'Early detection reduces pesticide use by 40% and crop losses by 60%.', date: 'January 2024', citations: 89 },
              { category: 'Water Conservation', title: 'Optimizing Drip Irrigation Schedules Using IoT and Machine Learning', authors: 'Dr. Sanjay Mehta, Dr. Anjali Reddy, et al.', abstract: 'A real-time irrigation optimization system that integrates soil moisture sensors, weather data, and crop water requirements to reduce water usage by 45% while maintaining or improving crop yields.', highlight: 'Average water savings of 1.2 million liters per hectare annually.', date: 'November 2023', citations: 67 }
            ].map((paper, idx) => (
              <div className="paper-card" key={idx}>
                <div className="paper-header">
                  <span className="paper-category">{paper.category}</span>
                  <h3 className="paper-title">{paper.title}</h3>
                  <p className="paper-authors">{paper.authors}</p>
                </div>
                <div className="paper-body">
                  <p className="paper-abstract">{paper.abstract}</p>
                  <div className="research-highlight">
                    <strong>Key Finding:</strong> {paper.highlight}
                  </div>
                  <div className="paper-meta">
                    <span className="paper-date"><i className="far fa-calendar"></i> Published: {paper.date}</span>
                    <span className="paper-citations">
                      <i className="fas fa-quote-right"></i> <span className="citation-count">{paper.citations} Citations</span>
                    </span>
                  </div>
                  <div className="paper-actions">
                    <button className="btn-paper btn-paper-primary" onClick={() => handleDownload(paper.title)}>
                      <i className="fas fa-download"></i> Download PDF
                    </button>
                    <button className="btn-paper btn-paper-secondary" onClick={() => showNotification('Citation copied (simulated)')}>
                      <i className="fas fa-quote-right"></i> Cite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Milestones Section */}
      <section className="milestones-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Research Milestones</h2>
            <p className="section-subtitle">Key breakthroughs and publications in our research journey</p>
          </div>

          <div className="milestones-timeline">
            {milestones.map((milestone, index) => (
              <div className={`milestone-card ${index % 2 === 0 ? 'milestone-left' : 'milestone-right'}`} key={index}>
                <div className="milestone-icon-wrapper">
                  <div className="milestone-icon">
                    <i className={`fas ${milestone.icon}`}></i>
                  </div>
                </div>
                <div className="milestone-content">
                  <div className="milestone-date">{milestone.date}</div>
                  <h3 className="milestone-title">{milestone.title}</h3>
                  <p className="milestone-description">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Database */}
      <section className="database-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Research Database</h2>
            <p className="section-subtitle">Search and explore our complete collection of research publications</p>
          </div>

          {/* Search and Filter Bar - Centered */}
          <div className="database-controls-centered">
            <div className="search-wrapper-centered">
              <i className="fas fa-search search-icon-centered"></i>
              <input
                type="text"
                className="search-input-centered"
                placeholder="Search research papers by title, author, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-buttons-centered">
              {['all', 'sustainable', 'precision', 'genetics', 'economics'].map((filter) => (
                <button
                  key={filter}
                  className={`filter-chip-centered ${currentFilter === filter ? 'active' : ''}`}
                  onClick={() => setCurrentFilter(filter)}
                >
                  <i className={`fas fa-${filter === 'all' ? 'layer-group' : filter === 'sustainable' ? 'leaf' : filter === 'precision' ? 'robot' : filter === 'genetics' ? 'dna' : 'chart-line'}`}></i>
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loadingTable ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading research papers...</p>
            </div>
          ) : (
            <>
              <div className="database-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Authors</th>
                      <th>Category</th>
                      <th>Year</th>
                      <th>Citations</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item) => (
                        <tr key={item.id}>
                          <td className="title-cell">
                            <a href="#" className="paper-link" onClick={(e) => e.preventDefault()}>
                              <span dangerouslySetInnerHTML={{ __html: getCategoryIcon(item.category) }} /> 
                              {item.title}
                            </a>
                            {item.impact && <span className="impact-factor"> IF: {item.impact}</span>}
                          </td>
                          <td>{item.authors}</td>
                          <td><span className={`category-badge ${item.category}`}>{getCategoryLabel(item.category)}</span></td>
                          <td>{item.year}</td>
                          <td><span className="citation-count">{item.citations}</span></td>
                          <td>
                            <button className="download-link" onClick={() => handleDownload(item.title)}>
                              <i className="fas fa-download"></i> Download
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="empty-state">
                          <i className="fas fa-search"></i>
                          <p>No research papers found matching your criteria.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Research Partners - Updated with proper logos and names */}
      <section className="partners-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Research Collaborations</h2>
            <p className="section-subtitle">Partnering with leading institutions worldwide to advance agricultural science</p>
          </div>

          <div className="partners-grid">
            {researchPartners.map((partner, idx) => (
              <div className="partner-card" key={idx}>
                <div className="partner-logo-wrapper">
                  <div className="partner-logo-emoji">{partner.logo}</div>
                </div>
                <h3 className="partner-name">{partner.name}</h3>
                <p className="partner-fullname">{partner.fullName}</p>
                <span className="partner-country">{partner.country}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section" id="submit-research">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Contribute to Agricultural Research</h2>
            <p className="cta-subtitle">
              Join our research community. Submit your papers, collaborate on studies,
              or access our datasets to advance agricultural science together.
            </p>
            <div className="cta-buttons">
              <a href="#submit-form" className="btn-cta btn-cta-primary" onClick={(e) => e.preventDefault()}>
                <i className="fas fa-paper-plane"></i> Submit Research Paper
              </a>
              <a href="#datasets" className="btn-cta btn-cta-secondary" onClick={(e) => e.preventDefault()}>
                <i className="fas fa-database"></i> Access Research Datasets
              </a>
              <a href="#collaborate" className="btn-cta btn-cta-secondary" onClick={(e) => e.preventDefault()}>
                <i className="fas fa-handshake"></i> Collaborate With Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Research Elements Animation (floating background) */}
      <div className="research-elements" id="researchElements"></div>

      {/* Notification */}
      {notification && (
        <div className="sustainability-notification">
          <div className="notification-content">
            <i className="fas fa-graduation-cap"></i>
            <span>{notification}</span>
          </div>
          <button className="notification-close" onClick={() => setNotification(null)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Research;