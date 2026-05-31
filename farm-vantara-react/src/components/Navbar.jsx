import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

const Navbar = ({
  userName = "Guest User",
  userRole = "Business Buyer Account",
  cartCount = 0,
  onCartClick = () => { },
  userInitials: propInitials,
  // New props for shop page
  wishlist = [],
  compareList = [],
  cart = [],
  cartOpen = false,
  setCartOpen = () => { },
  setCompareModalOpen = () => { }
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const [currentUser, setCurrentUser] = useState(null);
  const [buyerData, setBuyerData] = useState({
    cartCount: 0,
    wishlistCount: 0,
    favoritesCount: 0
  });

  useEffect(() => {
    const updateCounts = () => {
      const localCart = JSON.parse(localStorage.getItem('cart_buyer') || '[]');
      const localWishlist = JSON.parse(localStorage.getItem('wishlist_buyer') || '[]');
      const localFavorites = JSON.parse(localStorage.getItem('favorites_buyer') || '[]');
      setBuyerData({
        cartCount: localCart.length,
        wishlistCount: localWishlist.length,
        favoritesCount: localFavorites.length
      });
    };

    updateCounts();

    window.addEventListener('buyer-data-updated', updateCounts);
    window.addEventListener('storage', updateCounts);

    return () => {
      window.removeEventListener('buyer-data-updated', updateCounts);
      window.removeEventListener('storage', updateCounts);
    };
  }, [location]);

  useEffect(() => {
    const userStr = localStorage.getItem('farmvantara_user') || sessionStorage.getItem('farmvantara_user');
    if (userStr && userStr !== "undefined" && userStr !== "null") {
      try {
        const parsed = JSON.parse(userStr);
        setCurrentUser(parsed);
      } catch (e) {
        console.error(e);
      }
    } else {
      setCurrentUser(null);
    }
  }, [location]);

  const displayName = currentUser?.name || userName;
  const displayRole = currentUser?.role === 'farmer' 
    ? 'Farmer Account' 
    : (currentUser?.role === 'business' ? 'Business Buyer Account' : userRole);

  // Compute user initials from name if not provided
  const userInitials = propInitials ||
    displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('farmvantara_token');
    localStorage.removeItem('farmvantara_user');
    localStorage.removeItem('cart_buyer');
    localStorage.removeItem('wishlist_buyer');
    localStorage.removeItem('favorites_buyer');
    sessionStorage.removeItem('farmvantara_token');
    sessionStorage.removeItem('farmvantara_user');
    window.location.href = "/";
  };

  // Define link sets for different routes (unchanged)
  const linkSets = {
    default: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/farmers', label: 'For Farmers', icon: 'fa-tractor' },
      { path: '/business', label: 'For Buyers', icon: 'fa-building' },
      { path: '/shop', label: 'Shop', icon: 'fa-shopping-cart' },
      { path: '/process', label: 'How It Works', icon: 'fa-cogs' },
      { path: '/impact', label: 'Impact', icon: 'fa-seedling' },
      { path: '/contact', label: 'Contact', icon: 'fa-phone' }
    ],
    farmers: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/farmers', label: 'For Farmers', icon: 'fa-tractor' },
      { path: '/business', label: 'For Buyers', icon: 'fa-building' },
      { path: '/shop', label: 'Shop', icon: 'fa-shopping-cart' },
      { path: '/process', label: 'How It Works', icon: 'fa-cogs' },
      { path: '/contact', label: 'Contact', icon: 'fa-phone' }
    ],
    business: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/farmers', label: 'For Farmers', icon: 'fa-tractor' },
      { path: '/business', label: 'For Buyers', icon: 'fa-building' },
      { path: '/shop', label: 'Shop', icon: 'fa-shopping-cart' },
      { path: '/process', label: 'How It Works', icon: 'fa-cogs' },
      { path: '/contact', label: 'Contact', icon: 'fa-phone' }
    ],
    process: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/farmers', label: 'For Farmers', icon: 'fa-tractor' },
      { path: '/business', label: 'For Buyers', icon: 'fa-building' },
      { path: '/process', label: 'How It Works', icon: 'fa-cogs' },
      { path: '/impact', label: 'Impact', icon: 'fa-seedling' },
      { path: '/contact', label: 'Contact', icon: 'fa-phone' }
    ],
    impact: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/farmers', label: 'For Farmers', icon: 'fa-tractor' },
      { path: '/business', label: 'For Buyers', icon: 'fa-building' },
      { path: '/impact', label: 'Impact', icon: 'fa-seedling' },
      { path: '/contact', label: 'Contact', icon: 'fa-phone' }
    ],
    contact: [
      { path: '/farmers', label: 'For Farmers', icon: 'fa-tractor' },
      { path: '/business', label: 'For Buyers', icon: 'fa-building' },
      { path: '/shop', label: 'Shop', icon: 'fa-shopping-cart' },
      { path: '/process', label: 'How It Works', icon: 'fa-cogs' },
      { path: '/blog', label: 'Blog', icon: 'fa-blog' },
      { path: '/faq', label: 'FAQ', icon: 'fa-question-circle' }
    ],
    about: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/about', label: 'About', icon: 'fa-info-circle' },
      { path: '/farmers', label: 'For Farmers', icon: 'fa-tractor' },
      { path: '/business', label: 'For Buyers', icon: 'fa-building' },
      { path: '/contact', label: 'Contact', icon: 'fa-phone' },
      { path: '/login', label: 'Login', icon: 'fa-sign-in-alt' }
    ],
    blog: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/process', label: 'Process', icon: 'fa-cogs' },
      { path: '/quality', label: 'Quality', icon: 'fa-award' },
      { path: '/impact', label: 'Impact', icon: 'fa-seedling' },
      { path: '/faq', label: "FAQ's", icon: 'fa-question-circle' },
      { path: '/blog', label: 'Blog', icon: 'fa-blog' }
    ],
    businessSolutions: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/business', label: 'For Buyers', icon: 'fa-building' },
      { path: '/business-solutions', label: 'Business Solutions', icon: 'fa-cogs' },
      { path: '/contact', label: 'Support', icon: 'fa-headset' }
    ],
    caseStudies: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/farmers', label: 'For Farmers', icon: 'fa-user-tie' },
      { path: '/business', label: 'For Buyers', icon: 'fa-building' },
      { path: '/shop', label: 'Shop', icon: 'fa-shopping-cart' },
      { path: '/process', label: 'How It Works', icon: 'fa-cogs' },
      { path: '/case-studies', label: 'Case Studies', icon: 'fa-chart-line' },
      { path: '/contact', label: 'Contact', icon: 'fa-phone' }
    ],
    cropListing: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/farmers', label: 'For Farmers', icon: 'fa-user-tie' },
      { path: '/crop-listing', label: 'Crop Guide', icon: 'fa-seedling' },
      { path: '/market-prices', label: 'Market Prices', icon: 'fa-chart-line' },
      { path: '/contact', label: 'Support', icon: 'fa-headset' }
    ],
    faq: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/farmers', label: 'For Farmers', icon: 'fa-tractor' },
      { path: '/business', label: 'For Buyers', icon: 'fa-building' },
      { path: '/process', label: 'How It Works', icon: 'fa-cogs' },
      { path: '/quality', label: 'Quality', icon: 'fa-award' },
      { path: '/faq', label: 'FAQ', icon: 'fa-question-circle' }
    ],
    goals: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/quality', label: 'Quality', icon: 'fa-award' },
      { path: '/guides', label: 'Guides', icon: 'fa-book-open' },
      { path: '/blog', label: 'Blog', icon: 'fa-blog' },
      { path: '/sustainability', label: 'Sustainability', icon: 'fa-leaf' }
    ],
    guides: [
      { path: '/', label: '', icon: 'fa-home' },
      { path: '/process', label: 'Process', icon: 'fa-cogs' },
      { path: '/quality', label: 'Quality', icon: 'fa-award' },
      { path: '/blog', label: 'Blog', icon: 'fa-blog' },
      { path: '/guides', label: 'Guides', icon: 'fa-book-open' },
      { path: '/faq', label: "FAQ's", icon: 'fa-question-circle' }
    ],
    businessLogistics: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/business', label: 'For Buyers', icon: 'fa-building' },
      { path: '/business-solutions', label: 'Business Solutions', icon: 'fa-cogs' },
      { path: '/logistics', label: 'Business Logistics', icon: 'fa-truck' },
      { path: '/pricing', label: 'Volume Pricing', icon: 'fa-tags' }
    ],
    payments: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/crop-listing', label: 'Crop Guide', icon: 'fa-seedling' },
      { path: '/market-prices', label: 'Market Prices', icon: 'fa-chart-line' },
      { path: '/payments', label: 'Payments', icon: 'fa-credit-card' },
      { path: '/contact', label: 'Support', icon: 'fa-headset' }
    ],
    qualityAssurance: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/farmers', label: 'For Farmers', icon: 'fa-user-tie' },
      { path: '/business', label: 'For Buyers', icon: 'fa-building' },
      { path: '/process', label: 'Process', icon: 'fa-cogs' },
      { path: '/quality', label: 'Quality Assurance', icon: 'fa-award' },
      { path: '/impact', label: 'Impact', icon: 'fa-seedling' },
      { path: '/contact', label: 'Contact', icon: 'fa-phone' }
    ],
    research: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/quality', label: 'Quality', icon: 'fa-award' },
      { path: '/guides', label: 'Guides', icon: 'fa-book-open' },
      { path: '/blog', label: 'Blog', icon: 'fa-blog' },
      { path: '/sustainability', label: 'Sustainability', icon: 'fa-leaf' },
      { path: '/researchpapers', label: 'Research', icon: 'fa-file-alt' }
    ],
    algorithm: [
      { path: '/', label: 'Home', icon: 'fa-home' },
      { path: '/farmers', label: 'Farmers', icon: 'fa-user-tie' },
      { path: '/business', label: 'Business', icon: 'fa-building' },
      { path: '/process', label: 'Process', icon: 'fa-cogs' },
      { path: '/algorithm', label: 'Algorithm', icon: 'fa-robot' },
      { path: '/impact', label: 'Impact', icon: 'fa-seedling' },
      { path: '/contact', label: 'Contact', icon: 'fa-phone' }
    ]
  };

  const getCurrentLinks = () => {
    if (location.pathname === '/farmers') return linkSets.farmers;
    if (location.pathname === '/business') return linkSets.business;
    if (location.pathname === '/process') return linkSets.process;
    if (location.pathname === '/impact') return linkSets.impact;
    if (location.pathname === '/contact') return linkSets.contact;
    if (location.pathname === '/about') return linkSets.about;
    if (location.pathname === '/blog') return linkSets.blog;
    if (location.pathname === '/business-solutions') return linkSets.businessSolutions;
    if (location.pathname === '/case-studies') return linkSets.caseStudies;
    if (location.pathname === '/crop-listing') return linkSets.cropListing;
    if (location.pathname === '/market-prices') return linkSets.cropListing;
    if (location.pathname === '/payments') return linkSets.payments;
    if (location.pathname === '/faq') return linkSets.faq;
    if (location.pathname === '/goals') return linkSets.goals;
    if (location.pathname === '/guides') return linkSets.guides;
    if (location.pathname === '/logistics') return linkSets.businessLogistics;
    if (location.pathname === '/quality') return linkSets.qualityAssurance;
    if (location.pathname === '/researchpapers') return linkSets.research;
    if (location.pathname === '/algorithm') return linkSets.algorithm;
    return linkSets.default;
  };

  const baseLinks = getCurrentLinks();
  const navLinks = baseLinks.filter(link => {
    if (location.pathname === '/' && link.path === '/') return false;
    return true;
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const isRegisterPage = location.pathname === '/register' || location.pathname === '/login';
  const isContactPage = location.pathname === '/contact';
  const isAboutPage = location.pathname === '/about';
  const isBlogPage = location.pathname === '/blog';
  const isBusinessSolutionsPage = location.pathname === '/business-solutions';
  const isBuyerDashboard = location.pathname === '/buyer-dashboard';
  const isFarmerDashboard = location.pathname === '/farmer-dashboard';
  const isCropListingPage = location.pathname === '/crop-listing';
  const isMarketPricesPage = location.pathname === '/market-prices';
  const isPaymentsPage = location.pathname === '/payments';
  const isGoalsPage = location.pathname === '/goals';
  const isGuidesPage = location.pathname === '/guides';
  const isBusinessLogisticsPage = location.pathname === '/logistics';
  const isQualityAssurancePage = location.pathname === '/quality';
  const isResearchPage = location.pathname === '/researchpapers';
  const isPricingPage = location.pathname === '/pricing';
  const isShopPage = location.pathname === '/shop';
  const isAlgorithmPage = location.pathname === '/algorithm';

  const showAuthButtons = !isContactPage && !isAboutPage;

  const getRegisterProps = () => {
    if (isAlgorithmPage) {
      return {
        to: "#get-started",
        icon: "fa-user-plus",
        text: "Get Started"
      };
    }
    if (isResearchPage) {
      return {
        to: "#submit-research",
        icon: "fa-paper-plane",
        text: "Submit Research"
      };
    }
    if (isQualityAssurancePage) {
      return {
        to: "#get-certified",
        icon: "fa-user-plus",
        text: "Get Certified"
      };
    }
    if (isBusinessLogisticsPage) {
      return {
        to: "#logistics-consultation",
        icon: "fa-truck-loading",
        text: "Logistics Consultation"
      };
    }
    if (isGoalsPage) {
      return {
        to: "#join",
        icon: "fa-leaf",
        text: "Join Movement"
      };
    }
    if (isBusinessSolutionsPage) {
      return {
        to: "#consultation",
        icon: "fa-user-plus",
        text: "Get Consultation"
      };
    }
    return {
      to: "/register",
      icon: "fa-user-plus",
      text: "Register"
    };
  };

  const registerProps = getRegisterProps();

  // Farmer Dashboard Header
  if (isFarmerDashboard) {
    return (
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <nav className="navbar">

            {/* Logo */}
            <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
              <img
                src={logo}
                alt="Farm Vantara Logo"
                className="logo-img"
                style={{ height: '40px', width: 'auto' }}
                loading="eager"
              />
            </Link>

            {/* Right Section */}
            <div className="header-right">

              <div className="profile-card">
                <div className="user-avatar">{userInitials}</div>

                <div className="user-info-header">
                  <div className="user-name-header">{displayName}</div>
                  <div className="user-role-header">{displayRole}</div>
                </div>
              </div>

              <button className="logout-button" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>

            </div>

          </nav>
        </div>
      </header>
    );
  }

  // Buyer Dashboard Header
  if (isBuyerDashboard) {
    const handleCartClick = () => {
      window.dispatchEvent(new Event('toggle-cart-sidebar'));
    };

    const handleWishlistClick = () => {
      window.dispatchEvent(new Event('toggle-wishlist-modal'));
    };

    const handleFavoritesClick = () => {
      window.dispatchEvent(new Event('toggle-favorites-modal'));
    };

    return (
      <header className={`main-header scrolled`} style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'white', borderBottom: '1px solid #f1f5f9', padding: '10px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0' }}>
            {/* Logo */}
            <Link to="/buyer-dashboard" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <img
                src={logo}
                alt="Farm Vantara Logo"
                className="logo-img"
                style={{ height: '40px', width: 'auto' }}
                loading="eager"
              />
            </Link>

            {/* Right Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Cart Icon */}
              <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleCartClick}>
                <i className="fas fa-shopping-cart" style={{ color: '#27ae60', fontSize: '20px' }}></i>
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  background: '#e74c3c',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {buyerData.cartCount}
                </span>
              </div>

              {/* Wishlist Icon */}
              <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleWishlistClick}>
                <i className="fas fa-heart" style={{ color: '#27ae60', fontSize: '20px' }}></i>
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  background: '#e74c3c',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {buyerData.wishlistCount}
                </span>
              </div>

              {/* Favorites Icon */}
              <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleFavoritesClick}>
                <i className="fas fa-star" style={{ color: '#27ae60', fontSize: '20px' }}></i>
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  background: '#e74c3c',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {buyerData.favoritesCount}
                </span>
              </div>

              {/* Profile Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#f8fafc',
                padding: '4px 14px 4px 4px',
                borderRadius: '50px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer'
              }}>
                <div style={{
                  background: '#27ae60',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  {userInitials}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center' }}>
                    {displayName}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Buyer Account</div>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid #e74c3c',
                  color: '#e74c3c',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </nav>
        </div>
      </header>
    );
  }

  // Pricing Page Header
  if (isPricingPage) {
    return (
      <>
        <header className={`main-header ${isScrolled ? 'scrolled' : ''}`} id="mainHeader">
          <div className="container">
            <nav className="navbar" aria-label="Main navigation">
              <Link to="/" className="logo" onClick={closeMobileMenu}>
                <img src={logo} alt="Farm Vantara Logo" className="logo-img" />
              </Link>

              <div className="nav-container">
                <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`} id="navMenu">
                  <li className="nav-item"><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
                  <li className="nav-item"><Link to="/business-solutions"><i className="fas fa-cogs"></i> Business Solutions</Link></li>
                  <li className="nav-item active"><Link to="/pricing"><i className="fas fa-tags"></i> Volume Pricing</Link></li>
                  <li className="nav-item"><Link to="/contact"><i className="fas fa-headset"></i> Support</Link></li>
                </ul>

                <div className="auth-buttons">
                  <Link to="/login" className="btn-login"><i className="fas fa-sign-in-alt"></i> Login</Link>
                  <Link to="#custom-quote" className="btn-register"><i className="fas fa-calculator"></i> Get Custom Quote</Link>
                </div>
              </div>

              <button
                className="mobile-menu-btn"
                aria-label="Toggle menu"
                id="mobileMenuBtn"
                onClick={toggleMobileMenu}
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </nav>
          </div>
        </header>
      </>
    );
  }

  // Shop Page Header
  if (isShopPage) {
    return (
      <>

        <header className="shop-header">
          <div className="container">
            <nav className="shop-navbar">
              <Link to="/" className="shop-logo" onClick={closeMobileMenu}>
                <img src={logo} alt="Farm Vantara" className="shop-logo-img" />
                <div className="logo-text">
                  <h1>Shop</h1>
                  <p>Farm-to-Table Marketplace</p>
                </div>
              </Link>
              <div className="shop-actions">
                <div className="user-actions">
                  <Link to="/" className="home-link" aria-label="Go to homepage"><i className="fas fa-home"></i></Link>
                  <Link to="/wishlist" className="wishlist-icon" id="wishlistIcon" aria-label="Wishlist">
                    <i className="fas fa-heart"></i>
                    <span className="wishlist-count">{wishlist.length}</span>
                  </Link>
                  <button
                    className="compare-icon"
                    id="compareIcon"
                    aria-label="Compare products"
                    onClick={(e) => {
                      e.preventDefault();
                      setCompareModalOpen(true);
                    }}
                  >
                    <i className="fas fa-balance-scale"></i>
                    <span className="compare-count">{compareList.length}</span>
                  </button>
                  <button
                    className="cart-icon"
                    id="cartIcon"
                    aria-label="Shopping cart"
                    onClick={() => setCartOpen(!cartOpen)}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    <span className="cart-count">{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>
                  </button>
                  <div className="user-profile">
                    <div className="user-avatar">{userInitials}</div>
                    <span className="user-name">Welcome, {displayName}</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </header>
      </>
    );
  }

  // Regular Header for all other routes (using Bootstrap collapse)
  return (
    <>


      <header className={`main-header ${isScrolled ? 'scrolled' : ''} ${isRegisterPage ? 'register-header' : ''
        } ${isContactPage ? 'contact-header' : ''
        } ${isAboutPage ? 'about-header' : ''
        } ${isBlogPage ? 'blog-header' : ''
        } ${isBusinessSolutionsPage ? 'business-solutions-header' : ''
        } ${isCropListingPage ? 'crop-listing-header' : ''
        } ${isMarketPricesPage ? 'market-prices-header' : ''
        } ${isPaymentsPage ? 'payments-header' : ''
        } ${isGoalsPage ? 'goals-header' : ''
        } ${isGuidesPage ? 'guides-header' : ''
        } ${isBusinessLogisticsPage ? 'business-logistics-header' : ''
        } ${isQualityAssurancePage ? 'quality-assurance-header' : ''
        } ${isResearchPage ? 'research-header' : ''
        } ${isAlgorithmPage ? 'algorithm-header' : ''
        }`}>
        <div className="container">
          <nav className="navbar navbar-expand-lg" aria-label="Main navigation">
            {/* Logo with optional text on about and contact pages */}
            <Link
              to="/"
              className={`logo ${isAboutPage || isContactPage ? 'text-logo' : ''}`}
              onClick={closeMobileMenu}
            >
              <img
                src={logo}
                alt="Farm Vantara Logo"
                className="logo-img"
                width="225"
                height="75"
                loading="eager"
              />
            </Link>

            {isRegisterPage ? (
              <Link to="/" className="back-home">
                <i className="fas fa-arrow-left"></i> Back to Home
              </Link>
            ) : (
              <>
                {/* Bootstrap toggler button */}
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle navigation"
                  aria-expanded={isMobileMenuOpen}
                >
                  <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>

                {/* Bootstrap collapsible container */}
                <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {navLinks.map((link) => (
                      <li key={link.path} className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}>

                        {link.path === '/shop' ? (
                          // 🔥 External website (same tab)
                          <a
                            href="https://farmvantara.shop"
                            className="nav-link"
                          >
                            <i className={`fas ${link.icon}`}></i>
                            {link.label && ` ${link.label}`}
                          </a>
                        ) : (
                          // Normal React routing
                          <Link
                            to={link.path}
                            className="nav-link"
                          >
                            <i className={`fas ${link.icon}`}></i>
                            {link.label && ` ${link.label}`}
                          </Link>
                        )}

                      </li>
                    ))}
                  </ul>

                  {/* Auth buttons (always visible in desktop, inside collapse in mobile) */}
                  {showAuthButtons && (
                    <div className="auth-buttons d-flex">
                      {currentUser ? (
                        <>
                          <Link 
                            to={currentUser.role === 'farmer' ? '/farmer-dashboard' : (currentUser.role === 'admin' ? '/admin' : '/buyer-dashboard')} 
                            className="btn-login me-2"
                          >
                            <i className="fas fa-tachometer-alt"></i> Dashboard
                          </Link>
                          <button onClick={handleLogout} className="btn-register btn-register-logout" style={{ border: 'none', cursor: 'pointer' }}>
                            <i className="fas fa-sign-out-alt"></i> Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="btn-login me-2">
                            <i className="fas fa-sign-in-alt"></i> Login
                          </Link>
                          <Link
                            to={registerProps.to}
                            className="btn-register"
                          >
                            <i className={`fas ${registerProps.icon}`}></i>
                            {registerProps.text}
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {isContactPage && (
                  <Link to="/" className="back-home contact-back-home">
                    <i className="fas fa-arrow-left"></i> Back to Home
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;