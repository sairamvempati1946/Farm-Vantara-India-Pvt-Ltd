import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import html2pdf from 'html2pdf.js';
import { supabase } from '../supabaseClient';
import '../styles/FarmerDashboard.css';
import logo from '../assets/logo.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const FarmerDashboard = () => {
  const [farmerInfo, setFarmerInfo] = useState({
    id: '',
    name: '',
    farmName: '',
    location: '',
    phone: '',
    email: ''
  });

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!farmerInfo.id) {
      showNotification('Farmer profile not loaded yet. Please wait a moment.');
      return;
    }

    const productPayload = {
      farmer_id: farmerInfo.id,
      name: productForm.name,
      category: productForm.category,
      quantity: parseFloat(productForm.quantity),
      price: parseFloat(productForm.price),
      description: productForm.description,
      image_url: currentImageData
    };

    if (editingProductId) {
      // ✅ Update existing product
      const { data, error } = await supabase
        .from('products')
        .update(productPayload)
        .eq('id', editingProductId)
        .select();

      if (!error && data && data.length > 0) {
        const updatedProduct = {
          ...data[0],
          imageData: data[0].image_url
        };
        setProducts(prev => prev.map(p => p.id === editingProductId ? updatedProduct : p));
        showNotification('Product updated!');
        clearProductForm();
        setActiveSection('products');
      } else {
        console.error(error);
        showNotification('Error updating product');
      }
    } else {
      // ✅ Insert new product
      const { data, error } = await supabase
        .from('products')
        .insert([productPayload])
        .select();

      if (!error && data && data.length > 0) {
        const newProduct = {
          ...data[0],
          imageData: data[0].image_url
        };
        setProducts(prev => [...prev, newProduct]);
        showNotification('Product added!');
        clearProductForm();
        setActiveSection('products');
      } else {
        console.error(error);
        showNotification('Error adding product');
      }
    }
  };


  const updateOrderStatus = async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const oldStatus = order.status;
    const isStockDeductedStatus = (status) => ['confirmed', 'shipped', 'delivered'].includes(status);
    const wasDeducted = isStockDeductedStatus(oldStatus);
    const isDeducted = isStockDeductedStatus(newStatus);

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );

      if (wasDeducted !== isDeducted) {
        const product = products.find(p => p.name.toLowerCase() === order.product.toLowerCase());
        if (product) {
          let updatedQuantity = product.quantity;
          if (isDeducted && !wasDeducted) {
            updatedQuantity = Math.max(0, product.quantity - order.quantity);
          } else if (!isDeducted && wasDeducted) {
            updatedQuantity = product.quantity + order.quantity;
          }

          const { error: prodErr } = await supabase
            .from('products')
            .update({ quantity: updatedQuantity })
            .eq('id', product.id);

          if (!prodErr) {
            setProducts(prev =>
              prev.map(p => p.id === product.id ? { ...p, quantity: updatedQuantity } : p)
            );
            showNotification(`Stock updated for ${product.name}!`);
          } else {
            console.error('Error updating product stock:', prodErr);
          }
        }
      }

      showNotification('Order status updated!');
      setShowOrderActionModal(false);
    } else {
      showNotification('Error updating order status');
    }
  };

  const [products, setProducts] = useState([]);

  const [orders, setOrders] = useState([]);

  // Consolidated loading of farmer info, products and orders on mount
  useEffect(() => {
    const initDashboard = async () => {
      try {
        const userStr = localStorage.getItem('farmvantara_user') || sessionStorage.getItem('farmvantara_user');
        if (!userStr || userStr === "undefined" || userStr === "null") {
          window.location.href = "/login";
          return;
        }
        const sessionUser = JSON.parse(userStr);

        // 1. Fetch farmer details using sessionUser.id (auth.users)
        const { data: farmerData, error: farmerError } = await supabase
          .from('farmers')
          .select('*')
          .eq('user_id', sessionUser.id)
          .single();

        if (farmerError) {
          console.error('Error fetching farmer profile:', farmerError);
          showNotification('Failed to fetch farmer profile. Please try logging in again.');
          return;
        }

        if (farmerData) {
          setFarmerInfo({
            id: farmerData.id,
            name: farmerData.full_name,
            farmName: farmerData.farm_name,
            location: farmerData.state,
            phone: farmerData.phone,
            email: farmerData.email
          });

          // 2. Fetch products using farmerData.id (farmers primary key)
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('farmer_id', farmerData.id);

          if (productsError) {
            console.error('Error fetching products:', productsError);
          } else if (productsData) {
            // Map image_url from database to imageData for UI rendering
            const mappedProducts = productsData.map(p => ({
              ...p,
              imageData: p.image_url
            }));
            setProducts(mappedProducts);
          }

          // 3. Fetch orders using farmerData.id
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('farmer_id', farmerData.id);

          if (ordersError) {
            console.error('Error fetching orders:', ordersError);
          } else if (ordersData) {
            const sortedOrders = [...ordersData].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
            const mappedOrders = sortedOrders.map((o, idx) => ({
              ...o,
              displayId: 'ORD - ' + String(idx + 1).padStart(3, '0'),
              date: o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
            }));
            setOrders(mappedOrders);
          }

          // 4. Fetch registered buyers from businesses
          const { data: businessesData, error: businessesError } = await supabase
            .from('businesses')
            .select('*');

          if (businessesError) {
            console.error('Error fetching businesses:', businessesError);
          } else if (businessesData) {
            const mappedBuyers = businessesData.map(b => {
              const interestProducts = b.preferred_crops 
                ? b.preferred_crops.split(',').map(s => s.trim()).filter(Boolean)
                : ['Organic Vegetables', 'Tomatoes', 'Potatoes'];
              const qty = b.monthly_requirement || 500;
              return {
                id: b.id,
                name: b.business_name || b.full_name || 'Verified Buyer',
                type: b.business_type || 'retailer',
                phone: b.phone || '9876543210',
                email: b.email,
                location: b.state || 'Delhi',
                established: b.created_at ? new Date(b.created_at).getFullYear() : 2024,
                rating: 4.8,
                totalOrders: 25,
                verified: true,
                trustBadge: 'verified',
                interestProducts: interestProducts,
                preferredProducts: interestProducts,
                requirementVolume: `${qty} kg/month`,
                budget: `₹${(qty * 40).toLocaleString('en-IN')}/month`,
                lookingFor: `Looking for premium quality suppliers of ${interestProducts.join(', ')}`
              };
            });
            setRegisteredBuyers(mappedBuyers);

            // Fetch live pitches sent by this farmer from Supabase
            const { data: pitchesData, error: pitchesError } = await supabase
              .from('pitches')
              .select('*')
              .eq('farmer_id', farmerData.id);

            if (pitchesError) {
              console.error('Error fetching pitches:', pitchesError);
            } else if (pitchesData) {
              const sortedPitches = [...pitchesData].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
              const mappedPitches = sortedPitches.map((p, idx) => {
                const buyer = mappedBuyers.find(b => b.id === p.buyer_id);
                return {
                  id: p.id,
                  displayId: 'PIT - ' + String(idx + 1).padStart(3, '0'),
                  buyerId: p.buyer_id,
                  buyerName: buyer ? buyer.name : 'Verified Buyer',
                  productName: p.product_name || 'Produce offer',
                  quantity: parseFloat(p.quantity) || 0,
                  price: parseFloat(p.price) || 0,
                  total: (parseFloat(p.quantity) || 0) * (parseFloat(p.price) || 0),
                  message: p.message || '',
                  delivery: p.delivery || 'Within 3 days',
                  status: p.status || 'pending',
                  date: p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
                };
              });
              setFarmerPitches(mappedPitches);
            }
          }
        }
      } catch (err) {
        console.error('Error initializing dashboard:', err);
      }
    };

    initDashboard();
  }, []);

  // Update browser document/tab title dynamically
  useEffect(() => {
    if (farmerInfo.farmName) {
      document.title = `${farmerInfo.farmName} | Farmer Dashboard`;
    } else if (farmerInfo.name) {
      document.title = `${farmerInfo.name} | Farmer Dashboard`;
    } else {
      document.title = "Farmer Dashboard";
    }
  }, [farmerInfo]);

  // Registered Buyers
  const [registeredBuyers, setRegisteredBuyers] = useState([]);

  // Pitches State
  const [farmerPitches, setFarmerPitches] = useState([]);

  // UI State
  const [activeSection, setActiveSection] = useState('overview');
  const [currentImageData, setCurrentImageData] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all');
  const [pitchStatusFilter, setPitchStatusFilter] = useState('all');
  const [buyerProductFilter, setBuyerProductFilter] = useState('all');
  const [buyerLocationFilter, setBuyerLocationFilter] = useState('all');
  const [reportFromDate, setReportFromDate] = useState('');
  const [reportToDate, setReportToDate] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBuyerDetailsModal, setShowBuyerDetailsModal] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [showOrderActionModal, setShowOrderActionModal] = useState(false);
  const [showPitchDetailsModal, setShowPitchDetailsModal] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockUpdateProduct, setStockUpdateProduct] = useState(null);
  const [newStockQuantity, setNewStockQuantity] = useState('');
  const [pitchForm, setPitchForm] = useState({
    buyerId: '',
    buyerName: '',
    productId: '',
    quantity: '',
    price: '',
    message: '',
    delivery: 'Within 3 days'
  });

  // Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    description: ''
  });

  // Sales Data
  const salesDataByPeriod = {
    '7': [12500, 13800, 14200, 15800, 16500, 17200, 18900],
    '30': [12500, 13800, 14200, 15800, 16500, 17200, 18900, 19500, 20200, 21500, 22800, 23500, 24200, 25800, 26500, 27200, 28500, 29800, 30500, 31200, 32500, 33800, 34500, 35200, 36500, 37800, 38500, 39200, 40500, 41800],
    '90': Array.from({ length: 90 }, () => Math.floor(Math.random() * 20000) + 10000)
  };
  const [salesPeriod, setSalesPeriod] = useState('30');
  const [filteredOrders, setFilteredOrders] = useState(orders);

  // Helper Functions
  const formatCurrency = (amt) => `₹${amt.toLocaleString('en-IN')}`;
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN');
  const getStatusClass = (qty) => { if (qty >= 200) return 'available'; if (qty >= 50) return 'low'; return 'out'; };
  const getStatusText = (qty) => { if (qty >= 200) return 'Available'; if (qty >= 50) return 'Low Stock'; return 'Out of Stock'; };
  const getOrderStatusClass = (status) => `order-status-${status}`;
  const isFinalStatus = (status) => status === 'delivered' || status === 'cancelled';
  const getProductIcon = (cat) => { const icons = { 'grains': 'fa-wheat-alt', 'vegetables': 'fa-carrot', 'fruits': 'fa-apple-alt', 'pulses': 'fa-seedling' }; return icons[cat] || 'fa-seedling'; };

  const showNotification = (msg) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-check-circle" style="color:var(--primary-green);margin-right:10px;"></i>${msg}`;
    document.getElementById('notificationsContainer')?.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Update filtered orders
  useEffect(() => {
    if (orderFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.status === orderFilter));
    }
  }, [orderFilter, orders]);

  // Sales Chart Data
  const salesChartData = {
    labels: salesPeriod === '7' ? ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'] :
      salesPeriod === '30' ? Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`) :
        Array.from({ length: 90 }, (_, i) => `Day ${i + 1}`),
    datasets: [{
      label: 'Daily Sales (₹)',
      data: salesDataByPeriod[salesPeriod],
      borderColor: '#27ae60',
      backgroundColor: 'rgba(39,174,96,0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const productChartData = {
    labels: products.map(p => p.name),
    datasets: [{
      data: products.map(p => p.quantity),
      backgroundColor: ['#27ae60', '#f2c94c', '#f2994a', '#2d9cdb']
    }]
  };

  // Overview Stats
  const revenueOrders = orders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status));
  const totalRevenue = revenueOrders.reduce((s, o) => s + o.amount, 0);
  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status)).length;
  const totalStock = products.reduce((s, p) => s + p.quantity, 0);
  const avgOrderValue = revenueOrders.length > 0 ? Math.round(totalRevenue / revenueOrders.length) : 0;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const completionRate = orders.length > 0 ? ((completedOrders / orders.length) * 100).toFixed(1) : '0.0';


  const clearProductForm = () => {
    setProductForm({ name: '', category: '', quantity: '', price: '', description: '' });
    setCurrentImageData(null);
    setEditingProductId(null);
  };

  const editProduct = (product) => {
    setProductForm({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      description: product.description || ''
    });
    setCurrentImageData(product.imageData);
    setEditingProductId(product.id);
    setActiveSection('list');
  };

  const previewImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setCurrentImageData(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Stock Functions
  const openStockUpdate = (product) => {
    setStockUpdateProduct(product);
    setNewStockQuantity(product.quantity);
    setShowStockUpdateModal(true);
  };

  const updateStock = async () => {
    if (stockUpdateProduct) {
      const { error } = await supabase
        .from('products')
        .update({ quantity: parseFloat(newStockQuantity) })
        .eq('id', stockUpdateProduct.id);

      if (!error) {
        setProducts(products.map(p =>
          p.id === stockUpdateProduct.id
            ? { ...p, quantity: parseFloat(newStockQuantity) }
            : p
        ));
        showNotification(`${stockUpdateProduct.name} stock updated!`);
      } else {
        console.error(error);
        showNotification('Error updating stock');
      }
      setShowStockUpdateModal(false);
      setStockUpdateProduct(null);
    }
  };


  // Buyer Marketplace Functions
  const getFilteredBuyers = () => {
    return registeredBuyers.filter(b => {
      if (buyerLocationFilter !== 'all' && b.location !== buyerLocationFilter) return false;
      if (buyerProductFilter !== 'all') {
        const isInterested = b.interestProducts.some(p =>
          p.toLowerCase().includes(buyerProductFilter.toLowerCase()) ||
          buyerProductFilter.toLowerCase().includes(p.toLowerCase())
        ) || (b.preferredProducts && b.preferredProducts.includes('All products'));
        if (!isInterested) return false;
      }
      return true;
    });
  };

  // Pitch Functions
  const openPitchModal = (buyer) => {
    setSelectedBuyer(buyer);
    setPitchForm({
      buyerId: buyer.id,
      buyerName: buyer.name,
      productId: '',
      quantity: '',
      price: '',
      message: `Hello, I'm ${farmerInfo.name} from ${farmerInfo.farmName} in ${farmerInfo.location}. We grow high-quality organic produce. Looking forward to a long-term partnership.`,
      delivery: 'Within 3 days'
    });
    setShowPitchModal(true);
  };

  const updatePitchPrice = (productId) => {
    const product = products.find(p => p.id === productId);
    setPitchForm(prev => ({
      ...prev,
      productId: productId,
      price: product ? product.price : ''
    }));
  };

  const calculatePitchTotal = () => {
    const qty = parseFloat(pitchForm.quantity) || 0;
    const price = parseFloat(pitchForm.price) || 0;
    return formatCurrency(qty * price);
  };

  const submitPitch = async (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === pitchForm.productId);
    if (!product) {
      showNotification('Product not found!');
      return;
    }

    try {
      const { data: insertedData, error: insErr } = await supabase
        .from('pitches')
        .insert([{
          farmer_id: farmerInfo.id,
          buyer_id: pitchForm.buyerId,
          farmer_name: farmerInfo.name || 'Verified Farmer',
          product_name: product.name,
          quantity: parseFloat(pitchForm.quantity),
          price: parseFloat(pitchForm.price),
          message: pitchForm.message,
          status: 'pending'
        }])
        .select()
        .single();

      if (insErr) throw insErr;

      const newPitch = {
        id: insertedData.id,
        displayId: 'PIT - ' + String(farmerPitches.length + 1).padStart(3, '0'),
        buyerId: pitchForm.buyerId,
        buyerName: pitchForm.buyerName,
        productId: pitchForm.productId,
        productName: product.name,
        quantity: parseFloat(pitchForm.quantity),
        price: parseFloat(pitchForm.price),
        total: parseFloat(pitchForm.quantity) * parseFloat(pitchForm.price),
        message: pitchForm.message,
        delivery: pitchForm.delivery,
        status: 'pending',
        date: insertedData.created_at ? insertedData.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
      };

      setFarmerPitches([...farmerPitches, newPitch]);
      showNotification(`Pitch sent to ${pitchForm.buyerName}!`);
      setShowPitchModal(false);
    } catch (err) {
      console.error("Error inserting pitch:", err);
      showNotification(`Failed to send pitch: ${err.message || 'Check connection'}`);
    }
  };

  const handlePitchAgain = (pitch) => {
    const buyer = registeredBuyers.find(b => b.id === pitch.buyerId);
    const targetBuyer = buyer || {
      id: pitch.buyerId,
      name: pitch.buyerName
    };
    openPitchModal(targetBuyer);
  };



  // Report Functions
  const getFilteredReportOrders = () => {
    if (reportFromDate && reportToDate) {
      return orders.filter(o => {
        const od = new Date(o.date);
        return od >= new Date(reportFromDate) && od <= new Date(reportToDate);
      });
    }
    return orders;
  };

  const renderReportPreview = () => {
    const reportOrders = getFilteredReportOrders();
    const activeReportOrders = reportOrders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status));
    const rev = activeReportOrders.reduce((s, o) => s + o.amount, 0);
    const tot = reportOrders.length;
    const qty = activeReportOrders.reduce((s, o) => s + o.quantity, 0);
    const avg = activeReportOrders.length > 0 ? Math.round(rev / activeReportOrders.length) : 0;
    const comp = reportOrders.filter(o => o.status === 'delivered').length;
    const pend = reportOrders.filter(o => o.status === 'pending').length;
    const rate = tot > 0 ? ((comp / tot) * 100).toFixed(1) : 0;
    const activeBuyers = registeredBuyers.length;

    const prodSales = {};
    activeReportOrders.forEach(o => {
      if (!prodSales[o.product]) prodSales[o.product] = { qty: 0, rev: 0 };
      prodSales[o.product].qty += o.quantity;
      prodSales[o.product].rev += o.amount;
    });

    return (
      <div className="report-preview" style={{ position: 'relative', padding: '25px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
        {/* Top Right Corner Brand Logo */}
        <div style={{ position: 'absolute', top: '25px', right: '25px' }}>
          <img
            src={logo}
            alt="Farm Vantara Logo"
            style={{ height: '40px', width: 'auto' }}
          />
        </div>

        <div className="report-header" style={{ paddingRight: '180px', marginBottom: '20px' }}>
          <h2>{farmerInfo.farmName} - Sales Report</h2>
          <p>Generated: {new Date().toLocaleString()}</p>
          <p>Period: {reportFromDate && reportToDate ? `${formatDate(reportFromDate)} to ${formatDate(reportToDate)}` : 'All Time'}</p>
        </div>
        <div className="report-summary">
          <div className="report-summary-card"><h4>Total Revenue</h4><div className="value">{formatCurrency(rev)}</div></div>
          <div className="report-summary-card"><h4>Total Orders</h4><div className="value">{tot}</div></div>
          <div className="report-summary-card"><h4>Total Quantity</h4><div className="value">{qty} kg</div></div>
          <div className="report-summary-card"><h4>Avg Order Value</h4><div className="value">{formatCurrency(avg)}</div></div>
          <div className="report-summary-card"><h4>Completed</h4><div className="value">{comp}</div></div>
          <div className="report-summary-card"><h4>Pending</h4><div className="value">{pend}</div></div>
          <div className="report-summary-card"><h4>Completion Rate</h4><div className="value">{rate}%</div></div>
          <div className="report-summary-card">
            <h4>Active Buyers</h4>
            <div className="value">{activeBuyers}</div>
          </div>
        </div>
        <div className="report-section-title">Product-wise Sales Summary</div>
        <table className="report-table">
          <thead><tr><th>Product</th><th>Quantity (kg)</th><th>Revenue</th><th>Avg Price/kg</th></tr></thead>
          <tbody>
            {Object.entries(prodSales).map(([prod, d]) => (
              <tr key={prod}>
                <td><strong>{prod}</strong></td>
                <td>{d.qty} kg</td>
                <td>{formatCurrency(d.rev)}</td>
                <td>{formatCurrency(parseFloat((d.rev / d.qty).toFixed(2)))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="report-section-title">Order Details</div>

        <table className="report-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Buyer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reportOrders.map(o => (
              <tr key={o.id}>
                <td>{o.displayId || o.id}</td>
                <td>{formatDate(o.date)}</td>
                <td>{o.buyer}</td>
                <td>{o.product}</td>
                <td>{o.quantity} kg</td>
                <td>{formatCurrency(o.amount)}</td>
                <td>{o.status.toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Copyright */}
        <div style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px', fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
          &copy; {new Date().getFullYear()} Farm Vantara India Pvt Ltd. All Rights Reserved.
        </div>
      </div>
    );
  };

  const downloadPDFReport = () => {
    const element = document.getElementById('reportContainer');
    if (element) {
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${farmerInfo.farmName.toLowerCase().replace(/ /g, '-')}-report-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };
      html2pdf().set(opt).from(element).save();
      showNotification('PDF downloaded!');
    }
  };

  // Settings Update
  const updateSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedInfo = {
      farm_name: formData.get('farmName'),
      full_name: formData.get('farmerName'),
      email: formData.get('farmerEmail'),
      phone: formData.get('contactNumber'),
      state: formData.get('farmLocation')
    };

    if (farmerInfo.id) {
      const { error } = await supabase
        .from('farmers')
        .update(updatedInfo)
        .eq('id', farmerInfo.id);

      if (!error) {
        setFarmerInfo({
          ...farmerInfo,
          farmName: updatedInfo.farm_name,
          name: updatedInfo.full_name,
          email: updatedInfo.email,
          phone: updatedInfo.phone,
          location: updatedInfo.state
        });
        showNotification('Settings saved!');
      } else {
        console.error(error);
        showNotification('Error saving settings');
      }
    } else {
      showNotification('Farmer profile not loaded yet');
    }
  };

  // Render Functions for different sections
  const renderOverview = () => (
    <>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Welcome back, {farmerInfo.name.split(' ')[0]}!</h1>
          <p>Manage your farm produce, track sales, and connect with buyers</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary" onClick={() => setActiveSection('list')}>
            <i className="fas fa-plus"></i> List New Product
          </button>
          <button className="btn btn-secondary" onClick={() => showNotification('Data refreshed!')}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card card shadow-sm border-0"><div className="stat-header"><div className="stat-icon"><i className="fas fa-rupee-sign"></i></div><div className="stat-trend">+12.5%</div></div><div className="stat-value fw-bold">{formatCurrency(totalRevenue)}</div><div className="stat-label">Total Revenue</div></div>
        <div className="stat-card card shadow-sm border-0"><div className="stat-header"><div className="stat-icon"><i className="fas fa-shopping-cart"></i></div><div className="stat-trend">+8.2%</div></div><div className="stat-value fw-bold">{activeOrders}</div><div className="stat-label">Active Orders</div></div>
        <div className="stat-card card shadow-sm border-0"><div className="stat-header"><div className="stat-icon"><i className="fas fa-box-open"></i></div><div className="stat-trend negative">-3.1%</div></div><div className="stat-value fw-bold">{totalStock} kg</div><div className="stat-label">Available Stock</div></div>
        <div className="stat-card card shadow-sm border-0"><div className="stat-header"><div className="stat-icon"><i className="fas fa-users"></i></div><div className="stat-trend">+15.7%</div></div><div className="stat-value fw-bold">{registeredBuyers.length}</div><div className="stat-label">Active Buyers</div></div>
        <div className="stat-card card shadow-sm border-0"><div className="stat-header"><div className="stat-icon"><i className="fas fa-seedling"></i></div><div className="stat-trend">+5.2%</div></div><div className="stat-value fw-bold">{products.length}</div><div className="stat-label">Total Products</div></div>
        <div className="stat-card card shadow-sm border-0"><div className="stat-header"><div className="stat-icon"><i className="fas fa-chart-line"></i></div><div className="stat-trend">+6.8%</div></div><div className="stat-value fw-bold">{formatCurrency(avgOrderValue)}</div><div className="stat-label">Avg Order Value</div></div>
        <div className="stat-card card shadow-sm border-0"><div className="stat-header"><div className="stat-icon"><i className="fas fa-check-circle"></i></div><div className="stat-trend">+3.2%</div></div><div className="stat-value fw-bold">{completionRate}%</div><div className="stat-label">Completion Rate</div></div>
        <div className="stat-card card shadow-sm border-0"><div className="stat-header"><div className="stat-icon"><i className="fas fa-star"></i></div><div className="stat-trend">+0.3</div></div><div className="stat-value fw-bold">4.8 ★</div><div className="stat-label">Customer Rating</div></div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <h3><i className="fas fa-chart-line"></i> Sales Trend</h3>
            <select className="filter-select" value={salesPeriod} onChange={(e) => setSalesPeriod(e.target.value)}>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
          <Line data={salesChartData} options={{ responsive: true }} />
        </div>
        <div className="chart-container">
          <div className="chart-header">
            <h3><i className="fas fa-chart-pie"></i> Product Distribution</h3>
          </div>
          <Doughnut data={productChartData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="dashboard-section card shadow-sm border-0 p-3">
        <div className="section-header">
          <h2><i className="fas fa-clock"></i> Recent Orders</h2>
          <button className="btn btn-secondary" onClick={() => setActiveSection('orders')}>View All</button>
        </div>
        <div className="orders-table-container">
          <table className="orders-table table table-hover">
            <thead><tr><th>Order ID</th><th>Buyer</th><th>Product</th><th>Quantity</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {orders.slice(0, 5).map(o => (
                <tr key={o.id}>
                  <td>{o.displayId || o.id}</td><td>{o.buyer}</td><td>{o.product}</td><td>{o.quantity} kg</td>
                  <td>{formatCurrency(o.amount)}</td>
                  <td><span className={`order-status ${getOrderStatusClass(o.status)}`}>{o.status.toUpperCase()}</span></td>
                  <td>{formatDate(o.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderProducts = () => (
    <div className="products-grid mt-3">
      {products.map(p => (
        <div key={p.id} className="product-card card shadow-sm border-0">
          <div className="product-image">
            {p.imageData ? <img src={p.imageData} alt={p.name} /> :
              <div className="image-placeholder"><i className={`fas ${getProductIcon(p.category)}`}></i></div>}
          </div>
          <div className="product-info">
            <div className="product-header">
              <div className="product-name">{p.name}</div>
              <div className={`product-status status-${getStatusClass(p.quantity)}`}>{getStatusText(p.quantity)}</div>
            </div>
            <div className="product-details">
              <div className="product-detail">
                <div className="detail-label">Stock Availability</div>
                <div className="detail-value"><strong>{p.quantity} kg</strong></div>
              </div>
              <div className="product-detail">
                <div className="detail-label">Price</div>
                <div className="detail-value">₹{p.price}/kg</div>
              </div>
            </div>
            <div className="product-actions">
              <button className="btn btn-info btn-small" onClick={() => { setSelectedProduct(p); setShowProductDetailModal(true); }}>
                <i className="fas fa-eye"></i> View
              </button>
              <button className="btn btn-warning btn-small" onClick={() => editProduct(p)}>
                <i className="fas fa-edit"></i> Edit
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStock = () => (
    <div className="products-grid mt-3">
      {products.map(p => (
        <div key={p.id} className="product-card card shadow-sm border-0">
          <div className="product-image">
            {p.imageData ? <img src={p.imageData} alt={p.name} /> :
              <div className="image-placeholder"><i className={`fas ${getProductIcon(p.category)}`}></i></div>}
          </div>
          <div className="product-info">
            <div className="product-header">
              <div className="product-name">{p.name}</div>
              <div className={`product-status status-${getStatusClass(p.quantity)}`}>{getStatusText(p.quantity)}</div>
            </div>
            <div className="product-details">
              <div className="product-detail">
                <div className="detail-label">Current Stock</div>
                <div className="detail-value"><strong>{p.quantity} kg</strong></div>
              </div>
            </div>
            <div className="product-actions">
              <button className="btn btn-primary btn-small" onClick={() => openStockUpdate(p)}>
                <i className="fas fa-edit"></i> Update Stock
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderOrders = () => (
    <>
      <div className="section-header">
        <h2><i className="fas fa-shopping-cart"></i> Order Management</h2>
        <div className="filter-group">
          <div className="filter-item">
            <label>Filter by Status</label>
            <select className="filter-select" value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)}>
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      <div className="orders-table-container">
        <table className="orders-table">
          <thead><tr><th>Order ID</th><th>Buyer</th><th>Product</th><th>Quantity</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id}>
                <td>{o.displayId || o.id}</td><td>{o.buyer}</td><td>{o.product}</td><td>{o.quantity} kg</td>
                <td>{formatCurrency(o.amount)}</td>
                <td><span className={`order-status ${getOrderStatusClass(o.status)}`}>{o.status.toUpperCase()}</span></td>
                <td>{formatDate(o.date)}</td>
                <td className="action-buttons">
                  <button className="btn btn-info btn-small" onClick={() => { setSelectedOrder(o); setShowOrderDetailsModal(true); }}>
                    <i className="fas fa-receipt"></i> Details
                  </button>
                  <button className="btn btn-primary btn-small" onClick={() => { setSelectedOrder(o); setShowOrderActionModal(true); }} disabled={isFinalStatus(o.status)}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderBuyerMarketplace = () => {
    const filteredBuyers = getFilteredBuyers();
    const totalBuyers = filteredBuyers.length;
    const avgRating = filteredBuyers.length > 0 ? (filteredBuyers.reduce((s, b) => s + b.rating, 0) / filteredBuyers.length).toFixed(1) : 0;
    const highDemand = filteredBuyers.filter(b => b.requirementVolume && b.requirementVolume.includes('1000')).length;
    const verifiedCount = filteredBuyers.filter(b => b.verified).length;

    return (
      <>
        <div className="stats-grid mb-4">
          <div className="stat-card card shadow-sm border-0"><div className="stat-value fw-bold">{totalBuyers}</div><div className="stat-label">Matching Buyers</div></div>
          <div className="stat-card card shadow-sm border-0"><div className="stat-value fw-bold">{avgRating}★</div><div className="stat-label">Avg Rating</div></div>
          <div className="stat-card card shadow-sm border-0"><div className="stat-value fw-bold">{highDemand}</div><div className="stat-label">Bulk Buyers</div></div>
          <div className="stat-card card shadow-sm border-0"><div className="stat-value fw-bold">{verifiedCount}</div><div className="stat-label">Verified</div></div>
        </div>
        <div className="products-grid mt-3">
          {filteredBuyers.map(b => {
            let badgeClass = '', badgeText = '';
            if (b.trustBadge === 'verified') { badgeClass = 'badge-verified'; badgeText = '✓ Verified'; }
            else if (b.trustBadge === 'premium') { badgeClass = 'badge-premium'; badgeText = '★ Premium'; }
            else if (b.trustBadge === 'trusted') { badgeClass = 'badge-trusted'; badgeText = '⭐ Trusted'; }

            return (
              <div key={b.id} className="product-card card shadow-sm border-0">
                <div className="buyer-avatar">
                  <i className="fas fa-store"></i>
                  {badgeText && <div className={`buyer-badge ${badgeClass}`}>{badgeText}</div>}
                </div>
                <div className="buyer-info">
                  <div className="buyer-name">{b.name}</div>
                  <div className="buyer-type">{b.type.toUpperCase()} • Since {b.established} • ⭐ {b.rating}</div>
                  <div className="buyer-details">
                    <div className="buyer-detail"><i className="fas fa-map-marker-alt"></i> {b.location}</div>
                    <div className="buyer-detail"><i className="fas fa-chart-line"></i> {b.requirementVolume}</div>
                    <div className="buyer-detail"><i className="fas fa-rupee-sign"></i> {b.budget}</div>
                  </div>
                  <div className="interest-area">
                    <strong>🎯 Looking For:</strong> {b.lookingFor}<br />
                    <strong>📦 Interested In:</strong> {b.interestProducts.join(', ')}
                  </div>
                  <div className="product-actions">
                    <button className="btn btn-info btn-small" onClick={() => { setSelectedBuyer(b); setShowBuyerDetailsModal(true); }}>
                      <i className="fas fa-eye"></i> View Details
                    </button>
                    <button className="btn btn-success btn-small" onClick={() => openPitchModal(b)}>
                      <i className="fas fa-handshake"></i> Pitch Product
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderPitches = () => {
    const filteredPitches = pitchStatusFilter === 'all' ? farmerPitches : farmerPitches.filter(p => p.status === pitchStatusFilter);

    if (filteredPitches.length === 0) {
      return (
        <div className="empty-state">
          <i className="fas fa-handshake"></i>
          <h3>No pitches yet</h3>
          <p>Go to Buyer Marketplace and pitch your products!</p>
          <button className="btn btn-primary" onClick={() => setActiveSection('buyers')}>Browse Buyers</button>
        </div>
      );
    }

    return (
      <div className="products-grid mt-3">
        {filteredPitches.map(p => {
          let statusClass = '';
          switch (p.status) {
            case 'pending': statusClass = 'status-pending'; break;
            case 'interested': statusClass = 'status-interested'; break;
            case 'accepted': statusClass = 'status-accepted'; break;
            case 'rejected': statusClass = 'status-rejected'; break;
            default: statusClass = '';
          }
          return (
            <div key={p.id} className="product-card card shadow-sm border-0">
              <div className="buyer-avatar"><i className="fas fa-handshake"></i></div>
              <div className="buyer-info">
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary-green)', background: 'rgba(39,174,96,0.1)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '5px' }}>
                  {p.displayId}
                </span>
                <div className="buyer-name">Pitch to {p.buyerName}</div>
                <div className="buyer-type">Sent on {formatDate(p.date)} • <span className={`pitch-status ${statusClass}`}>{p.status.toUpperCase()}</span></div>
                <div className="buyer-details">
                  <div className="buyer-detail"><i className="fas fa-box"></i> {p.productName}</div>
                  <div className="buyer-detail"><i className="fas fa-weight-hanging"></i> {p.quantity} kg</div>
                  <div className="buyer-detail"><i className="fas fa-rupee-sign"></i> {formatCurrency(p.price)}/kg</div>
                  <div className="buyer-detail"><i className="fas fa-truck"></i> {p.delivery}</div>
                </div>
                <div className="interest-area"><strong>💬 Your Message:</strong><br />{p.message.substring(0, 100)}{p.message.length > 100 ? '...' : ''}</div>
                <div className="product-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="btn btn-info btn-small" onClick={() => { setSelectedPitch(p); setShowPitchDetailsModal(true); }}>
                    <i className="fas fa-eye"></i> View Details
                  </button>
                  <button className="btn btn-primary btn-small" onClick={() => handlePitchAgain(p)}>
                    <i className="fas fa-paper-plane"></i> Pitch Again
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSales = () => (
    <>
      <div className="section-header">
        <h2><i className="fas fa-chart-line"></i> Sales Reports & Analytics</h2>
        <button className="btn btn-primary" onClick={downloadPDFReport}>
          <i className="fas fa-download"></i> Download PDF Report
        </button>
      </div>
      <div className="filter-section">
        <div className="date-filter-group">
          <div className="date-filter-item">
            <label>From Date</label>
            <input type="date" value={reportFromDate} onChange={(e) => setReportFromDate(e.target.value)} />
          </div>
          <div className="date-filter-item">
            <label>To Date</label>
            <input type="date" value={reportToDate} onChange={(e) => setReportToDate(e.target.value)} />
          </div>
        </div>
      </div>
      <div id="reportContainer">{renderReportPreview()}</div>
    </>
  );

  const renderListProduct = () => (
    <form onSubmit={handleProductSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Product Name *</label>
          <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required placeholder="e.g., Organic Wheat" />
        </div>
        <div className="form-group">
          <label>Category *</label>
          <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} required>
            <option value="">Select</option>
            <option value="grains">Grains</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="pulses">Pulses</option>
          </select>
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Quantity (kg) *</label>
          <input type="number" value={productForm.quantity} onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })} required min="1" step="0.1" />
        </div>
        <div className="form-group">
          <label>Price per kg (₹) *</label>
          <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required min="1" step="0.1" />
        </div>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows="3"></textarea>
      </div>
      <div className="form-group">
        <label>Product Image</label>
        <div className="upload-area" onClick={() => document.getElementById('imageUpload').click()}>
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: '40px', marginBottom: '15px' }}></i>
          <p>Click to upload product image</p>
        </div>
        <input type="file" id="imageUpload" accept="image/*" style={{ display: 'none' }} onChange={previewImage} />
        {currentImageData && (
          <div className="image-preview">
            <div className="image-preview-item"><img src={currentImageData} alt="Preview" /></div>
          </div>
        )}
      </div>
      <div className="form-buttons">
        <button type="button" className="btn btn-secondary" onClick={() => { clearProductForm(); setActiveSection('products'); }}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-sm">Save Product</button>
      </div>
    </form>
  );

  const renderSettings = () => (
    <form onSubmit={updateSettings}>
      <div className="form-grid">
        <div className="form-group"><label>Farm Name</label><input type="text" name="farmName" defaultValue={farmerInfo.farmName} /></div>
        <div className="form-group"><label>Contact Number</label><input type="tel" name="contactNumber" defaultValue={farmerInfo.phone} /></div>
        <div className="form-group"><label>Farmer Name</label><input type="text" name="farmerName" defaultValue={farmerInfo.name} /></div>
        <div className="form-group"><label>Email Address</label><input type="email" name="farmerEmail" defaultValue={farmerInfo.email} /></div>
        <div className="form-group"><label>Farm Location</label><input type="text" name="farmLocation" defaultValue={farmerInfo.location} /></div>
      </div>
      <div className="form-buttons">
        <button type="submit" className="btn btn-primary btn-sm">Save Changes</button>
      </div>
    </form>
  );

  return (
    <div className="farmer-dashboard">

      <div className="dashboard">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2><i className="fas fa-tractor"></i> {farmerInfo.farmName}</h2>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li><a className={activeSection === 'overview' ? 'active' : ''} onClick={() => setActiveSection('overview')}><i className="fas fa-home"></i> Overview</a></li>
              <li><a className={activeSection === 'products' ? 'active' : ''} onClick={() => setActiveSection('products')}><i className="fas fa-seedling"></i> My Products</a></li>
              <li><a className={activeSection === 'stock' ? 'active' : ''} onClick={() => setActiveSection('stock')}><i className="fas fa-warehouse"></i> Live Stock</a></li>
              <li><a className={activeSection === 'orders' ? 'active' : ''} onClick={() => setActiveSection('orders')}><i className="fas fa-shopping-cart"></i> Orders</a></li>
              <li><a className={activeSection === 'sales' ? 'active' : ''} onClick={() => setActiveSection('sales')}><i className="fas fa-chart-line"></i> Sales Reports</a></li>
              <li><a className={activeSection === 'buyers' ? 'active' : ''} onClick={() => setActiveSection('buyers')}><i className="fas fa-users"></i> Buyer Marketplace</a></li>
              <li><a className={activeSection === 'pitches' ? 'active' : ''} onClick={() => setActiveSection('pitches')}><i className="fas fa-handshake"></i> My Pitches</a></li>
              <li><a className={activeSection === 'settings' ? 'active' : ''} onClick={() => setActiveSection('settings')}><i className="fas fa-cog"></i> Settings</a></li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'products' && (
            <div className="dashboard-section card shadow-sm border-0 p-3">
              <div className="section-header">
                <h2><i className="fas fa-seedling"></i> My Products</h2>
                <button className="btn btn-primary" onClick={() => { clearProductForm(); setActiveSection('list'); }}>
                  <i className="fas fa-plus"></i> Add New Product
                </button>
              </div>
              {renderProducts()}
            </div>
          )}
          {activeSection === 'stock' && (
            <div className="dashboard-section card shadow-sm border-0 p-3">
              <div className="section-header">
                <h2><i className="fas fa-warehouse"></i> Live Stock Monitoring</h2>
              </div>
              {renderStock()}
            </div>
          )}
          {activeSection === 'orders' && (
            <div className="dashboard-section card shadow-sm border-0 p-3">
              {renderOrders()}
            </div>
          )}
          {activeSection === 'sales' && (
            <div className="dashboard-section card shadow-sm border-0 p-3">
              {renderSales()}
            </div>
          )}
          {activeSection === 'buyers' && (
            <div className="dashboard-section card shadow-sm border-0 p-3">
              <div className="section-header">
                <h2><i className="fas fa-store"></i> Buyer Marketplace</h2>
              </div>
              <div className="filter-section">
                <div className="filter-group">
                  <div className="filter-item">
                    <label>Filter by Product</label>
                    <select className="filter-select" value={buyerProductFilter} onChange={(e) => setBuyerProductFilter(e.target.value)}>
                      <option value="all">All Products</option>
                      {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="filter-item">
                    <label>Filter by Location</label>
                    <select className="filter-select" value={buyerLocationFilter} onChange={(e) => setBuyerLocationFilter(e.target.value)}>
                      <option value="all">All Locations</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                    </select>
                  </div>
                </div>
              </div>
              {renderBuyerMarketplace()}
            </div>
          )}
          {activeSection === 'pitches' && (
            <div className="dashboard-section card shadow-sm border-0 p-3">
              <div className="section-header">
                <h2><i className="fas fa-handshake"></i> My Pitches</h2>
                <div className="filter-group">
                  <div className="filter-item">
                    <label>Filter by Status</label>
                    <select className="filter-select" value={pitchStatusFilter} onChange={(e) => setPitchStatusFilter(e.target.value)}>
                      <option value="all">All Pitches</option>
                      <option value="pending">Pending</option>
                      <option value="interested">Interested</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
              {renderPitches()}
            </div>
          )}
          {activeSection === 'list' && (
            <div className="dashboard-section card shadow-sm border-0 p-3">
              <div className="section-header">
                <h2><i className="fas fa-plus-circle"></i> {editingProductId ? 'Edit Product' : 'List New Product'}</h2>
                <button className="btn btn-secondary" onClick={() => { clearProductForm(); setActiveSection('products'); }}>
                  <i className="fas fa-arrow-left"></i> Back to Products
                </button>
              </div>
              {renderListProduct()}
            </div>
          )}
          {activeSection === 'settings' && (
            <div className="dashboard-section card shadow-sm border-0 p-3">
              <div className="section-header">
                <h2><i className="fas fa-cog"></i> Account Settings</h2>
              </div>
              {renderSettings()}
            </div>
          )}
        </main>
      </div>

      {/* Notifications Container */}
      <div id="notificationsContainer"></div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal active" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-user-circle"></i> My Profile</h2>
              <button className="modal-close" onClick={() => setShowProfileModal(false)}>&times;</button>
            </div>
            <div className="profile-detail-container">
              <div className="profile-avatar-large">
                <div className="avatar-circle"><i className="fas fa-user"></i></div>
              </div>
              <div className="form-grid">
                <div className="form-group"><label>Farmer Name</label><input type="text" id="profileFarmerName" defaultValue={farmerInfo.name} /></div>
                <div className="form-group"><label>Farm Name</label><input type="text" id="profileFarmName" defaultValue={farmerInfo.farmName} /></div>
                <div className="form-group"><label>Email Address</label><input type="email" id="profileEmail" defaultValue={farmerInfo.email} /></div>
                <div className="form-group"><label>Phone Number</label><input type="tel" id="profilePhone" defaultValue={farmerInfo.phone} /></div>
                <div className="form-group"><label>Farm Location</label><input type="text" id="profileLocation" defaultValue={farmerInfo.location} /></div>
              </div>
              <div className="form-buttons">
                <button className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={async () => {
                  const updatedName = document.getElementById('profileFarmerName')?.value || farmerInfo.name;
                  const updatedFarmName = document.getElementById('profileFarmName')?.value || farmerInfo.farmName;
                  const updatedEmail = document.getElementById('profileEmail')?.value || farmerInfo.email;
                  const updatedPhone = document.getElementById('profilePhone')?.value || farmerInfo.phone;
                  const updatedLocation = document.getElementById('profileLocation')?.value || farmerInfo.location;

                  if (farmerInfo.id) {
                    const { error } = await supabase
                      .from('farmers')
                      .update({
                        full_name: updatedName,
                        farm_name: updatedFarmName,
                        email: updatedEmail,
                        phone: updatedPhone,
                        state: updatedLocation
                      })
                      .eq('id', farmerInfo.id);

                    if (!error) {
                      setFarmerInfo({
                        ...farmerInfo,
                        name: updatedName,
                        farmName: updatedFarmName,
                        email: updatedEmail,
                        phone: updatedPhone,
                        location: updatedLocation,
                      });
                      showNotification('Profile updated!');
                    } else {
                      console.error(error);
                      showNotification('Error updating profile');
                    }
                  } else {
                    showNotification('Farmer profile not loaded yet');
                  }
                  setShowProfileModal(false);
                }}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Details Modal */}
      {showBuyerDetailsModal && selectedBuyer && (
        <div className="modal active" onClick={() => setShowBuyerDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-store"></i> Buyer Details</h2>
              <button className="modal-close" onClick={() => setShowBuyerDetailsModal(false)}>&times;</button>
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ background: 'linear-gradient(135deg,var(--primary-green),var(--dark-green))', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                  <i className="fas fa-store" style={{ fontSize: '40px' }}></i>
                  <h3>{selectedBuyer.name}</h3>
                  <p>{selectedBuyer.type.toUpperCase()} • Since {selectedBuyer.established}</p>
                  <p>⭐ {selectedBuyer.rating} ★ ({selectedBuyer.totalOrders}+ orders)</p>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <div className="detail-row"><strong>📍 Location:</strong> {selectedBuyer.location}</div>
                  <div className="detail-row"><strong>📞 Contact:</strong> {selectedBuyer.phone}</div>
                  <div className="detail-row"><strong>✉️ Email:</strong> {selectedBuyer.email}</div>
                  <div className="detail-row"><strong>✅ Verified:</strong> {selectedBuyer.verified ? 'Yes' : 'No'}</div>
                </div>
              </div>
              <div style={{ flex: 2 }}>
                <div className="stats-grid mb-4" style={{ gridTemplateColumns: 'repeat(2,1fr)', marginBottom: '15px' }}>
                  <div className="stat-card card shadow-sm border-0"><div className="stat-value fw-bold">{selectedBuyer.requirementVolume}</div><div className="stat-label">Weekly Volume</div></div>
                  <div className="stat-card card shadow-sm border-0"><div className="stat-value fw-bold">{selectedBuyer.budget}</div><div className="stat-label">Monthly Budget</div></div>
                </div>
                <h4>🎯 Products They're Interested In:</h4>
                <div>{selectedBuyer.interestProducts.map(p => <span key={p} className="requirement-tag">{p}</span>)}</div>
                <h4 style={{ marginTop: '15px' }}>📋 Buyer Requirements:</h4>
                <p>{selectedBuyer.lookingFor}</p>
                <div className="form-buttons" style={{ marginTop: '20px' }}>
                  <button className="btn btn-primary" onClick={() => { setShowBuyerDetailsModal(false); openPitchModal(selectedBuyer); }}>
                    <i className="fas fa-handshake"></i> Send Pitch
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowBuyerDetailsModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pitch Modal */}
      {showPitchModal && (
        <div className="modal active" onClick={() => setShowPitchModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-handshake"></i> Pitch Your Product</h2>
              <button className="modal-close" onClick={() => setShowPitchModal(false)}>&times;</button>
            </div>
            <form onSubmit={submitPitch}>
              <div className="form-group"><label>Buyer</label><input type="text" value={pitchForm.buyerName} readOnly style={{ background: 'var(--light-gray)' }} /></div>
              <div className="form-group">
                <label>Select Your Product</label>
                <select value={pitchForm.productId} onChange={(e) => updatePitchPrice(e.target.value)} required>
                  <option value="">Select Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} - {p.quantity}kg available @ ₹{p.price}/kg</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity (kg)</label>
                <input type="number" value={pitchForm.quantity} onChange={(e) => setPitchForm({ ...pitchForm, quantity: e.target.value })} required min="1" step="0.1" />
              </div>
              <div className="form-group">
                <label>Your Price per kg (₹)</label>
                <input type="number" value={pitchForm.price} onChange={(e) => setPitchForm({ ...pitchForm, price: e.target.value })} required step="0.1" />
              </div>
              <div className="form-group">
                <label>Total Amount</label>
                <input type="text" value={calculatePitchTotal()} readOnly style={{ background: 'var(--light-gray)' }} />
              </div>
              <div className="form-group">
                <label>Your Message / Offer</label>
                <textarea value={pitchForm.message} onChange={(e) => setPitchForm({ ...pitchForm, message: e.target.value })} rows="4" required></textarea>
              </div>
              <div className="form-group">
                <label>Expected Delivery</label>
                <select value={pitchForm.delivery} onChange={(e) => setPitchForm({ ...pitchForm, delivery: e.target.value })}>
                  <option value="Within 3 days">Within 3 days</option>
                  <option value="Within 1 week">Within 1 week</option>
                  <option value="Within 2 weeks">Within 2 weeks</option>
                </select>
              </div>
              <div className="form-buttons">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPitchModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Send Pitch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetailsModal && selectedOrder && (
        <div className="modal active" onClick={() => setShowOrderDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-receipt"></i> Order Details</h2>
              <button className="modal-close" onClick={() => setShowOrderDetailsModal(false)}>&times;</button>
            </div>
            <div>
              <div className="detail-row"><strong>Order ID:</strong> {selectedOrder.displayId || selectedOrder.id}</div>
              <div className="detail-row"><strong>Date:</strong> {formatDate(selectedOrder.date)}</div>
              <div className="detail-row"><strong>Buyer:</strong> {selectedOrder.buyer}</div>
              <div className="detail-row"><strong>Product:</strong> {selectedOrder.product}</div>
              <div className="detail-row"><strong>Quantity:</strong> {selectedOrder.quantity} kg</div>
              <div className="detail-row"><strong>Amount:</strong> {formatCurrency(selectedOrder.amount)}</div>
              <div className="detail-row"><strong>Status:</strong> <span className={`order-status ${getOrderStatusClass(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
              <div className="detail-row"><strong>Delivery:</strong> {selectedOrder.deliveryAddress || 'N/A'}</div>
            </div>
            <div className="form-buttons">
              <button className="btn btn-primary" onClick={() => setShowOrderDetailsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Update Modal */}
      {showStockUpdateModal && stockUpdateProduct && (
        <div className="modal active" onClick={() => setShowStockUpdateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Stock</h2>
              <button className="modal-close" onClick={() => setShowStockUpdateModal(false)}>&times;</button>
            </div>
            <div className="form-group"><label>Product Name</label><input type="text" value={stockUpdateProduct.name} readOnly style={{ background: 'var(--light-gray)' }} /></div>
            <div className="form-group"><label>Current Stock (kg)</label><input type="text" value={`${stockUpdateProduct.quantity} kg`} readOnly style={{ background: 'var(--light-gray)' }} /></div>
            <div className="form-group"><label>New Quantity (kg) *</label><input type="number" value={newStockQuantity} onChange={(e) => setNewStockQuantity(e.target.value)} required min="0" step="0.1" /></div>
            <div className="form-buttons">
              <button className="btn btn-secondary" onClick={() => setShowStockUpdateModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={updateStock}>Update Stock</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductDetailModal && selectedProduct && (
        <div className="modal active" onClick={() => setShowProductDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Product Details</h2>
              <button className="modal-close" onClick={() => setShowProductDetailModal(false)}>&times;</button>
            </div>
            <div className="product-detail-container">
              <div className="product-detail-image-section">
                {selectedProduct.imageData ? <img src={selectedProduct.imageData} alt={selectedProduct.name} /> :
                  <i className={`fas ${getProductIcon(selectedProduct.category)}`} style={{ fontSize: '120px' }}></i>}
              </div>
              <div className="product-detail-info-section">
                <div className="detail-item"><div className="detail-label">Product Name</div><div className="detail-value"><strong>{selectedProduct.name}</strong></div></div>
                <div className="detail-item"><div className="detail-label">Category</div><div className="detail-value">{selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}</div></div>
                <div className="detail-item"><div className="detail-label">Stock Quantity</div><div className="detail-value"><strong>{selectedProduct.quantity} kg</strong> <span className={`product-status status-${getStatusClass(selectedProduct.quantity)}`}>{getStatusText(selectedProduct.quantity)}</span></div></div>
                <div className="detail-item"><div className="detail-label">Price</div><div className="detail-value">₹{selectedProduct.price} per kg</div></div>
                <div className="detail-item"><div className="detail-label">Total Value</div><div className="detail-value"><strong>{formatCurrency(selectedProduct.quantity * selectedProduct.price)}</strong></div></div>
                <div className="detail-item"><div className="detail-label">Description</div><div className="detail-value">{selectedProduct.description || 'No description available'}</div></div>
              </div>
            </div>
            <div className="form-buttons">
              <button className="btn btn-primary" onClick={() => setShowProductDetailModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Action Modal */}
      {showOrderActionModal && selectedOrder && (
        <div className="modal active" onClick={() => setShowOrderActionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Order Status</h2>
              <button className="modal-close" onClick={() => setShowOrderActionModal(false)}>&times;</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', padding: '15px 0' }}>
              {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => {
                const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
                const currentIndex = statusOrder.indexOf(selectedOrder.status);
                const targetIndex = statusOrder.indexOf(s);
                const isDisabled = targetIndex <= currentIndex;
                const isCurrent = selectedOrder.status === s;

                let btnStyle = {
                  cursor: 'pointer',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  transition: 'all 0.2s ease',
                  border: '1px solid transparent'
                };

                if (isDisabled) {
                  if (isCurrent) {
                    btnStyle = {
                      ...btnStyle,
                      backgroundColor: '#cbd5e1',
                      color: '#475569',
                      borderColor: '#94a3b8',
                      cursor: 'not-allowed',
                      opacity: 0.9,
                      pointerEvents: 'none',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
                    };
                  } else {
                    btnStyle = {
                      ...btnStyle,
                      backgroundColor: '#f1f5f9',
                      color: '#cbd5e1',
                      borderColor: '#e2e8f0',
                      cursor: 'not-allowed',
                      opacity: 0.6,
                      pointerEvents: 'none'
                    };
                  }
                }

                return (
                  <button
                    key={s}
                    className={`btn ${isCurrent ? 'btn-primary' : 'btn-secondary'}`}
                    style={btnStyle}
                    disabled={isDisabled}
                    onClick={() => updateOrderStatus(selectedOrder.id, s)}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pitch Details Modal */}
      {showPitchDetailsModal && selectedPitch && (
        <div className="modal active" onClick={() => setShowPitchDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-handshake"></i> Pitch Details</h2>
              <button className="modal-close" onClick={() => setShowPitchDetailsModal(false)}>&times;</button>
            </div>
            <div>
              <div className="detail-row"><strong>Pitch ID:</strong> {selectedPitch.displayId || selectedPitch.id}</div>
              <div className="detail-row"><strong>Date Sent:</strong> {formatDate(selectedPitch.date)}</div>
              <div className="detail-row"><strong>Buyer:</strong> {selectedPitch.buyerName}</div>
              <div className="detail-row"><strong>Product Offered:</strong> {selectedPitch.productName}</div>
              <div className="detail-row"><strong>Quantity:</strong> {selectedPitch.quantity} kg</div>
              <div className="detail-row"><strong>Price:</strong> {formatCurrency(selectedPitch.price)}/kg</div>
              <div className="detail-row"><strong>Total Amount:</strong> {formatCurrency(selectedPitch.total)}</div>
              <div className="detail-row"><strong>Expected Delivery:</strong> {selectedPitch.delivery || 'Within 3 days'}</div>
              <div className="detail-row">
                <strong>Status:</strong>{' '}
                <span className={`pitch-status status-${selectedPitch.status}`}>
                  {selectedPitch.status.toUpperCase()}
                </span>
              </div>
              <div className="detail-row" style={{ marginTop: '15px' }}>
                <strong>💬 Your Message:</strong>
                <p style={{ background: 'var(--light-gray)', padding: '10px', borderRadius: '8px', marginTop: '5px', whiteSpace: 'pre-line' }}>
                  {selectedPitch.message}
                </p>
              </div>
            </div>
            <div className="form-buttons">
              <button className="btn btn-primary" onClick={() => setShowPitchDetailsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;