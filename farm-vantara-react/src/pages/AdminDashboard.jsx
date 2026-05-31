import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import html2pdf from 'html2pdf.js';
import logo from '../assets/logo.png';
import { supabase } from '../supabaseClient';

const getFarmerInitials = (name) => {
    if (!name) return 'FV';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const AdminDashboard = () => {
    // ============ STATE & INITIALIZATION ============
    const [currentSection, setCurrentSection] = useState('overview');
    const [notifications, setNotifications] = useState([]);
    const [activeModal, setActiveModal] = useState(null); // 'register' or 'details'
    const [registerType, setRegisterType] = useState('farmer'); // 'farmer' or 'buyer'
    const [selectedDetails, setSelectedDetails] = useState(null); // { type, data }
    const [revenuePeriod, setRevenuePeriod] = useState(6);
    const [reportFromDate, setReportFromDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 5);
        d.setDate(1);
        return d.toISOString().split('T')[0];
    });
    const [reportToDate, setReportToDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [reportPeriodLabel, setReportPeriodLabel] = useState('6 Months');

    const [registerForm, setRegisterForm] = useState({
        name: '',
        location: '',
        email: '',
        phone: ''
    });
    const [farmers, setFarmers] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [reportTransactions, setReportTransactions] = useState([]);

    // Chart refs and instances
    const revenueChartInstance = useRef(null);
    const userChartInstance = useRef(null);
    const detailedRevenueChartInstance = useRef(null);

    const revenueCanvasRef = useRef(null);
    const userCanvasRef = useRef(null);
    const detailedRevenueCanvasRef = useRef(null);

    // ============ DATABASE FETCH ============
    const fetchDBData = async () => {
        try {
            // Fetch farmers
            const { data: dbFarmers, error: fErr } = await supabase.from('farmers').select('*');
            if (fErr) throw fErr;

            // Fetch buyers
            const { data: dbBuyers, error: bErr } = await supabase.from('businesses').select('*');
            if (bErr) throw bErr;

            // Fetch products
            const { data: dbProducts, error: pErr } = await supabase.from('products').select('*');
            if (pErr) throw pErr;

            // Fetch orders
            const { data: dbOrders, error: oErr } = await supabase.from('orders').select('*');
            if (oErr) throw oErr;

            // Parse and structure orders into transactions
            const mappedTransactions = (dbOrders || []).map(order => {
                const farmerObj = (dbFarmers || []).find(f => f.user_id === order.farmer_id || f.id === order.farmer_id);
                const buyerObj = (dbBuyers || []).find(b => b.user_id === order.buyer_id || b.id === order.buyer_id);

                return {
                    id: order.id,
                    amount: parseFloat(order.amount || 0),
                    date: order.created_at ? order.created_at.split('T')[0] : (order.date || new Date().toISOString().split('T')[0]),
                    farmerId: order.farmer_id,
                    farmerName: farmerObj ? (farmerObj.farm_name || farmerObj.full_name) : (order.farmer_name || 'Unknown Farmer'),
                    buyerId: order.buyer_id,
                    buyerName: order.buyer || (buyerObj ? (buyerObj.business_name || buyerObj.full_name) : 'Unknown Buyer'),
                    product: order.product || 'Fresh Produce',
                    quantity: parseFloat(order.quantity || 0),
                    status: order.status || 'pending'
                };
            });

            // Map and calculate farmers
            const mappedFarmers = (dbFarmers || []).map((f, index) => {
                const farmerProductsCount = (dbProducts || []).filter(p => p.farmer_id === f.user_id || p.farmer_id === f.id).length;
                const farmerRevenue = mappedTransactions
                    .filter(t => (t.farmerId === f.user_id || t.farmerId === f.id) && t.status !== 'cancelled')
                    .reduce((sum, t) => sum + t.amount, 0);

                const initials = getFarmerInitials(f.farm_name || f.full_name);
                const displayId = `${initials} - FRM - ${String(index + 1).padStart(3, '0')}`;

                return {
                    id: f.id || f.user_id,
                    displayId: displayId,
                    dbId: f.id,
                    userId: f.user_id,
                    name: f.farm_name || f.full_name || 'Green Valley Farm',
                    fullName: f.full_name || '',
                    location: f.state || f.village || 'India',
                    products: farmerProductsCount,
                    revenue: farmerRevenue,
                    status: 'active',
                    joined: f.created_at ? f.created_at.split('T')[0] : '2026-01-01',
                    email: f.email || '',
                    phone: f.phone || '',
                    description: f.selected_crops ? `Grows: ${f.selected_crops}` : 'Organic farmer partner',
                    rating: 4.8
                };
            });

            // Map and calculate buyers
            const mappedBuyers = (dbBuyers || []).map((b, index) => {
                const buyerOrders = mappedTransactions.filter(t => t.buyerId === b.user_id || t.buyerId === b.id);
                const buyerSpent = buyerOrders
                    .filter(t => t.status !== 'cancelled')
                    .reduce((sum, t) => sum + t.amount, 0);

                const initials = getFarmerInitials(b.business_name || b.full_name);
                const displayId = `${initials} - BYR - ${String(index + 1).padStart(3, '0')}`;

                return {
                    id: b.id || b.user_id,
                    displayId: displayId,
                    dbId: b.id,
                    userId: b.user_id,
                    name: b.business_name || b.full_name || 'Fresh Mart',
                    fullName: b.full_name || '',
                    location: b.state || 'India',
                    orders: buyerOrders.length,
                    spent: buyerSpent,
                    status: 'active',
                    joined: b.created_at ? b.created_at.split('T')[0] : '2026-01-01',
                    email: b.email || '',
                    phone: b.phone || '',
                    type: b.business_type || 'Wholesaler',
                    gst: b.gst_number || 'N/A'
                };
            });

            setFarmers(mappedFarmers);
            setBuyers(mappedBuyers);
            setTransactions(mappedTransactions);

        } catch (error) {
            console.error("Error loading database data:", error);
            showNotification(`Failed to load database: ${error.message || error}`);
        }
    };

    // ============ EFFECTS ============
    // Load initial data on mount
    useEffect(() => {
        fetchDBData();
    }, []);

    // Handle performance report period auto-calculation
    useEffect(() => {
        if (reportPeriodLabel !== 'Custom Range') {
            const currentDate = new Date();
            let fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - revenuePeriod + 1, 1);
            let fromDateStr = fromDate.toISOString().split('T')[0];
            let toDateStr = currentDate.toISOString().split('T')[0];

            let filtered = transactions.filter(t => t.date >= fromDateStr && t.date <= toDateStr);
            setReportTransactions(filtered);
            setReportPeriodLabel(`${revenuePeriod} Months`);
        }
    }, [revenuePeriod, transactions, currentSection]);

    // Overview Section charts rendering
    useEffect(() => {
        if (currentSection === 'overview') {
            const revData = getMonthlyRevenueData(6);
            if (revenueCanvasRef.current) {
                if (revenueChartInstance.current) {
                    revenueChartInstance.current.destroy();
                }
                revenueChartInstance.current = new Chart(revenueCanvasRef.current, {
                    type: 'line',
                    data: {
                        labels: revData.labels,
                        datasets: [{
                            label: 'Revenue (₹)',
                            data: revData.data,
                            borderColor: '#27ae60',
                            backgroundColor: 'rgba(39, 174, 96, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            }

            const activeFarmers = farmers.filter(f => f.status === 'active').length;
            const inactiveFarmers = farmers.length - activeFarmers;
            const activeBuyers = buyers.filter(b => b.status === 'active').length;
            const inactiveBuyers = buyers.length - activeBuyers;

            if (userCanvasRef.current) {
                if (userChartInstance.current) {
                    userChartInstance.current.destroy();
                }
                userChartInstance.current = new Chart(userCanvasRef.current, {
                    type: 'doughnut',
                    data: {
                        labels: ['Active Farmers', 'Inactive Farmers', 'Active Buyers', 'Inactive Buyers'],
                        datasets: [{
                            data: [activeFarmers, inactiveFarmers, activeBuyers, inactiveBuyers],
                            backgroundColor: ['#27ae60', '#e74c3c', '#3498db', '#95a5a6']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            }
        }
    }, [currentSection, farmers, buyers, transactions]);

    // Revenue Section charts rendering
    useEffect(() => {
        if (currentSection === 'revenue') {
            const revData = getMonthlyRevenueData(revenuePeriod);
            if (detailedRevenueCanvasRef.current) {
                if (detailedRevenueChartInstance.current) {
                    detailedRevenueChartInstance.current.destroy();
                }
                detailedRevenueChartInstance.current = new Chart(detailedRevenueCanvasRef.current, {
                    type: 'bar',
                    data: {
                        labels: revData.labels,
                        datasets: [{
                            label: 'Revenue (₹)',
                            data: revData.data,
                            backgroundColor: '#27ae60',
                            borderRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            }
        }
    }, [currentSection, revenuePeriod, transactions]);

    // Clean up chart references on unmount
    useEffect(() => {
        return () => {
            if (revenueChartInstance.current) revenueChartInstance.current.destroy();
            if (userChartInstance.current) userChartInstance.current.destroy();
            if (detailedRevenueChartInstance.current) detailedRevenueChartInstance.current.destroy();
        };
    }, []);

    // ============ UTILITIES ============
    const formatCurrency = (amt) => '₹' + parseFloat(amt).toLocaleString('en-IN');
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-IN');
    };

    const showNotification = (msg) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message: msg }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const getMonthlyRevenueData = (months = 6) => {
        const monthly = {};
        transactions.forEach(t => {
            let month = t.date.slice(0, 7);
            monthly[month] = (monthly[month] || 0) + t.amount;
        });

        const labels = [];
        const data = [];
        const currentDate = new Date();

        for (let i = months - 1; i >= 0; i--) {
            let d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let monthStr = year + '-' + String(month).padStart(2, '0');
            let monthName = d.toLocaleString('default', { month: 'short' });
            labels.push(monthName + ' ' + year);
            data.push(monthly[monthStr] || 0);
        }
        return { labels, data };
    };

    // ============ HANDLERS ============
    const refreshData = () => {
        fetchDBData();
        showNotification('Dashboard refreshed with latest data!');
    };

    const toggleFarmerStatus = (id) => {
        const farmer = farmers.find(f => f.id === id || f.userId === id);
        if (farmer) {
            const nextStatus = farmer.status === 'active' ? 'inactive' : 'active';
            showNotification(`Farmer ${farmer.name} is now ${nextStatus}`);
            setFarmers(prev => prev.map(f => {
                if (f.id === id || f.userId === id) {
                    return { ...f, status: nextStatus };
                }
                return f;
            }));
        }
    };

    const toggleBuyerStatus = (id) => {
        const buyer = buyers.find(b => b.id === id || b.userId === id);
        if (buyer) {
            const nextStatus = buyer.status === 'active' ? 'inactive' : 'active';
            showNotification(`Buyer ${buyer.name} is now ${nextStatus}`);
            setBuyers(prev => prev.map(b => {
                if (b.id === id || b.userId === id) {
                    return { ...b, status: nextStatus };
                }
                return b;
            }));
        }
    };

    const removeFarmer = async (id) => {
        if (window.confirm('Remove this farmer permanently from the database?')) {
            try {
                // Delete from DB by numerical ID or user_id
                const { error: delErr } = await supabase.from('farmers').delete().or(`id.eq.${id},user_id.eq.${id}`);
                if (delErr) throw delErr;
                showNotification('Farmer removed from Supabase');
                fetchDBData();
            } catch (err) {
                console.error("Error removing farmer:", err);
                showNotification(`Removal failed: ${err.message || err}`);
            }
        }
    };

    const removeBuyer = async (id) => {
        if (window.confirm('Remove this buyer permanently from the database?')) {
            try {
                // Delete from DB by numerical ID or user_id
                const { error: delErr } = await supabase.from('businesses').delete().or(`id.eq.${id},user_id.eq.${id}`);
                if (delErr) throw delErr;
                showNotification('Buyer removed from Supabase');
                fetchDBData();
            } catch (err) {
                console.error("Error removing buyer:", err);
                showNotification(`Removal failed: ${err.message || err}`);
            }
        }
    };

    const openRegisterModal = (type) => {
        setRegisterType(type);
        setRegisterForm({ name: '', location: '', email: '', phone: '' });
        setActiveModal('register');
    };

    const submitRegistration = async (e) => {
        e.preventDefault();
        try {
            if (registerType === 'farmer') {
                const { error: insErr } = await supabase.from("farmers").insert([{
                    full_name: registerForm.name,
                    farm_name: registerForm.name,
                    email: registerForm.email,
                    phone: registerForm.phone,
                    state: registerForm.location
                }]);
                if (insErr) throw insErr;
                showNotification(`Farmer "${registerForm.name}" registered in Supabase!`);
            } else {
                const { error: insErr } = await supabase.from("businesses").insert([{
                    full_name: registerForm.name,
                    business_name: registerForm.name,
                    email: registerForm.email,
                    phone: registerForm.phone,
                    state: registerForm.location
                }]);
                if (insErr) throw insErr;
                showNotification(`Buyer "${registerForm.name}" registered in Supabase!`);
            }
            fetchDBData();
            setActiveModal(null);
        } catch (err) {
            console.error("Error registering user:", err);
            showNotification(`Registration failed: ${err.message || err}`);
        }
    };

    const viewFarmerDetails = (id) => {
        const farmer = farmers.find(f => f.id === id || f.userId === id);
        if (farmer) {
            setSelectedDetails({ type: 'farmer', data: farmer });
            setActiveModal('details');
        }
    };

    const viewBuyerDetails = (id) => {
        const buyer = buyers.find(b => b.id === id || b.userId === id);
        if (buyer) {
            setSelectedDetails({ type: 'buyer', data: buyer });
            setActiveModal('details');
        }
    };

    const applyReportFilter = () => {
        if (reportFromDate && reportToDate) {
            let filtered = transactions.filter(t => t.date >= reportFromDate && t.date <= reportToDate);
            setReportTransactions(filtered);
            setReportPeriodLabel('Custom Range');
            showNotification('Report updated with date filter');
        } else {
            showNotification('Please select both from and to dates');
        }
    };

    const resetReportFilter = () => {
        setReportFromDate('');
        setReportToDate('');
        const currentDate = new Date();
        let fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - revenuePeriod + 1, 1);
        let fromDateStr = fromDate.toISOString().split('T')[0];
        let toDateStr = currentDate.toISOString().split('T')[0];

        let filtered = transactions.filter(t => t.date >= fromDateStr && t.date <= toDateStr);
        setReportTransactions(filtered);
        setReportPeriodLabel(`${revenuePeriod} Months`);
        showNotification('Reset to revenue period');
    };

    const downloadPerformanceReport = async () => {
        const element = document.getElementById('performanceReportContainer');
        if (!element || !element.innerHTML) {
            showNotification('No data to generate report');
            return;
        }
        showNotification('Generating PDF report...');
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `farm_vantara_performance_report_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        try {
            await html2pdf().set(opt).from(element).save();
            showNotification('PDF Report Downloaded Successfully!');
        } catch (e) {
            showNotification('Error generating PDF');
        }
    };

    const logout = () => {
        if (window.confirm('Logout from Admin Panel?')) {
            localStorage.removeItem('farmvantara_token');
            localStorage.removeItem('farmvantara_user');
            sessionStorage.removeItem('farmvantara_token');
            sessionStorage.removeItem('farmvantara_user');
            showNotification('Logged out successfully!');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }
    };

    // ============ RENDER COMPUTATIONS ============
    const activeFarmers = farmers.filter(f => f.status === 'active').length;
    const activeBuyers = buyers.filter(b => b.status === 'active').length;
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalOrders = transactions.length;
    const totalProducts = farmers.reduce((sum, f) => sum + f.products, 0);

    const detailedRevData = getMonthlyRevenueData(revenuePeriod);
    const totalDetailedRev = detailedRevData.data.reduce((a, b) => a + b, 0);
    const avgDetailedRev = detailedRevData.data.length ? Math.round(totalDetailedRev / detailedRevData.data.length) : 0;

    // Report Computations
    const totalReportRevenue = reportTransactions.reduce((s, t) => s + t.amount, 0);
    const totalReportOrders = reportTransactions.length;
    const avgReportOrderValue = totalReportOrders > 0 ? totalReportRevenue / totalReportOrders : 0;

    const monthlyReportData = {};
    reportTransactions.forEach(t => {
        const month = t.date.slice(0, 7);
        if (!monthlyReportData[month]) monthlyReportData[month] = { revenue: 0, orders: 0 };
        monthlyReportData[month].revenue += t.amount;
        monthlyReportData[month].orders += 1;
    });

    const monthlyReportBreakdown = Object.entries(monthlyReportData).sort().map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' }),
        revenue: data.revenue,
        orders: data.orders
    }));

    const farmerReportPerformance = farmers.map(f => {
        const farmerRevenue = reportTransactions.filter(t => t.farmerId === f.id).reduce((s, t) => s + t.amount, 0);
        const farmerOrders = reportTransactions.filter(t => t.farmerId === f.id).length;
        return { name: f.name, revenue: farmerRevenue, orders: farmerOrders, rating: f.rating, status: f.status };
    }).filter(fp => fp.revenue > 0 || fp.orders > 0).sort((a, b) => b.revenue - a.revenue);

    const buyerReportPerformance = buyers.map(b => {
        const buyerSpent = reportTransactions.filter(t => t.buyerId === b.id).reduce((s, t) => s + t.amount, 0);
        const buyerOrders = reportTransactions.filter(t => t.buyerId === b.id).length;
        return { name: b.name, spent: buyerSpent, orders: buyerOrders, type: b.type, status: b.status };
    }).filter(bp => bp.spent > 0).sort((a, b) => b.spent - a.spent);

    const monthsList = Object.keys(monthlyReportData).sort();
    let growthMessage = "Insufficient data for growth analysis";
    let topFarmerName = farmerReportPerformance[0]?.name || "N/A";
    let topBuyerName = buyerReportPerformance[0]?.name || "N/A";

    if (monthsList.length >= 2) {
        const firstMonthRev = monthlyReportData[monthsList[0]]?.revenue || 0;
        const lastMonthRev = monthlyReportData[monthsList[monthsList.length - 1]]?.revenue || 0;
        const growthPercent = firstMonthRev > 0 ? ((lastMonthRev - firstMonthRev) / firstMonthRev * 100).toFixed(1) : 0;
        growthMessage = growthPercent >= 0 ? `📈 Revenue grew by ${growthPercent}% over the period` : `📉 Revenue declined by ${Math.abs(growthPercent)}% over the period`;
    }

    return (
        <div className="admin-dashboard-page-container">
            {/* Embedded styles to guarantee identical vanilla looks */}
            <style>{`
                :root {
                    --primary-green: #27ae60;
                    --dark-green: #219653;
                    --light-green: #6fcf97;
                    --accent-blue: #2980b9;
                    --accent-orange: #f39c12;
                    --accent-red: #e74c3c;
                    --dark-blue: #2c3e50;
                    --light-gray: #f8f9fa;
                    --medium-gray: #dfe6e9;
                    --text-dark: #2d3436;
                    --text-light: #636e72;
                    --white: #ffffff;
                    --shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                    --shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.12);
                    --transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
                    --gradient-primary: linear-gradient(135deg, var(--primary-green) 0%, var(--dark-green) 100%);
                    --gradient-admin: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
                }

                .admin-dashboard-page-container {
                    font-family: 'Open Sans', sans-serif;
                    line-height: 1.6;
                    color: var(--text-dark);
                    background-color: #f0f2f5;
                    overflow-x: hidden;
                    min-height: 100vh;
                }

                .admin-dashboard-page-container h1,
                .admin-dashboard-page-container h2,
                .admin-dashboard-page-container h3,
                .admin-dashboard-page-container h4,
                .admin-dashboard-page-container h5 {
                    font-family: 'Poppins', sans-serif;
                    font-weight: 700;
                    line-height: 1.3;
                }

                .main-header {
                    background: var(--gradient-admin);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                .navbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 20px;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    gap: 12px;
                }

                .logo-svg {
                    width: 45px;
                    height: 45px;
                }

                .logo-text {
                    font-size: 22px;
                    font-weight: 700;
                    color: white;
                }

                .admin-badge-header {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 8px 20px;
                    border-radius: 50px;
                    color: white;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .logout-btn {
                    background: rgba(231, 76, 60, 0.9);
                    border: none;
                    color: white;
                    padding: 8px 18px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: var(--transition);
                }

                .logout-btn:hover {
                    background: #e74c3c;
                    transform: scale(1.02);
                }

                .dashboard {
                    display: flex;
                    min-height: calc(100vh - 70px);
                }

                .sidebar {
                    width: 280px;
                    background: var(--white);
                    box-shadow: 2px 0 20px rgba(0, 0, 0, 0.05);
                    padding: 30px 20px;
                    position: sticky;
                    top: 70px;
                    height: calc(100vh - 70px);
                    overflow-y: auto;
                }

                .sidebar-header {
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid var(--medium-gray);
                }

                .sidebar-header h2 {
                    font-size: 1.3rem;
                    color: var(--dark-green);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .sidebar-nav ul {
                    list-style: none;
                }

                .sidebar-nav li {
                    margin-bottom: 8px;
                }

                .sidebar-nav a {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 14px 18px;
                    color: var(--text-light);
                    text-decoration: none;
                    border-radius: 12px;
                    transition: var(--transition);
                    font-weight: 500;
                    font-size: 14px;
                    cursor: pointer;
                }

                .sidebar-nav a:hover {
                    background: rgba(39, 174, 96, 0.1);
                    color: var(--primary-green);
                }

                .sidebar-nav a.active {
                    background: var(--gradient-primary);
                    color: white;
                    box-shadow: 0 5px 15px rgba(39, 174, 96, 0.2);
                }

                .sidebar-nav a i {
                    width: 22px;
                    text-align: center;
                    font-size: 16px;
                }

                .main-content {
                    flex: 1;
                    padding: 30px;
                    overflow-y: auto;
                }

                .dashboard-section {
                    background: var(--white);
                    border-radius: 20px;
                    padding: 25px;
                    margin-bottom: 25px;
                    box-shadow: var(--shadow);
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid var(--medium-gray);
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .section-header h2 {
                    font-size: 1.3rem;
                    color: var(--dark-green);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-card {
                    background: var(--white);
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: var(--shadow);
                    transition: var(--transition);
                    border-left: 4px solid var(--primary-green);
                }

                .stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-hover);
                }

                .stat-value {
                    font-size: 28px;
                    font-weight: 700;
                    margin-top: 10px;
                }

                .stat-label {
                    font-size: 12px;
                    color: var(--text-light);
                }

                .charts-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 25px;
                    margin-bottom: 30px;
                }

                .chart-card {
                    background: var(--white);
                    border-radius: 20px;
                    padding: 20px;
                    box-shadow: var(--shadow);
                }

                .chart-card h3 {
                    margin-bottom: 20px;
                    color: var(--dark-green);
                }

                .table-container {
                    overflow-x: auto;
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .data-table th,
                .data-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid var(--medium-gray);
                    font-size: 13px;
                }

                .data-table th {
                    background: var(--light-gray);
                    font-weight: 600;
                }

                .status-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    display: inline-block;
                }

                .status-active {
                    background: rgba(39, 174, 96, 0.2);
                    color: #1e7e2f;
                }

                .status-inactive {
                    background: rgba(231, 76, 60, 0.2);
                    color: #c0392b;
                }

                .action-icons {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .action-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    font-size: 14px;
                }

                .action-btn:hover {
                    transform: scale(1.05);
                }

                .btn-view {
                    background: #3498db;
                    color: white;
                }

                .btn-view:hover {
                    background: #2980b9;
                }

                .btn-toggle-active {
                    background: #27ae60;
                    color: white;
                }

                .btn-toggle-active:hover {
                    background: #1e7e34;
                }

                .btn-toggle-inactive {
                    background: #e74c3c;
                    color: white;
                }

                .btn-toggle-inactive:hover {
                    background: #c0392b;
                }

                .btn-delete {
                    background: #7f8c8d;
                    color: white;
                }

                .btn-delete:hover {
                    background: #95a5a6;
                }

                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    transition: var(--transition);
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-primary {
                    background: var(--gradient-primary);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
                }

                .btn-outline {
                    background: transparent;
                    border: 2px solid var(--primary-green);
                    color: var(--primary-green);
                }

                .btn-sm {
                    padding: 6px 12px;
                    font-size: 11px;
                }

                .modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 2000;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .modal.active {
                    display: flex;
                }

                .modal-content {
                    background: var(--white);
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 550px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid var(--medium-gray);
                }

                .details-card {
                    background: linear-gradient(135deg, #f8fff9 0%, #e8f5e9 100%);
                    border-radius: 16px;
                    padding: 20px;
                }

                .details-row {
                    display: flex;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid var(--medium-gray);
                }

                .details-label {
                    width: 130px;
                    font-weight: 700;
                    color: var(--dark-green);
                }

                .details-value {
                    flex: 1;
                    color: var(--text-dark);
                }

                .details-header {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .details-header i {
                    font-size: 60px;
                    color: var(--primary-green);
                    margin-bottom: 10px;
                }

                .stats-mini {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    margin: 20px 0;
                }

                .stat-mini-card {
                    background: white;
                    padding: 12px;
                    border-radius: 12px;
                    text-align: center;
                }

                .stat-mini-card .value {
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--primary-green);
                }

                .form-group {
                    margin-bottom: 18px;
                    text-align: left;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 600;
                    font-size: 13px;
                }

                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 10px 12px;
                    border: 2px solid var(--medium-gray);
                    border-radius: 10px;
                    font-size: 13px;
                }

                .form-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 20px;
                }

                .report-preview {
                    background: #ffffff;
                    padding: 30px;
                    border-radius: 20px;
                    border: 1px solid var(--medium-gray);
                    font-family: 'Poppins', sans-serif;
                    text-align: left;
                }

                .report-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 3px solid var(--primary-green);
                }

                .report-header h2 {
                    color: var(--dark-green);
                    font-size: 28px;
                    margin-bottom: 10px;
                }

                .report-header .report-date {
                    color: var(--text-light);
                    font-size: 12px;
                }

                .report-summary-cards {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .report-summary-card {
                    background: linear-gradient(135deg, var(--primary-green), var(--dark-green));
                    color: white;
                    padding: 20px;
                    border-radius: 16px;
                    text-align: center;
                }

                .report-summary-card .value {
                    font-size: 28px;
                    font-weight: 700;
                }

                .report-summary-card .label {
                    font-size: 12px;
                    opacity: 0.9;
                    margin-top: 5px;
                }

                .report-section {
                    margin-bottom: 25px;
                }

                .report-section-title {
                    font-size: 18px;
                    color: var(--dark-green);
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid var(--primary-green);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .report-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }

                .report-table th,
                .report-table td {
                    border: 1px solid var(--medium-gray);
                    padding: 10px;
                    text-align: left;
                    font-size: 12px;
                }

                .report-table th {
                    background: var(--light-gray);
                    font-weight: 600;
                }

                .insight-box {
                    background: #e8f5e9;
                    padding: 15px;
                    border-radius: 12px;
                    margin: 20px 0;
                }

                .insight-box h4 {
                    color: var(--dark-green);
                    margin-bottom: 10px;
                }

                .report-footer {
                    margin-top: 30px;
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid var(--medium-gray);
                    font-size: 11px;
                    color: var(--text-light);
                }

                .admin-notifications-container {
                     position: fixed;
                     bottom: 20px;
                     right: 20px;
                     z-index: 9999;
                     display: flex;
                     flex-direction: column;
                     gap: 10px;
                 }

                 .admin-notification {
                     background: var(--white);
                     padding: 12px 24px;
                     border-radius: 10px;
                     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                     border-left: 4px solid var(--primary-green);
                     display: flex;
                     align-items: center;
                     font-size: 14px;
                     font-weight: 500;
                     color: var(--text-dark);
                     animation: slideInAdmin 0.3s ease-out;
                     min-width: 280px;
                     max-width: 380px;
                 }

                 @keyframes slideInAdmin {
                     from {
                         transform: translateX(100%);
                         opacity: 0;
                     }
                     to {
                         transform: translateX(0);
                         opacity: 1;
                     }
                 }

                @media (max-width: 1024px) {
                    .dashboard {
                        flex-direction: column;
                    }

                    .sidebar {
                        width: 100%;
                        height: auto;
                        position: static;
                        padding: 20px;
                    }

                    .sidebar-nav ul {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                    }

                    .main-content {
                        padding: 20px;
                    }

                    .charts-row {
                        grid-template-columns: 1fr;
                    }

                    .report-summary-cards {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}</style>

            <header className="main-header">
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <nav className="navbar">
                        <a href="#" className="logo">
                            <img src={logo} alt="Farm Vantara Logo" style={{ height: '45px', width: 'auto', objectFit: 'contain' }} />
                        </a>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div className="admin-badge-header"><i className="fas fa-shield-alt"></i> Super Administrator</div>
                            <button className="logout-btn" onClick={logout}><i className="fas fa-sign-out-alt"></i> Logout</button>
                        </div>
                    </nav>
                </div>
            </header>

            <div className="dashboard">
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h2><i className="fas fa-crown"></i> Admin Panel</h2>
                    </div>
                    <nav className="sidebar-nav">
                        <ul>
                            <li>
                                <a href="javascript:void(0)" onClick={() => setCurrentSection('overview')} className={currentSection === 'overview' ? 'active' : ''}>
                                    <i className="fas fa-home"></i> Overview
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" onClick={() => setCurrentSection('farmers')} className={currentSection === 'farmers' ? 'active' : ''}>
                                    <i className="fas fa-tractor"></i> Farmer Management
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" onClick={() => setCurrentSection('buyers')} className={currentSection === 'buyers' ? 'active' : ''}>
                                    <i className="fas fa-store"></i> Buyer Management
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" onClick={() => setCurrentSection('revenue')} className={currentSection === 'revenue' ? 'active' : ''}>
                                    <i className="fas fa-chart-line"></i> Revenue Analytics
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" onClick={() => setCurrentSection('performance')} className={currentSection === 'performance' ? 'active' : ''}>
                                    <i className="fas fa-chart-simple"></i> Performance Report
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <main className="main-content">
                    {/* OVERVIEW SECTION */}
                    {currentSection === 'overview' && (
                        <div id="overview" className="dashboard-section">
                            <div className="section-header">
                                <h2><i className="fas fa-chart-pie"></i> Platform Overview</h2>
                                <button className="btn btn-primary btn-sm" onClick={refreshData}>
                                    <i className="fas fa-sync-alt"></i> Refresh
                                </button>
                            </div>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-value">{farmers.filter(f => f.status === 'active').length}/{farmers.length}</div>
                                    <div className="stat-label">Active Farmers</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{buyers.filter(b => b.status === 'active').length}/{buyers.length}</div>
                                    <div className="stat-label">Active Buyers</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{formatCurrency(totalRevenue)}</div>
                                    <div className="stat-label">Platform Revenue</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{totalOrders}</div>
                                    <div className="stat-label">Total Orders</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{totalProducts}</div>
                                    <div className="stat-label">Products Listed</div>
                                </div>
                            </div>
                            <div className="charts-row">
                                <div className="chart-card">
                                    <h3><i className="fas fa-chart-line"></i> Revenue Trend (Last 6 Months)</h3>
                                    <div style={{ position: 'relative', height: '280px' }}>
                                        <canvas ref={revenueCanvasRef}></canvas>
                                    </div>
                                </div>
                                <div className="chart-card">
                                    <h3><i className="fas fa-chart-pie"></i> User Distribution</h3>
                                    <div style={{ position: 'relative', height: '280px' }}>
                                        <canvas ref={userCanvasRef}></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FARMER MANAGEMENT SECTION */}
                    {currentSection === 'farmers' && (
                        <div id="farmers" className="dashboard-section">
                            <div className="section-header">
                                <h2><i className="fas fa-tractor"></i> Farmer Management</h2>
                                <button className="btn btn-primary" onClick={() => openRegisterModal('farmer')}>
                                    <i className="fas fa-plus"></i> Register Farmer
                                </button>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Farm Name</th>
                                            <th>Location</th>
                                            <th>Products</th>
                                            <th>Revenue</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {farmers.map(f => {
                                            const isActive = f.status === 'active';
                                            return (
                                                <tr key={f.id}>
                                                    <td>{f.displayId}</td>
                                                    <td><strong>{f.name}</strong><br /><small>{f.email}</small></td>
                                                    <td>{f.location}</td>
                                                    <td>{f.products}</td>
                                                    <td>{formatCurrency(f.revenue)}</td>
                                                    <td>
                                                        <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                                                            {isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(f.joined)}</td>
                                                    <td className="action-icons">
                                                        <button className="action-btn btn-view" onClick={() => viewFarmerDetails(f.id)} title="View Details">
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        <button className={`action-btn ${isActive ? 'btn-toggle-active' : 'btn-toggle-inactive'}`} onClick={() => toggleFarmerStatus(f.id)} title="Toggle Status">
                                                            <i className={`fas ${isActive ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                                                        </button>
                                                        <button className="action-btn btn-delete" onClick={() => removeFarmer(f.id)} title="Remove">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* BUYER MANAGEMENT SECTION */}
                    {currentSection === 'buyers' && (
                        <div id="buyers" className="dashboard-section">
                            <div className="section-header">
                                <h2><i className="fas fa-store"></i> Buyer Management</h2>
                                <button className="btn btn-primary" onClick={() => openRegisterModal('buyer')}>
                                    <i className="fas fa-plus"></i> Register Buyer
                                </button>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Business Name</th>
                                            <th>Location</th>
                                            <th>Orders</th>
                                            <th>Total Spent</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {buyers.map(b => {
                                            const isActive = b.status === 'active';
                                            return (
                                                <tr key={b.id}>
                                                    <td>{b.displayId}</td>
                                                    <td><strong>{b.name}</strong><br /><small>{b.email}</small></td>
                                                    <td>{b.location}</td>
                                                    <td>{b.orders}</td>
                                                    <td>{formatCurrency(b.spent)}</td>
                                                    <td>
                                                        <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                                                            {isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(b.joined)}</td>
                                                    <td className="action-icons">
                                                        <button className="action-btn btn-view" onClick={() => viewBuyerDetails(b.id)} title="View Details">
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        <button className={`action-btn ${isActive ? 'btn-toggle-active' : 'btn-toggle-inactive'}`} onClick={() => toggleBuyerStatus(b.id)} title="Toggle Status">
                                                            <i className={`fas ${isActive ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                                                        </button>
                                                        <button className="action-btn btn-delete" onClick={() => removeBuyer(b.id)} title="Remove">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* REVENUE ANALYTICS SECTION */}
                    {currentSection === 'revenue' && (
                        <div id="revenue" className="dashboard-section">
                            <div className="section-header">
                                <h2><i className="fas fa-chart-line"></i> Revenue Analytics</h2>
                                <select value={revenuePeriod} onChange={(e) => setRevenuePeriod(parseInt(e.target.value))} className="btn btn-outline btn-sm">
                                    <option value="3">Last 3 Months</option>
                                    <option value="6">Last 6 Months</option>
                                    <option value="12">Last 12 Months</option>
                                </select>
                            </div>
                            <div className="chart-card" style={{ marginBottom: '20px' }}>
                                <div style={{ position: 'relative', height: '350px' }}>
                                    <canvas ref={detailedRevenueCanvasRef}></canvas>
                                </div>
                            </div>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-value">{formatCurrency(totalDetailedRev)}</div>
                                    <div className="stat-label">Total Revenue ({revenuePeriod} months)</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{formatCurrency(avgDetailedRev)}</div>
                                    <div className="stat-label">Average Monthly Revenue</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PERFORMANCE REPORT SECTION */}
                    {currentSection === 'performance' && (
                        <div id="performance" className="dashboard-section">
                            <div className="section-header">
                                <h2><i className="fas fa-chart-simple"></i> Platform Performance Report</h2>
                                <button className="btn btn-primary" onClick={downloadPerformanceReport}>
                                    <i className="fas fa-download"></i> Download PDF Report
                                </button>
                            </div>
                            <div className="filter-section" style={{ background: 'var(--light-gray)', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>From Date</label>
                                        <input type="date" value={reportFromDate} onChange={(e) => setReportFromDate(e.target.value)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--medium-gray)' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>To Date</label>
                                        <input type="date" value={reportToDate} onChange={(e) => setReportToDate(e.target.value)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--medium-gray)' }} />
                                    </div>
                                    <div>
                                        <button className="btn btn-primary btn-sm" onClick={applyReportFilter}>Apply Filter</button>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline btn-sm" onClick={resetReportFilter}>Reset</button>
                                    </div>
                                </div>
                            </div>

                            <div id="performanceReportContainer" className="report-preview">
                                <div className="report-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '3px solid var(--primary-green)', textAlign: 'left' }}>
                                    <div>
                                        <h2 style={{ margin: '0 0 5px 0', fontSize: '28px', color: 'var(--dark-green)' }}>🌾 Farm Vantara</h2>
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: 'var(--text-dark)' }}>Platform Performance Report</h3>
                                        <p className="report-date" style={{ margin: '0', fontSize: '12px', color: 'var(--text-light)' }}>Generated: {new Date().toLocaleString()} | Period: {reportPeriodLabel} {reportFromDate && reportToDate ? `(${formatDate(reportFromDate)} to ${formatDate(reportToDate)})` : ''}</p>
                                    </div>
                                    <img src={logo} alt="Farm Vantara Logo" style={{ height: '60px', objectFit: 'contain' }} />
                                </div>
                                
                                <div className="report-summary-cards">
                                    <div className="report-summary-card"><div className="value">{formatCurrency(totalReportRevenue)}</div><div className="label">Total Revenue</div></div>
                                    <div className="report-summary-card"><div className="value">{totalReportOrders}</div><div className="label">Total Orders</div></div>
                                    <div className="report-summary-card"><div className="value">{formatCurrency(avgReportOrderValue)}</div><div className="label">Avg Order Value</div></div>
                                    <div className="report-summary-card"><div className="value">{totalReportOrders > 0 ? Math.round(totalReportRevenue / totalReportOrders) : 0}</div><div className="label">Avg Ticket Size</div></div>
                                </div>
                                
                                <div className="insight-box">
                                    <h4><i className="fas fa-lightbulb"></i> Key Insights</h4>
                                    <p>🌟 <strong>Top Performing Farmer:</strong> {topFarmerName} with {formatCurrency(farmerReportPerformance[0]?.revenue || 0)} revenue</p>
                                    <p>🛒 <strong>Top Buyer:</strong> {topBuyerName} with {formatCurrency(buyerReportPerformance[0]?.spent || 0)} total spend</p>
                                    <p>📊 <strong>Growth Trend:</strong> {growthMessage}</p>
                                    <p>👥 <strong>Active Users:</strong> {activeFarmers + activeBuyers} out of {farmers.length + buyers.length} total</p>
                                </div>
                                
                                <div className="report-section">
                                    <div className="report-section-title"><i className="fas fa-chart-line"></i> Monthly Breakdown</div>
                                    <table className="report-table">
                                        <thead>
                                            <tr>
                                                <th>Month</th>
                                                <th>Revenue</th>
                                                <th>Orders</th>
                                                <th>Avg Order Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monthlyReportBreakdown.map((m, idx) => (
                                                <tr key={idx}>
                                                    <td>{m.month}</td>
                                                    <td>{formatCurrency(m.revenue)}</td>
                                                    <td>{m.orders}</td>
                                                    <td>{formatCurrency(m.revenue / m.orders)}</td>
                                                </tr>
                                            ))}
                                            {monthlyReportBreakdown.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No data available</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="report-section">
                                    <div className="report-section-title"><i className="fas fa-tractor"></i> Farmer Performance</div>
                                    <table className="report-table">
                                        <thead>
                                            <tr>
                                                <th>Farmer Name</th>
                                                <th>Orders</th>
                                                <th>Revenue</th>
                                                <th>Rating</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {farmerReportPerformance.map((fp, idx) => (
                                                <tr key={idx}>
                                                    <td>{fp.name}</td>
                                                    <td>{fp.orders}</td>
                                                    <td>{formatCurrency(fp.revenue)}</td>
                                                    <td>⭐ {fp.rating}</td>
                                                    <td>{fp.status === 'active' ? '✅ Active' : '❌ Inactive'}</td>
                                                </tr>
                                            ))}
                                            {farmerReportPerformance.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No data available</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="report-section">
                                    <div className="report-section-title"><i className="fas fa-store"></i> Buyer Performance</div>
                                    <table className="report-table">
                                        <thead>
                                            <tr>
                                                <th>Buyer Name</th>
                                                <th>Type</th>
                                                <th>Orders</th>
                                                <th>Total Spent</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {buyerReportPerformance.map((bp, idx) => (
                                                <tr key={idx}>
                                                    <td>{bp.name}</td>
                                                    <td>{bp.type}</td>
                                                    <td>{bp.orders}</td>
                                                    <td>{formatCurrency(bp.spent)}</td>
                                                    <td>{bp.status === 'active' ? '✅ Active' : '❌ Inactive'}</td>
                                                </tr>
                                            ))}
                                            {buyerReportPerformance.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No data available</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="report-section">
                                    <div className="report-section-title"><i className="fas fa-users"></i> User Statistics</div>
                                    <table className="report-table">
                                        <thead>
                                            <tr>
                                                <th>User Type</th>
                                                <th>Active</th>
                                                <th>Inactive</th>
                                                <th>Total</th>
                                                <th>Activation Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Farmers</td>
                                                <td>{activeFarmers}</td>
                                                <td>{farmers.length - activeFarmers}</td>
                                                <td>{farmers.length}</td>
                                                <td>{((activeFarmers / farmers.length) * 100).toFixed(1)}%</td>
                                            </tr>
                                            <tr>
                                                <td>Buyers</td>
                                                <td>{activeBuyers}</td>
                                                <td>{buyers.length - activeBuyers}</td>
                                                <td>{buyers.length}</td>
                                                <td>{((activeBuyers / buyers.length) * 100).toFixed(1)}%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="report-footer">
                                    <p>© Farm Vantara - Empowering Farmers & Connecting Buyers</p>
                                    <p>This is a system-generated performance report based on selected period.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* MODALS */}
            {activeModal === 'register' && (
                <div id="registerModal" className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 id="modalTitle">{registerType === 'farmer' ? 'Register New Farmer' : 'Register New Buyer'}</h3>
                            <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <form id="registerForm" onSubmit={submitRegistration}>
                            <div className="form-group">
                                <label>Full Name / Business Name *</label>
                                <input type="text" value={registerForm.name} required onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Location *</label>
                                <input type="text" value={registerForm.location} required onChange={(e) => setRegisterForm({ ...registerForm, location: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input type="email" value={registerForm.email} required onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" value={registerForm.phone} required onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} />
                            </div>
                            <div className="form-buttons">
                                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
                                <button type="submit" className="btn className=btn-primary">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeModal === 'details' && selectedDetails && (
                <div id="detailsModal" className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 id="detailsModalTitle">
                                <i className={selectedDetails.type === 'farmer' ? "fas fa-tractor" : "fas fa-store"}></i>{' '}
                                {selectedDetails.type === 'farmer' ? 'Farmer Details' : 'Buyer Details'}
                            </h3>
                            <button onClick={() => { setActiveModal(null); setSelectedDetails(null); }} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <div id="detailsModalContent">
                            {selectedDetails.type === 'farmer' ? (
                                <div className="details-card">
                                    <div className="details-header">
                                        <i className="fas fa-tractor"></i>
                                        <h2>{selectedDetails.data.name}</h2>
                                        <span className={`status-badge ${selectedDetails.data.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                                            {selectedDetails.data.status === 'active' ? 'Active Farmer' : 'Inactive Farmer'}
                                        </span>
                                    </div>
                                    <div className="stats-mini">
                                        <div className="stat-mini-card"><div className="value">{selectedDetails.data.products}</div><div>Products</div></div>
                                        <div className="stat-mini-card"><div className="value">{transactions.filter(t => t.farmerId === selectedDetails.data.id).length}</div><div>Orders</div></div>
                                        <div className="stat-mini-card"><div className="value">{formatCurrency(selectedDetails.data.revenue)}</div><div>Revenue</div></div>
                                        <div className="stat-mini-card"><div className="value">⭐ {selectedDetails.data.rating}</div><div>Rating</div></div>
                                    </div>
                                    <div className="details-row"><div className="details-label">📍 Location</div><div className="details-value">{selectedDetails.data.location}</div></div>
                                    <div className="details-row"><div className="details-label">📧 Email</div><div className="details-value">{selectedDetails.data.email}</div></div>
                                    <div className="details-row"><div className="details-label">📞 Phone</div><div className="details-value">{selectedDetails.data.phone}</div></div>
                                    <div className="details-row"><div className="details-label">📅 Joined</div><div className="details-value">{formatDate(selectedDetails.data.joined)}</div></div>
                                    <div className="details-row"><div className="details-label">📝 Description</div><div className="details-value">{selectedDetails.data.description}</div></div>
                                    <div className="form-buttons"><button className="btn btn-primary" onClick={() => { setActiveModal(null); setSelectedDetails(null); }}>Close</button></div>
                                </div>
                            ) : (
                                <div className="details-card">
                                    <div className="details-header">
                                        <i className="fas fa-store"></i>
                                        <h2>{selectedDetails.data.name}</h2>
                                        <span className={`status-badge ${selectedDetails.data.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                                            {selectedDetails.data.status === 'active' ? 'Active Buyer' : 'Inactive Buyer'}
                                        </span>
                                    </div>
                                    <div className="stats-mini">
                                        <div className="stat-mini-card"><div className="value">{selectedDetails.data.orders}</div><div>Orders</div></div>
                                        <div className="stat-mini-card"><div className="value">{formatCurrency(selectedDetails.data.spent)}</div><div>Total Spent</div></div>
                                        <div className="stat-mini-card"><div className="value">{selectedDetails.data.type}</div><div>Type</div></div>
                                    </div>
                                    <div className="details-row"><div className="details-label">📍 Location</div><div className="details-value">{selectedDetails.data.location}</div></div>
                                    <div className="details-row"><div className="details-label">📧 Email</div><div className="details-value">{selectedDetails.data.email}</div></div>
                                    <div className="details-row"><div className="details-label">📞 Phone</div><div className="details-value">{selectedDetails.data.phone}</div></div>
                                    <div className="details-row"><div className="details-label">🏢 GST</div><div className="details-value">{selectedDetails.data.gst}</div></div>
                                    <div className="details-row"><div className="details-label">📅 Joined</div><div className="details-value">{formatDate(selectedDetails.data.joined)}</div></div>
                                    <div className="form-buttons"><button className="btn btn-primary" onClick={() => { setActiveModal(null); setSelectedDetails(null); }}>Close</button></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Slide-in notifications portal */}
            <div className="admin-notifications-container">
                {notifications.map(n => (
                    <div key={n.id} className="admin-notification">
                        <i className="fas fa-check-circle" style={{ color: 'var(--primary-green)', marginRight: '10px' }}></i>
                        {n.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;