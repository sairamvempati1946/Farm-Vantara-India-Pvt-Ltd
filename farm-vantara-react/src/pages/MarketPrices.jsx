// src/pages/MarketPrices.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/MarketPrices.css";

const MarketPrices = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [marketData, setMarketData] = useState({
    crops: [],
    regions: []
  });
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    region: 'all',
    trend: 'all',
    search: ''
  });
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [lastUpdate, setLastUpdate] = useState('');
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    totalCrops: 125,
    mandiCount: 53,
    updateInterval: 5,
    dataAccuracy: 99.7
  });

  const navMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);
  const updateIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Initialize market data
  useEffect(() => {
    // Initial market data with region property added
    const initialCrops = [
      { id: 1, name: "Wheat", variety: "Sharbati", category: "cereals", region: "north", price: 2650, change: 2.5, trend: "rising", topMarket: "Khanna, Punjab", icon: "fa-wheat" },
      { id: 2, name: "Basmati Rice", variety: "Pusa 1121", category: "cereals", region: "north", price: 4250, change: 1.8, trend: "rising", topMarket: "Karnal, Haryana", icon: "fa-bowl-rice" },
      { id: 3, name: "Tomato", variety: "Hybrid", category: "vegetables", region: "south", price: 1850, change: -3.2, trend: "falling", topMarket: "Bangalore, Karnataka", icon: "fa-apple" },
      { id: 4, name: "Potato", variety: "Kufri Jyoti", category: "vegetables", region: "north", price: 1250, change: 0.8, trend: "stable", topMarket: "Agra, UP", icon: "fa-apple-alt" },
      { id: 5, name: "Onion", variety: "Nasik Red", category: "vegetables", region: "west", price: 2250, change: -4.1, trend: "falling", topMarket: "Lasalgaon, Maharashtra", icon: "fa-apple-alt" },
      { id: 6, name: "Carrot", variety: "Nantes", category: "vegetables", region: "south", price: 1650, change: 1.5, trend: "rising", topMarket: "Ooty, Tamil Nadu", icon: "fa-carrot" },
      { id: 7, name: "Cabbage", variety: "Golden Acre", category: "vegetables", region: "west", price: 950, change: 2.3, trend: "rising", topMarket: "Pune, Maharashtra", icon: "fa-leaf" },
      { id: 8, name: "Cauliflower", variety: "Snowball", category: "vegetables", region: "north", price: 1150, change: 3.7, trend: "rising", topMarket: "Jalandhar, Punjab", icon: "fa-leaf" },
      { id: 9, name: "Corn", variety: "Sweet Corn", category: "cereals", region: "west", price: 1950, change: 1.2, trend: "rising", topMarket: "Nashik, Maharashtra", icon: "fa-corn" },
      { id: 10, name: "Soybean", variety: "JS 335", category: "oilseeds", region: "central", price: 3850, change: -2.1, trend: "falling", topMarket: "Indore, MP", icon: "fa-seedling" },
      { id: 11, name: "Cotton", variety: "BG II", category: "oilseeds", region: "west", price: 6250, change: 3.5, trend: "rising", topMarket: "Yavatmal, Maharashtra", icon: "fa-tshirt" },
      { id: 12, name: "Sugarcane", variety: "Co 86032", category: "cereals", region: "north", price: 3350, change: 1.2, trend: "rising", topMarket: "Muzaffarnagar, UP", icon: "fa-candy-cane" },
      { id: 13, name: "Turmeric", variety: "Alleppey", category: "spices", region: "south", price: 12500, change: 5.2, trend: "rising", topMarket: "Erode, Tamil Nadu", icon: "fa-mortar-pestle" },
      { id: 14, name: "Chilli", variety: "Teja", category: "spices", region: "south", price: 18500, change: -1.5, trend: "falling", topMarket: "Guntur, Andhra", icon: "fa-pepper-hot" },
      { id: 15, name: "Toor Dal", variety: "Organic", category: "pulses", region: "south", price: 12500, change: 2.8, trend: "rising", topMarket: "Latur, Maharashtra", icon: "fa-seedling" },
      { id: 16, name: "Moong Dal", variety: "Green", category: "pulses", region: "north", price: 8500, change: 1.5, trend: "rising", topMarket: "Rajasthan", icon: "fa-seedling" },
      { id: 17, name: "Mango", variety: "Alphonso", category: "fruits", region: "west", price: 8500, change: 8.2, trend: "rising", topMarket: "Ratnagiri, Maharashtra", icon: "fa-apple-alt" },
      { id: 18, name: "Banana", variety: "Grand Naine", category: "fruits", region: "west", price: 1850, change: 0.5, trend: "stable", topMarket: "Jalgaon, Maharashtra", icon: "fa-apple-alt" },
      { id: 19, name: "Grapes", variety: "Thompson", category: "fruits", region: "west", price: 6500, change: 4.2, trend: "rising", topMarket: "Nashik, Maharashtra", icon: "fa-grapes" },
      { id: 20, name: "Mustard", variety: "Pusa Bold", category: "oilseeds", region: "central", price: 5850, change: 3.8, trend: "rising", topMarket: "Bharatpur, Rajasthan", icon: "fa-seedling" },
      { id: 21, name: "Rice", variety: "IR-64", category: "cereals", region: "east", price: 2450, change: 0.5, trend: "stable", topMarket: "Kolkata, West Bengal", icon: "fa-bowl-rice" },
      { id: 22, name: "Jute", variety: "TD-5", category: "cereals", region: "east", price: 4250, change: -1.2, trend: "falling", topMarket: "Kolkata, West Bengal", icon: "fa-leaf" },
      { id: 23, name: "Maize", variety: "Hybrid", category: "cereals", region: "east", price: 1850, change: 0.8, trend: "rising", topMarket: "Patna, Bihar", icon: "fa-corn" },
      { id: 24, name: "Gram", variety: "Desi", category: "pulses", region: "central", price: 5200, change: 1.2, trend: "rising", topMarket: "Bhopal, MP", icon: "fa-seedling" }
    ];

    const initialRegions = [
      { name: "North India", avgPrice: 2850, trend: "+2.3%", topCrops: ["Wheat", "Basmati Rice", "Potato", "Mustard"] },
      { name: "South India", avgPrice: 3850, trend: "+1.8%", topCrops: ["Rice", "Turmeric", "Chilli", "Toor Dal"] },
      { name: "West India", avgPrice: 3250, trend: "+3.1%", topCrops: ["Cotton", "Sugarcane", "Onion", "Grapes"] },
      { name: "East India", avgPrice: 2450, trend: "-0.5%", topCrops: ["Rice", "Potato", "Jute", "Maize"] },
      { name: "Central India", avgPrice: 2650, trend: "+1.2%", topCrops: ["Soybean", "Wheat", "Gram", "Mustard"] }
    ];

    setMarketData({ crops: initialCrops, regions: initialRegions });
    setFilteredCrops(initialCrops);
    updateLastUpdateTime();

    // Start live updates
    startLiveUpdates();

    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Apply filters when filter state changes
    applyFilters();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [filters, marketData.crops]);

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

  const startLiveUpdates = () => {
    // Update countdown every second
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Reset to 5 minutes and trigger update
          setTimeout(() => updateMarketData(), 0);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    // Update market data every 5 minutes
    updateIntervalRef.current = setInterval(() => {
      updateMarketData();
    }, 300000); // 5 minutes

    // Simulate first update after 10 seconds
    setTimeout(() => updateMarketData(), 10000);
  };

  const updateMarketData = () => {
    setMarketData(prev => {
      const updatedCrops = prev.crops.map(crop => {
        // Generate random price movement (-2% to +3%)
        const changePercent = (Math.random() * 5 - 2) / 100;
        const oldPrice = crop.price;
        const newPrice = Math.round(oldPrice * (1 + changePercent));
        const priceChange = parseFloat(((newPrice - oldPrice) / oldPrice * 100).toFixed(1));

        // Update trend based on change
        let trend = crop.trend;
        if (priceChange > 0.5) trend = "rising";
        else if (priceChange < -0.5) trend = "falling";
        else trend = "stable";

        return {
          ...crop,
          price: newPrice,
          change: priceChange,
          trend
        };
      });

      return { ...prev, crops: updatedCrops };
    });

    updateLastUpdateTime();
    showNotification('Market prices updated with latest rates', 'success');
  };

  const updateLastUpdateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    setLastUpdate(timeString);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const applyFilters = () => {
    let filtered = [...marketData.crops];

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(crop => crop.category === filters.category);
    }

    // Apply region filter - FIXED: Now working properly
    if (filters.region !== 'all') {
      filtered = filtered.filter(crop => crop.region === filters.region);
    }

    // Apply trend filter
    if (filters.trend !== 'all') {
      filtered = filtered.filter(crop => {
        if (filters.trend === 'rising') return crop.trend === 'rising';
        if (filters.trend === 'falling') return crop.trend === 'falling';
        if (filters.trend === 'stable') return crop.trend === 'stable';
        return true;
      });
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm) ||
        crop.variety.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredCrops(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleSetAlert = () => {
    const cropSelect = document.getElementById('alertCropSelect');
    const targetPrice = document.getElementById('targetPrice');
    const phoneNumber = document.getElementById('phoneNumber');

    if (!cropSelect?.value || !targetPrice?.value || !phoneNumber?.value) {
      showNotification('Please fill all fields to set a price alert', 'error');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      showNotification(`Price alert set successfully! You will receive alerts on ${phoneNumber.value}`, 'success');

      // Reset form
      if (cropSelect) cropSelect.value = '';
      if (targetPrice) targetPrice.value = '';
      if (phoneNumber) phoneNumber.value = '';
    }, 1500);
  };

  const showCropDetail = (crop) => {
    const message = `${crop.name} (${crop.variety})\n\n` +
      `Current Price: ₹${crop.price}/Quintal\n` +
      `24h Change: ${crop.change >= 0 ? '+' : ''}${crop.change}%\n` +
      `Market Trend: ${crop.trend.charAt(0).toUpperCase() + crop.trend.slice(1)}\n` +
      `Best Market: ${crop.topMarket}\n\n` +
      `Price 7 days ago: ₹${Math.round(crop.price / (1 + crop.change / 100))}\n` +
      `Expected trend: ${getTrendPrediction(crop)}\n\n` +
      `Tip: ${getSellingTip(crop)}`;

    alert(message);
  };

  const getTrendPrediction = (crop) => {
    if (crop.trend === 'rising' && crop.change > 2) {
      return "Strong upward momentum, likely to continue rising";
    } else if (crop.trend === 'rising') {
      return "Moderate upward trend, may stabilize soon";
    } else if (crop.trend === 'falling' && crop.change < -2) {
      return "Significant decline, may continue falling";
    } else if (crop.trend === 'falling') {
      return "Moderate decline, may find support soon";
    } else {
      return "Stable, expect minor fluctuations";
    }
  };

  const getSellingTip = (crop) => {
    if (crop.trend === 'rising') {
      return "Consider holding for better prices if storage permits";
    } else if (crop.trend === 'falling') {
      return "Sell now or consider alternative markets";
    } else {
      return "Good time to sell for immediate cash flow";
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
  };

  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <main id="main-content">
        {/* Live Market Hero */}
        <section className="market-hero">
          <div className="container">
            <div className="market-hero-content">
              <h1 className="market-hero-title">Live Agricultural Market Prices</h1>
              <p className="market-hero-subtitle">
                Real-time commodity prices updated every 5 minutes from 50+ major mandis across India. Track live rates, analyze trends, and make informed selling decisions with Farm Vantara's comprehensive market intelligence.
              </p>

              <div className="market-stats">
                <div className="stat-card">
                  <div className="stat-value">{stats.totalCrops}+</div>
                  <div className="stat-label">Crops & Commodities</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.mandiCount}</div>
                  <div className="stat-label">Live Mandi Feeds</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.updateInterval} min</div>
                  <div className="stat-label">Refresh Interval</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.dataAccuracy}%</div>
                  <div className="stat-label">Data Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Update Banner */}
        <div className="live-banner">
          <div className="container">
            <div className="live-banner-content">
              <div className="live-indicator">
                <div className="live-dot"></div>
                <span>LIVE MARKET DATA</span>
              </div>
              <div className="last-update">
                Last updated: <span>{lastUpdate}</span>
              </div>
              <div className="update-countdown">
                <i className="fas fa-sync-alt"></i>
                Next update in: <span>{formatCountdown()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Market Prices Section */}
        <section className="market-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Live Commodity Prices</h2>
              <p className="section-subtitle">Current market rates per quintal (100kg) for major agricultural commodities</p>
            </div>

            {/* Market Controls */}
            <div className="market-controls">
              <div className="filter-group">
                <select className="filter-select" name="category" value={filters.category} onChange={handleFilterChange}>
                  <option value="all">All Categories</option>
                  <option value="cereals">Cereals</option>
                  <option value="pulses">Pulses</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="spices">Spices</option>
                  <option value="oilseeds">Oilseeds</option>
                </select>

                {/* REGION DROPDOWN - Now working properly */}
                <select className="filter-select" name="region" value={filters.region} onChange={handleFilterChange}>
                  <option value="all">All Regions</option>
                  <option value="north">North India</option>
                  <option value="south">South India</option>
                  <option value="west">West India</option>
                  <option value="east">East India</option>
                  <option value="central">Central India</option>
                </select>

                <select className="filter-select" name="trend" value={filters.trend} onChange={handleFilterChange}>
                  <option value="all">All Trends</option>
                  <option value="rising">Rising 📈</option>
                  <option value="falling">Falling 📉</option>
                  <option value="stable">Stable ➡️</option>
                </select>
              </div>

              <div className="search-box">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search for crop or commodity..."
                  value={filters.search}
                  onChange={handleSearch}
                />
              </div>
            </div>

            {/* Live Price Table */}
            <div className="price-table-container">
              <table className="price-table">
                <thead className="table-header">
                  <tr>
                    <th style={{ width: '25%' }}>Crop / Commodity</th>
                    <th style={{ width: '15%' }}>Variety</th>
                    <th style={{ width: '15%' }}>Current Price (₹/Quintal)</th>
                    <th style={{ width: '15%' }}>24h Change</th>
                    <th style={{ width: '15%' }}>Market Trend</th>
                    <th style={{ width: '15%' }}>Top Market</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCrops.length > 0 ? (
                    filteredCrops.map(crop => {
                      const changeClass = crop.change >= 0 ? 'positive' : 'negative';
                      const changeIcon = crop.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
                      const trendIcon = crop.trend === 'rising' ? 'fa-arrow-up' :
                        crop.trend === 'falling' ? 'fa-arrow-down' : 'fa-minus';
                      const trendColor = crop.trend === 'rising' ? 'var(--dark-green)' :
                        crop.trend === 'falling' ? '#eb5757' : '#636e72';

                      return (
                        <tr key={crop.id} onClick={() => showCropDetail(crop)} style={{ cursor: 'pointer' }}>
                          <td>
                            <div className="crop-name">
                              <div className="crop-icon">
                                <i className={`fas ${crop.icon}`}></i>
                              </div>
                              <span>{crop.name}</span>
                            </div>
                          </td>
                          <td>{crop.variety}</td>
                          <td>
                            <div className="price-amount">₹{crop.price.toLocaleString()}</div>
                          </td>
                          <td>
                            <span className={`price-change ${changeClass}`}>
                              <i className={`fas ${changeIcon}`}></i>
                              {Math.abs(crop.change)}%
                            </span>
                          </td>
                          <td>
                            <div className="market-trend">
                              <i className={`fas ${trendIcon} trend-icon`} style={{ color: trendColor }}></i>
                              <span>{crop.trend.charAt(0).toUpperCase() + crop.trend.slice(1)}</span>
                            </div>
                          </td>
                          <td>{crop.topMarket}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                        <i className="fas fa-search" style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px', display: 'block' }}></i>
                        <h3>No crops found</h3>
                        <p>Try adjusting your filters or search term</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Results Counter */}
            {filteredCrops.length > 0 && filteredCrops.length < marketData.crops.length && (
              <div className="results-counter">
                Showing {filteredCrops.length} of {marketData.crops.length} crops
              </div>
            )}

            {/* Table Legend */}
            <div className="table-legend">
              <div className="legend-items">
                <div className="legend-item">
                  <div className="legend-color" style={{ background: 'rgba(39, 174, 96, 0.1)' }}></div>
                  <span>Increasing Price Trend</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: 'rgba(235, 87, 87, 0.1)' }}></div>
                  <span>Decreasing Price Trend</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: 'rgba(99, 110, 114, 0.1)' }}></div>
                  <span>Stable Price Trend</span>
                </div>
              </div>
              <div className="legend-note">
                <i className="fas fa-info-circle"></i>
                Prices are average rates from major mandis, actual rates may vary by 2-5%
              </div>
            </div>
          </div>
        </section>

        {/* Regional Price Comparison */}
        <section className="market-section" style={{ background: 'var(--light-gray)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Regional Price Comparison</h2>
              <p className="section-subtitle">Compare commodity prices across major agricultural regions in India</p>
            </div>

            <div className="region-grid">
              {marketData.regions.map((region, index) => (
                <div key={index} className="region-card">
                  <div className="region-header">
                    <div className="region-name">{region.name}</div>
                    <div className="region-price">₹{region.avgPrice.toLocaleString()}</div>
                  </div>
                  <div className="region-trend">
                    <span style={{
                      color: region.trend.startsWith('+') ? 'var(--dark-green)' : '#eb5757',
                      fontWeight: 700
                    }}>
                      {region.trend}
                    </span> weekly average change
                  </div>
                  <h4 className="region-crops-title">Top Crops in Region</h4>
                  <ul className="top-crops">
                    {region.topCrops.map((crop, idx) => {
                      const cropData = marketData.crops.find(c => c.name === crop);
                      const price = cropData ? `₹${cropData.price.toLocaleString()}` : '₹---';
                      return (
                        <li key={idx}>
                          <span>{crop}</span>
                          <span className="crop-price">{price}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="smart-tip">
              <h3>
                <i className="fas fa-lightbulb"></i> Smart Selling Tip
              </h3>
              <p>
                Prices in Western and Southern regions are typically 8-15% higher for fruits and vegetables due to higher transportation costs from Northern growing regions. Consider logistics when choosing your target market.
              </p>
            </div>
          </div>
        </section>

        {/* Market Trends & Analysis */}
        <section className="trends-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Market Trends & Analysis</h2>
              <p className="section-subtitle">Expert analysis and predictions based on current market data</p>
            </div>

            <div className="trend-grid">
              <div className="trend-card">
                <div className="trend-header">
                  <div className="trend-icon-large">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div>
                    <h3>Weekly Trend Analysis</h3>
                    <p className="trend-update-time">Updated: Today {lastUpdate}</p>
                  </div>
                </div>
                <div className="trend-content">
                  <p>Wheat prices have increased by 4.2% this week due to reduced arrivals in North Indian mandis. Potato prices are stable despite increased supply. Onion prices show a downward trend with new crop arrivals from Maharashtra.</p>

                  <div className="trend-stats">
                    <div className="trend-stat">
                      <div className="trend-stat-value" style={{ color: 'var(--dark-green)' }}>+4.2%</div>
                      <div className="trend-stat-label">Wheat Weekly Change</div>
                    </div>
                    <div className="trend-stat">
                      <div className="trend-stat-value" style={{ color: '#636e72' }}>+0.8%</div>
                      <div className="trend-stat-label">Potato Weekly Change</div>
                    </div>
                    <div className="trend-stat">
                      <div className="trend-stat-value" style={{ color: '#eb5757' }}>-3.5%</div>
                      <div className="trend-stat-label">Onion Weekly Change</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="trend-card">
                <div className="trend-header">
                  <div className="trend-icon-large">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div>
                    <h3>Seasonal Outlook</h3>
                    <p className="trend-update-time">Rabi Season 2024</p>
                  </div>
                </div>
                <div className="trend-content">
                  <p>The current Rabi season shows strong yield projections for wheat and mustard. Expect prices to remain stable or slightly increase for pulses. Vegetable prices may see volatility due to unseasonal rainfall patterns in key growing regions.</p>

                  <div className="trend-stats">
                    <div className="trend-stat">
                      <div className="trend-stat-value" style={{ color: 'var(--dark-green)' }}>↑ Stable</div>
                      <div className="trend-stat-label">Wheat Outlook</div>
                    </div>
                    <div className="trend-stat">
                      <div className="trend-stat-value" style={{ color: 'var(--dark-green)' }}>↑ Rising</div>
                      <div className="trend-stat-label">Mustard Outlook</div>
                    </div>
                    <div className="trend-stat">
                      <div className="trend-stat-value" style={{ color: '#f2994a' }}>⚠ Volatile</div>
                      <div className="trend-stat-label">Vegetables Outlook</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="trend-card">
                <div className="trend-header">
                  <div className="trend-icon-large">
                    <i className="fas fa-truck"></i>
                  </div>
                  <div>
                    <h3>Logistics Impact</h3>
                    <p className="trend-update-time">Transportation Cost Analysis</p>
                  </div>
                </div>
                <div className="trend-content">
                  <p>Transport costs have increased by 12% due to fuel price hikes. This impacts perishable commodities the most. Cold chain availability remains stable. Consider local markets for perishables to maximize profits.</p>

                  <div className="trend-stats">
                    <div className="trend-stat">
                      <div className="trend-stat-value" style={{ color: '#eb5757' }}>+12%</div>
                      <div className="trend-stat-label">Transport Cost</div>
                    </div>
                    <div className="trend-stat">
                      <div className="trend-stat-value" style={{ color: '#27ae60' }}>95%</div>
                      <div className="trend-stat-label">Cold Chain Avail.</div>
                    </div>
                    <div className="trend-stat">
                      <div className="trend-stat-value" style={{ color: '#f2994a' }}>Medium</div>
                      <div className="trend-stat-label">Perishables Risk</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Price Alerts Section */}
        <section className="alert-section">
          <div className="container">
            <div className="alert-card">
              <h2 className="alert-title">Get Price Alerts</h2>
              <p className="alert-description">
                Never miss a price movement. Get instant alerts when your selected crops reach target prices. Available via SMS, WhatsApp, and email.
              </p>

              <div className="alert-form">
                <div className="alert-input-group">
                  <select className="alert-input" id="alertCropSelect">
                    <option value="">Select Crop</option>
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                    <option value="tomato">Tomato</option>
                    <option value="potato">Potato</option>
                    <option value="onion">Onion</option>
                    <option value="mango">Mango</option>
                    <option value="grapes">Grapes</option>
                    <option value="cotton">Cotton</option>
                  </select>
                  <input
                    type="number"
                    className="alert-input"
                    id="targetPrice"
                    placeholder="Target Price (₹/Quintal)"
                  />
                </div>
                <div className="alert-input-group">
                  <input
                    type="tel"
                    className="alert-input"
                    id="phoneNumber"
                    placeholder="Phone Number"
                  />
                  <button className="alert-btn" onClick={handleSetAlert}>
                    <i className="fas fa-bell"></i> Set Alert
                  </button>
                </div>
              </div>

              <p className="alert-security">
                <i className="fas fa-shield-alt"></i>
                Your data is secure and will only be used for price alerts
              </p>
            </div>
          </div>
        </section>
      </main>

    </>
  );
};

export default MarketPrices;