// src/pages/Contact.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Contact.css";
import logo from "../assets/logo.png";

const Contact = () => {

  const location = useLocation();
  const [activeTab, setActiveTab] = useState('privacy');
  const [activeFaq, setActiveFaq] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [counts, setCounts] = useState({
    support: 0,
    response: 0,
    satisfaction: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: '',
    agree: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState(null);

  // Contact options
  const contactOptions = [
    {
      icon: 'fa-tractor',
      title: 'Farmer Support',
      description: 'For farmers needing assistance with registration, listing, or payments',
      link: 'tel:9491483933',
      linkText: '+91 9491483933',
      linkIcon: 'fa-phone'
    },
    {
      icon: 'fa-building',
      title: 'Business Inquiries',
      description: 'For corporate procurement, partnerships, and bulk orders',
      link: 'mailto:helpdesk@farmvantara.com',
      linkText: 'helpdesk@farmvantara.com',
      linkIcon: 'fa-envelope'
    },
    {
      icon: 'fab fa-question-circle',
      title: 'WhatsApp Support',
      description: 'Quick assistance via WhatsApp. We respond within 30 minutes',
      link: 'https://wa.me/919553774933',
      linkText: '+91 95537 74933',
      linkIcon: 'fab fa-whatsapp',
      external: true
    }
  ];

  // Office locations
  const officeLocations = [
    {
      title: 'Headquarters - Hyderabad',
      icon: 'fa-building',
      image: 'https://photos.letsroam.com/scavenger_hunt_locations/___scavenger_hunt_1762264891_medium.jpg',
      details: [
        { icon: 'fa-map-marker-alt', text: 'Near Preston Prime Mall, Gachibowli, Hyderabad, Telangana - 500032' },
        { icon: 'fa-phone', text: '+91 9491483933' },
        { icon: 'fa-envelope', text: 'admin@farmvantara.com' },
        { icon: 'fa-clock', text: 'Mon-Sat: 9AM-7PM | Sun: 10AM-6PM' }
      ]
    },
    {
      title: 'Technology Hub - Hyderabad',
      icon: 'fa fa-file-code',
      image: 'https://media.telanganatoday.com/wp-content/uploads/2023/01/Hyderabad-3-2.jpg',
      details: [
        { icon: 'fa-map-marker-alt', text: 'Gachibowli, Hyderabad, Telangana - 500032' },
        { icon: 'fa-phone', text: '+91 9553774933' },
        { icon: 'fa-envelope', text: 'tech@farmvantara.com' },
        { icon: 'fa-clock', text: 'Mon-Fri: 9AM-8PM | Sat: 10AM-6PM' }
      ]
    },
    {
      title: 'Agri Hub - Dharmavaram',
      icon: 'fa-tractor',
      image: 'https://alchetron.com/cdn/west-godavari-district-14e9aa34-2f6f-42ed-8f88-f32327ee455-resize-750.jpg',
      details: [
        { icon: 'fa-map-marker-alt', text: 'FV Agri Complex, Dharmavaram, East Godavari, Andhra Pradesh - 534340' },
        { icon: 'fa-phone', text: '+91 161 345 6789' },
        { icon: 'fa-envelope', text: 'agriculture@farmvantara.com' },
        { icon: 'fa-clock', text: 'Mon-Sat: 8AM-8PM | Sun: 9AM-5PM' }
      ]
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: 'How do I register as a farmer on Farm Vantara?',
      answer: 'To register as a farmer, visit our Farmers page and click "Register Free". You\'ll need to provide basic information, farm details, identity proof, and bank details for payments. Our team will verify your details within 24 hours and activate your account.'
    },
    {
      question: 'What are the commission charges for farmers?',
      answer: 'Farm Vantara charges a nominal 2% commission on successful transactions. There are no registration fees, monthly fees, or hidden charges. First 10 transactions are completely free for new farmers.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery times vary by location: Metro cities (24-48 hours), Tier 2 cities (48-72 hours), other areas (3-5 business days). Same-day delivery is available in select cities for orders placed before 12 PM.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major payment methods: Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Digital Wallets. Payments to farmers are released within 24 hours of successful delivery.'
    },
    {
      question: 'How do I report a quality issue?',
      answer: 'Report quality issues within 24 hours of delivery through your order history or contact customer support at 1800-123-4567. Please provide photos of the issue for faster resolution.'
    }
  ];

  // Policy content
  const policyContent = {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'January 15, 2024',
      sections: [
        {
          title: '1. Information We Collect',
          content: 'At Farm Vantara, we collect information to provide better services to all our users - farmers, businesses, and consumers. We collect information in the following ways:',
          list: [
            '<strong>Information you provide:</strong> When you register for an account, we ask for personal information like your name, email address, telephone number, and address.',
            '<strong>Transaction information:</strong> When you buy or sell through Farm Vantara, we collect information about the transaction.',
            '<strong>Information we get from your use of our services:</strong> We collect information about the services that you use and how you use them, like when you visit our website or view and interact with our content.'
          ]
        },
        {
          title: '2. How We Use Information',
          content: 'We use the information we collect from all our services to provide, maintain, protect and improve them, to develop new ones, and to protect Farm Vantara and our users. We also use this information to offer you tailored content.',
          list: [
            'To verify your identity and prevent fraud',
            'To process your transactions',
            'To provide customer support',
            'To send you important notices, such as communications about purchases and changes to our terms, conditions, and policies',
            'For internal purposes such as auditing, data analysis, and research to improve our products, services, and customer communications'
          ]
        },
        {
          title: '3. Information Security',
          content: 'We work hard to protect Farm Vantara and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold. In particular:',
          list: [
            'We encrypt many of our services using SSL',
            'We review our information collection, storage and processing practices, including physical security measures, to guard against unauthorized access to systems',
            'We restrict access to personal information to Farm Vantara employees, contractors and agents who need to know that information in order to process it for us, and who are subject to strict contractual confidentiality obligations'
          ]
        },
        {
          title: '4. Changes to Privacy Policy',
          content: 'Our Privacy Policy may change from time to time. We will not reduce your rights under this Privacy Policy without your explicit consent. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice (including, for certain services, email notification of privacy policy changes).'
        }
      ]
    },
    terms: {
      title: 'Terms & Conditions',
      lastUpdated: 'January 15, 2024',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: 'By accessing and using Farm Vantara\'s website and services, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.'
        },
        {
          title: '2. User Accounts',
          content: 'When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.',
          list: [
            'You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.'
          ]
        },
        {
          title: '3. Platform Usage',
          content: 'Farm Vantara is an agricultural marketplace that connects farmers directly with buyers. Users agree to:',
          list: [
            'Provide accurate product descriptions and pricing',
            'Maintain product quality as described',
            'Complete transactions in good faith',
            'Not engage in fraudulent activities',
            'Comply with all applicable laws and regulations'
          ]
        },
        {
          title: '4. Transactions and Payments',
          content: 'All transactions on Farm Vantara are conducted through secure payment gateways. We charge a nominal platform fee for facilitating transactions:',
          list: [
            'Farmers: 2% transaction fee on successful sales',
            'Buyers: No additional fees beyond product price and delivery charges',
            'Payments to farmers are released within 24 hours of successful delivery verification'
          ]
        },
        {
          title: '5. Limitation of Liability',
          content: 'Farm Vantara shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.'
        }
      ]
    },
    shipping: {
      title: 'Shipping & Delivery Policy',
      lastUpdated: 'January 15, 2024',
      sections: [
        {
          title: '1. Delivery Areas',
          content: 'Farm Vantara currently delivers to 50+ cities across India. Delivery availability is displayed during checkout based on your delivery location.'
        },
        {
          title: '2. Delivery Timeframes',
          list: [
            '<strong>Metro Cities:</strong> 24-48 hours',
            '<strong>Tier 2 Cities:</strong> 48-72 hours',
            '<strong>Other Areas:</strong> 3-5 business days',
            '<strong>Same Day Delivery:</strong> Available in select areas for orders placed before 12 PM'
          ]
        },
        {
          title: '3. Shipping Charges',
          content: 'Shipping charges vary based on:',
          list: [
            'Delivery location',
            'Order weight and volume',
            'Special handling requirements (cold chain, fragile items)',
            'Free delivery on orders above ₹999 in select cities'
          ]
        },
        {
          title: '4. Cold Chain Logistics',
          content: 'For perishable items, we maintain temperature-controlled logistics:',
          list: [
            'Temperature monitoring throughout transit',
            'Specialized packaging for fruits and vegetables',
            'Dairy products delivered in insulated containers'
          ]
        }
      ]
    },
    refund: {
      title: 'Return & Refund Policy',
      lastUpdated: 'January 15, 2024',
      sections: [
        {
          title: '1. Quality Guarantee',
          content: 'Farm Vantara guarantees the quality of all products sold on our platform. If you\'re not satisfied with the quality of produce received, you\'re eligible for:',
          list: [
            'Full refund within 24 hours of delivery',
            'Partial refund for minor quality issues',
            'Replacement delivery at no extra cost'
          ]
        },
        {
          title: '2. Return Process',
          content: 'To initiate a return:',
          list: [
            'Report the issue within 24 hours of delivery',
            'Provide photos of the quality issue',
            'Our quality team will review within 2 hours',
            'If approved, pickup will be scheduled within 24 hours',
            'Refund processed within 3-5 business days'
          ]
        },
        {
          title: '3. Non-Returnable Items',
          content: 'Certain items cannot be returned:',
          list: [
            'Perishable items after 24 hours of delivery',
            'Customized or personalized orders',
            'Damaged due to customer mishandling'
          ]
        },
        {
          title: '4. Refund Methods',
          content: 'Refunds are issued to the original payment method:',
          list: [
            'Credit/Debit Cards: 5-7 business days',
            'UPI: 24-48 hours',
            'Net Banking: 3-5 business days',
            'Wallet: Instant to 24 hours'
          ]
        }
      ]
    }
  };

  useEffect(() => {
    animateCounters();

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('.contact-card, .location-card, .faq-item').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash) {
        setActiveTab(hash);

        setTimeout(() => {
          const element = document.getElementById("policies");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    };

    // initial load ki
    handleHashChange();

    // hash change listener
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const animateCounters = () => {
    const targets = { support: 24, response: 2, satisfaction: 98 };
    const durations = { support: 2000, response: 1500, satisfaction: 1000 };

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        errors.phone = 'Please enter a valid Indian phone number';
      }
    }

    if (!formData.category) {
      errors.category = 'Please select a category';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    if (!formData.agree) {
      errors.agree = 'You must agree to the Privacy Policy';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotification('Please fix the errors in the form', 'error');
      return;
    }

    showNotification('Your message has been sent successfully! We\'ll get back to you within 2 hours.', 'success');

    setFormData({
      name: '',
      email: '',
      phone: '',
      category: '',
      subject: '',
      message: '',
      agree: false
    });

    console.log('Form submitted:', formData);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePolicyLinkClick = (e, tabId) => {
    e.preventDefault();
    setActiveTab(tabId);
    document.getElementById('policies').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Banner */}
        <section className="contact-hero">
          <div className="container">
            <div className="hero-content-wrapper">
              <div className="hero-content-left">
                <h1 className="hero-title">Get in Touch with Farm Vantara</h1>
                <p className="hero-subtitle">
                  We're here to help farmers, businesses, and customers connect with India's leading AgriTech platform.
                  Whether you need support, have questions, or want to partner with us, we're just a call or click away.
                </p>
              </div>
              <div className="hero-stats-right">
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">{counts.support}/7</span>
                    <span className="stat-label">Support Available</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{counts.response} hr</span>
                    <span className="stat-label">Response Time</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{counts.satisfaction}%</span>
                    <span className="stat-label">Satisfaction Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="contact-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Contact Options</h2>
              <p className="section-subtitle">Choose the most convenient way to reach us</p>
            </div>

            <div className="contact-grid">
              {contactOptions.map((option, index) => (
                <div key={index} className="contact-card">
                  <div className="contact-icon">
                    <i className={`fas ${option.icon}`}></i>
                  </div>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                  {option.external ? (
                    <a href={option.link} target="_blank" rel="noopener noreferrer" className="contact-link">
                      <i className={`fas ${option.linkIcon}`}></i>
                      {option.linkText}
                    </a>
                  ) : (
                    <a href={option.link} className="contact-link">
                      <i className={`fas ${option.linkIcon}`}></i>
                      {option.linkText}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-section">
          <div className="container">
            <div className="form-section">
              <div className="form-header">
                <h2 className="form-title">Send Us a Message</h2>
                <p className="form-subtitle">Fill out the form below and our team will get back to you within 2 hours</p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.name ? 'error' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                    {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? 'error' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                    />
                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      className={`form-control ${formErrors.phone ? 'error' : ''}`}
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="category">Inquiry Category *</label>
                    <div className="select-wrapper">
                      <select
                        className={`form-control ${formErrors.category ? 'error' : ''}`}
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a category</option>
                        <option value="farmer">Farmer Support</option>
                        <option value="customer">Customer Support</option>
                        <option value="business">Business Inquiry</option>
                        <option value="partner">Partnership</option>
                        <option value="media">Media & Press</option>
                        <option value="career">Careers</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    {formErrors.category && <span className="error-message">{formErrors.category}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.subject ? 'error' : ''}`}
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your inquiry"
                  />
                  {formErrors.subject && <span className="error-message">{formErrors.subject}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message *</label>
                  <textarea
                    className={`form-control ${formErrors.message ? 'error' : ''}`}
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please provide details about your inquiry"
                    rows="5"
                  ></textarea>
                  {formErrors.message && <span className="error-message">{formErrors.message}</span>}
                </div>

                <div className="form-group checkbox-group">
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      id="agree"
                      name="agree"
                      checked={formData.agree}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="agree">
                      I agree to the <a href="#privacy" className="policy-link" onClick={(e) => handlePolicyLinkClick(e, 'privacy')}>Privacy Policy</a> and allow Farm Vantara to contact me
                    </label>
                  </div>
                  {formErrors.agree && <span className="error-message">{formErrors.agree}</span>}
                </div>

                <button type="submit" className="btn-submit">
                  <i className="fas fa-paper-plane"></i>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="locations-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Office Locations</h2>
              <p className="section-subtitle">Visit us at our offices across India</p>
            </div>

            <div className="locations-grid">
              {officeLocations.map((location, index) => (
                <div key={index} className="location-card">
                  <div className="location-image">
                    <img src={location.image} alt={location.title} loading="lazy" />
                  </div>
                  <div className="location-content">
                    <div className="location-header">
                      <div className="location-icon">
                        <i className={`fas ${location.icon}`}></i>
                      </div>
                      <h3 className="location-title">{location.title}</h3>
                    </div>
                    <ul className="location-details">
                      {location.details.map((detail, idx) => (
                        <li key={idx}>
                          <i className={`fas ${detail.icon}`}></i>
                          <span>{detail.text}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="#" className="btn-location">
                      <i className="fas fa-directions"></i>
                      Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Policies Section */}
        <section className="policies-section" id="policies">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Policies & Legal Information</h2>
              <p className="section-subtitle">Important legal documents and policies for your reference</p>
            </div>

            <div className="policies-tabs">
              <div className="tabs-header">
                {Object.keys(policyContent).map((key) => (
                  <button
                    key={key}
                    className={`tab-btn ${activeTab === key ? 'active' : ''}`}
                    onClick={() => setActiveTab(key)}
                  >
                    <i className={`fas fa-${key === 'privacy' ? 'shield-alt' :
                      key === 'terms' ? 'file-contract' :
                        key === 'shipping' ? 'shipping-fast' :
                          'undo-alt'
                      }`}></i>
                    {policyContent[key].title}
                  </button>
                ))}
              </div>

              <div className="tabs-content">
                {Object.keys(policyContent).map((key) => (
                  <div
                    key={key}
                    className={`tab-content ${activeTab === key ? 'active' : ''}`}
                    id={key}
                  >
                    <div className="policy-content">
                      <h2>{policyContent[key].title}</h2>
                      <p><strong>Last Updated:</strong> {policyContent[key].lastUpdated}</p>

                      {policyContent[key].sections.map((section, idx) => (
                        <div key={idx}>
                          <h3>{section.title}</h3>
                          {section.content && <p>{section.content}</p>}
                          {section.list && (
                            <ul>
                              {section.list.map((item, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: item }}></li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">Quick answers to common questions</p>
            </div>

            <div className="faq-container">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                >
                  <div
                    className="faq-question"
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  >
                    <span>{item.question}</span>
                    <i className={`fas fa-plus faq-icon ${activeFaq === index ? 'rotate' : ''}`}></i>
                  </div>
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Fixed WhatsApp Button - Matching Home Page */}
      <a
        href="https://wa.me/919553774933"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </>
  );
};

export default Contact;