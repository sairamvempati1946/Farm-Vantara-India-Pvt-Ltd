// src/components/Footer.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Footer.css';
import Logo from "../assets/logo.png";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Hide footer on admin routes and dashboard routes
  if (location.pathname.startsWith('/admin') ||
    location.pathname === '/buyer-dashboard' ||
    location.pathname === '/farmer-dashboard') {
    return null;
  }

  const handlePolicyClick = (e, policyId) => {
    e.preventDefault();

    if (location.pathname === "/contact") {
      window.location.hash = policyId; // ✅ trigger hashchange
    } else {
      navigate(`/contact#${policyId}`);
    }
  };

  // Define navigation links - consistent for all pages
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/farmers', label: 'For Farmers' },
    { path: '/business', label: 'For Businesses' },
    { path: '/shop', label: 'Shop Fresh' },
    { path: '/process', label: 'How It Works' },
    { path: '/impact', label: 'Our Impact' }
  ];

  // Policy links for footer bottom
  const policyLinks = [
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms of Service' },
    { id: 'shipping', label: 'Shipping Policy' },
    { id: 'refund', label: 'Refund Policy' }
  ];

  // Dynamic resource links based on current page
  const getResourceLinks = () => {
    const currentPath = location.pathname;

    // Page-specific resource links
    if (currentPath === '/farmers') {
      return [
        { path: '/register?role=farmer', label: 'Register Your Farm' },
        { path: '/market-prices', label: 'Live Market Prices' },
        { path: '/crop-listing', label: 'Crop Listing Guide' },
        { path: '/payments', label: 'Payment Methods' },
        { path: '/success-stories', label: 'Success Stories' },
      ];
    }

    if (currentPath === '/business' || currentPath === '/business-solutions') {
      return [
        { path: '/business-solutions', label: 'Business Solutions' },
        { path: '/pricing', label: 'Volume Pricing' },
        { path: '/logistics', label: 'Business Logistics' },
        { path: '/case-studies', label: 'Case Studies' },
        { path: '/support', label: 'Business Support' },
      ];
    }

    if (currentPath === '/shop') {
      return [
        { path: '/shop', label: 'Browse Products' },
        { path: '/categories', label: 'Shop by Category' },
        { path: '/offers', label: 'Current Offers' },
        { path: '/new-arrivals', label: 'New Arrivals' },
        { path: '/best-sellers', label: 'Best Sellers' },
      ];
    }

    if (currentPath === '/about') {
      return [
        { path: '/about', label: 'Our Story' },
        { path: '/team', label: 'Leadership Team' },
        { path: '/careers', label: 'Careers' },
        { path: '/press', label: 'Press & Media' },
        { path: '/awards', label: 'Awards & Recognition' },
      ];
    }

    if (currentPath === '/contact') {
      return [
        { path: '/contact', label: 'Contact Form' },
        { path: '/support', label: 'Support Center' },
        { path: '/feedback', label: 'Give Feedback' },
        { path: '/report-issue', label: 'Report an Issue' },
        { path: '/complaints', label: 'Grievance Redressal' },
      ];
    }

    if (currentPath === '/algorithm') {
      return [
        { path: '/algorithm', label: 'Matching Algorithm' },
        { path: '/quality', label: 'Quality Assurance' },
        { path: '/process', label: 'How It Works' },
        { path: '/technology', label: 'Our Technology' },
        { path: '/security', label: 'Data Security' },
      ];
    }

    if (currentPath === '/blog') {
      return [
        { path: '/blog', label: 'Latest Articles' },
        { path: '/blog/categories', label: 'Categories' },
        { path: '/blog/trending', label: 'Trending Posts' },
        { path: '/guest-blogging', label: 'Write for Us' },
        { path: '/newsletter', label: 'Newsletter' },
      ];
    }

    if (currentPath === '/faq') {
      return [
        { path: '/faq', label: 'General FAQs' },
        { path: '/faq/farmers', label: 'For Farmers' },
        { path: '/faq/business', label: 'For Businesses' },
        { path: '/faq/shipping', label: 'Shipping FAQs' },
        { path: '/faq/payments', label: 'Payment FAQs' },
      ];
    }

    if (currentPath === '/guides') {
      return [
        { path: '/guides/farming', label: 'Farming Guides' },
        { path: '/guides/selling', label: 'Selling Guides' },
        { path: '/guides/buying', label: 'Buying Guides' },
        { path: '/guides/logistics', label: 'Logistics Guides' },
        { path: '/guides/legal', label: 'Legal Guides' },
      ];
    }

    if (currentPath === '/researchpapers') {
      return [
        { path: '/researchpapers', label: 'All Papers' },
        { path: '/researchpapers/sustainable', label: 'Sustainable Agriculture' },
        { path: '/researchpapers/technology', label: 'AgriTech Research' },
        { path: '/researchpapers/economics', label: 'Farm Economics' },
        { path: '/researchpapers/case-studies', label: 'Case Studies' },
      ];
    }

    if (currentPath === '/logistics') {
      return [
        { path: '/logistics/tracking', label: 'Track Order' },
        { path: '/logistics/shipping', label: 'Shipping Policy' },
        { path: '/logistics/coverage', label: 'Delivery Coverage' },
        { path: '/logistics/partners', label: 'Logistics Partners' },
        { path: '/logistics/faq', label: 'Logistics FAQ' },
      ];
    }

    if (currentPath === '/pricing') {
      return [
        { path: '/pricing/individual', label: 'Individual Plans' },
        { path: '/pricing/business', label: 'Business Plans' },
        { path: '/pricing/enterprise', label: 'Enterprise Solutions' },
        { path: '/pricing/calculator', label: 'Pricing Calculator' },
        { path: '/pricing/comparison', label: 'Compare Plans' },
      ];
    }

    if (currentPath === '/quality') {
      return [
        { path: '/quality/standards', label: 'Quality Standards' },
        { path: '/quality/certification', label: 'Certifications' },
        { path: '/quality/inspection', label: 'Inspection Process' },
        { path: '/quality/guarantee', label: 'Quality Guarantee' },
        { path: '/quality/reports', label: 'Quality Reports' },
      ];
    }

    if (currentPath === '/process') {
      return [
        { path: '/process/registration', label: 'Registration' },
        { path: '/process/listing', label: 'Product Listing' },
        { path: '/process/matching', label: 'Matching Process' },
        { path: '/process/payment', label: 'Payment Process' },
        { path: '/process/delivery', label: 'Delivery Process' },
      ];
    }

    if (currentPath === '/impact') {
      return [
        { path: '/impact/farmers', label: 'Farmer Impact' },
        { path: '/impact/environment', label: 'Environmental Impact' },
        { path: '/impact/economy', label: 'Economic Impact' },
        { path: '/impact/reports', label: 'Annual Reports' },
        { path: '/impact/goals', label: 'Future Goals' },
      ];
    }

    // Default resource links for all other pages
    return [
      { path: '/blog', label: 'Blog & Articles' },
      { path: '/guides', label: 'Farming Guides' },
      { path: '/market-prices', label: 'Market Insights' },
      { path: '/researchpapers', label: 'Research Papers' },
      { path: '/webinars', label: 'Webinars' },
    ];
  };

  // Get resource section title based on current page
  const getResourceTitle = () => {
    const currentPath = location.pathname;

    if (currentPath === '/farmers') return 'For Farmers';
    if (currentPath === '/business' || currentPath === '/business-solutions') return 'For Business';
    if (currentPath === '/shop') return 'Quick Shop';
    if (currentPath === '/about') return 'About Us';
    if (currentPath === '/contact') return 'Get in Touch';
    if (currentPath === '/algorithm') return 'Technology';
    if (currentPath === '/blog') return 'Blog';
    if (currentPath === '/faq') return 'FAQ Topics';
    if (currentPath === '/guides') return 'Guides';
    if (currentPath === '/researchpapers') return 'Research';
    if (currentPath === '/logistics') return 'Logistics';
    if (currentPath === '/pricing') return 'Pricing';
    if (currentPath === '/quality') return 'Quality';
    if (currentPath === '/process') return 'Process';
    if (currentPath === '/impact') return 'Impact';
    return 'Resources';
  };

  // Social links
  const socialLinks = [
    { icon: 'fab fa-facebook-f', url: 'https://facebook.com/farmvantara', label: 'Facebook' },
    { icon: 'fab fa-twitter', url: 'https://twitter.com/farmvantara', label: 'Twitter' },
    { icon: 'fab fa-instagram', url: 'https://instagram.com/farmvantara', label: 'Instagram' },
    { icon: 'fab fa-youtube', url: 'https://youtube.com/farmvantara', label: 'YouTube' },
    { icon: 'fab fa-linkedin-in', url: 'https://linkedin.com/company/farmvantara', label: 'LinkedIn' }
  ];

  const resourceLinks = getResourceLinks();
  const resourceTitle = getResourceTitle();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Main Footer Content - 4 Column Grid */}
        <div className="footer-grid">

          {/* Column 1: Logo & Social Links */}
          <div className="footer-col footer-brand-col">
            <div className="footer-logo">
              <img
                src={Logo}
                alt="Farm Vantara - Transforming Indian Agriculture"
                className="footer-logo-img"
                width="275"
                height="100"
                loading="lazy"
              />
            </div>
            <p className="footer-description">
              India's leading AgriTech platform connecting farmers directly with businesses and consumers.
              Empowering agriculture with technology, transparency, and direct market access since 2023.
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={social.label}
                  className="social-link"
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="footer-col">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path}>
                    <i className="fas fa-chevron-right"></i> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Dynamic Resources */}
          <div className="footer-col">
            <h4 className="footer-title">{resourceTitle}</h4>
            <ul className="footer-links">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path}>
                    <i className="fas fa-chevron-right"></i> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="footer-col footer-contact-col">
            <h4 className="footer-title">Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>1st Floor, Lumbini Avenue, Behind Preston Prime Mall, Gachibowli, Hyderabad, Telangana - 500032</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone-alt"></i>
                <a href="tel:+919491483933" className="contact-link">+91 9491483933</a>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <a href="mailto:info@farmvantara.com" className="contact-link">info@farmvantara.com</a>
              </div>
              <div className="contact-item">
                <i className="fab fa-whatsapp"></i>
                <a href="https://wa.me/919553774933" target="_blank" rel="noopener noreferrer" className="contact-link">+91 9553774933</a>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <span>Mon-Sat: 8AM-8PM | Sun: 10AM-6PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Updated with working policy links */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright-line">
              &copy; {currentYear} Farm Vantara India Private Limited – India's Leading AgriTech Platform. All rights reserved.

              {policyLinks.map((policy, index) => (
                <span key={policy.id}>
                  <span className="copyright-separator">|</span>
                  <a
                    href="#"
                    onClick={(e) => handlePolicyClick(e, policy.id)}
                    className="policy-link"
                  >
                    {policy.label}
                  </a>
                </span>
              ))}
              <span className="inline-group">
                <i className="fas fa-leaf"></i>
                <span>UDYAM-AP-03-0113582</span>
              </span>
              <span className="copyright-separator">|</span>
              <i className="fas fa-shield-alt"></i>
              <span>Govt. Certified</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;