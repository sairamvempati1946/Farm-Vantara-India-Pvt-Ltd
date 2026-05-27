import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/Shop.css';

const Shop = () => {
  // ---------- Data ----------
  const [products] = useState([
    {
      id: 1,
      name: "Organic Tomatoes",
      farmer: "Rajesh Kumar",
      farmerId: "FK001",
      category: "vegetables",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 45,
      originalPrice: 55,
      unit: "kg",
      rating: 4.5,
      reviews: 128,
      stock: "in-stock",
      badges: ["organic", "seasonal"],
      description: "Fresh organic tomatoes grown without pesticides",
      certification: ["organic", "pesticide-free"],
      location: "Punjab"
    },
    {
      id: 2,
      name: "Alphonso Mangoes",
      farmer: "Priya Sharma",
      farmerId: "FK002",
      category: "fruits",
      image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 320,
      originalPrice: 380,
      unit: "dozen",
      rating: 4.8,
      reviews: 256,
      stock: "in-stock",
      badges: ["organic", "seasonal"],
      description: "Premium Alphonso mangoes from Maharashtra",
      certification: ["organic"],
      location: "Maharashtra"
    },
    {
      id: 3,
      name: "Basmati Rice",
      farmer: "Arun Patel",
      farmerId: "FK003",
      category: "grains",
      image: "https://images.unsplash.com/photo-1596040033221-a3824e6c4e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 120,
      originalPrice: null,
      unit: "kg",
      rating: 4.7,
      reviews: 189,
      stock: "in-stock",
      badges: [],
      description: "Premium quality basmati rice, aged for 1 year",
      certification: ["non-gmo"],
      location: "Gujarat"
    },
    {
      id: 4,
      name: "Fresh Cow Milk",
      farmer: "Sunil Verma",
      farmerId: "FK004",
      category: "dairy",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 60,
      originalPrice: 65,
      unit: "liter",
      rating: 4.6,
      reviews: 342,
      stock: "low-stock",
      badges: ["organic"],
      description: "Fresh pasteurized cow milk, delivered daily",
      certification: ["organic"],
      location: "Uttar Pradesh"
    },
    {
      id: 5,
      name: "Broccoli",
      farmer: "Meena Singh",
      farmerId: "FK005",
      category: "vegetables",
      image: "https://images.unsplash.com/photo-1583182332415-7a8b9e6b32c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 85,
      originalPrice: 95,
      unit: "kg",
      rating: 4.4,
      reviews: 96,
      stock: "in-stock",
      badges: ["organic"],
      description: "Fresh broccoli, rich in nutrients",
      certification: ["organic", "pesticide-free"],
      location: "Himachal Pradesh"
    },
    {
      id: 6,
      name: "Strawberries",
      farmer: "Kiran Reddy",
      farmerId: "FK006",
      category: "fruits",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 180,
      originalPrice: 220,
      unit: "250g pack",
      rating: 4.9,
      reviews: 178,
      stock: "in-stock",
      badges: ["organic", "seasonal", "discount"],
      description: "Sweet and juicy strawberries, hand-picked",
      certification: ["organic"],
      location: "Karnataka"
    },
    {
      id: 7,
      name: "Organic Eggs",
      farmer: "Vikram Singh",
      farmerId: "FK007",
      category: "dairy",
      image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 120,
      originalPrice: null,
      unit: "dozen",
      rating: 4.7,
      reviews: 234,
      stock: "in-stock",
      badges: ["organic"],
      description: "Free-range organic eggs from happy chickens",
      certification: ["organic"],
      location: "Punjab"
    },
    {
      id: 8,
      name: "Baby Potatoes",
      farmer: "Ramesh Iyer",
      farmerId: "FK008",
      category: "vegetables",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 35,
      originalPrice: 40,
      unit: "kg",
      rating: 4.3,
      reviews: 87,
      stock: "in-stock",
      badges: ["organic"],
      description: "Fresh baby potatoes, perfect for curries",
      certification: ["organic"],
      location: "Tamil Nadu"
    },
    {
      id: 9,
      name: "Carrots",
      farmer: "Sanjay Verma",
      farmerId: "FK009",
      category: "vegetables",
      image: "https://images.unsplash.com/photo-1598170845058-78132e1b46d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 40,
      originalPrice: 45,
      unit: "kg",
      rating: 4.2,
      reviews: 95,
      stock: "in-stock",
      badges: ["organic"],
      description: "Fresh organic carrots",
      certification: ["organic"],
      location: "Haryana"
    },
    {
      id: 10,
      name: "Apples",
      farmer: "Anita Desai",
      farmerId: "FK010",
      category: "fruits",
      image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 150,
      originalPrice: 180,
      unit: "kg",
      rating: 4.6,
      reviews: 210,
      stock: "in-stock",
      badges: ["organic"],
      description: "Fresh Kashmiri apples",
      certification: ["organic"],
      location: "Kashmir"
    },
    {
      id: 11,
      name: "Wheat Flour",
      farmer: "Rajeshwari Nair",
      farmerId: "FK011",
      category: "grains",
      image: "https://images.unsplash.com/photo-1596040033221-a3824e6c4e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 80,
      originalPrice: null,
      unit: "kg",
      rating: 4.5,
      reviews: 145,
      stock: "in-stock",
      badges: [],
      description: "Whole wheat flour",
      certification: ["non-gmo"],
      location: "Madhya Pradesh"
    },
    {
      id: 12,
      name: "Paneer",
      farmer: "Mohan Lal",
      farmerId: "FK012",
      category: "dairy",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 220,
      originalPrice: 250,
      unit: "500g",
      rating: 4.8,
      reviews: 189,
      stock: "in-stock",
      badges: ["organic"],
      description: "Fresh homemade paneer",
      certification: ["organic"],
      location: "Rajasthan"
    }
  ]);

  const [farmers] = useState([
    {
      id: "FK001",
      name: "Rajesh Kumar",
      location: "Punjab",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1586773860418-dc22f8b874bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      products: ["Tomatoes", "Potatoes", "Onions", "Cabbage"],
      joined: "2022"
    },
    {
      id: "FK002",
      name: "Priya Sharma",
      location: "Maharashtra",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      products: ["Mangoes", "Bananas", "Papayas", "Guavas"],
      joined: "2021"
    },
    {
      id: "FK003",
      name: "Arun Patel",
      location: "Gujarat",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      products: ["Rice", "Wheat", "Corn", "Pulses"],
      joined: "2023"
    }
  ]);

  // ---------- State ----------
  const [cart, setCart] = useState([
    {
      id: 1,
      productId: 1,
      name: "Organic Tomatoes",
      farmer: "Rajesh Kumar",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 45,
      unit: "kg",
      quantity: 2
    },
    {
      id: 2,
      productId: 4,
      name: "Fresh Cow Milk",
      farmer: "Sunil Verma",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 60,
      unit: "liter",
      quantity: 1
    },
    {
      id: 3,
      productId: 7,
      name: "Organic Eggs",
      farmer: "Vikram Singh",
      image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      price: 120,
      unit: "dozen",
      quantity: 1
    }
  ]);

  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 1000],
    certifications: [],
    minRating: 0
  });
  const [location, setLocation] = useState(localStorage.getItem('farmVantaraLocation') || 'Select Location');
  const [deliveryTime, setDeliveryTime] = useState(localStorage.getItem('farmVantaraDeliveryTime') || '');
  const [notification, setNotification] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Refs for debounce and timeouts
  const searchTimeout = useRef(null);
  const notificationTimeout = useRef(null);

  // ---------- Load from localStorage ----------
  useEffect(() => {
    const savedWishlist = localStorage.getItem('farmVantaraWishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    const savedCompare = localStorage.getItem('farmVantaraCompare');
    if (savedCompare) setCompareList(JSON.parse(savedCompare));
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Save to localStorage when wishlist/compare change
  useEffect(() => {
    localStorage.setItem('farmVantaraWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('farmVantaraCompare', JSON.stringify(compareList));
  }, [compareList]);

  // Scroll listener for back to top
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup notification timeout
  useEffect(() => {
    return () => {
      if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
    };
  }, []);

  // ---------- Helper Functions ----------
  const showNotification = (message, type = 'success') => {
    if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
    setNotification({ message, type });
    notificationTimeout.current = setTimeout(() => setNotification(null), 3000);
  };

  const getStarRating = (rating) => {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars += '<i class="fas fa-star"></i>';
      else if (i === Math.ceil(rating) && !Number.isInteger(rating)) stars += '<i class="fas fa-star-half-alt"></i>';
      else stars += '<i class="far fa-star"></i>';
    }
    return stars;
  };

  // ---------- Filter & Sort Products ----------
  const filteredProducts = useCallback(() => {
    let filtered = products.filter(p => {
      if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !p.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !p.farmer.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
      if (filters.certifications.length && !filters.certifications.some(cert => p.certification.includes(cert))) return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'newest': filtered.sort((a, b) => b.id - a.id); break;
      default: break; // featured – keep original order
    }
    return filtered;
  }, [products, searchTerm, filters, sortBy]);

  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts().length / productsPerPage);
  const currentProducts = filteredProducts().slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  // ---------- Cart ----------
  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        farmer: product.farmer,
        image: product.image,
        price: product.price,
        unit: product.unit,
        quantity: 1
      }]);
    }
    showNotification(`${product.name} added to cart!`);
  };

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQty = item.quantity + change;
        return newQty < 1 ? null : { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
    showNotification('Item removed from cart');
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartSubtotal > 299 ? 0 : 50;
  const discount = cartSubtotal > 500 ? 50 : 0;
  const cartTotal = cartSubtotal + deliveryFee - discount;

  // ---------- Wishlist ----------
  const toggleWishlist = (product) => {
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      showNotification('Removed from wishlist');
    } else {
      setWishlist([...wishlist, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        farmer: product.farmer,
        unit: product.unit
      }]);
      showNotification('Added to wishlist!');
    }
  };

  // ---------- Compare ----------
  const toggleCompare = (product) => {
    const exists = compareList.some(item => item.id === product.id);
    if (exists) {
      setCompareList(compareList.filter(item => item.id !== product.id));
      showNotification('Removed from comparison');
    } else {
      if (compareList.length >= 4) {
        showNotification('Maximum 4 products can be compared', 'error');
        return;
      }
      setCompareList([...compareList, product]);
      showNotification('Added to comparison');
    }
  };

  const clearCompare = () => {
    setCompareList([]);
    showNotification('Comparison cleared');
  };

  // ---------- Pagination ----------
  const changePage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: document.querySelector('.products-section').offsetTop - 100, behavior: 'smooth' });
  };

  // ---------- Search ----------
  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (term.length < 2) {
      setSearchError('Please enter at least 2 characters');
      return;
    }
    if (term.length > 50) {
      setSearchError('Search term too long');
      return;
    }
    setSearchError('');
    setCurrentPage(1);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setCurrentPage(1);
    }, 500);
  };

  // ---------- Filters ----------
  const applyFilters = () => {
    setCurrentPage(1);
    setFiltersOpen(false);
    showNotification('Filters applied');
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000],
      certifications: [],
      minRating: 0
    });
    setCurrentPage(1);
    setFiltersOpen(false);
    showNotification('All filters cleared');
  };

  const filterCount = filters.categories.length + filters.certifications.length + (filters.minRating > 0 ? 1 : 0) + (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);

  // ---------- Location & Delivery ----------
  const setUserLocation = () => {
    const newLoc = prompt('Enter your delivery location (city):');
    if (newLoc && newLoc.trim()) {
      setLocation(newLoc.trim());
      localStorage.setItem('farmVantaraLocation', newLoc.trim());
      showNotification(`Delivery location set to: ${newLoc.trim()}`);
    }
  };

  const handleDeliveryTimeChange = (e) => {
    const val = e.target.value;
    setDeliveryTime(val);
    localStorage.setItem('farmVantaraDeliveryTime', val);
    if (val) showNotification(`Delivery time set to: ${getDeliveryTimeText(val)}`);
  };

  const getDeliveryTimeText = (val) => {
    const map = { 'morning': 'Morning (8AM-12PM)', 'afternoon': 'Afternoon (12PM-4PM)', 'evening': 'Evening (4PM-8PM)', 'next-day': 'Next Day' };
    return map[val] || val;
  };

  // ---------- Checkout ----------
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      showNotification('Your cart is empty!', 'error');
      return;
    }
    if (!deliveryTime) {
      showNotification('Please select a delivery time', 'error');
      return;
    }
    // Simulate checkout
    showNotification('Order placed successfully! Redirecting to payment...', 'success');
    setTimeout(() => {
      alert(`Order Confirmed!\n\nTotal: ₹${cartTotal.toFixed(2)}\nDelivery: ${getDeliveryTimeText(deliveryTime)}\nThank you for your order!`);
      setCart([]);
      setCartOpen(false);
    }, 1000);
  };

  // ---------- Render Helpers ----------
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    // Prev
    pages.push(
      <button key="prev" className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
        <i className="fas fa-chevron-left"></i>
      </button>
    );

    // First page with dots
    if (start > 1) {
      pages.push(
        <button key={1} className="pagination-btn" onClick={() => changePage(1)}>1</button>
      );
      if (start > 2) pages.push(<span key="dots1" className="pagination-dots">...</span>);
    }

    // Page numbers
    for (let i = start; i <= end; i++) {
      pages.push(
        <button key={i} className={`pagination-btn ${i === currentPage ? 'active' : ''}`} onClick={() => changePage(i)}>
          {i}
        </button>
      );
    }

    // Last page with dots
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="dots2" className="pagination-dots">...</span>);
      pages.push(
        <button key={totalPages} className="pagination-btn" onClick={() => changePage(totalPages)}>
          {totalPages}
        </button>
      );
    }

    // Next
    pages.push(
      <button key="next" className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
        <i className="fas fa-chevron-right"></i>
      </button>
    );

    return <div className="pagination">{pages}</div>;
  };

  // ---------- JSX ----------
  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading fresh produce...</p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`custom-alert ${notification.type}`} role="alert">
          <i className={`fas ${notification.type === 'error' ? 'fa-times-circle' : notification.type === 'info' ? 'fa-info-circle' : 'fa-check-circle'}`}></i>
          <span>{notification.message}</span>
        </div>
      )}

    

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="shop-hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Fresh Farm Produce Direct to Your Doorstep</h1>
                <p className="hero-subtitle">
                  Shop directly from verified farmers across India. Get the freshest fruits, vegetables, grains, and dairy products delivered to your home. No middlemen, better prices, and guaranteed quality.
                </p>
                <div className="hero-stats">
                  <div className="stat"><span className="stat-number">500+</span><span className="stat-label">Farmers Online</span></div>
                  <div className="stat"><span className="stat-number">1000+</span><span className="stat-label">Products Available</span></div>
                  <div className="stat"><span className="stat-number">50+</span><span className="stat-label">Cities Served</span></div>
                </div>
              </div>
              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  srcSet="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80 400w, https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80 800w, https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80 1200w"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt="Fresh vegetables and fruits"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="search-section">
          <div className="container">
            <div className="search-container">
              <form className="search-box" id="searchForm" onSubmit={handleSearch}>
                <input
                  type="text"
                  className={`search-input ${searchError ? 'error' : ''}`}
                  placeholder="Search for vegetables, fruits, grains, dairy..."
                  aria-label="Search products"
                  value={searchTerm}
                  onChange={handleSearchInput}
                />
                <i className="fas fa-search search-icon"></i>
                {searchError && <div className="search-error active">{searchError}</div>}
              </form>
              <button className="filter-btn" id="filterBtn" aria-label="Filter products" onClick={() => setFiltersOpen(true)}>
                <i className="fas fa-filter"></i> Filter <span className="filter-count">{filterCount}</span>
              </button>
              <div className="location-selector">
                <button className="location-btn" id="locationBtn" aria-label="Set delivery location" onClick={setUserLocation}>
                  <i className="fas fa-map-marker-alt"></i> <span id="currentLocation">{location}</span>
                </button>
                <div className={`delivery-time-selector ${location !== 'Select Location' ? 'active' : ''}`} id="deliveryTimeSelector">
                  <select className="time-select" aria-label="Select delivery time" value={deliveryTime} onChange={handleDeliveryTimeChange}>
                    <option value="">Delivery Time</option>
                    <option value="morning">Morning (8AM-12PM)</option>
                    <option value="afternoon">Afternoon (12PM-4PM)</option>
                    <option value="evening">Evening (4PM-8PM)</option>
                    <option value="next-day">Next Day</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            <div className={`advanced-filters ${filtersOpen ? 'active' : ''}`} id="advancedFilters">
              <div className="filter-header">
                <h3>Filter Products</h3>
                <button className="close-filters" id="closeFilters" onClick={() => setFiltersOpen(false)}>&times;</button>
              </div>
              <div className="filter-groups">
                <div className="filter-group">
                  <h4>Category</h4>
                  <div className="filter-options">
                    {['vegetables', 'fruits', 'grains', 'dairy'].map(cat => (
                      <label className="filter-option" key={cat}>
                        <input type="checkbox" name="category" value={cat} checked={filters.categories.includes(cat)} onChange={(e) => {
                          const checked = e.target.checked;
                          setFilters(prev => ({
                            ...prev,
                            categories: checked ? [...prev.categories, cat] : prev.categories.filter(c => c !== cat)
                          }));
                        }} />
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="filter-group">
                  <h4>Price Range</h4>
                  <div className="price-slider">
                    <input type="range" className="price-range" min="0" max="1000" value={filters.priceRange[0]} onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                    }))} />
                    <input type="range" className="price-range" min="0" max="1000" value={filters.priceRange[1]} onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                    }))} />
                    <div className="price-values">
                      <span id="minPriceValue">₹{filters.priceRange[0]}</span> - <span id="maxPriceValue">₹{filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                <div className="filter-group">
                  <h4>Certifications</h4>
                  <div className="filter-options">
                    {['organic', 'non-gmo', 'pesticide-free'].map(cert => (
                      <label className="filter-option" key={cert}>
                        <input type="checkbox" name="certification" value={cert} checked={filters.certifications.includes(cert)} onChange={(e) => {
                          const checked = e.target.checked;
                          setFilters(prev => ({
                            ...prev,
                            certifications: checked ? [...prev.certifications, cert] : prev.certifications.filter(c => c !== cert)
                          }));
                        }} />
                        {cert.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="filter-group">
                  <h4>Rating</h4>
                  <div className="filter-options">
                    {['4', '3', '0'].map(val => (
                      <label className="filter-option" key={val}>
                        <input type="radio" name="rating" value={val} checked={filters.minRating === parseInt(val)} onChange={() => setFilters(prev => ({ ...prev, minRating: parseInt(val) }))} />
                        {val === '0' ? 'All Ratings' : val + '+ Stars & Above'}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="filter-actions">
                <button className="btn-clear-filters" id="clearFilters" onClick={clearFilters}>Clear All</button>
                <button className="btn-apply-filters" id="applyFilters" onClick={applyFilters}>Apply Filters</button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Browse fresh produce from our verified farmers</p>
            </div>
            <div className="categories-grid">
              {[
                { name: 'Vegetables', icon: 'fa-carrot', count: '250+', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
                { name: 'Fruits', icon: 'fa-apple-alt', count: '180+', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
                { name: 'Grains & Pulses', icon: 'fa-wheat-awn', count: '120+', img: 'https://images.unsplash.com/photo-1596040033221-a3824e6c4e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
                { name: 'Dairy & Eggs', icon: 'fa-egg', count: '80+', img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
              ].map(cat => (
                <div className="category-card" key={cat.name}>
                  <div className="category-image"><img src={cat.img} alt={cat.name} loading="lazy" /></div>
                  <div className="category-content">
                    <div className="category-icon"><i className={`fas ${cat.icon}`}></i></div>
                    <h3 className="category-title">{cat.name}</h3>
                    <p className="category-count">{cat.count} Products</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="products-section">
          <div className="container">
            <div className="products-header">
              <h2 className="products-title">Fresh from the Farm</h2>
              <div className="sort-options">
                <select className="sort-select" id="sortSelect" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest First</option>
                </select>
                <div className="view-toggle">
                  <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} id="gridView" onClick={() => setViewMode('grid')}><i className="fas fa-th"></i></button>
                  <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} id="listView" onClick={() => setViewMode('list')}><i className="fas fa-list"></i></button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`} id="productsGrid">
              {currentProducts.length === 0 ? (
                <div className="no-products">
                  <i className="fas fa-seedling"></i>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search term</p>
                </div>
              ) : (
                currentProducts.map(product => {
                  const inWishlist = wishlist.some(w => w.id === product.id);
                  const inCompare = compareList.some(c => c.id === product.id);
                  return (
                    <div className="product-card" key={product.id}>
                      <div className="product-badges">
                        {product.badges.includes('organic') && <span className="badge badge-organic">Organic</span>}
                        {product.badges.includes('seasonal') && <span className="badge badge-seasonal">Seasonal</span>}
                        {product.badges.includes('discount') && <span className="badge badge-discount">-15%</span>}
                      </div>
                      <div className="product-image">
                        <img src={product.image} alt={product.name} loading="lazy" />
                        <button className={`compare-toggle ${inCompare ? 'active' : ''}`} onClick={() => toggleCompare(product)} aria-label={inCompare ? 'Remove from comparison' : 'Add to comparison'}>
                          <i className="fas fa-balance-scale"></i>
                        </button>
                      </div>
                      <div className="product-content">
                        <h3 className="product-title">{product.name}</h3>
                        <div className="product-farmer">
                          <div className="farmer-avatar">{product.farmer.charAt(0)}</div>
                          <span>By {product.farmer}</span>
                        </div>
                        <div className="product-rating" dangerouslySetInnerHTML={{ __html: getStarRating(product.rating) }}></div>
                        <div className="product-price">
                          <span className="current-price">₹{product.price}</span>
                          {product.originalPrice && <span className="original-price">₹{product.originalPrice}</span>}
                          <span className="per-unit">/ {product.unit}</span>
                        </div>
                        <div className="product-stock">
                          <span className={`stock-status ${product.stock === 'in-stock' ? 'stock-in' : 'stock-low'}`}>
                            {product.stock === 'in-stock' ? 'In Stock' : 'Low Stock'}
                          </span>
                          <span className="product-location"><i className="fas fa-map-marker-alt"></i> {product.location}</span>
                        </div>
                        <div className="product-actions">
                          <button className="btn-add-to-cart" onClick={() => addToCart(product)}>
                            <i className="fas fa-cart-plus"></i> Add to Cart
                          </button>
                          <button className={`btn-wishlist ${inWishlist ? 'active wishlist-saved' : ''}`} onClick={() => toggleWishlist(product)}>
                            <i className={`${inWishlist ? 'fas' : 'far'} fa-heart`}></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </div>
        </section>

        {/* Compare Modal */}
        {compareModalOpen && (
          <div className="compare-modal active" id="compareModal">
            <div className="compare-modal-content">
              <div className="compare-header">
                <h3>Compare Products</h3>
                <button className="close-compare" onClick={() => setCompareModalOpen(false)}>&times;</button>
              </div>
              <div className="compare-table" id="compareTable">
                {compareList.length === 0 ? (
                  <p className="no-compare">Add products to compare</p>
                ) : (
                  <table>
                    <thead>
                      <tr><th>Feature</th>{compareList.map(p => <th key={p.id}>{p.name}</th>)}</tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Price', key: 'price', format: v => `₹${v}` },
                        { name: 'Farmer', key: 'farmer' },
                        { name: 'Rating', key: 'rating', format: v => `${v}/5` },
                        { name: 'Category', key: 'category' },
                        { name: 'Stock', key: 'stock', format: v => v === 'in-stock' ? 'In Stock' : 'Low Stock' },
                        { name: 'Certifications', key: 'certification', format: v => v.join(', ') || 'None' }
                      ].map(feature => (
                        <tr key={feature.name}>
                          <td>{feature.name}</td>
                          {compareList.map(p => <td key={p.id}>{feature.format ? feature.format(p[feature.key]) : p[feature.key]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="compare-actions">
                <button className="btn-clear-compare" onClick={clearCompare}>Clear All</button>
                <button className="btn-close-compare" onClick={() => setCompareModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Featured Farmers Section */}
        <section className="farmers-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Meet Our Featured Farmers</h2>
              <p className="section-subtitle">Buy directly from these trusted farmers</p>
            </div>
            <div className="farmers-slider" id="farmersSlider">
              {farmers.map(farmer => (
                <div className="farmer-card" key={farmer.id}>
                  <div className="farmer-header">
                    <div className="farmer-avatar-large"><img src={farmer.image} alt={farmer.name} loading="lazy" /></div>
                    <div className="farmer-info">
                      <h3>{farmer.name}</h3>
                      <div className="farmer-location"><i className="fas fa-map-marker-alt"></i> {farmer.location}</div>
                      <div className="farmer-rating" dangerouslySetInnerHTML={{ __html: getStarRating(farmer.rating) }}></div>
                    </div>
                  </div>
                  <div className="farmer-products">
                    <h4>Specializes In</h4>
                    <div className="product-tags">{farmer.products.map(p => <span key={p} className="product-tag">{p}</span>)}</div>
                  </div>
                  <div className="farmer-actions">
                    <button className="btn-view-farm"><i className="fas fa-tractor"></i> View Farm</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery Info Section */}
        <section className="delivery-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">Simple steps to get farm-fresh produce</p>
            </div>
            <div className="delivery-cards">
              {[
                { icon: 'fa-search', title: 'Browse & Select', text: 'Choose from fresh produce listed by verified farmers across India' },
                { icon: 'fa-shopping-cart', title: 'Add to Cart', text: 'Select quantities and add items to your cart. Minimum order: ₹299' },
                { icon: 'fa-truck', title: 'Fast Delivery', text: 'Get your order delivered in 24-48 hours. Same-day delivery in select cities' },
                { icon: 'fa-leaf', title: 'Enjoy Freshness', text: 'Receive farm-fresh produce with quality guarantee. 100% satisfaction or money back' }
              ].map((item, idx) => (
                <div className="delivery-card" key={idx}>
                  <div className="delivery-icon"><i className={`fas ${item.icon}`}></i></div>
                  <h3 className="delivery-title">{item.title}</h3>
                  <p className="delivery-text">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${cartOpen ? 'active' : ''}`} id="cartSidebar">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <div className="close-cart" id="closeCart" onClick={() => setCartOpen(false)}>&times;</div>
        </div>
        <div className="cart-items" id="cartItems">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon"><i className="fas fa-shopping-cart"></i></div>
              <h3>Your cart is empty</h3>
              <p>Add some fresh produce to get started!</p>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-image"><img src={item.image} alt={item.name} loading="lazy" /></div>
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-farmer">By {item.farmer}</div>
                  <div className="cart-item-price">₹{item.price}/{item.unit}</div>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button className="quantity-btn minus" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span className="quantity">{item.quantity}</span>
                      <button className="quantity-btn plus" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <div className="remove-item" onClick={() => removeFromCart(item.id)}><i className="fas fa-trash"></i></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="order-summary" id="orderSummary">
            <div className="summary-item"><span>Subtotal:</span><span className="subtotal-amount">₹{cartSubtotal.toFixed(2)}</span></div>
            <div className="summary-item"><span>Delivery:</span><span className="delivery-amount">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span></div>
            <div className="summary-item discount-item"><span>Discount:</span><span className="discount-amount">-₹{discount.toFixed(2)}</span></div>
            <div className="summary-total"><span>Total:</span><span className="total-amount">₹{cartTotal.toFixed(2)}</span></div>
          </div>
          <div className="delivery-time-cart">
            <label htmlFor="cartDeliveryTime">Delivery Time:</label>
            <select id="cartDeliveryTime" className="cart-time-select" value={deliveryTime} onChange={handleDeliveryTimeChange}>
              <option value="">Select Time Slot</option>
              <option value="morning">Morning (8AM-12PM)</option>
              <option value="afternoon">Afternoon (12PM-4PM)</option>
              <option value="evening">Evening (4PM-8PM)</option>
              <option value="next-day">Next Day</option>
            </select>
          </div>
          <button className="btn-checkout" id="checkoutBtn" onClick={proceedToCheckout}><i className="fas fa-lock"></i> Proceed to Checkout</button>
        </div>
      </div>

      
      {/* Back to Top Button */}
      <a href="#" className={`back-to-top ${showBackToTop ? 'visible' : ''}`} id="backToTop" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        <i className="fas fa-arrow-up"></i>
      </a>
    </>
  );
};

export default Shop;