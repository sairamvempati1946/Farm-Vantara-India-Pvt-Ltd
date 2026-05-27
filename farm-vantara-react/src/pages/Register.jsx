import React, { useState, useEffect } from 'react';
import '../styles/Register.css';
import { supabase } from "../supabaseClient";

const Register = () => {
  // ---------- State ----------
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  // Crop selections per role
  const [selectedCrops, setSelectedCrops] = useState([]);         // farmer
  const [selectedBusinessCrops, setSelectedBusinessCrops] = useState([]); // business
  // const [selectedProducts, setSelectedProducts] = useState([]);   // consumer

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({ width: 0, text: 'Password strength', className: '' });

  // ---------- Effects ----------
  useEffect(() => {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }, []);

  // Handle role from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    // if (role && ['farmer', 'business', 'consumer'].includes(role)) {
    if (role && ['farmer', 'business'].includes(role)) {
      setSelectedRole(role);
      setTimeout(() => setCurrentStep(2), 500);
    }
  }, []);

  // ---------- Progress ----------
  const progressWidth = ((currentStep - 1) / 2) * 100;

  // ---------- Role Selection ----------
  const selectRole = (role) => {
    setSelectedRole(role);
  };

  const nextStep = () => {
    if (!selectedRole) {
      alert('Please select a role to continue');
      return;
    }
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  // ---------- Form Handling ----------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Password strength meter
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ width: 0, text: 'Password strength', className: '' });
      return;
    }
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const percentage = (strength / 6) * 100;
    let text = '', className = '';
    if (strength <= 2) {
      text = 'Weak password';
      className = 'weak';
    } else if (strength <= 4) {
      text = 'Medium password';
      className = 'medium';
    } else {
      text = 'Strong password';
      className = 'strong';
    }
    setPasswordStrength({ width: percentage, text, className });
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    handleInputChange(e);
    checkPasswordStrength(password);
  };

  // Crop/Product toggle functions
  const toggleCrop = (cropName, type) => {
    if (type === 'farmer') {
      setSelectedCrops(prev =>
        prev.includes(cropName) ? prev.filter(c => c !== cropName) : [...prev, cropName]
      );
    } else if (type === 'business') {
      setSelectedBusinessCrops(prev =>
        prev.includes(cropName) ? prev.filter(c => c !== cropName) : [...prev, cropName]
      );
    } // else if (type === 'consumer') {
    //   setSelectedProducts(prev =>
    //     prev.includes(cropName) ? prev.filter(c => c !== cropName) : [...prev, cropName]
    //   );
    // }
  };

  // Update hidden fields when selections change
  useEffect(() => {
    if (selectedRole === 'farmer') {
      setFormData(prev => ({ ...prev, selectedCrops: selectedCrops.join(', ') }));
    } else if (selectedRole === 'business') {
      setFormData(prev => ({ ...prev, selectedBusinessCrops: selectedBusinessCrops.join(', ') }));
    } // else if (selectedRole === 'consumer') {
    //   setFormData(prev => ({ ...prev, selectedProducts: selectedProducts.join(', ') }));
    // }
  // }, [selectedCrops, selectedBusinessCrops, selectedProducts, selectedRole]);
  }, [selectedCrops, selectedBusinessCrops, selectedRole]);

  // Validation
  const validateField = (name, value) => {
    if (!value && document.querySelector(`[name="${name}"]`)?.hasAttribute('required')) {
      return 'This field is required';
    }
    if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    if (name === 'phone' && value && !/^[0-9]{10}$/.test(value)) {
      return 'Please enter a valid 10‑digit phone number';
    }
    if (name === 'pincode' && value && !/^[0-9]{6}$/.test(value)) {
      return 'Please enter a valid 6‑digit pincode';
    }
    if (name === 'confirmPassword' && value && value !== formData.password) {
      return 'Passwords do not match';
    }
    if (name === 'farmSize' && value && parseFloat(value) <= 0) {
      return 'Farm size must be greater than 0';
    }
    if (name === 'monthlyRequirement' && value && parseFloat(value) < 0) {
      return 'Monthly requirement cannot be negative';
    }
    return null;
  };

  const validateForm = () => {
    const form = document.getElementById('registrationForm');
    if (!form) return false;

    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    const newErrors = {};

    inputs.forEach((field) => {
      const error = validateField(field.name, field.value);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    // Terms checkbox
    const terms = document.getElementById('terms');
    if (terms && !terms.checked) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      isValid = false;
    }

    // Role-specific validations
    if (selectedRole === 'farmer' && selectedCrops.length === 0) {
      alert('Please select at least one crop');
      isValid = false;
    }
    if (selectedRole === 'business' && selectedBusinessCrops.length === 0) {
      alert('Please select at least one preferred crop/product');
      isValid = false;
    }
    // if (selectedRole === 'consumer' && selectedProducts.length === 0) {
    //   alert('Please select at least one preferred product');
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };

  // ---------- handleSubmit with better error handling ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1️⃣ Register user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            fullName: formData.fullName,
            role: selectedRole,
            phone: formData.phone,
          },
        },
      });

      if (error) {
        // Friendly message for rate limit error
        let userMessage = error.message;
        if (error.message && error.message.toLowerCase().includes('rate limit')) {
          userMessage = 'Too many registration attempts from this email or IP. Please wait 10 minutes and try again, or use a different email address.';
        }
        alert(userMessage);
        setLoading(false);
        return;
      }

      // If email confirmation is required, session will be null
      if (!data.session) {
        alert('Registration successful! Please check your email to confirm your account. You can log in after verification.');
        setLoading(false);
        // Optionally redirect to login page
        // window.location.href = '/login';
        return;
      }

      // 2️⃣ User is authenticated, insert role-specific data
      let insertError = null;

      if (selectedRole === 'farmer') {
        const { error: err } = await supabase.from("farmers").insert([{
          user_id: data.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          state: formData.state,
          farm_name: formData.farmName,
          farm_size: formData.farmSize ? parseFloat(formData.farmSize) : null,
          experience: formData.experience ? parseInt(formData.experience) : null,
          village: formData.village,
          selected_crops: formData.selectedCrops,
        }]);
        insertError = err;
      }
      else if (selectedRole === 'business') {
        const { error: err } = await supabase.from("businesses").insert([{
          user_id: data.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          state: formData.state,
          business_name: formData.businessName,
          business_type: formData.businessType,
          gst_number: formData.gstNumber || null,
          monthly_requirement: formData.monthlyRequirement ? parseFloat(formData.monthlyRequirement) : null,
          preferred_crops: formData.selectedBusinessCrops,
        }]);
        insertError = err;
      }
      // else if (selectedRole === 'consumer') {
      //   const { error: err } = await supabase.from("consumers").insert([{
      //     user_id: data.user.id,
      //     full_name: formData.fullName,
      //     email: formData.email,
      //     phone: formData.phone,
      //     state: formData.state,
      //     city: formData.city,
      //     pincode: formData.pincode,
      //     address: formData.address || null,
      //     preferred_products: formData.selectedProducts,
      //     delivery_frequency: formData.deliveryFrequency || null,
      //   }]);
      //   insertError = err;
      // }

      if (insertError) {
        console.error("Insert error details:", insertError);
        alert(`Failed to save ${selectedRole} details: ${insertError.message || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      // Save session info to localStorage
      if (data.session) {
        const user = {
          id: data.user.id,
          name: formData.fullName,
          email: formData.email,
          role: selectedRole === 'farmer' ? 'farmer' : 'business',
          redirectTo: selectedRole === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard'
        };
        localStorage.setItem('farmvantara_token', data.session.access_token);
        localStorage.setItem('farmvantara_user', JSON.stringify(user));
      }

      // 3️⃣ Success
      setLoading(false);
      setShowSuccessPrompt(true);
      setCurrentStep(3);

    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong! Please check the console for details.");
      setLoading(false);
    }
  };

  // ---------- Success Handlers ----------
  const handleOkButton = () => {
    setShowSuccessPrompt(false);
    setShowLoginSuccess(true);
  };

  const registerNewProfile = () => {
    setSelectedRole(null);
    setCurrentStep(1);
    setFormData({});
    setErrors({});
    setSelectedCrops([]);
    setSelectedBusinessCrops([]);
    // setSelectedProducts([]);
    setShowLoginSuccess(false);
    setShowSuccessPrompt(false);
    setPasswordStrength({ width: 0, text: 'Password strength', className: '' });
  };

  // ---------- Options for crops & products ----------
  const cropOptions = [
    { name: 'Wheat', icon: 'fa-wheat-awn' },
    { name: 'Rice', icon: 'fa-bowl-rice' },
    { name: 'Corn', icon: 'fa-corn' },
    { name: 'Cotton', icon: 'fa-shirt' },
    { name: 'Sugarcane', icon: 'fa-candy-cane' },
    { name: 'Soybean', icon: 'fa-seedling' },
    { name: 'Tomato', icon: 'fa-apple-whole' },
    { name: 'Potato', icon: 'fa-potato' },
    { name: 'Onion', icon: 'fa-onion' },
    { name: 'Vegetables', icon: 'fa-carrot' },
    { name: 'Fruits', icon: 'fa-apple-alt' },
    { name: 'Pulses', icon: 'fa-seedling' },
    { name: 'Spices', icon: 'fa-mortar-pestle' },
    { name: 'Dairy', icon: 'fa-cow' },
    { name: 'Flowers', icon: 'fa-flower' },
    { name: 'Other', icon: 'fa-leaf' },
  ];

  const productOptions = [
    { name: 'Fresh Vegetables', icon: 'fa-carrot' },
    { name: 'Seasonal Fruits', icon: 'fa-apple-alt' },
    { name: 'Organic Produce', icon: 'fa-leaf' },
    { name: 'Grains & Pulses', icon: 'fa-wheat-awn' },
    { name: 'Dairy Products', icon: 'fa-cow' },
    { name: 'Spices & Herbs', icon: 'fa-mortar-pestle' },
    { name: 'Flowers', icon: 'fa-flower' },
    { name: 'Honey', icon: 'fa-honey-pot' },
    { name: 'Ready-to-Cook', icon: 'fa-utensils' },
    { name: 'Other', icon: 'fa-seedling' },
  ];

  // ---------- Role-specific Form Sections ----------
  const renderFarmerFields = () => (
    <div className="form-section">
      <h3 className="section-title"><i className="fas fa-tractor"></i> Farm Details</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="farmName">Farm Name <span className="required">*</span></label>
          <input type="text" id="farmName" name="farmName" required value={formData.farmName || ''} onChange={handleInputChange} placeholder="Enter your farm name" />
          {errors.farmName && <div className="error-message show">{errors.farmName}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="farmSize">Farm Size (Acres) <span className="required">*</span></label>
          <input type="number" id="farmSize" name="farmSize" required min="0.1" step="0.1" value={formData.farmSize || ''} onChange={handleInputChange} placeholder="e.g., 5.5" />
          {errors.farmSize && <div className="error-message show">{errors.farmSize}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="experience">Farming Experience (Years)</label>
          <input type="number" id="experience" name="experience" min="0" value={formData.experience || ''} onChange={handleInputChange} placeholder="e.g., 10" />
        </div>
        <div className="form-group">
          <label htmlFor="village">Village/Town <span className="required">*</span></label>
          <input type="text" id="village" name="village" required value={formData.village || ''} onChange={handleInputChange} placeholder="Enter your village/town" />
          {errors.village && <div className="error-message show">{errors.village}</div>}
        </div>
        <div className="form-group full-width">
          <label>Main Crops Grown <span className="required">*</span></label>
          <div className="crop-selection">
            {cropOptions.map((crop) => (
              <div key={crop.name} className={`crop-option ${selectedCrops.includes(crop.name) ? 'selected' : ''}`} onClick={() => toggleCrop(crop.name, 'farmer')}>
                <i className={`fas ${crop.icon} crop-icon`}></i>
                <span>{crop.name}</span>
              </div>
            ))}
          </div>
          <input type="hidden" name="selectedCrops" value={selectedCrops.join(', ')} />
        </div>
      </div>
    </div>
  );

  const renderBusinessFields = () => (
    <div className="form-section">
      <h3 className="section-title"><i className="fas fa-building"></i> Business Details</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="businessName">Business Name <span className="required">*</span></label>
          <input type="text" id="businessName" name="businessName" required value={formData.businessName || ''} onChange={handleInputChange} placeholder="Enter your business name" />
          {errors.businessName && <div className="error-message show">{errors.businessName}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="businessType">Business Type <span className="required">*</span></label>
          <select id="businessType" name="businessType" required value={formData.businessType || ''} onChange={handleInputChange}>
            <option value="">Select Business Type</option>
            <option value="retailer">Retail Store/Supermarket</option>
            <option value="wholesaler">Wholesale Distributor</option>
            <option value="restaurant">Restaurant/Hotel</option>
            <option value="catering">Catering Service</option>
            <option value="processor">Food Processing Unit</option>
            <option value="exporter">Export Company</option>
            <option value="other">Other</option>
          </select>
          {errors.businessType && <div className="error-message show">{errors.businessType}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="gstNumber">GST Number (Optional)</label>
          <input type="text" id="gstNumber" name="gstNumber" value={formData.gstNumber || ''} onChange={handleInputChange} placeholder="Enter GST number" />
        </div>
        <div className="form-group">
          <label htmlFor="monthlyRequirement">Monthly Requirement (Quintal)</label>
          <input type="number" id="monthlyRequirement" name="monthlyRequirement" min="0" step="0.1" value={formData.monthlyRequirement || ''} onChange={handleInputChange} placeholder="Estimated monthly requirement" />
        </div>
        <div className="form-group full-width">
          <label>Preferred Crops/Products <span className="required">*</span></label>
          <div className="crop-selection">
            {cropOptions.map((crop) => (
              <div key={crop.name} className={`crop-option ${selectedBusinessCrops.includes(crop.name) ? 'selected' : ''}`} onClick={() => toggleCrop(crop.name, 'business')}>
                <i className={`fas ${crop.icon} crop-icon`}></i>
                <span>{crop.name}</span>
              </div>
            ))}
          </div>
          <input type="hidden" name="selectedBusinessCrops" value={selectedBusinessCrops.join(', ')} />
        </div>
      </div>
    </div>
  );

  // const renderConsumerFields = () => (
  //   <div className="form-section">
  //     <h3 className="section-title"><i className="fas fa-shopping-basket"></i> Consumer Details</h3>
  //     <div className="form-grid">
  //       <div className="form-group">
  //         <label htmlFor="city">City <span className="required">*</span></label>
  //         <input type="text" id="city" name="city" required value={formData.city || ''} onChange={handleInputChange} placeholder="Enter your city" />
  //         {errors.city && <div className="error-message show">{errors.city}</div>}
  //       </div>
  //       <div className="form-group">
  //         <label htmlFor="pincode">Pincode <span className="required">*</span></label>
  //         <input type="text" id="pincode" name="pincode" required pattern="[0-9]{6}" value={formData.pincode || ''} onChange={handleInputChange} placeholder="6‑digit pincode" />
  //         {errors.pincode && <div className="error-message show">{errors.pincode}</div>}
  //       </div>
  //       <div className="form-group full-width">
  //         <label htmlFor="address">Delivery Address</label>
  //         <textarea id="address" name="address" rows="3" value={formData.address || ''} onChange={handleInputChange} placeholder="Enter your complete delivery address"></textarea>
  //       </div>
  //       <div className="form-group full-width">
  //         <label>Preferred Products <span className="required">*</span></label>
  //         <div className="crop-selection">
  //           {productOptions.map((product) => (
  //             <div key={product.name} className={`crop-option ${selectedProducts.includes(product.name) ? 'selected' : ''}`} onClick={() => toggleCrop(product.name, 'consumer')}>
  //               <i className={`fas ${product.icon} crop-icon`}></i>
  //               <span>{product.name}</span>
  //             </div>
  //           ))}
  //         </div>
  //         <input type="hidden" name="selectedProducts" value={selectedProducts.join(', ')} />
  //       </div>
  //       <div className="form-group">
  //         <label htmlFor="deliveryFrequency">Preferred Delivery Frequency</label>
  //         <select id="deliveryFrequency" name="deliveryFrequency" value={formData.deliveryFrequency || ''} onChange={handleInputChange}>
  //           <option value="">Select frequency</option>
  //           <option value="daily">Daily</option>
  //           <option value="weekly">Weekly</option>
  //           <option value="biweekly">Bi-Weekly</option>
  //           <option value="monthly">Monthly</option>
  //           <option value="occasional">Occasional</option>
  //         </select>
  //       </div>
  //     </div>
  //   </div>
  // );

  // ---------- Main Render ----------
  return (
    <>
      {/* Hero */}
      <section className="registration-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Join Farm Vantara Today</h1>
            <p className="hero-subtitle">Register as a farmer, business buyer, or consumer to start your journey with India's leading farm‑to‑market platform</p>
          </div>
        </div>
      </section>

      {/* Registration Flow */}
      <section className="registration-flow">
        <div className="container">
          <div className="flow-container">
            <div className="progress-steps">
              <div className="progress-bar" style={{ width: `${progressWidth}%` }}></div>
              <div className={`step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`} data-step="1">
                <div className="step-icon">1</div>
                <div className="step-label">Select Role</div>
              </div>
              <div className={`step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`} data-step="2">
                <div className="step-icon">2</div>
                <div className="step-label">Fill Details</div>
              </div>
              <div className={`step ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`} data-step="3">
                <div className="step-icon">3</div>
                <div className="step-label">Complete</div>
              </div>
            </div>

            <div className="registration-container">
              {!showLoginSuccess ? (
                <>
                  {/* Step 1: Role Selection */}
                  {currentStep === 1 && (
                    <div id="step-1" className="step-content">
                      <div className="role-selection">
                        {/* Farmer Card */}
                        <div className={`role-card ${selectedRole === 'farmer' ? 'selected' : ''}`} onClick={() => selectRole('farmer')}>
                          <div className="role-icon"><i className="fas fa-tractor"></i></div>
                          <div className="role-info">
                            <h3>I'm a Farmer</h3>
                            <p>List and sell your farm produce directly to buyers across India</p>
                            <ul className="role-benefits">
                              <li><i className="fas fa-check"></i> Free registration & listing</li>
                              <li><i className="fas fa-check"></i> Direct buyer access</li>
                              <li><i className="fas fa-check"></i> Guaranteed payments</li>
                              <li><i className="fas fa-check"></i> Market price insights</li>
                            </ul>
                          </div>
                        </div>
                        {/* Business Card */}
                        <div className={`role-card ${selectedRole === 'business' ? 'selected' : ''}`} onClick={() => selectRole('business')}>
                          <div className="role-icon"><i className="fas fa-building"></i></div>
                          <div className="role-info">
                            <h3>I'm a Business Buyer</h3>
                            <p>Procure fresh farm produce directly from verified farmers</p>
                            <ul className="role-benefits">
                              <li><i className="fas fa-check"></i> Bulk purchase discounts</li>
                              <li><i className="fas fa-check"></i> Quality assurance</li>
                              <li><i className="fas fa-check"></i> Reliable supply chain</li>
                              <li><i className="fas fa-check"></i> Custom requirements</li>
                            </ul>
                          </div>
                        </div>
                        {/* Consumer Card */}
                        {/* <div className={`role-card ${selectedRole === 'consumer' ? 'selected' : ''}`} onClick={() => selectRole('consumer')}>
                          <div className="role-icon"><i className="fas fa-shopping-basket"></i></div>
                          <div className="role-info">
                            <h3>I'm a Consumer</h3>
                            <p>Buy fresh farm produce directly from farmers in your city</p>
                            <ul className="role-benefits">
                              <li><i className="fas fa-check"></i> Farm‑fresh quality</li>
                              <li><i className="fas fa-check"></i> Competitive prices</li>
                              <li><i className="fas fa-check"></i> Home delivery</li>
                              <li><i className="fas fa-check"></i> Quality assurance</li>
                            </ul>
                          </div>
                        </div> */}
                      </div>
                      <div className="form-buttons">
                        <div style={{ width: '100%', textAlign: 'center' }}>
                          <button className="btn btn-primary" onClick={nextStep} style={{ margin: '0 auto' }}>
                            Continue <i className="fas fa-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Dynamic Form */}
                  {currentStep === 2 && (
                    <div id="step-2" className="step-content">
                      <div className="form-container">
                        <h2 className="form-title">
                          {selectedRole === 'farmer' && 'Farmer Registration Details'}
                          {selectedRole === 'business' && 'Business Registration Details'}
                          {selectedRole === 'consumer' && 'Consumer Registration Details'}
                        </h2>
                        <p className="form-subtitle">
                          {selectedRole === 'farmer' && 'Tell us about your farm and crops to connect with buyers.'}
                          {selectedRole === 'business' && 'Provide business details to start sourcing fresh produce.'}
                          {selectedRole === 'consumer' && 'Enter your details to start shopping farm‑fresh products.'}
                        </p>

                        <form className="registration-form" id="registrationForm" onSubmit={handleSubmit} noValidate>
                          {/* Basic Information (common to all) */}
                          <div className="form-section">
                            <h3 className="section-title"><i className="fas fa-user"></i> Basic Information</h3>
                            <div className="form-grid">
                              <div className="form-group">
                                <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                                <input type="text" id="fullName" name="fullName" required value={formData.fullName || ''} onChange={handleInputChange} placeholder="Enter your full name" autoComplete="name" />
                                {errors.fullName && <div className="error-message show">{errors.fullName}</div>}
                              </div>
                              <div className="form-group">
                                <label htmlFor="email">Email Address <span className="required">*</span></label>
                                <input type="email" id="email" name="email" required value={formData.email || ''} onChange={handleInputChange} placeholder="your@email.com" autoComplete="email" />
                                {errors.email && <div className="error-message show">{errors.email}</div>}
                              </div>
                              <div className="form-group">
                                <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                                <input type="tel" id="phone" name="phone" required value={formData.phone || ''} onChange={handleInputChange} placeholder="9876543210" pattern="[0-9]{10}" autoComplete="tel" />
                                {errors.phone && <div className="error-message show">{errors.phone}</div>}
                              </div>
                              <div className="form-group">
                                <label htmlFor="state">State <span className="required">*</span></label>
                                <select id="state" name="state" required value={formData.state || ''} onChange={handleInputChange}>
                                  <option value="">Select State</option>
                                  <option value="Punjab">Punjab</option>
                                  <option value="Maharashtra">Maharashtra</option>
                                  <option value="Gujarat">Gujarat</option>
                                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                                  <option value="Tamil Nadu">Tamil Nadu</option>
                                  <option value="Karnataka">Karnataka</option>
                                  <option value="Rajasthan">Rajasthan</option>
                                </select>
                                {errors.state && <div className="error-message show">{errors.state}</div>}
                              </div>
                            </div>
                          </div>

                          {/* Role-specific fields */}
                          {selectedRole === 'farmer' && renderFarmerFields()}
                          {selectedRole === 'business' && renderBusinessFields()}
                          {/* {selectedRole === 'consumer' && renderConsumerFields()} */}

                          {/* Account Security */}
                          <div className="form-section">
                            <h3 className="section-title"><i className="fas fa-shield-alt"></i> Account Security</h3>
                            <div className="form-grid">
                              <div className="form-group">
                                <label htmlFor="password">Password <span className="required">*</span></label>
                                <input type="password" id="password" name="password" required minLength="8" value={formData.password || ''} onChange={handlePasswordChange} placeholder="Minimum 8 characters" autoComplete="new-password" />
                                <div className="password-strength">
                                  <div className="strength-meter">
                                    <div className="strength-bar" style={{ width: `${passwordStrength.width}%`, background: passwordStrength.className === 'weak' ? '#e74c3c' : passwordStrength.className === 'medium' ? '#f39c12' : 'var(--primary-green)' }}></div>
                                  </div>
                                  <div className={`strength-text ${passwordStrength.className}`}>{passwordStrength.text}</div>
                                </div>
                                {errors.password && <div className="error-message show">{errors.password}</div>}
                              </div>
                              <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                                <input type="password" id="confirmPassword" name="confirmPassword" required value={formData.confirmPassword || ''} onChange={handleInputChange} placeholder="Re‑enter your password" autoComplete="new-password" />
                                {errors.confirmPassword && <div className="error-message show">{errors.confirmPassword}</div>}
                              </div>
                            </div>
                          </div>

                          {/* Terms */}
                          <div className="terms-group">
                            <input type="checkbox" id="terms" name="terms" required checked={formData.terms || false} onChange={handleInputChange} />
                            <div className="terms-text">
                              <label htmlFor="terms">
                                I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a> <span className="required">*</span>
                              </label>
                              <p>By registering, you confirm that you've read and agree to our terms and privacy policy. You also agree to receive communications from Farm Vantara regarding your account and platform updates.</p>
                            </div>
                          </div>

                          <div className="form-buttons">
                            <button type="button" className="btn btn-secondary" onClick={prevStep}>
                              <i className="fas fa-arrow-left"></i> Back
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                              {loading ? <span className="loading-spinner"></span> : <><i className="fas fa-user-plus"></i> Complete Registration</>}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Success */}
                  {currentStep === 3 && (
                    <div id="step-3" className="step-content">
                      <div className="success-state active">
                        <div className="success-icon"><i className="fas fa-check"></i></div>
                        <h2 className="success-title">
                          {/* Successfully Registered as {selectedRole === 'farmer' ? 'Farmer' : selectedRole === 'business' ? 'Business Buyer' : 'Consumer'} */}
                          Successfully Registered as {selectedRole === 'farmer' ? 'Farmer' : 'Business Buyer'}
                        </h2>
                        <p className="success-message">
                          {selectedRole === 'farmer' && `Welcome to Farm Vantara, ${formData.fullName}! Your farmer account has been created successfully. You can now list your produce and connect with buyers across India.`}
                          {selectedRole === 'business' && `Welcome to Farm Vantara, ${formData.fullName}! Your business buyer account is ready. Start sourcing fresh produce directly from verified farmers.`}
                          {/* {selectedRole === 'consumer' && `Welcome to Farm Vantara, ${formData.fullName}! Your consumer account is active. Start shopping for farm‑fresh products delivered to your doorstep.`} */}
                        </p>
                        <div className="success-details">
                          <h4>Registration Details:</h4>
                          <p><strong>Name:</strong> {formData.fullName}</p>
                          <p><strong>Email:</strong> {formData.email}</p>
                          <p><strong>Phone:</strong> {formData.phone}</p>
                          <p><strong>State:</strong> {formData.state}</p>
                          {selectedRole === 'farmer' && (
                            <>
                              <p><strong>Farm Name:</strong> {formData.farmName}</p>
                              <p><strong>Farm Size:</strong> {formData.farmSize} acres</p>
                              <p><strong>Main Crops:</strong> {formData.selectedCrops}</p>
                              {formData.experience && <p><strong>Experience:</strong> {formData.experience} years</p>}
                              {formData.village && <p><strong>Village/Town:</strong> {formData.village}</p>}
                            </>
                          )}
                          {selectedRole === 'business' && (
                            <>
                              <p><strong>Business Name:</strong> {formData.businessName}</p>
                              <p><strong>Business Type:</strong> {formData.businessType}</p>
                              {formData.gstNumber && <p><strong>GST Number:</strong> {formData.gstNumber}</p>}
                              {formData.monthlyRequirement && <p><strong>Monthly Requirement:</strong> {formData.monthlyRequirement} quintals</p>}
                              <p><strong>Preferred Crops:</strong> {formData.selectedBusinessCrops}</p>
                            </>
                          )}
                          {/* {selectedRole === 'consumer' && (
                            <>
                              <p><strong>City:</strong> {formData.city}</p>
                              <p><strong>Pincode:</strong> {formData.pincode}</p>
                              {formData.address && <p><strong>Address:</strong> {formData.address}</p>}
                              <p><strong>Preferred Products:</strong> {formData.selectedProducts}</p>
                              {formData.deliveryFrequency && <p><strong>Delivery Frequency:</strong> {formData.deliveryFrequency}</p>}
                            </>
                          )} */}
                        </div>
                        <div className="success-actions">
                          <a href={selectedRole === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard'} className="btn btn-primary"><i className="fas fa-tachometer-alt"></i> Go to Dashboard</a>
                          <a href="/login" className="btn btn-secondary"><i className="fas fa-sign-in-alt"></i> Login to Your Account</a>
                          <button className="btn btn-outline" onClick={registerNewProfile}><i className="fas fa-user-plus"></i> Register New Profile</button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Login Success State */
                <div className="login-success-state active">
                  <div className="login-success-icon"><i className="fas fa-user-check"></i></div>
                  <h2 className="login-success-title">Welcome Back!</h2>
                  <p className="login-success-message">You have been successfully logged in to your Farm Vantara account.</p>
                  <div className="user-profile">
                    <div className="user-avatar">
                      <i className={`fas ${selectedRole === 'farmer' ? 'fa-tractor' : selectedRole === 'business' ? 'fa-building' : 'fa-shopping-basket'}`}></i>
                    </div>
                    <div className="user-name">{formData.fullName}</div>
                    <div className="user-role">
                      {selectedRole === 'farmer' ? 'Farmer' : selectedRole === 'business' ? 'Business Buyer' : 'Consumer'}
                    </div>
                    <div className="user-email">{formData.email}</div>
                  </div>
                  <div className="login-success-actions">
                    <a href={selectedRole === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard'} className="btn btn-primary"><i className="fas fa-tachometer-alt"></i> Go to Dashboard</a>
                    <a href="/" className="btn btn-secondary"><i className="fas fa-home"></i> Go to Homepage</a>
                    <button className="btn btn-outline" onClick={registerNewProfile}><i className="fas fa-user-plus"></i> Register New Profile</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Success Prompt Modal */}
      {showSuccessPrompt && (
        <div className="success-prompt active">
          <div className="success-prompt-content">
            <div className="success-prompt-icon"><i className="fas fa-check"></i></div>
            <h2 className="success-prompt-title">
              Successfully Registered as {selectedRole === 'farmer' ? 'Farmer' : selectedRole === 'business' ? 'Business Buyer' : 'Consumer'}
            </h2>
            <p className="success-prompt-message">
              {selectedRole === 'farmer' && `Welcome to Farm Vantara, ${formData.fullName}! Your farmer account has been created successfully. Click OK to log in and start listing your produce.`}
              {selectedRole === 'business' && `Welcome to Farm Vantara, ${formData.fullName}! Your business buyer account is ready. Click OK to log in and start sourcing fresh produce.`}
              {selectedRole === 'consumer' && `Welcome to Farm Vantara, ${formData.fullName}! Your consumer account is active. Click OK to log in and start shopping for farm‑fresh products.`}
            </p>
            <button className="success-prompt-button" onClick={handleOkButton}><i className="fas fa-check-circle"></i> OK</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;