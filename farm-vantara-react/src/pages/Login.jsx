import React, { useState, useEffect, useRef } from 'react';
import '../styles/Login.css';
import { supabase } from "../supabaseClient";

const Login = () => {
  // ---------- State ----------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const [passwordStrength, setPasswordStrength] = useState({
  //   label: 'None',
  //   class: '',
  //   percentage: 0,
  //   color: 'var(--text-light)',
  // });
  // const [passwordRequirements, setPasswordRequirements] = useState({
  //   length: false,
  //   uppercase: false,
  //   lowercase: false,
  //   number: false,
  //   special: false,
  // });
  // const [showRequirements, setShowRequirements] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [rateLimited, setRateLimited] = useState(false);
  const [rateLimitMinutes, setRateLimitMinutes] = useState(0);
  const [sessionWarning, setSessionWarning] = useState(false);
  // const [loginSuccess, setLoginSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Refs for timers
  const sessionTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  // ---------- Effects ----------
  // Check for existing login on mount
  // useEffect(() => {
  //   const token = localStorage.getItem('farmvantara_token') || sessionStorage.getItem('farmvantara_token');
  //   const user = localStorage.getItem('farmvantara_user') || sessionStorage.getItem('farmvantara_user');
  //   if (token && user) {
  //     try {
  //       const parsed = JSON.parse(user);
  //       setUserData(parsed);
  //       startSessionTimer();
  //       window.location.href = parsed.redirectTo;
  //     } catch (e) {
  //       clearUserData();
  //     }
  //   }

  // }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearSessionTimers();
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('farmvantara_token') || sessionStorage.getItem('farmvantara_token');
    const user = localStorage.getItem('farmvantara_user') || sessionStorage.getItem('farmvantara_user');

    if (token && user && token !== "undefined" && token !== "null") {
      try {
        const parsed = JSON.parse(user);

        if (parsed?.redirectTo) {
          window.location.href = parsed.redirectTo;
        }

      } catch (e) {
        clearUserData();
      }
    }
  }, []);
  // ---------- Helper Functions ----------
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const trackAnalytics = (event, data = {}) => {
    console.log(`[Analytics] ${event}`, data);
    // In production, send to real analytics
  };

  // Password strength calculation
  // const calculatePasswordStrength = (pwd) => {
  //   let score = 0;
  //   const reqs = {
  //     length: pwd.length >= 8,
  //     uppercase: /[A-Z]/.test(pwd),
  //     lowercase: /[a-z]/.test(pwd),
  //     number: /[0-9]/.test(pwd),
  //     special: /[^A-Za-z0-9]/.test(pwd),
  //   };
  //   setPasswordRequirements(reqs);
  //   Object.values(reqs).forEach((met) => met && score++);

  //   const levels = [
  //     { label: 'Very Weak', class: 'very-weak', percentage: 20, color: '#e74c3c' },
  //     { label: 'Weak', class: 'weak', percentage: 40, color: '#e67e22' },
  //     { label: 'Fair', class: 'fair', percentage: 60, color: '#f1c40f' },
  //     { label: 'Good', class: 'good', percentage: 80, color: '#2ecc71' },
  //     { label: 'Strong', class: 'strong', percentage: 100, color: '#27ae60' },
  //   ];
  //   return levels[score] || levels[0];
  // };

  // const handlePasswordChange = (e) => {
  //   const pwd = e.target.value;
  //   setPassword(pwd);
  //   if (pwd.length > 0) {
  //     setShowRequirements(true);
  //     const strength = calculatePasswordStrength(pwd);
  //     setPasswordStrength({
  //       label: strength.label,
  //       class: strength.class,
  //       percentage: strength.percentage,
  //       color: strength.color,
  //     });
  //   } else {
  //     setShowRequirements(false);
  //     setPasswordStrength({
  //       label: 'None',
  //       class: '',
  //       percentage: 0,
  //       color: 'var(--text-light)',
  //     });
  //   }
  // };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Validation
  const validateField = (field, value) => {
    let error = '';
    if (!value) {
      error = 'This field is required';
    } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address';
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = () => {
    const emailValid = validateField('email', email);
    const passwordValid = validateField('password', password);
    return emailValid && passwordValid;
  };

  // Rate limiting (simulated)
  const loginAttempts = useRef(new Map());
  const maxLoginAttempts = 5;
  const lockoutTime = 15 * 60 * 1000;

  const checkRateLimit = (email) => {
    const now = Date.now();
    const attempts = loginAttempts.current.get(email) || [];
    const recent = attempts.filter((t) => now - t < lockoutTime);
    if (recent.length >= maxLoginAttempts) {
      const timeLeft = lockoutTime - (now - recent[0]);
      const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
      setRateLimited(true);
      setRateLimitMinutes(minutesLeft);
      setTimeout(() => setRateLimited(false), 10000);
      trackAnalytics('rate_limit_triggered', { email, attempts: recent.length });
      return true;
    }
    return false;
  };

  const recordLoginAttempt = (email) => {
    const now = Date.now();
    const attempts = loginAttempts.current.get(email) || [];
    attempts.push(now);
    const cutoff = now - lockoutTime;
    const filtered = attempts.filter((t) => t > cutoff);
    loginAttempts.current.set(email, filtered);
    trackAnalytics('login_attempt_recorded', { email, attemptCount: filtered.length });
  };

  // Session timer
  const sessionTimeout = 5 * 60 * 1000;
  const sessionWarningTime = 60 * 1000;

  const startSessionTimer = () => {
    clearSessionTimers();
    warningTimerRef.current = setTimeout(() => {
      setSessionWarning(true);
    }, sessionTimeout - sessionWarningTime);
    sessionTimerRef.current = setTimeout(() => {
      forceLogout();
    }, sessionTimeout);
  };

  const clearSessionTimers = () => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
  };

  const extendSession = () => {
    setSessionWarning(false);
    startSessionTimer();
    showNotification('Session extended. You will stay logged in for another 5 minutes.', 'success');
    trackAnalytics('session_extended');
  };

  const forceLogout = () => {
    clearSessionTimers();
    showNotification('Your session has expired. Please login again.', 'warning');
    logoutUser();
    trackAnalytics('session_expired');
  };

  const clearUserData = () => {
    localStorage.removeItem('farmvantara_token');
    localStorage.removeItem('farmvantara_user');
    sessionStorage.removeItem('farmvantara_token');
    sessionStorage.removeItem('farmvantara_user');
  };
  const logoutUser = () => {
    // ✅ clear storage first
    localStorage.removeItem('farmvantara_token');
    localStorage.removeItem('farmvantara_user');
    sessionStorage.removeItem('farmvantara_token');
    sessionStorage.removeItem('farmvantara_user');

    // ✅ reset states
    setUserData(null);
    setSessionWarning(false);
    resetForm();

    // ✅ IMPORTANT redirect to login
    window.location.href = "/login";
  };

  // Reset form
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setRememberMe(false);
    setErrors({ email: '', password: '' });
    // setPasswordStrength({ label: 'None', class: '', percentage: 0, color: 'var(--text-light)' });
    // setShowRequirements(false);
    // setPasswordRequirements({ length: false, uppercase: false, lowercase: false, number: false, special: false });
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    trackAnalytics('form_submission_started');

    if (!validateForm()) {
      trackAnalytics('form_submission_failed', { reason: 'validation_error' });
      return;
    }

    if (checkRateLimit(email)) {
      trackAnalytics('form_submission_failed', { reason: 'rate_limited' });
      return;
    }

    recordLoginAttempt(email);
    setLoading(true);



    try {
      let loginEmail = email;

      // ✅ Admin default login check
      const ADMIN_EMAIL = "admin@farmvantara.com";
      const ADMIN_PASSWORD = "Admin@123";

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          id: "admin_001",
          name: "Admin",
          email: ADMIN_EMAIL,
          role: "admin",
          redirectTo: "/admin"
        };

        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem('farmvantara_token', 'admin_token_123');
        storage.setItem('farmvantara_user', JSON.stringify(adminUser));

        setUserData(adminUser);
        startSessionTimer();

        showNotification("Admin login successful", "success");

        window.location.href = "/admin";
        setLoading(false);
        return; // ⚠️ important
      }

      // 👉 Phone login support
      if (/^[0-9]{10}$/.test(email)) {
        // const tables = ["farmers", "businesses", "consumers"];
        const tables = ["farmers", "businesses"];
        let foundEmail = null;

        for (let table of tables) {
          const { data } = await supabase
            .from(table)
            .select("email")
            .eq("phone", email)
            .single();

          if (data) {
            foundEmail = data.email;
            break;
          }
        }

        if (!foundEmail) {
          showNotification("Mobile number not registered", "error");
          setLoading(false);
          return;
        }

        loginEmail = foundEmail;
      }

      // 🔐 Supabase Auth Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (error) {
        showNotification(error.message, "error");
        setLoading(false);
        return;
      }

      // 👉 Get user role from DB
      let userProfile = null;

      const { data: farmer } = await supabase.from("farmers").select("*").eq("email", loginEmail).single();
      const { data: business } = await supabase.from("businesses").select("*").eq("email", loginEmail).single();
      // const { data: consumer } = await supabase.from("consumers").select("*").eq("email", loginEmail).single();

      if (farmer) userProfile = { role: "farmer", data: farmer };
      else if (business) userProfile = { role: "business", data: business };
      // else if (consumer) userProfile = { role: "consumer", data: consumer };

      if (!userProfile) {
        showNotification("User profile not found", "error");
        setLoading(false);
        return;
      }

      // ✅ Existing structure ni follow avutam
      const user = {
        id: data.user.id,
        name: userProfile.data.full_name,
        email: loginEmail,
        role: userProfile.role,
        // redirectTo:
        //   userProfile.role === "farmer"
        //     ? "/farmer-dashboard"
        //     : userProfile.role === "business"
        //       ? "/buyer-dashboard"
        //       : "/shop",

        redirectTo:
          userProfile.role === "farmer"
            ? "/farmer-dashboard"
            : "/buyer-dashboard",


      };

      const storage = rememberMe ? localStorage : sessionStorage;
      // Reset residual buyer storage keys for fresh sessions
      localStorage.removeItem('cart_buyer');
      localStorage.removeItem('wishlist_buyer');
      localStorage.removeItem('favorites_buyer');
      sessionStorage.removeItem('cart_buyer');
      sessionStorage.removeItem('wishlist_buyer');
      sessionStorage.removeItem('favorites_buyer');
      
      storage.setItem('farmvantara_token', data.session.access_token);
      storage.setItem('farmvantara_user', JSON.stringify(user));

      setUserData(user);
      startSessionTimer();
      window.location.href = user.redirectTo;

    } catch (err) {
      console.error(err);
      showNotification("Login failed", "error");
    }

    setLoading(false);
  };

  const generateAvatar = (email) => {
    const colors = ['27ae60', '219653', 'f2c94c', 'f2994a', '2d9cdb', '2f80ed'];
    const hash = email.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const color = colors[hash % colors.length];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=${color}&color=fff&size=128`;
  };



  // Social login simulation
  const socialLogin = (provider) => {
    trackAnalytics('social_login_clicked', { provider });
    showNotification(`Redirecting to ${provider} login... (Demo)`, 'info');
    setTimeout(() => {
      // const mockUser = {
      //   id: 'social_user_' + Date.now(),
      //   name: provider.charAt(0).toUpperCase() + provider.slice(1) + ' User',
      //   email: `user@${provider}.com`,
      //   role: 'consumer',
      //   redirectTo: '/shop',
      //   provider,
      //   avatar: generateAvatar(`user@${provider}.com`),
      // };

      const mockUser = {
        id: 'social_user_' + Date.now(),
        name: provider.charAt(0).toUpperCase() + provider.slice(1) + ' User',
        email: `user@${provider}.com`,
        role: 'business', // or 'farmer'
        redirectTo: '/buyer-dashboard', // or '/farmer-dashboard'
        provider,
        avatar: generateAvatar(`user@${provider}.com`),
      };

      localStorage.setItem('farmvantara_token', 'social_token_' + provider + '_' + Date.now());
      localStorage.setItem('farmvantara_user', JSON.stringify(mockUser));
      trackAnalytics('social_login_success', { provider });
      setUserData(mockUser);
      setLoginSuccess(true);
      startSessionTimer();
    }, 1000);
  };

  // Forgot password simulation
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      showNotification('Please enter your email address to reset password.', 'error');
      return;
    }
    setLoading(true);
    trackAnalytics('forgot_password_clicked', { status: 'processing' });
    setTimeout(() => {
      setLoading(false);
      showNotification(`Password reset instructions sent to ${email}. Check your inbox.`, 'success');
      trackAnalytics('forgot_password_success', { email });
    }, 1500);
  };

  // ---------- JSX ----------
  return (
    <div className="login-page">
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay active">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <h3>Processing...</h3>
            <p>Please wait while we authenticate your credentials</p>
          </div>
        </div>
      )}

      {/* Session Warning */}
      {sessionWarning && (
        <div className="session-warning active">
          <h4>Session About to Expire</h4>
          <p>Your session will expire in 60 seconds. Do you want to stay logged in?</p>
          <div className="session-actions">
            <button className="stay-logged-in" onClick={extendSession}>Stay Logged In</button>
            <button className="logout-now" onClick={logoutUser}>Logout Now</button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {notifications.map((n) => (
        <div key={n.id} className={`custom-alert ${n.type}`}>
          <i className={`fas fa-${n.type === 'success' ? 'check-circle' : n.type === 'error' ? 'times-circle' : n.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}`}></i>
          <span>{n.message}</span>
        </div>
      ))}


      {/* Login Container */}
      <section className="login-container">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome Back to Farm Vantara</h1>
            <p className="hero-subtitle">Login to your account to continue your journey with India's leading farm-to-market platform</p>
          </div>

          {/* {!loginSuccess ? */}

          <div className="login-wrapper">
            {/* Left Column: Login Form */}
            <div className="login-column login-column-left">
              <div className="login-card" id="loginCard">


                {/* Rate Limit Warning */}
                {rateLimited && (
                  <div className="rate-limit-warning active">
                    <h4><i className="fas fa-exclamation-triangle"></i> Too Many Attempts</h4>
                    <p>Too many login attempts. Please wait {rateLimitMinutes} minute{rateLimitMinutes !== 1 ? 's' : ''} before trying again.</p>
                  </div>
                )}

                <div className="login-header">
                  <div className="login-icon"><i className="fas fa-sign-in-alt"></i></div>
                  <h2 className="login-title">Login to Your Account</h2>
                  <p className="login-subtitle">Enter your credentials to access your dashboard</p>
                </div>

                {/* Login Form */}
                <form className="login-form" id="loginForm" onSubmit={handleSubmit} noValidate>
                  <input type="hidden" name="csrf_token" id="csrfToken" value="mock_csrf_token_123456" />
                  {/* Honeypot */}
                  <div className="honeypot-field">
                    <label htmlFor="website" className="sr-only">Leave this field empty</label>
                    <input type="url" id="website" name="website" tabIndex="-1" autoComplete="off" />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="your@email.com"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={(e) => validateField('email', e.target.value)}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <div className="error-message show">{errors.email}</div>}
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label htmlFor="password">Password <span className="required">*</span></label>
                    <div className="password-input">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        required
                        minLength="8"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={(e) => validateField('password', e.target.value)}
                        className={errors.password ? 'error' : ''}
                      />
                      <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>

                    {/* Password Strength */}
                    {/* <div className="password-strength">
                        <div className="strength-meter">
                          <div className={`strength-fill ${passwordStrength.class}`} style={{ width: `${passwordStrength.percentage}%` }}></div>
                        </div>
                        <div className="strength-text">
                          <span>Password Strength:</span>
                          <span className="strength-label" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                        </div>
                      </div> */}

                    {/* Password Requirements */}
                    {/* {showRequirements && (
                        <div className="password-requirements active">
                          <p>Password must contain:</p>
                          <ul>
                            <li className={passwordRequirements.length ? 'valid' : ''}>At least 8 characters</li>
                            <li className={passwordRequirements.uppercase ? 'valid' : ''}>One uppercase letter</li>
                            <li className={passwordRequirements.lowercase ? 'valid' : ''}>One lowercase letter</li>
                            <li className={passwordRequirements.number ? 'valid' : ''}>One number</li>
                            <li className={passwordRequirements.special ? 'valid' : ''}>One special character</li>
                          </ul>
                        </div>
                      )} */}
                    {errors.password && <div className="error-message show">{errors.password}</div>}
                  </div>

                  {/* CAPTCHA placeholder */}
                  <div className="captcha-container"></div>

                  {/* Form Options */}
                  <div className="form-options">
                    <div className="remember-me">
                      <input type="checkbox" id="remember" name="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                      <label htmlFor="remember">Remember me</label>
                    </div>
                    <a href="#" className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</a>
                  </div>

                  {/* Login Button */}
                  <button type="submit" className="login-button" id="loginButton" disabled={loading}>
                    {loading ? <span className="loading-spinner"></span> : <><i className="fas fa-sign-in-alt"></i> <span>Login</span></>}
                  </button>

                  <p className="login-subtitle" style={{ textAlign: 'center', fontSize: '12px' }}>
                    <i className="fas fa-lightbulb"></i> Tip: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to submit the form
                  </p>
                </form>

                {/* Divider */}
                <div className="divider"><span>Or continue with</span></div>

                {/* Social Login */}
                <div className="social-login">
                  <div className="social-buttons">
                    <button type="button" className="social-button google" onClick={() => socialLogin('google')}><i className="fab fa-google"></i> Google</button>
                    <button type="button" className="social-button facebook" onClick={() => socialLogin('facebook')}><i className="fab fa-facebook-f"></i> Facebook</button>
                    <button type="button" className="social-button apple" onClick={() => socialLogin('apple')}><i className="fab fa-apple"></i> Apple</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Register Section */}
            <div className="login-column login-column-right">
              <div className="register-section">
                <div className="register-card">
                  <div className="register-header">
                    <div className="register-icon"><i className="fas fa-user-plus"></i></div>
                    <h2 className="register-title">Join Farm Vantara</h2>
                    <p className="register-subtitle">Create your account and start your journey with India's leading AgriTech platform</p>
                  </div>
                  <div className="register-content">
                    <p className="register-text">Don't have an account yet? Join our community today!</p>
                    <a href="/register" className="register-button"><i className="fas fa-user-plus"></i> Create New Account</a>
                    <div className="register-options">
                      <a href="/register?role=farmer" className="register-option">
                        <div className="register-option-icon"><i className="fas fa-tractor"></i></div>
                        <div className="register-option-text"><h4>Register as Farmer</h4><p>Sell your produce directly to businesses and consumers</p></div>
                        <div className="register-option-arrow"><i className="fas fa-arrow-right"></i></div>
                      </a>
                      <a href="/register?role=business" className="register-option">
                        <div className="register-option-icon"><i className="fas fa-building"></i></div>
                        <div className="register-option-text"><h4>Register as Business</h4><p>Source fresh produce directly from farmers</p></div>
                        <div className="register-option-arrow"><i className="fas fa-arrow-right"></i></div>
                      </a>
                      {/* <a href="/register?role=consumer" className="register-option">
                          <div className="register-option-icon"><i className="fas fa-shopping-basket"></i></div>
                          <div className="register-option-text"><h4>Register as Consumer</h4><p>Buy fresh farm products at best prices</p></div>
                          <div className="register-option-arrow"><i className="fas fa-arrow-right"></i></div>
                        </a> */}
                    </div>
                    <div className="register-benefits">
                      <h4>Why Join Farm Vantara?</h4>
                      <ul className="benefits-list">
                        <li><i className="fas fa-check-circle"></i> Direct farm-to-market access</li>
                        <li><i className="fas fa-check-circle"></i> Transparent pricing and quality</li>
                        <li><i className="fas fa-check-circle"></i> Secure and easy transactions</li>
                        <li><i className="fas fa-check-circle"></i> Dedicated support for all users</li>
                        <li><i className="fas fa-check-circle"></i> Grow your business with our tools</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ) : (
          /* Success State */
          <div className="success-state active">
            <div className="success-icon"><i className="fas fa-check"></i></div>
            <h2 className="success-title" id="successTitle">Welcome Back, {userData?.name}!</h2>
            <p className="success-message" id="successMessage">
              {userData?.role === 'farmer' && 'Ready to manage your farm and connect with buyers?'}
              {userData?.role === 'business' && 'Ready to source fresh produce for your business?'}
              {/* {userData?.role === 'consumer' && 'Ready to shop for farm-fresh products?'} */}
              {userData?.role === 'admin' && 'Access the admin dashboard to manage the platform.'}
            </p>
            <div className="success-actions" id="successActions">
              <a href={userData?.redirectTo || (userData?.role === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard')} className="login-button" style={{ marginBottom: '15px' }}>
                <i className="fas fa-tachometer-alt"></i> Go to Dashboard
              </a>
              <div className="success-actions">
                <a href="/" className="register-button" style={{ padding: '12px 24px' }}><i className="fas fa-home"></i> Go to Homepage</a>
                <button className="logout-button" onClick={logoutUser}><i className="fas fa-sign-out-alt"></i> Logout</button>
              </div>
            </div>
          </div>
          )
          {/* } */}
        </div>
      </section>

    </div>
  );
};

export default Login;