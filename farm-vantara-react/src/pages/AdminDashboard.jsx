import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import DataTable from 'react-data-table-component';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  // ---------- State ----------
  const [sidebarActive, setSidebarActive] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // Data states
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [logistics, setLogistics] = useState([]);
  const [support, setSupport] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  // Stats
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalBuyers: 0,
    totalConsumers: 0,
    pendingOrders: 0,
    todayRevenue: '₹0',
  });

  // Modal state
  const [modals, setModals] = useState({
    addFarmer: false,
    verifyBuyer: false,
    issueRefund: false,
    sendNotification: false,
    systemSettings: false,
  });

  // Chart refs
  const growthChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const cropChartRef = useRef(null);
  const regionChartRef = useRef(null);
  const growthChartInstance = useRef(null);
  const revenueChartInstance = useRef(null);
  const cropChartInstance = useRef(null);
  const regionChartInstance = useRef(null);

  // Form refs (for reset)
  const addFarmerFormRef = useRef(null);
  const verifyBuyerFormRef = useRef(null);
  const refundFormRef = useRef(null);
  const notificationFormRef = useRef(null);
  const settingsFormRef = useRef(null);

  // ---------- Effects ----------

  // Load sample data on mount
  useEffect(() => {
    loadSampleData();
    // Initialize charts after data is loaded
    setTimeout(() => initCharts(), 100);
    // Simulate real-time updates
    const interval = setInterval(() => {
      simulateRealTimeUpdates();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Re-initialize charts when data changes (if needed)
  useEffect(() => {
    if (growthChartRef.current && revenueChartRef.current) {
      // charts already initialized, but we can update data if needed
      // For simplicity, we'll rely on initial data
    }
  }, [farmers, buyers, consumers]);

  // Update stats when data changes
  useEffect(() => {
    updateStats();
  }, [farmers, buyers, consumers, orders]);

  // Search effect
  useEffect(() => {
    if (searchTerm.length > 2) {
      performSearch(searchTerm);
    } else {
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  // Cleanup chart instances on unmount
  useEffect(() => {
    return () => {
      [growthChartInstance, revenueChartInstance, cropChartInstance, regionChartInstance].forEach(inst => {
        if (inst.current) inst.current.destroy();
      });
    };
  }, []);

  // ---------- Data Loading ----------
  const loadSampleData = () => {
    // Farmers
    setFarmers([
      { id: 'FARM-1001', name: 'Rajesh Kumar', location: 'Punjab', crops: 'Wheat, Rice', totalSales: '₹12,50,000', rating: '4.8', status: 'active', phone: '+91 9876543210', email: 'rajesh@example.com', farmSize: '12 acres', joined: '2023-01-15', orders: 45 },
      { id: 'FARM-1002', name: 'Priya Sharma', location: 'Maharashtra', crops: 'Organic Vegetables', totalSales: '₹8,20,000', rating: '4.9', status: 'verified', phone: '+91 9876543211', email: 'priya@example.com', farmSize: '8 acres', joined: '2023-02-20', orders: 32 },
      { id: 'FARM-1003', name: 'Arun Patel', location: 'Gujarat', crops: 'Cotton, Groundnuts', totalSales: '₹6,70,000', rating: '4.6', status: 'active', phone: '+91 9876543212', email: 'arun@example.com', farmSize: '15 acres', joined: '2023-03-10', orders: 28 },
      { id: 'FARM-1004', name: 'Suresh Reddy', location: 'Andhra Pradesh', crops: 'Rice, Pulses', totalSales: '₹9,80,000', rating: '4.7', status: 'pending', phone: '+91 9876543213', email: 'suresh@example.com', farmSize: '20 acres', joined: '2023-04-05', orders: 38 },
    ]);

    // Buyers
    setBuyers([
      { id: 'BIZ-2001', name: 'FreshMart Stores', contact: 'Rahul Verma', type: 'Retail Chain', monthlySpend: '₹2,50,000', orders: 120, status: 'verified', gst: '27ABCDE1234F1Z5', phone: '+91 9876543220', email: 'orders@freshmart.com', location: 'Delhi' },
      { id: 'BIZ-2002', name: 'Green Leaf Restaurant', contact: 'Anjali Mehta', type: 'Restaurant', monthlySpend: '₹1,80,000', orders: 85, status: 'active', gst: '29ABCDE1234F1Z6', phone: '+91 9876543221', email: 'procurement@greenleaf.com', location: 'Mumbai' },
      { id: 'BIZ-2003', name: 'Agro Processors Ltd', contact: 'Vikram Singh', type: 'Processing Unit', monthlySpend: '₹5,00,000', orders: 45, status: 'verified', gst: '24ABCDE1234F1Z7', phone: '+91 9876543222', email: 'purchase@agroprocessors.com', location: 'Punjab' },
    ]);

    // Consumers
    setConsumers([
      { id: 'CUST-3001', name: 'Amit Sharma', email: 'amit@example.com', orders: 12, totalSpent: '₹24,500', status: 'active', location: 'Delhi' },
      { id: 'CUST-3002', name: 'Priya Patel', email: 'priya@example.com', orders: 8, totalSpent: '₹18,200', status: 'active', location: 'Mumbai' },
      { id: 'CUST-3003', name: 'Raj Kumar', email: 'raj@example.com', orders: 5, totalSpent: '₹12,800', status: 'inactive', location: 'Bangalore' },
    ]);

    // Orders
    setOrders([
      { id: 'ORD-4001', farmer: 'Rajesh Kumar', buyer: 'FreshMart Stores', amount: '₹45,000', status: 'delivered', date: '2024-01-15' },
      { id: 'ORD-4002', farmer: 'Priya Sharma', buyer: 'Green Leaf Restaurant', amount: '₹28,500', status: 'processing', date: '2024-01-16' },
      { id: 'ORD-4003', farmer: 'Arun Patel', buyer: 'Agro Processors Ltd', amount: '₹67,000', status: 'pending', date: '2024-01-17' },
    ]);

    // Activities
    setActivities([
      { time: '10:30 AM', userType: 'Farmer', activity: 'New Registration', details: 'Rajesh Kumar - Punjab', status: 'completed' },
      { time: '09:45 AM', userType: 'Business', activity: 'Bulk Order', details: 'Order #ORD-7845 - ₹2,45,000', status: 'processing' },
      { time: 'Yesterday', userType: 'Consumer', activity: 'Complaint Filed', details: 'Quality issue with vegetables', status: 'pending' },
    ]);

    // Pending Approvals
    setPendingApprovals([
      { id: 'APP-1001', user: 'Gopal Singh', type: 'Farmer', request: 'Registration', submitted: '2 hours ago' },
      { id: 'APP-1002', user: 'Spice Hub Restaurant', type: 'Business', request: 'Verification', submitted: '5 hours ago' },
      { id: 'APP-1003', user: 'Mohan Lal', type: 'Farmer', request: 'Bank Update', submitted: '1 day ago' },
    ]);

    // Other data
    setProducts([
      { id: 'PROD-5001', name: 'Organic Wheat', category: 'Grains', price: '₹2,450/quintal', stock: '1200 quintals', farmer: 'Rajesh Kumar' },
      { id: 'PROD-5002', name: 'Fresh Tomatoes', category: 'Vegetables', price: '₹1,800/quintal', stock: '800 quintals', farmer: 'Priya Sharma' },
      { id: 'PROD-5003', name: 'Basmati Rice', category: 'Grains', price: '₹3,200/quintal', stock: '950 quintals', farmer: 'Suresh Reddy' },
    ]);

    setPayments([
      { id: 'PAY-6001', order: 'ORD-4001', farmer: 'Rajesh Kumar', amount: '₹45,000', status: 'completed', date: '2024-01-15' },
      { id: 'PAY-6002', order: 'ORD-4002', farmer: 'Priya Sharma', amount: '₹28,500', status: 'pending', date: '2024-01-16' },
      { id: 'PAY-6003', order: 'ORD-4003', farmer: 'Arun Patel', amount: '₹67,000', status: 'processing', date: '2024-01-17' },
    ]);

    setLogistics([
      { id: 'LOG-7001', order: 'ORD-4001', from: 'Punjab', to: 'Delhi', status: 'delivered', deliveryDate: '2024-01-16' },
      { id: 'LOG-7002', order: 'ORD-4002', from: 'Maharashtra', to: 'Mumbai', status: 'in transit', estimatedDate: '2024-01-18' },
      { id: 'LOG-7003', order: 'ORD-4003', from: 'Gujarat', to: 'Punjab', status: 'pending', estimatedDate: '2024-01-19' },
    ]);

    setSupport([
      { id: 'TICK-8001', user: 'Amit Sharma', issue: 'Delivery delay', status: 'open', priority: 'high', created: '2024-01-15' },
      { id: 'TICK-8002', user: 'Green Leaf Restaurant', issue: 'Quality concern', status: 'in progress', priority: 'medium', created: '2024-01-16' },
      { id: 'TICK-8003', user: 'Rajesh Kumar', issue: 'Payment query', status: 'resolved', priority: 'low', created: '2024-01-14' },
    ]);

    setNotifications([
      { id: 'NOTIF-9001', title: 'System Maintenance', message: 'Scheduled maintenance on Jan 20', type: 'system', read: false },
      { id: 'NOTIF-9002', title: 'New Farmer Registration', message: 'New farmer registered: Gopal Singh', type: 'farmer', read: false },
      { id: 'NOTIF-9003', title: 'Order Alert', message: 'Large order placed by FreshMart Stores', type: 'order', read: true },
    ]);
  };

  const updateStats = () => {
    setStats({
      totalFarmers: farmers.length,
      totalBuyers: buyers.length,
      totalConsumers: consumers.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      todayRevenue: '₹8,42,156', // static for demo
    });
  };

  // ---------- Chart Initialization ----------
  const initCharts = () => {
    // User Growth Chart
    if (growthChartRef.current) {
      if (growthChartInstance.current) growthChartInstance.current.destroy();
      growthChartInstance.current = new Chart(growthChartRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            { label: 'Farmers', data: [1200, 1900, 3000, 3500, 4200, 5247], borderColor: '#27ae60', backgroundColor: 'rgba(39, 174, 96, 0.1)', tension: 0.4 },
            { label: 'Business Buyers', data: [800, 1200, 1500, 1650, 1800, 1846], borderColor: '#2d9cdb', backgroundColor: 'rgba(45, 156, 219, 0.1)', tension: 0.4 },
            { label: 'Consumers', data: [8000, 12000, 16500, 20000, 22500, 24589], borderColor: '#f2994a', backgroundColor: 'rgba(242, 153, 74, 0.1)', tension: 0.4 },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }

    // Revenue Distribution Chart
    if (revenueChartRef.current) {
      if (revenueChartInstance.current) revenueChartInstance.current.destroy();
      revenueChartInstance.current = new Chart(revenueChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Farmers Sales', 'Platform Commission', 'Logistics', 'Other Services'],
          datasets: [{ data: [65, 15, 12, 8], backgroundColor: ['#27ae60', '#2d9cdb', '#f2994a', '#f2c94c'], borderWidth: 2 }],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }

    // Crop Categories Chart
    if (cropChartRef.current) {
      if (cropChartInstance.current) cropChartInstance.current.destroy();
      cropChartInstance.current = new Chart(cropChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Grains', 'Vegetables', 'Fruits', 'Pulses', 'Spices'],
          datasets: [{
            label: 'Sales Volume (Quintal)',
            data: [12000, 8500, 6200, 4500, 3200],
            backgroundColor: ['rgba(39,174,96,0.7)', 'rgba(45,156,219,0.7)', 'rgba(242,153,74,0.7)', 'rgba(242,201,76,0.7)', 'rgba(155,81,224,0.7)'],
          }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      });
    }

    // Regional Distribution Chart
    if (regionChartRef.current) {
      if (regionChartInstance.current) regionChartInstance.current.destroy();
      regionChartInstance.current = new Chart(regionChartRef.current, {
        type: 'polarArea',
        data: {
          labels: ['North', 'South', 'East', 'West', 'Central'],
          datasets: [{
            label: 'Farmers Count',
            data: [1850, 1240, 980, 760, 417],
            backgroundColor: ['rgba(39,174,96,0.7)', 'rgba(45,156,219,0.7)', 'rgba(242,153,74,0.7)', 'rgba(242,201,76,0.7)', 'rgba(155,81,224,0.7)'],
          }],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    }
  };

  // ---------- Helper Functions ----------
  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
  };

  const showLoading = (show) => setLoading(show);

  const safeRender = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // ---------- Section Switching ----------
  const loadSection = (section) => {
    setCurrentSection(section);
    setSidebarActive(false);
  };

  // ---------- Search ----------
  const performSearch = (term) => {
    const results = [];
    farmers.forEach(f => {
      if (f.name.toLowerCase().includes(term) || f.location.toLowerCase().includes(term) || f.crops.toLowerCase().includes(term)) {
        results.push({ type: 'Farmer', id: f.id, name: f.name, detail: f.location, action: () => viewFarmer(f.id) });
      }
    });
    buyers.forEach(b => {
      if (b.name.toLowerCase().includes(term) || b.contact.toLowerCase().includes(term)) {
        results.push({ type: 'Business Buyer', id: b.id, name: b.name, detail: b.type, action: () => viewBuyer(b.id) });
      }
    });
    setSearchResults(results);
    setShowSearchResults(true);
  };

  // ---------- Modal Handlers ----------
  const openModal = (modal) => setModals(prev => ({ ...prev, [modal]: true }));
  const closeModal = (modal) => {
    setModals(prev => ({ ...prev, [modal]: false }));
    // Reset forms
    if (modal === 'addFarmer' && addFarmerFormRef.current) addFarmerFormRef.current.reset();
    if (modal === 'verifyBuyer' && verifyBuyerFormRef.current) verifyBuyerFormRef.current.reset();
    if (modal === 'issueRefund' && refundFormRef.current) refundFormRef.current.reset();
    if (modal === 'sendNotification' && notificationFormRef.current) notificationFormRef.current.reset();
    if (modal === 'systemSettings' && settingsFormRef.current) settingsFormRef.current.reset();
  };

  // ---------- CRUD Operations ----------
  const addNewFarmer = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newFarmer = {
      id: 'FARM-' + (1000 + farmers.length + 1),
      name: formData.get('farmerName'),
      location: `${formData.get('farmerDistrict')}, ${formData.get('farmerState')}`,
      crops: formData.get('farmerCrops'),
      totalSales: '₹0',
      rating: '0.0',
      status: 'pending',
      phone: formData.get('farmerMobile'),
      email: formData.get('farmerEmail'),
      farmSize: formData.get('farmSize') + ' acres',
      joined: new Date().toISOString().split('T')[0],
      orders: 0,
    };
    setFarmers(prev => [newFarmer, ...prev]);
    showAlert('Farmer added successfully! Verification pending.', 'success');
    closeModal('addFarmer');
  };

  const verifyBusinessBuyer = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBuyer = {
      id: 'BIZ-' + (2000 + buyers.length + 1),
      name: formData.get('businessName'),
      contact: formData.get('contactPerson'),
      type: formData.get('businessType'),
      monthlySpend: `₹${parseInt(formData.get('monthlyProcurement')).toLocaleString()}`,
      orders: 0,
      status: 'verified',
      gst: formData.get('gstNumber'),
      phone: formData.get('contactNumber'),
      email: '',
      location: '',
    };
    setBuyers(prev => [newBuyer, ...prev]);
    showAlert('Business buyer verified and added successfully!', 'success');
    closeModal('verifyBuyer');
  };

  const processRefund = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = formData.get('refundAmount');
    const orderId = formData.get('orderId');
    showAlert(`Refund of ₹${amount} processed for order ${orderId}`, 'success');
    // Add to activities
    setActivities(prev => [{
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userType: 'System',
      activity: 'Refund Processed',
      details: `₹${amount} for order ${orderId}`,
      status: 'completed',
    }, ...prev].slice(0, 50));
    closeModal('issueRefund');
  };

  const sendNotification = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subject = formData.get('notificationSubject');
    const type = formData.get('notificationType');
    setActivities(prev => [{
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userType: 'System',
      activity: 'Notification Sent',
      details: `${subject} to ${type}`,
      status: 'completed',
    }, ...prev].slice(0, 50));
    showAlert('Notification sent successfully!', 'success');
    closeModal('sendNotification');
  };

  const saveSystemSettings = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settings = {
      commission: formData.get('platformCommission'),
      paymentDelay: formData.get('paymentDelay'),
      minOrder: formData.get('minOrderValue'),
      autoVerify: formData.get('autoVerification'),
      language: formData.get('defaultLanguage'),
    };
    localStorage.setItem('farmvantara_settings', JSON.stringify(settings));
    showAlert('System settings saved successfully!', 'success');
    closeModal('systemSettings');
  };

  // View details
  const viewFarmer = (farmerId) => {
    // For simplicity, we just show alert – in a real app we'd navigate to detail view
    showAlert(`Viewing farmer ${farmerId}`, 'info');
  };

  const viewBuyer = (buyerId) => {
    showAlert(`Viewing buyer ${buyerId}`, 'info');
  };

  const editFarmer = (farmerId) => {
    showAlert(`Edit farmer ${farmerId}`, 'info');
    openModal('addFarmer');
  };

  const editBuyer = (buyerId) => {
    showAlert(`Edit buyer ${buyerId}`, 'info');
    openModal('verifyBuyer');
  };

  const deleteFarmer = (farmerId) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      setFarmers(prev => prev.filter(f => f.id !== farmerId));
      showAlert('Farmer deleted successfully!', 'success');
    }
  };

  const approveRequest = (requestId) => {
    showAlert(`Request ${requestId} approved!`, 'success');
    setPendingApprovals(prev => prev.filter(r => r.id !== requestId));
  };

  const rejectRequest = (requestId) => {
    showAlert(`Request ${requestId} rejected!`, 'error');
    setPendingApprovals(prev => prev.filter(r => r.id !== requestId));
  };

  const generateReport = () => {
    showLoading(true);
    setTimeout(() => {
      const reportData = {
        timestamp: new Date().toISOString(),
        farmers: farmers.length,
        buyers: buyers.length,
        consumers: consumers.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
      };
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const link = document.createElement('a');
      link.setAttribute('href', dataUri);
      link.setAttribute('download', `farmvantara_report_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showLoading(false);
      showAlert('Report generated and downloaded successfully!', 'success');
    }, 2000);
  };

  const exportData = (type, format) => {
    showAlert(`Exporting ${type} data as ${format.toUpperCase()}... (demo)`, 'info');
  };

  const simulateRealTimeUpdates = () => {
    // Randomly update stats
    setStats(prev => ({
      ...prev,
      totalFarmers: prev.totalFarmers + Math.floor(Math.random() * 3),
      totalBuyers: prev.totalBuyers + Math.floor(Math.random() * 2),
      totalConsumers: prev.totalConsumers + Math.floor(Math.random() * 10),
    }));
    // Add a random activity
    const activitiesList = ['New Order', 'Farmer Registration', 'Payment Received', 'Support Ticket', 'Product Listing'];
    const users = ['Farmer', 'Business', 'Consumer', 'System'];
    const newActivity = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userType: users[Math.floor(Math.random() * users.length)],
      activity: activitiesList[Math.floor(Math.random() * activitiesList.length)],
      details: 'Automated update from system',
      status: 'completed',
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50));
  };

  const logout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      showLoading(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }
  };

  // ---------- Table Columns ----------
  const activitiesColumns = [
    { name: 'Time', selector: row => row.time, sortable: true },
    { name: 'User Type', selector: row => row.userType, sortable: true },
    { name: 'Activity', selector: row => row.activity, sortable: true },
    { name: 'Details', selector: row => row.details, sortable: true },
    {
      name: 'Status',
      selector: row => row.status,
      cell: row => <span className={`status-badge status-${row.status}`}>{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</span>,
    },
  ];

  const approvalsColumns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'User', selector: row => row.user, sortable: true },
    { name: 'Type', selector: row => row.type, sortable: true },
    { name: 'Request', selector: row => row.request, sortable: true },
    { name: 'Submitted', selector: row => row.submitted, sortable: true },
    {
      name: 'Action',
      cell: row => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <button className="btn btn-primary btn-sm" onClick={() => approveRequest(row.id)}>
            <i className="fas fa-check"></i>
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => rejectRequest(row.id)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      ),
    },
  ];

  const farmersColumns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Location', selector: row => row.location, sortable: true },
    { name: 'Crops', selector: row => row.crops, sortable: true },
    { name: 'Total Sales', selector: row => row.totalSales, sortable: true },
    { name: 'Rating', selector: row => row.rating, sortable: true },
    {
      name: 'Status',
      selector: row => row.status,
      cell: row => <span className={`status-badge status-${row.status}`}>{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</span>,
    },
    {
      name: 'Actions',
      cell: row => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => viewFarmer(row.id)}><i className="fas fa-eye"></i></button>
          <button className="btn btn-primary btn-sm" onClick={() => editFarmer(row.id)}><i className="fas fa-edit"></i></button>
          <button className="btn btn-danger btn-sm" onClick={() => deleteFarmer(row.id)}><i className="fas fa-trash"></i></button>
        </div>
      ),
    },
  ];

  const buyersColumns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Business Name', selector: row => row.name, sortable: true },
    { name: 'Contact', selector: row => row.contact, sortable: true },
    { name: 'Type', selector: row => row.type, sortable: true },
    { name: 'Monthly Spend', selector: row => row.monthlySpend, sortable: true },
    { name: 'Orders', selector: row => row.orders, sortable: true },
    {
      name: 'Status',
      selector: row => row.status,
      cell: row => <span className={`status-badge status-${row.status}`}>{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</span>,
    },
    {
      name: 'Actions',
      cell: row => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => viewBuyer(row.id)}><i className="fas fa-eye"></i></button>
          <button className="btn btn-primary btn-sm" onClick={() => editBuyer(row.id)}><i className="fas fa-edit"></i></button>
        </div>
      ),
    },
  ];

  // ---------- JSX ----------
  return (
    <div className="admin-dashboard">
      {/* Alert */}
      {alert.show && (
        <div className={`alert alert-${alert.type} active`}>{alert.message}</div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-spinner active">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarActive ? 'active' : ''}`}>
          <div className="sidebar-header">
            <div className="admin-logo"><i className="fas fa-user-shield"></i></div>
            <div className="admin-name">Admin User</div>
            <div className="admin-role">Super Administrator</div>
          </div>
          <nav className="sidebar-menu">
            {[
              { section: 'dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard', badge: null },
              { section: 'farmers', icon: 'fa-tractor', label: 'Farmers Management', badge: farmers.filter(f => f.status === 'pending').length },
              { section: 'buyers', icon: 'fa-building', label: 'Buyers Management', badge: buyers.filter(b => b.status === 'pending').length },
              { section: 'consumers', icon: 'fa-users', label: 'Consumers Management', badge: null },
              { section: 'orders', icon: 'fa-shopping-cart', label: 'Orders & Transactions', badge: orders.filter(o => o.status === 'pending').length },
              { section: 'products', icon: 'fa-seedling', label: 'Products & Listings', badge: null },
              { section: 'payments', icon: 'fa-credit-card', label: 'Payments & Settlements', badge: null },
              { section: 'logistics', icon: 'fa-truck', label: 'Logistics & Delivery', badge: null },
              { section: 'reports', icon: 'fa-chart-bar', label: 'Analytics & Reports', badge: null },
              { section: 'support', icon: 'fa-headset', label: 'Support & Tickets', badge: support.filter(t => t.status === 'open').length },
              { section: 'settings', icon: 'fa-cog', label: 'System Settings', badge: null },
            ].map(item => (
              <a
                key={item.section}
                href="#"
                className={`menu-item ${currentSection === item.section ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); loadSection(item.section); }}
              >
                <i className={`fas ${item.icon}`}></i>
                <span>{item.label}</span>
                {item.badge > 0 && <span className="menu-badge">{item.badge}</span>}
              </a>
            ))}
            <div className="menu-item logout-btn" onClick={logout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Top Bar */}
          <div className="top-bar">
            <button className="toggle-sidebar" onClick={() => setSidebarActive(!sidebarActive)}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search farmers, orders, reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {showSearchResults && searchResults.length > 0 && (
                <div className="search-results active">
                  {searchResults.map((res, idx) => (
                    <div key={idx} className="search-result-item" onClick={() => res.action()}>
                      <div style={{ fontWeight: 600 }}>{safeRender(res.name)}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                        {safeRender(res.type)} • {safeRender(res.id)}
                      </div>
                      <div style={{ fontSize: '12px' }}>{safeRender(res.detail)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="top-bar-actions">
              <div className="notification" onClick={() => loadSection('notifications')}>
                <i className="fas fa-bell"></i>
                <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
              </div>
              <div className="notification">
                <i className="fas fa-envelope"></i>
                <span className="notification-badge">3</span>
              </div>
              <div className="user-profile">
                <div className="user-avatar"><i className="fas fa-user"></i></div>
                <div>
                  <div style={{ fontWeight: 600 }}>Admin User</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Super Admin</div>
                </div>
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>

          {/* Content Wrapper */}
          <div className="content-wrapper">
            {/* Dashboard Section */}
            {currentSection === 'dashboard' && (
              <div className="section-content active">
                <div className="page-header">
                  <h1 className="page-title">Admin Dashboard</h1>
                  <p className="page-subtitle">Monitor all insights of Farmers, Buyers and Consumers at one place</p>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-header">
                      <div className="stat-title">Total Farmers</div>
                      <div className="stat-icon"><i className="fas fa-tractor"></i></div>
                    </div>
                    <div className="stat-number">{stats.totalFarmers.toLocaleString()}</div>
                    <div className="stat-change positive"><i className="fas fa-arrow-up"></i> 12% from last month</div>
                  </div>
                  <div className="stat-card blue">
                    <div className="stat-header">
                      <div className="stat-title">Business Buyers</div>
                      <div className="stat-icon"><i className="fas fa-building"></i></div>
                    </div>
                    <div className="stat-number">{stats.totalBuyers.toLocaleString()}</div>
                    <div className="stat-change positive"><i className="fas fa-arrow-up"></i> 8% from last month</div>
                  </div>
                  <div className="stat-card orange">
                    <div className="stat-header">
                      <div className="stat-title">Active Consumers</div>
                      <div className="stat-icon"><i className="fas fa-users"></i></div>
                    </div>
                    <div className="stat-number">{stats.totalConsumers.toLocaleString()}</div>
                    <div className="stat-change positive"><i className="fas fa-arrow-up"></i> 15% from last month</div>
                  </div>
                  <div className="stat-card red">
                    <div className="stat-header">
                      <div className="stat-title">Pending Orders</div>
                      <div className="stat-icon"><i className="fas fa-shopping-cart"></i></div>
                    </div>
                    <div className="stat-number">{stats.pendingOrders}</div>
                    <div className="stat-change negative"><i className="fas fa-arrow-down"></i> 5% from yesterday</div>
                  </div>
                  <div className="stat-card yellow">
                    <div className="stat-header">
                      <div className="stat-title">Today's Revenue</div>
                      <div className="stat-icon"><i className="fas fa-rupee-sign"></i></div>
                    </div>
                    <div className="stat-number">{stats.todayRevenue}</div>
                    <div className="stat-change positive"><i className="fas fa-arrow-up"></i> 22% from yesterday</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions-grid">
                  {[
                    { icon: 'fa-user-plus', title: 'Add New Farmer', desc: 'Register new farmer with verification', action: () => openModal('addFarmer') },
                    { icon: 'fa-check-circle', title: 'Verify Business Buyer', desc: 'Approve business registration', action: () => openModal('verifyBuyer') },
                    { icon: 'fa-hand-holding-usd', title: 'Issue Refund', desc: 'Process customer refunds', action: () => openModal('issueRefund') },
                    { icon: 'fa-bullhorn', title: 'Send Broadcast', desc: 'Send notification to all users', action: () => openModal('sendNotification') },
                    { icon: 'fa-file-export', title: 'Generate Report', desc: 'Export data analytics', action: generateReport },
                    { icon: 'fa-sliders-h', title: 'System Settings', desc: 'Update platform configuration', action: () => openModal('systemSettings') },
                  ].map((act, idx) => (
                    <div key={idx} className="action-card" onClick={act.action}>
                      <div className="action-icon"><i className={`fas ${act.icon}`}></i></div>
                      <div className="action-title">{act.title}</div>
                      <div className="action-desc">{act.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Charts Grid */}
                <div className="charts-grid">
                  <div className="chart-card">
                    <div className="chart-header">
                      <div className="chart-title">User Growth Analysis</div>
                      <div className="chart-controls">
                        <select onChange={(e) => console.log('Period changed', e.target.value)}>
                          <option value="monthly">Monthly</option>
                          <option value="weekly">Weekly</option>
                          <option value="daily">Daily</option>
                        </select>
                      </div>
                    </div>
                    <div className="chart-container">
                      <canvas ref={growthChartRef}></canvas>
                    </div>
                  </div>
                  <div className="chart-card">
                    <div className="chart-header">
                      <div className="chart-title">Revenue Distribution</div>
                      <div className="chart-controls">
                        <select onChange={(e) => console.log('Period changed', e.target.value)}>
                          <option value="monthly">This Month</option>
                          <option value="quarterly">This Quarter</option>
                          <option value="yearly">This Year</option>
                        </select>
                      </div>
                    </div>
                    <div className="chart-container">
                      <canvas ref={revenueChartRef}></canvas>
                    </div>
                  </div>
                  <div className="chart-card">
                    <div className="chart-header">
                      <div className="chart-title">Top Crop Categories</div>
                      <div className="chart-controls">
                        <select onChange={(e) => console.log('Period changed', e.target.value)}>
                          <option value="current">Current Month</option>
                          <option value="previous">Previous Month</option>
                        </select>
                      </div>
                    </div>
                    <div className="chart-container">
                      <canvas ref={cropChartRef}></canvas>
                    </div>
                  </div>
                  <div className="chart-card">
                    <div className="chart-header">
                      <div className="chart-title">Regional Distribution</div>
                      <div className="chart-controls">
                        <select onChange={(e) => console.log('Region changed', e.target.value)}>
                          <option value="all">All Regions</option>
                          <option value="north">North India</option>
                          <option value="south">South India</option>
                        </select>
                      </div>
                    </div>
                    <div className="chart-container">
                      <canvas ref={regionChartRef}></canvas>
                    </div>
                  </div>
                </div>

                {/* Recent Activities Table */}
                <div className="data-table-card active">
                  <div className="table-header">
                    <h3>Recent Activities</h3>
                    <div className="table-actions">
                      <button className="btn btn-secondary" onClick={() => showAlert('Filter clicked', 'info')}>
                        <i className="fas fa-filter"></i> Filter
                      </button>
                      <button className="btn btn-secondary" onClick={() => exportData('activities', 'csv')}>
                        <i className="fas fa-download"></i> Export
                      </button>
                    </div>
                  </div>
                  <DataTable
                    columns={activitiesColumns}
                    data={activities}
                    pagination
                    paginationPerPage={10}
                    highlightOnHover
                    striped
                  />
                </div>

                {/* Pending Approvals Table */}
                <div className="data-table-card active">
                  <div className="table-header">
                    <h3>Pending Approvals</h3>
                    <div className="table-actions">
                      <button className="btn btn-primary" onClick={() => { pendingApprovals.forEach(r => approveRequest(r.id)); }}>
                        <i className="fas fa-check"></i> Approve All
                      </button>
                      <button className="btn btn-danger" onClick={() => { pendingApprovals.forEach(r => rejectRequest(r.id)); }}>
                        <i className="fas fa-times"></i> Reject All
                      </button>
                    </div>
                  </div>
                  <DataTable
                    columns={approvalsColumns}
                    data={pendingApprovals}
                    pagination
                    paginationPerPage={5}
                    highlightOnHover
                    striped
                  />
                </div>
              </div>
            )}

            {/* Farmers Section */}
            {currentSection === 'farmers' && (
              <div className="section-content active">
                <div className="page-header">
                  <h1 className="page-title">Farmers Management</h1>
                  <p className="page-subtitle">Manage farmer registrations, verifications, and activities</p>
                </div>
                <div className="data-table-card active">
                  <div className="table-header">
                    <h3>All Farmers</h3>
                    <div className="table-actions">
                      <button className="btn btn-primary" onClick={() => openModal('addFarmer')}>
                        <i className="fas fa-user-plus"></i> Add Farmer
                      </button>
                      <button className="btn btn-secondary" onClick={() => exportData('farmers', 'csv')}>
                        <i className="fas fa-download"></i> Export
                      </button>
                    </div>
                  </div>
                  <DataTable
                    columns={farmersColumns}
                    data={farmers}
                    pagination
                    paginationPerPage={10}
                    highlightOnHover
                    striped
                  />
                </div>
              </div>
            )}

            {/* Buyers Section */}
            {currentSection === 'buyers' && (
              <div className="section-content active">
                <div className="page-header">
                  <h1 className="page-title">Business Buyers Management</h1>
                  <p className="page-subtitle">Monitor business buyers, orders, and transactions</p>
                </div>
                <div className="data-table-card active">
                  <div className="table-header">
                    <h3>All Business Buyers</h3>
                    <div className="table-actions">
                      <button className="btn btn-primary" onClick={() => openModal('verifyBuyer')}>
                        <i className="fas fa-check-circle"></i> Verify Buyer
                      </button>
                      <button className="btn btn-secondary" onClick={() => exportData('buyers', 'csv')}>
                        <i className="fas fa-download"></i> Export
                      </button>
                    </div>
                  </div>
                  <DataTable
                    columns={buyersColumns}
                    data={buyers}
                    pagination
                    paginationPerPage={10}
                    highlightOnHover
                    striped
                  />
                </div>
              </div>
            )}

            {/* Other sections - simplified */}
            {currentSection !== 'dashboard' && currentSection !== 'farmers' && currentSection !== 'buyers' && (
              <div className="section-content active">
                <div className="page-header">
                  <h1 className="page-title">{currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}</h1>
                  <p className="page-subtitle">Content for {currentSection} section</p>
                </div>
                <div className="user-detail-card">
                  <p>This section is under development. Full functionality coming soon.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}

      {/* Add Farmer Modal */}
      {modals.addFarmer && (
        <div className="modal active" onClick={() => closeModal('addFarmer')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Farmer</h3>
              <button className="close-modal" onClick={() => closeModal('addFarmer')}>&times;</button>
            </div>
            <div className="modal-body">
              <form ref={addFarmerFormRef} onSubmit={addNewFarmer}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" className="form-control" name="farmerName" required />
                </div>
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input type="tel" className="form-control" name="farmerMobile" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-control" name="farmerEmail" />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <select className="form-control" name="farmerState" required>
                    <option value="">Select State</option>
                    <option>Punjab</option>
                    <option>Maharashtra</option>
                    <option>Gujarat</option>
                    <option>Uttar Pradesh</option>
                    <option>Madhya Pradesh</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>District *</label>
                  <input type="text" className="form-control" name="farmerDistrict" required />
                </div>
                <div className="form-group">
                  <label>Crops Grown *</label>
                  <input type="text" className="form-control" name="farmerCrops" placeholder="Wheat, Rice, Vegetables" required />
                </div>
                <div className="form-group">
                  <label>Farm Size (Acres)</label>
                  <input type="number" className="form-control" name="farmSize" step="0.1" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <i className="fas fa-save"></i> Register Farmer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Verify Buyer Modal */}
      {modals.verifyBuyer && (
        <div className="modal active" onClick={() => closeModal('verifyBuyer')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Verify Business Buyer</h3>
              <button className="close-modal" onClick={() => closeModal('verifyBuyer')}>&times;</button>
            </div>
            <div className="modal-body">
              <form ref={verifyBuyerFormRef} onSubmit={verifyBusinessBuyer}>
                <div className="form-group">
                  <label>Business Name *</label>
                  <input type="text" className="form-control" name="businessName" required />
                </div>
                <div className="form-group">
                  <label>GST Number *</label>
                  <input type="text" className="form-control" name="gstNumber" required />
                </div>
                <div className="form-group">
                  <label>Business Type *</label>
                  <select className="form-control" name="businessType" required>
                    <option value="">Select Type</option>
                    <option>Restaurant</option>
                    <option>Hotel</option>
                    <option>Retail Store</option>
                    <option>Wholesaler</option>
                    <option>Processing Unit</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Monthly Procurement (₹) *</label>
                  <input type="number" className="form-control" name="monthlyProcurement" required />
                </div>
                <div className="form-group">
                  <label>Contact Person *</label>
                  <input type="text" className="form-control" name="contactPerson" required />
                </div>
                <div className="form-group">
                  <label>Contact Number *</label>
                  <input type="tel" className="form-control" name="contactNumber" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <i className="fas fa-check-circle"></i> Verify & Approve
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Issue Refund Modal */}
      {modals.issueRefund && (
        <div className="modal active" onClick={() => closeModal('issueRefund')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Issue Refund</h3>
              <button className="close-modal" onClick={() => closeModal('issueRefund')}>&times;</button>
            </div>
            <div className="modal-body">
              <form ref={refundFormRef} onSubmit={processRefund}>
                <div className="form-group">
                  <label>Order ID *</label>
                  <input type="text" className="form-control" name="orderId" required />
                </div>
                <div className="form-group">
                  <label>Refund Amount (₹) *</label>
                  <input type="number" className="form-control" name="refundAmount" required />
                </div>
                <div className="form-group">
                  <label>Refund Reason *</label>
                  <select className="form-control" name="refundReason" required>
                    <option value="">Select Reason</option>
                    <option value="quality">Quality Issue</option>
                    <option value="delay">Delivery Delay</option>
                    <option value="damage">Damaged Goods</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea className="form-control" name="refundNotes" rows="3"></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <i className="fas fa-hand-holding-usd"></i> Process Refund
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      {modals.sendNotification && (
        <div className="modal active" onClick={() => closeModal('sendNotification')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Broadcast Notification</h3>
              <button className="close-modal" onClick={() => closeModal('sendNotification')}>&times;</button>
            </div>
            <div className="modal-body">
              <form ref={notificationFormRef} onSubmit={sendNotification}>
                <div className="form-group">
                  <label>Notification Type *</label>
                  <select className="form-control" name="notificationType" required>
                    <option value="">Select Type</option>
                    <option value="all">All Users</option>
                    <option value="farmers">Farmers Only</option>
                    <option value="buyers">Business Buyers Only</option>
                    <option value="consumers">Consumers Only</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input type="text" className="form-control" name="notificationSubject" required />
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea className="form-control" name="notificationMessage" rows="5" required></textarea>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select className="form-control" name="notificationPriority">
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <i className="fas fa-paper-plane"></i> Send Notification
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* System Settings Modal */}
      {modals.systemSettings && (
        <div className="modal active" onClick={() => closeModal('systemSettings')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>System Settings</h3>
              <button className="close-modal" onClick={() => closeModal('systemSettings')}>&times;</button>
            </div>
            <div className="modal-body">
              <form ref={settingsFormRef} onSubmit={saveSystemSettings}>
                <div className="form-group">
                  <label>Platform Commission (%)</label>
                  <input type="number" className="form-control" name="platformCommission" min="0" max="20" step="0.1" defaultValue="5" />
                </div>
                <div className="form-group">
                  <label>Farmer Payment Delay (Hours)</label>
                  <input type="number" className="form-control" name="paymentDelay" min="1" max="72" defaultValue="24" />
                </div>
                <div className="form-group">
                  <label>Minimum Order Value (₹)</label>
                  <input type="number" className="form-control" name="minOrderValue" min="0" defaultValue="500" />
                </div>
                <div className="form-group">
                  <label>Enable Automatic Farmer Verification</label>
                  <select className="form-control" name="autoVerification">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Default Notification Language</label>
                  <select className="form-control" name="defaultLanguage">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <i className="fas fa-save"></i> Save Settings
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;