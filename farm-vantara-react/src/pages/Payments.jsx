// src/pages/Payments.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Payments.css";

const Payments = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [calcResult, setCalcResult] = useState({
    visible: false,
    amount: 0,
    fees: 0,
    net: 0,
    timeline: '',
    note: ''
  });
  const [selectorResult, setSelectorResult] = useState({
    visible: false,
    title: '',
    description: '',
    bestFor: ''
  });
  const [calculator, setCalculator] = useState({
    amount: 50000,
    method: 'upi'
  });

  const navMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);

  
  // Payment methods data
  const paymentMethods = [
    {
      id: 'upi',
      title: 'UPI Payments',
      category: 'Instant & Most Popular',
      icon: 'fa-university',
      iconBg: 'var(--gradient-blue)',
      description: 'Unified Payments Interface (UPI) allows instant bank-to-bank transfers using mobile apps like Google Pay, PhonePe, Paytm, and BHIM. Most recommended for transactions under ₹2 lakhs.',
      details: [
        { label: 'Transaction Speed', value: 'Instant', color: 'var(--dark-green)' },
        { label: 'Transaction Limit', value: '₹1-2 lakhs/day' },
        { label: 'Transaction Fees', value: 'Zero charges' },
        { label: 'Best For', value: 'Small to medium transactions' }
      ],
      recommendation: { type: 'good', text: 'RECOMMENDED: Fastest & most convenient for daily transactions' }
    },
    {
      id: 'escrow',
      title: 'Escrow Protection Service',
      category: 'Farm Vantara Exclusive',
      icon: 'fa-shield-alt',
      iconBg: 'var(--gradient-primary)',
      description: 'Our secure escrow service holds payment until produce delivery is confirmed. Once buyer verifies quality and quantity, payment is released to farmer. Eliminates payment risks for both parties.',
      details: [
        { label: 'Payment Release', value: 'After delivery verification' },
        { label: 'Transaction Limit', value: 'No limit' },
        { label: 'Service Fee', value: '1% (capped at ₹5,000)' },
        { label: 'Dispute Resolution', value: 'Included' }
      ],
      recommendation: { type: 'good', text: 'HIGHLY RECOMMENDED: Best for new relationships & large transactions' }
    },
    {
      id: 'bank-transfer',
      title: 'Bank Transfer',
      category: 'Traditional & Reliable',
      icon: 'fa-credit-card',
      iconBg: 'var(--gradient-yellow)',
      description: 'Direct bank transfers via NEFT, RTGS, or IMPS. NEFT operates in batches, RTGS for large amounts (₹2 lakhs+), and IMPS for instant transfers. Bank statements serve as transaction proof.',
      details: [
        { label: 'Transaction Speed', value: '2hrs - Instant' },
        { label: 'Transaction Limit', value: 'No limit (RTGS)' },
        { label: 'Bank Charges', value: '₹2-25 + GST' },
        { label: 'Best For', value: 'Large transactions' }
      ],
      recommendation: { type: 'good', text: 'RECOMMENDED: Ideal for transactions over ₹2 lakhs' }
    },
    {
      id: 'wallet',
      title: 'Digital Wallets',
      category: 'Mobile Convenience',
      icon: 'fa-mobile-alt',
      iconBg: 'var(--gradient-purple)',
      description: 'Paytm, PhonePe Wallet, Amazon Pay, and other mobile wallets. Money is stored in the wallet and can be transferred instantly. KYC verification required for larger transactions.',
      details: [
        { label: 'Transaction Speed', value: 'Instant' },
        { label: 'Wallet Limit', value: '₹1-2 lakhs (with KYC)' },
        { label: 'Transaction Fees', value: 'Zero for wallet to wallet' },
        { label: 'Best For', value: 'Quick small payments' }
      ],
      recommendation: { type: 'fair', text: 'GOOD ALTERNATIVE: Convenient but has wallet balance limits' }
    },
    {
      id: 'qr',
      title: 'QR Code Payments',
      category: 'Contactless & Easy',
      icon: 'fa-qrcode',
      iconBg: 'var(--gradient-red)',
      description: 'Static or dynamic QR codes that can be scanned with any UPI app. Farmers can display printed QR codes at collection points. Buyers scan and pay instantly without sharing details.',
      details: [
        { label: 'Transaction Speed', value: 'Instant' },
        { label: 'Transaction Limit', value: 'Same as UPI limits' },
        { label: 'Setup Required', value: 'QR code generation' },
        { label: 'Best For', value: 'In-person transactions' }
      ],
      recommendation: { type: 'good', text: 'RECOMMENDED: Excellent for collection centers & mandis' }
    },
    {
      id: 'cheque',
      title: 'Cheque/Demand Draft',
      category: 'Traditional Paper',
      icon: 'fa-file-invoice-dollar',
      iconBg: '#636e72',
      description: 'Physical cheques or demand drafts. Cheques take 2-3 days to clear, demand drafts are pre-paid instruments. Provides physical proof but has clearing time and bounce risks.',
      details: [
        { label: 'Clearing Time', value: '2-3 business days' },
        { label: 'Risk Factor', value: 'Cheque bounce risk' },
        { label: 'Bank Charges', value: '₹50-200 per instrument' },
        { label: 'Best For', value: 'Traditional businesses' }
      ],
      recommendation: { type: 'limited', text: 'LIMITED USE: Only when digital options not available' }
    }
  ];

  // Security features
  const securityFeatures = [
    { icon: 'fa-lock', title: 'End-to-End Encryption', description: 'All payment data is encrypted using 256-bit SSL encryption. Your financial information is never stored on our servers.' },
    { icon: 'fa-user-shield', title: 'Two-Factor Authentication', description: 'Mandatory OTP verification for all transactions above ₹10,000. Additional security layer prevents unauthorized payments.' },
    { icon: 'fa-history', title: 'Transaction Tracking', description: 'Real-time tracking of every payment with status updates. Complete audit trail available for dispute resolution.' },
    { icon: 'fa-handshake', title: 'Dispute Resolution', description: '48-hour dispute resolution service. Our team mediates between farmers and buyers to resolve payment issues fairly.' }
  ];

  // Payment comparison data
  const comparisonData = [
    {
      method: 'UPI Payments',
      icon: 'fa-university',
      iconBg: 'var(--gradient-blue)',
      speed: { text: 'Instant', color: 'var(--dark-green)' },
      fees: 'Zero',
      limit: '₹2 lakhs/day',
      security: 5,
      badge: { text: 'Best Overall', type: 'recommended' }
    },
    {
      method: 'Escrow Service',
      icon: 'fa-shield-alt',
      iconBg: 'var(--gradient-primary)',
      speed: { text: '24-48 hours' },
      fees: '1% (capped)',
      limit: 'No limit',
      security: 5,
      badge: { text: 'High Value & New Buyers', type: 'recommended' }
    },
    {
      method: 'Bank Transfer',
      icon: 'fa-credit-card',
      iconBg: 'var(--gradient-yellow)',
      speed: { text: '2hrs - Instant' },
      fees: '₹2-25 + GST',
      limit: 'No limit',
      security: 4.5,
      badge: { text: 'Large Transactions', type: 'recommended' }
    },
    {
      method: 'Digital Wallets',
      icon: 'fa-mobile-alt',
      iconBg: 'var(--gradient-purple)',
      speed: { text: 'Instant', color: 'var(--dark-green)' },
      fees: 'Zero',
      limit: '₹1-2 lakhs',
      security: 4,
      badge: { text: 'Quick Small Payments', type: 'alternative' }
    },
    {
      method: 'QR Code Pay',
      icon: 'fa-qrcode',
      iconBg: 'var(--gradient-red)',
      speed: { text: 'Instant', color: 'var(--dark-green)' },
      fees: 'Zero',
      limit: '₹2 lakhs/day',
      security: 5,
      badge: { text: 'In-Person Collections', type: 'recommended' }
    }
  ];

  // Recommendations
  const recommendations = [
    {
      badge: 'For Farmers',
      title: 'Best Payment Methods for Farmers',
      items: [
        '<strong>UPI Payments</strong> - Instant receipt, no charges, works with any bank',
        '<strong>Escrow Service</strong> - Payment guarantee for new buyers',
        '<strong>QR Code Payments</strong> - Easy collection at farm gate',
        '<strong>Avoid cheques</strong> - Due to clearing delays and bounce risks',
        '<strong>Set payment terms</strong> - Define payment timeline upfront'
      ]
    },
    {
      badge: 'For Buyers',
      title: 'Best Payment Methods for Buyers',
      items: [
        '<strong>Escrow Service</strong> - Quality assurance before payment',
        '<strong>Bank Transfer (RTGS)</strong> - Best for large bulk purchases',
        '<strong>UPI Payments</strong> - Quick payments to trusted farmers',
        '<strong>Schedule payments</strong> - Align with delivery milestones',
        '<strong>Maintain records</strong> - Keep transaction proofs for accounting'
      ]
    },
    {
      badge: 'By Transaction Size',
      title: 'Recommendations by Amount',
      items: [
        '<i class="fas fa-rupee-sign"></i> <strong>Under ₹10,000:</strong> UPI or Digital Wallets (instant, no fee)',
        '<i class="fas fa-rupee-sign"></i> <strong>₹10,000 - ₹2 lakhs:</strong> UPI (instant) or IMPS (instant)',
        '<i class="fas fa-rupee-sign"></i> <strong>₹2 - ₹10 lakhs:</strong> Escrow Service or RTGS (secure, trackable)',
        '<i class="fas fa-rupee-sign"></i> <strong>Over ₹10 lakhs:</strong> Escrow Service (with milestone payments)',
        '<i class="fas fa-rupee-sign"></i> <strong>Regular transactions:</strong> Set up automated payment schedules'
      ]
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: 'How quickly do farmers receive payments?',
      answer: 'Payment timing depends on the method used: UPI & Digital Wallets are instant; Escrow Service releases within 24 hours of delivery verification; Bank transfers take 2 hours to 1 business day; Cheques require 2-3 business days for clearing. We guarantee payment to farmers within 24 hours when using Farm Vantara\'s payment services.'
    },
    {
      question: 'Are there any transaction fees charged by Farm Vantara?',
      answer: 'Farm Vantara does not charge any fees for UPI, bank transfers, digital wallets, or QR code payments. We only charge a 1% service fee (capped at ₹5,000) for our Escrow Protection Service, which includes payment security, dispute resolution, and guaranteed payment release. Bank charges for RTGS/NEFT/IMPS are levied by banks, not by Farm Vantara.'
    },
    {
      question: 'What if a payment fails or gets delayed?',
      answer: 'In case of payment failure: 1) Check transaction status in your payment app/bank, 2) Contact our 24/7 payment support at 1800-123-4567, 3) For Escrow Service, we mediate between parties, 4) Failed transactions are automatically reversed within 30 minutes. We provide transaction tracking and immediate notification for any delays. For disputes, our resolution team intervenes within 2 hours.'
    },
    {
      question: 'How do I set up UPI or QR code for my farm?',
      answer: 'Setting up UPI/QR is simple: 1) Download any UPI app (Google Pay, PhonePe, BHIM), 2) Link your bank account, 3) Create UPI ID (usually mobile@bankname), 4) In Farm Vantara profile, add your UPI ID, 5) We generate a unique QR code for you. For farmers without smartphones, we provide printed QR codes that can be scanned by buyers. Our support team assists with setup in regional languages.'
    },
    {
      question: 'What payment records will I receive?',
      answer: 'For every transaction, you receive: 1) Farm Vantara transaction receipt with details, 2) Payment confirmation from your bank/UPI app, 3) Monthly payment statements for accounting, 4) Annual transaction summary for tax purposes. All records are available in your account dashboard and can be downloaded as PDF. Farmers also receive SMS confirmation for every payment received.'
    }
  ];

  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Animate method cards on scroll
    const methodCards = document.querySelectorAll('.method-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 200);
        }
      });
    }, { threshold: 0.1 });
    
    methodCards.forEach(card => observer.observe(card));

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleCalculatorChange = (e) => {
    const { name, value } = e.target;
    setCalculator(prev => ({ ...prev, [name]: value }));
  };

  const calculatePaymentFees = () => {
    const amount = parseFloat(calculator.amount) || 0;
    const method = calculator.method;

    if (amount < 1000) {
      alert('Please enter an amount of ₹1000 or more');
      return;
    }

    let fees = 0;
    let timeline = '';
    let note = '';

    switch(method) {
      case 'upi':
        fees = 0;
        timeline = 'Instant';
        note = 'UPI payments are instant with zero charges. Recommended for transactions up to ₹2 lakhs.';
        break;
      case 'escrow':
        fees = Math.min(amount * 0.01, 5000);
        timeline = '24-48 hours';
        note = 'Escrow service fee includes payment protection and dispute resolution. Payment released after delivery verification.';
        break;
      case 'rtgs':
        fees = 25;
        timeline = '2 hours';
        note = 'RTGS is for amounts ₹2 lakhs and above. Bank charges apply. Settlement happens in real-time during banking hours.';
        break;
      case 'neft':
        fees = amount <= 10000 ? 2.5 : amount <= 100000 ? 5 : 25;
        timeline = '2 hours - Next day';
        note = 'NEFT operates in hourly batches. Charges vary by bank and amount.';
        break;
      case 'wallet':
        fees = 0;
        timeline = 'Instant';
        note = 'Digital wallets have transaction limits (typically ₹1-2 lakhs). No fees for wallet-to-wallet transfers.';
        break;
      case 'cheque':
        fees = 50;
        timeline = '2-3 business days';
        note = 'Includes clearing time and risk of cheque bounce. Not recommended for time-sensitive transactions.';
        break;
    }

    setCalcResult({
      visible: true,
      amount,
      fees,
      net: amount - fees,
      timeline,
      note
    });
  };

  const showMethodRecommendation = (method) => {
    const methods = {
      upi: {
        title: 'UPI Payments - Our Top Recommendation',
        description: 'Unified Payments Interface is perfect for most agricultural transactions. Instant transfers, zero charges, and works with any bank. Easy to use with mobile apps like Google Pay, PhonePe, or BHIM.',
        bestFor: 'Daily transactions under ₹2 lakhs, quick payments to trusted partners, and situations where instant payment confirmation is needed.'
      },
      escrow: {
        title: 'Escrow Service - Maximum Security',
        description: 'Farm Vantara\'s exclusive escrow service holds payment until delivery verification. Perfect for new business relationships or large transactions where trust needs to be established.',
        bestFor: 'First-time transactions, high-value purchases (over ₹2 lakhs), long-distance deals, and when quality verification is critical.'
      },
      bank: {
        title: 'Bank Transfers - Traditional & Reliable',
        description: 'Direct bank transfers (NEFT/RTGS/IMPS) are ideal for large transactions. Provides bank statements as proof and works for any amount. RTGS is instant for amounts over ₹2 lakhs.',
        bestFor: 'Bulk purchases, corporate payments, transactions over ₹5 lakhs, and when formal payment records are required for accounting.'
      },
      qr: {
        title: 'QR Code Payments - In-Person Convenience',
        description: 'QR codes make collection easy at farm gates or mandis. Buyers scan and pay instantly without sharing payment details. Can be printed and displayed anywhere.',
        bestFor: 'Farm gate collections, mandi transactions, situations with limited smartphone access, and quick in-person payments.'
      }
    };

    const selected = methods[method];
    if (selected) {
      setSelectorResult({
        visible: true,
        ...selected
      });
    }
  };

  const renderStars = (count) => {
    const stars = [];
    const fullStars = Math.floor(count);
    const hasHalf = count % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="fas fa-star"></i>);
    }
    if (hasHalf) {
      stars.push(<i key="half-star" className="fas fa-star-half-alt"></i>);
    }
    const emptyStars = 5 - Math.ceil(count);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  return (
    <>

      {/* Main Content */}
      <main id="main-content">
        {/* Payment Methods Hero */}
        <section className="payment-hero">
          <div className="container">
            <div className="payment-hero-content">
              <div className="payment-hero-text">
                <h1 className="payment-hero-title">Secure & Transparent Payment Methods</h1>
                <p className="payment-hero-subtitle">
                  Farm Vantara offers multiple secure payment options designed specifically for agricultural transactions. Choose from UPI, bank transfers, digital wallets, and our exclusive Escrow Protection Service to ensure safe and timely payments for both farmers and buyers.
                </p>
                
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">24hr</span>
                    <span className="stat-label">Guaranteed Payment</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Secure Transactions</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">0%</span>
                    <span className="stat-label">Farm Vantara Fees</span>
                  </div>
                </div>
              </div>
              <div className="payment-hero-visual">
                <div className="payment-visual-container">
                  <div className="payment-icon-large" style={{ background: 'var(--gradient-blue)', animationDelay: '0s' }}>
                    <i className="fas fa-university"></i>
                    UPI
                  </div>
                  <div className="payment-icon-large" style={{ background: 'var(--gradient-primary)', animationDelay: '-2s' }}>
                    <i className="fas fa-shield-alt"></i>
                    Escrow
                  </div>
                  <div className="payment-icon-large" style={{ background: 'var(--gradient-purple)', animationDelay: '-4s' }}>
                    <i className="fas fa-mobile-alt"></i>
                    Wallet
                  </div>
                  <div className="payment-icon-large" style={{ background: 'var(--gradient-yellow)', animationDelay: '-1s' }}>
                    <i className="fas fa-credit-card"></i>
                    Net Banking
                  </div>
                  <div className="payment-icon-large" style={{ background: 'var(--gradient-red)', animationDelay: '-3s' }}>
                    <i className="fas fa-qrcode"></i>
                    QR Pay
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods Details */}
        <section className="payment-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Available Payment Methods</h2>
              <p className="section-subtitle">Choose the payment method that best suits your transaction needs. All methods are secure and transparent.</p>
            </div>
            
            <div className="methods-grid">
              {paymentMethods.map((method, index) => (
                <div key={index} className="method-card" id={`${method.id}-method`}>
                  <div className="method-header">
                    <div className="method-icon" style={{ background: method.iconBg }}>
                      <i className={`fas ${method.icon}`}></i>
                    </div>
                    <div className="method-title-group">
                      <h3>{method.title}</h3>
                      <span className="method-category">{method.category}</span>
                    </div>
                  </div>
                  <p className="method-description">{method.description}</p>
                  
                  <div className="method-details">
                    {method.details.map((detail, idx) => (
                      <div key={idx} className="detail-row">
                        <span className="detail-label">{detail.label}</span>
                        <span className="detail-value" style={detail.color ? { color: detail.color, fontWeight: 700 } : {}}>{detail.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`method-recommendation ${method.recommendation.type}`}>
                    <i className={`fas fa-${method.recommendation.type === 'good' ? 'check-circle' : method.recommendation.type === 'fair' ? 'info-circle' : 'exclamation-triangle'}`}></i>
                    <span>{method.recommendation.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Security Features */}
        <section className="security-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Payment Security & Protection</h2>
              <p className="section-subtitle">Farm Vantara ensures 100% secure transactions with multiple layers of protection</p>
            </div>
            
            <div className="security-grid">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="security-card">
                  <div className="security-icon">
                    <i className={`fas ${feature.icon}`}></i>
                  </div>
                  <h3 className="security-title">{feature.title}</h3>
                  <p className="security-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Comparison */}
        <section className="comparison-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Payment Method Comparison</h2>
              <p className="section-subtitle">Compare all payment options to choose the best one for your transaction</p>
            </div>
            
            <div className="comparison-table-container">
              <table className="comparison-table">
                <thead className="table-header">
                  <tr>
                    <th style={{ width: '20%' }}>Payment Method</th>
                    <th style={{ width: '15%' }}>Speed</th>
                    <th style={{ width: '15%' }}>Fees</th>
                    <th style={{ width: '15%' }}>Limit</th>
                    <th style={{ width: '15%' }}>Security</th>
                    <th style={{ width: '20%' }}>Our Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="payment-method-cell">
                          <div className="payment-method-icon" style={{ background: item.iconBg }}>
                            <i className={`fas ${item.icon}`}></i>
                          </div>
                          <span className="payment-method-name">{item.method}</span>
                        </div>
                      </td>
                      <td>
                        <span style={item.speed.color ? { color: item.speed.color, fontWeight: 700 } : {}}>
                          {item.speed.text}
                        </span>
                      </td>
                      <td>{item.fees}</td>
                      <td>{item.limit}</td>
                      <td>
                        <div className="rating-stars">
                          {renderStars(item.security)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${item.badge.type}`}>{item.badge.text}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Payment Calculator */}
        <section className="payment-section">
          <div className="container">
            <div className="calculator-card">
              <h3 className="calculator-title">
                <i className="fas fa-calculator"></i> Payment Fee Calculator
              </h3>
              
              <div className="calculator-form">
                <div className="form-group">
                  <label htmlFor="calcAmount">Transaction Amount (₹)</label>
                  <input 
                    type="number" 
                    id="calcAmount" 
                    name="amount"
                    min="1000" 
                    value={calculator.amount}
                    onChange={handleCalculatorChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="calcMethod">Payment Method</label>
                  <select 
                    id="calcMethod" 
                    name="method"
                    value={calculator.method}
                    onChange={handleCalculatorChange}
                  >
                    <option value="upi">UPI Payment</option>
                    <option value="escrow">Escrow Service</option>
                    <option value="rtgs">Bank Transfer (RTGS)</option>
                    <option value="neft">Bank Transfer (NEFT)</option>
                    <option value="wallet">Digital Wallet</option>
                    <option value="cheque">Cheque/Demand Draft</option>
                  </select>
                </div>
              </div>
              
              <div className="calculator-action">
                <button id="calculateFees" onClick={calculatePaymentFees}>
                  Calculate Fees & Timeline
                </button>
              </div>
              
              {calcResult.visible && (
                <div id="calcResult" className="calc-result">
                  <h4>Calculation Results</h4>
                  <div className="result-grid">
                    <div>
                      <div className="result-label">Transaction Amount</div>
                      <div className="result-value">₹{calcResult.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="result-label">Transaction Fees</div>
                      <div className="result-value">₹{calcResult.fees.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="result-label">Net Amount Received</div>
                      <div className="result-value">₹{calcResult.net.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="result-label">Expected Timeline</div>
                      <div className="result-value">{calcResult.timeline}</div>
                    </div>
                  </div>
                  <div className="result-note">
                    {calcResult.note}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recommendations by Transaction Type */}
        <section className="payment-section" style={{ background: 'var(--light-gray)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Smart Payment Recommendations</h2>
              <p className="section-subtitle">Choose the right payment method based on your transaction type and amount</p>
            </div>
            
            <div className="recommendation-grid">
              {recommendations.map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <div className="recommendation-badge">{rec.badge}</div>
                  <h3 className="recommendation-title">{rec.title}</h3>
                  <ul className="recommendation-list">
                    {rec.items.map((item, idx) => (
                      <li key={idx} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Method Selector */}
        <section className="payment-section">
          <div className="container">
            <div className="selector-card">
              <h3 className="selector-title">
                <i className="fas fa-question-circle"></i> Which Payment Method Should I Choose?
              </h3>
              
              <div className="selector-buttons">
                <button className="selector-btn" style={{ background: 'var(--gradient-blue)' }} onClick={() => showMethodRecommendation('upi')}>
                  <i className="fas fa-university"></i>
                  UPI
                </button>
                <button className="selector-btn" style={{ background: 'var(--gradient-primary)' }} onClick={() => showMethodRecommendation('escrow')}>
                  <i className="fas fa-shield-alt"></i>
                  Escrow
                </button>
                <button className="selector-btn" style={{ background: 'var(--gradient-yellow)' }} onClick={() => showMethodRecommendation('bank')}>
                  <i className="fas fa-credit-card"></i>
                  Bank
                </button>
                <button className="selector-btn" style={{ background: 'var(--gradient-red)' }} onClick={() => showMethodRecommendation('qr')}>
                  <i className="fas fa-qrcode"></i>
                  QR Code
                </button>
              </div>
              
              {selectorResult.visible && (
                <div id="selectorResult" className="selector-result">
                  <h4 id="selectorTitle">{selectorResult.title}</h4>
                  <p id="selectorDescription">{selectorResult.description}</p>
                  <div className="selector-best-for">
                    <strong>Best For:</strong> <span id="bestForText">{selectorResult.bestFor}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Payment FAQs</h2>
              <p className="section-subtitle">Common questions about payments on Farm Vantara</p>
            </div>
            
            <div className="faq-container">
              {faqItems.map((item, index) => (
                <div key={index} className="faq-item">
                  <div className="faq-question" onClick={() => toggleFaq(index)}>
                    <h3>{item.question}</h3>
                    <i className={`fas fa-chevron-${activeFaq === index ? 'up' : 'down'} faq-icon`}></i>
                  </div>
                  <div className={`faq-answer ${activeFaq === index ? 'active' : ''}`}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Need Help with Payments?</h2>
              <p className="cta-description">
                Our payment support team is available 24/7 to help you with payment setup, transaction issues, or choosing the right payment method. Get assistance in Hindi, English, Tamil, Telugu, and Marathi.
              </p>
              
              <div className="cta-buttons">
                <a href="tel:18001234567" className="btn-cta btn-cta-primary">
                  <i className="fas fa-phone-alt"></i> Call Payment Support: 1800-123-4567
                </a>
                <a href="https://wa.me/919553774933" className="btn-cta btn-cta-secondary" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                </a>
              </div>
              
              <p className="cta-support">
                <i className="fas fa-clock"></i> Payment support available 24/7 | <i className="fas fa-shield-alt"></i> 100% secure transactions guaranteed
              </p>
            </div>
          </div>
        </section>
      </main>

    </>
  );
};

export default Payments;