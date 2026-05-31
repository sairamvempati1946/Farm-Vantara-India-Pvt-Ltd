import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import html2pdf from 'html2pdf.js';
import { supabase } from '../supabaseClient';
import '../styles/BuyerDashboard.css';
import logo from '../assets/logo.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const getFarmerInitials = (name) => {
    if (!name) return 'FV';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const BuyerDashboard = () => {
    // ============ STATE & INITIALIZATION ============
    const [currentSection, setCurrentSection] = useState('overview');

    // User session details
    const [buyerInfo, setBuyerInfo] = useState(() => {
        const userStr = localStorage.getItem('farmvantara_user') || sessionStorage.getItem('farmvantara_user');
        if (userStr && userStr !== "undefined" && userStr !== "null") {
            try {
                const u = JSON.parse(userStr);
                return {
                    name: u.name || 'Fresh Mart',
                    businessName: u.name || 'Fresh Mart Supermarket',
                    contactPerson: u.name || 'Rajesh',
                    phone: u.phone || '9876543210',
                    email: u.email || 'freshmart@example.com',
                    deliveryAddress: u.address || '123, MG Road, Connaught Place, New Delhi - 110001'
                };
            } catch (e) {
                console.error("Error parsing user session:", e);
            }
        }
        return {
            name: 'Fresh Mart',
            businessName: 'Fresh Mart Supermarket',
            contactPerson: 'Rajesh',
            phone: '9876543210',
            email: 'freshmart@example.com',
            deliveryAddress: '123, MG Road, Connaught Place, New Delhi - 110001'
        };
    });

    // Database loaded state
    const [farmers, setFarmers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [receivedPitches, setReceivedPitches] = useState([]);

    // Persisted User lists (Wishlist & Favorites)
    const [wishlist, setWishlist] = useState(() => {
        const w = localStorage.getItem('wishlist_buyer');
        return w ? JSON.parse(w) : [];
    });

    const [favoriteFarmers, setFavoriteFarmers] = useState(() => {
        const f = localStorage.getItem('favorites_buyer');
        return f ? JSON.parse(f) : [];
    });

    // Cart state
    const [cart, setCart] = useState(() => {
        const c = localStorage.getItem('cart_buyer');
        return c ? JSON.parse(c) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Dynamic filtering state
    const [productCategoryFilter, setProductCategoryFilter] = useState('all');
    const [productLocationFilter, setProductLocationFilter] = useState('all');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [pitchStatusFilter, setPitchStatusFilter] = useState('all');

    // Report Dates state
    const [reportFromDate, setReportFromDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().split('T')[0];
    });
    const [reportToDate, setReportToDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [filteredOrders, setFilteredOrders] = useState([]);

    // UI Interactive state
    const [userDropdownActive, setUserDropdownActive] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [modals, setModals] = useState({
        wishlist: false,
        favorites: false,
        farmerProducts: false,
        productDetail: false,
        farmDetails: false,
        order: false,
        profile: false,
        tracking: false
    });

    const [trackedOrder, setTrackedOrder] = useState(null);

    // Modal data states
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [farmerProductsModalData, setFarmerProductsModalData] = useState({ title: '', productsList: [], farmerId: null });
    const [detailQuantity, setDetailQuantity] = useState(1);

    // Order form state
    const [orderForm, setOrderForm] = useState({
        productId: '',
        farmerId: '',
        productName: '',
        farmerName: '',
        price: 0,
        quantity: 1,
        total: 0,
        deliveryAddress: '',
        instructions: ''
    });

    // Save Cart, Wishlist & Favorites to LocalStorage
    useEffect(() => {
        localStorage.setItem('cart_buyer', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('wishlist_buyer', JSON.stringify(wishlist));
    }, [wishlist]);

    useEffect(() => {
        localStorage.setItem('favorites_buyer', JSON.stringify(favoriteFarmers));
    }, [favoriteFarmers]);

    // Dispatch update events for Navbar counts
    useEffect(() => {
        window.dispatchEvent(new Event('buyer-data-updated'));
    }, [cart, wishlist, favoriteFarmers]);

    // Listen to custom toggle events from Navbar
    useEffect(() => {
        const handleToggleCart = () => setIsCartOpen(prev => !prev);
        const handleToggleWishlist = () => toggleModal('wishlist', true);
        const handleToggleFavorites = () => toggleModal('favorites', true);

        window.addEventListener('toggle-cart-sidebar', handleToggleCart);
        window.addEventListener('toggle-wishlist-modal', handleToggleWishlist);
        window.addEventListener('toggle-favorites-modal', handleToggleFavorites);

        return () => {
            window.removeEventListener('toggle-cart-sidebar', handleToggleCart);
            window.removeEventListener('toggle-wishlist-modal', handleToggleWishlist);
            window.removeEventListener('toggle-favorites-modal', handleToggleFavorites);
        };
    }, []);

    // Update browser document/tab title dynamically
    useEffect(() => {
        if (buyerInfo.businessName) {
            document.title = `${buyerInfo.businessName} | Buyer Dashboard`;
        } else if (buyerInfo.name) {
            document.title = `${buyerInfo.name} | Buyer Dashboard`;
        } else {
            document.title = "Buyer Dashboard";
        }
    }, [buyerInfo]);

    // ============ SUPABASE DATA CONNECTIVITY ============
    useEffect(() => {
        const fetchDBData = async () => {
            setLoading(true);
            try {
                // Get session user
                const userStr = localStorage.getItem('farmvantara_user') || sessionStorage.getItem('farmvantara_user');
                if (!userStr || userStr === "undefined" || userStr === "null") {
                    window.location.href = "/login";
                    return;
                }
                const sessionUser = JSON.parse(userStr);

                // 1. Fetch live business profile
                const { data: profile, error: profileErr } = await supabase
                    .from('businesses')
                    .select('*')
                    .eq('user_id', sessionUser.id)
                    .single();

                let activeBuyerProfile = null;
                if (!profileErr && profile) {
                    activeBuyerProfile = profile;
                    setBuyerInfo({
                        id: profile.id,
                        userId: profile.user_id,
                        name: profile.full_name,
                        businessName: profile.business_name,
                        businessType: profile.business_type,
                        contactPerson: profile.full_name,
                        phone: profile.phone,
                        email: profile.email,
                        state: profile.state,
                        gstNumber: profile.gst_number || '',
                        monthlyRequirement: profile.monthly_requirement || 0,
                        preferredCrops: profile.preferred_crops || '',
                        deliveryAddress: profile.delivery_address || `${profile.business_name}, ${profile.state}`
                    });
                } else if (profileErr && profileErr.code === 'PGRST116') {
                    // Auto-create missing business profile in DB!
                    console.log("Auto-creating missing business profile for user:", sessionUser.id);
                    const { data: newProfile, error: createErr } = await supabase
                        .from('businesses')
                        .insert([{
                            user_id: sessionUser.id,
                            full_name: sessionUser.name || 'Business Buyer',
                            email: sessionUser.email,
                            phone: sessionUser.phone || '9876543210',
                            state: 'Delhi',
                            business_name: sessionUser.name ? `${sessionUser.name} Supermarket` : 'Fresh Mart Supermarket',
                            business_type: 'retailer',
                            gst_number: '',
                            monthly_requirement: 500.00,
                            preferred_crops: 'Wheat, Rice',
                            delivery_address: '123, MG Road, Connaught Place, New Delhi - 110001'
                        }])
                        .select()
                        .single();

                    if (!createErr && newProfile) {
                        activeBuyerProfile = newProfile;
                        setBuyerInfo({
                            id: newProfile.id,
                            userId: newProfile.user_id,
                            name: newProfile.full_name,
                            businessName: newProfile.business_name,
                            businessType: newProfile.business_type,
                            contactPerson: newProfile.full_name,
                            phone: newProfile.phone,
                            email: newProfile.email,
                            state: newProfile.state,
                            gstNumber: newProfile.gst_number || '',
                            monthlyRequirement: newProfile.monthly_requirement || 0,
                            preferredCrops: newProfile.preferred_crops || '',
                            deliveryAddress: newProfile.delivery_address || `${newProfile.business_name}, ${newProfile.state}`
                        });
                    } else {
                        console.error("Failed to auto-create business profile:", createErr);
                        // Fallback as backup
                        setBuyerInfo({
                            id: sessionUser.id,
                            userId: sessionUser.id,
                            name: sessionUser.name || 'Fresh Mart',
                            businessName: sessionUser.name || 'Fresh Mart Supermarket',
                            contactPerson: sessionUser.name || 'Rajesh',
                            phone: sessionUser.phone || '9876543210',
                            email: sessionUser.email || 'freshmart@example.com',
                            state: 'Delhi',
                            gstNumber: '',
                            monthlyRequirement: 500,
                            preferredCrops: 'Wheat, Rice',
                            deliveryAddress: '123, MG Road, Connaught Place, New Delhi - 110001'
                        });
                    }
                } else {
                    console.error("Error or missing profile in businesses:", profileErr);
                    // Fallback to local session data if DB profile doesn't exist yet
                    setBuyerInfo({
                        id: sessionUser.id,
                        userId: sessionUser.id,
                        name: sessionUser.name || 'Fresh Mart',
                        businessName: sessionUser.name || 'Fresh Mart Supermarket',
                        contactPerson: sessionUser.name || 'Rajesh',
                        phone: sessionUser.phone || '9876543210',
                        email: sessionUser.email || 'freshmart@example.com',
                        state: 'Delhi',
                        gstNumber: '',
                        monthlyRequirement: 500,
                        preferredCrops: 'Wheat, Rice',
                        deliveryAddress: '123, MG Road, Connaught Place, New Delhi - 110001'
                    });
                }

                const buyerId = activeBuyerProfile ? activeBuyerProfile.id : sessionUser.id;

                // 2. Fetch live products
                const { data: dbProducts, error: prodErr } = await supabase.from('products').select('*');
                let loadedProducts = [];
                if (!prodErr && dbProducts) {
                    loadedProducts = dbProducts.map(p => ({
                        id: p.id,
                        farmerId: p.farmer_id,
                        name: p.name,
                        category: p.category || 'vegetables',
                        quantity: parseFloat(p.quantity) || 0,
                        price: parseFloat(p.price) || 0,
                        description: p.description || '',
                        imageData: p.image_url
                    }));
                    setProducts(loadedProducts);
                }

                // 3. Fetch live farmers
                const { data: dbFarmers, error: farmErr } = await supabase.from('farmers').select('*');
                if (!farmErr && dbFarmers) {
                    setFarmers(dbFarmers.map(f => ({
                        id: f.id,
                        name: f.full_name || f.farm_name,
                        location: f.state || 'Punjab',
                        rating: 4.8,
                        verified: true,
                        established: '2015',
                        totalProducts: loadedProducts.filter(p => p.farmerId === f.id).length,
                        totalSales: 10000,
                        description: `Farm name: ${f.farm_name}. Experience: ${f.experience} years. Village: ${f.village || ''}. Selected Crops: ${f.selected_crops || ''}`
                    })));
                }

                // 4. Fetch live orders
                const { data: dbOrders, error: ordErr } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('buyer_id', buyerId);

                if (!ordErr && dbOrders) {
                    const sortedOrders = [...dbOrders].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
                    setOrders(sortedOrders.map((o, idx) => {
                        const matchedFarmer = dbFarmers ? dbFarmers.find(f => f.id === o.farmer_id) : null;
                        const resolvedFarmerName = matchedFarmer 
                            ? (matchedFarmer.full_name || matchedFarmer.farm_name) 
                            : 'Verified Farmer';

                        const initials = getFarmerInitials(resolvedFarmerName);
                        return {
                            id: o.id,
                            displayId: `${initials} - ORD - ${String(idx + 1).padStart(3, '0')}`,
                            farmerId: o.farmer_id,
                            farmerName: resolvedFarmerName,
                            productId: o.product_id || '',
                            productName: o.product || o.special_instructions || 'Farm Produce',
                            quantity: parseFloat(o.quantity) || 50,
                            amount: parseFloat(o.amount) || 0,
                            status: o.status || 'pending',
                            date: o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
                            deliveryAddress: o.delivery_address || 'Registered Address'
                        };
                    }));
                }

                // 5. Fetch live pitches
                const { data: dbPitches, error: pitchErr } = await supabase
                    .from('pitches')
                    .select('*')
                    .eq('buyer_id', buyerId);

                if (!pitchErr && dbPitches) {
                    const sortedPitches = [...dbPitches].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
                    setReceivedPitches(sortedPitches.map((p, idx) => {
                        const matchedFarmer = dbFarmers ? dbFarmers.find(f => f.id === p.farmer_id) : null;
                        const resolvedFarmerName = matchedFarmer 
                            ? (matchedFarmer.full_name || matchedFarmer.farm_name) 
                            : 'Farmer partner';

                        return {
                            id: p.id,
                            displayId: 'PIT - ' + String(idx + 1).padStart(3, '0'),
                            farmerId: p.farmer_id,
                            farmerName: resolvedFarmerName,
                            productId: p.product_id || '',
                            productName: p.product_name || 'Produce offer',
                            quantity: parseFloat(p.quantity) || 100,
                            price: parseFloat(p.price) || 50,
                            total: parseFloat(p.quantity) * parseFloat(p.price),
                            message: p.message || '',
                            status: p.status || 'pending',
                            date: p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
                        };
                    }));
                }

            } catch (err) {
                console.error("Database connection error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDBData();
    }, []);

    // Filter purchase report orders when dates or base orders change
    useEffect(() => {
        if (reportFromDate && reportToDate) {
            const filtered = orders.filter(o => {
                const oDate = new Date(o.date);
                return oDate >= new Date(reportFromDate) && oDate <= new Date(reportToDate);
            });
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders([...orders]);
        }
    }, [orders, reportFromDate, reportToDate]);

    // ============ UTILITIES ============
    const formatCurrency = (amt) => '₹' + parseFloat(amt).toLocaleString('en-IN');

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const showNotification = (msg) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message: msg }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const toggleModal = (modalName, isOpen) => {
        setModals(prev => ({ ...prev, [modalName]: isOpen }));
    };

    const logout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                await supabase.auth.signOut();
            } catch (e) {
                console.error("Supabase signOut error:", e);
            }
            localStorage.removeItem('farmvantara_token');
            localStorage.removeItem('farmvantara_user');
            localStorage.removeItem('cart_buyer');
            localStorage.removeItem('wishlist_buyer');
            localStorage.removeItem('favorites_buyer');
            sessionStorage.removeItem('farmvantara_token');
            sessionStorage.removeItem('farmvantara_user');
            showNotification('Logged out successfully!');
            window.location.href = "/";
        }
    };

    // ============ INTERACTION HANDLERS ============
    // Wishlist Toggle
    const toggleWishlist = (productId) => {
        const index = wishlist.indexOf(productId);
        if (index > -1) {
            setWishlist(prev => prev.filter(id => id !== productId));
            showNotification('Removed from wishlist');
        } else {
            setWishlist(prev => [...prev, productId]);
            showNotification('Added to wishlist');
        }
    };

    // Favorite Farmer Toggle
    const toggleFavoriteFarmer = (farmerId) => {
        const index = favoriteFarmers.indexOf(farmerId);
        if (index > -1) {
            setFavoriteFarmers(prev => prev.filter(id => id !== farmerId));
            showNotification('Removed from favorites');
        } else {
            setFavoriteFarmers(prev => [...prev, farmerId]);
            showNotification('Added to favorites');
        }
    };

    // Cart management
    const addToCart = (productId, qty) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        if (product.quantity < qty) {
            showNotification(`Only ${product.quantity}kg available!`);
            return;
        }

        const farmer = farmers.find(f => f.id === product.farmerId) || { name: 'Unknown Farm' };

        setCart(prev => {
            const existing = prev.find(item => item.productId === productId);
            if (existing) {
                return prev.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            return [...prev, {
                productId,
                productName: product.name,
                farmerId: product.farmerId,
                farmerName: farmer.name,
                price: product.price,
                quantity: qty
            }];
        });
        showNotification(`Added ${qty}kg of ${product.name} to cart`);
    };

    const updateCartItemQtyBy = (index, delta) => {
        const item = cart[index];
        const newQty = item.quantity + delta;
        if (newQty < 0.1) {
            removeFromCart(index);
            return;
        }

        const product = products.find(p => p.id === item.productId);
        if (product && product.quantity < newQty) {
            showNotification(`Only ${product.quantity}kg available!`);
            return;
        }

        setCart(prev => prev.map((c, i) => i === index ? { ...c, quantity: newQty } : c));
    };

    const updateCartItemQty = (index, val) => {
        const qty = parseFloat(val);
        if (isNaN(qty) || qty <= 0) {
            removeFromCart(index);
            return;
        }

        const item = cart[index];
        const product = products.find(p => p.id === item.productId);
        if (product && product.quantity < qty) {
            showNotification(`Only ${product.quantity}kg available!`);
            return;
        }

        setCart(prev => prev.map((c, i) => i === index ? { ...c, quantity: qty } : c));
    };

    const removeFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
        showNotification('Item removed from cart');
    };

    // Bulk Checkout
    const handleCheckout = async () => {
        if (cart.length === 0) {
            showNotification('Cart is empty!');
            return;
        }

        const ordersByFarmer = {};
        cart.forEach(item => {
            if (!ordersByFarmer[item.farmerId]) {
                ordersByFarmer[item.farmerId] = { farmerName: item.farmerName, items: [] };
            }
            ordersByFarmer[item.farmerId].items.push(item);
        });

        const newOrdersList = [];

        for (const farmerId in ordersByFarmer) {
            const farmerData = ordersByFarmer[farmerId];
            let totalAmount = 0;
            const orderItems = [];

            for (const item of farmerData.items) {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    totalAmount += item.price * item.quantity;
                    orderItems.push(`${item.quantity}kg of ${item.productName}`);
                }
            }

            const initials = getFarmerInitials(farmerData.farmerName);
            const orderPayload = {
                id: `${initials} - ORD - ${String(orders.length + newOrdersList.length + 1).padStart(3, '0')}`,
                displayId: `${initials} - ORD - ${String(orders.length + newOrdersList.length + 1).padStart(3, '0')}`,
                farmerId: farmerId,
                farmerName: farmerData.farmerName,
                productId: '',
                productName: orderItems.join(', '),
                quantity: cart.filter(i => i.farmerId === farmerId).reduce((sum, i) => sum + i.quantity, 0),
                amount: totalAmount,
                status: 'pending',
                date: new Date().toISOString().split('T')[0],
                deliveryAddress: buyerInfo.deliveryAddress
            };

            // Write order to Supabase
            try {
                const { error: insErr } = await supabase.from('orders').insert([{
                    farmer_id: orderPayload.farmerId,
                    buyer_id: buyerInfo.id,
                    buyer: buyerInfo.businessName,
                    product: orderPayload.productName,
                    quantity: orderPayload.quantity,
                    amount: orderPayload.amount,
                    status: 'pending',
                    special_instructions: orderPayload.productName,
                    delivery_address: buyerInfo.deliveryAddress
                }]);
                if (insErr) throw insErr;

                // Adjust local stock ONLY if DB insert succeeds
                for (const item of farmerData.items) {
                    const product = products.find(p => p.id === item.productId);
                    if (product) {
                        product.quantity -= item.quantity;
                    }
                }
                newOrdersList.push(orderPayload);
            } catch (e) {
                console.error("Supabase Order insertion failed:", e);
                showNotification(`Order placement failed: ${e.message || e.details || 'Check RLS Policies'}`);
                return; // Exit early to avoid clearing cart
            }
        }

        setOrders(prev => [...prev, ...newOrdersList]);
        setCart([]);
        setIsCartOpen(false);
        showNotification(`${cart.length} item(s) ordered successfully!`);
        setCurrentSection('orders');
    };

    // Place Single Order (modal form submission)
    const handlePlaceSingleOrder = async (e) => {
        e.preventDefault();
        const quantity = parseFloat(orderForm.quantity);
        const product = products.find(p => p.id === orderForm.productId);

        if (product && product.quantity < quantity) {
            showNotification(`Only ${product.quantity}kg available!`);
            return;
        }

        const initials = getFarmerInitials(orderForm.farmerName);
        const newOrder = {
            id: `${initials} - ORD - ${String(orders.length + 1).padStart(3, '0')}`,
            displayId: `${initials} - ORD - ${String(orders.length + 1).padStart(3, '0')}`,
            farmerId: orderForm.farmerId,
            farmerName: orderForm.farmerName,
            productId: orderForm.productId,
            productName: orderForm.productName,
            quantity,
            amount: orderForm.price * quantity,
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            deliveryAddress: orderForm.deliveryAddress
        };

        // Write order to Supabase
        try {
            const { error: insErr } = await supabase.from('orders').insert([{
                farmer_id: newOrder.farmerId,
                buyer_id: buyerInfo.id,
                buyer: buyerInfo.businessName,
                product: newOrder.productName,
                quantity: newOrder.quantity,
                amount: newOrder.amount,
                status: 'pending',
                special_instructions: `${newOrder.quantity}kg of ${newOrder.productName}. Instruction: ${orderForm.instructions}`,
                delivery_address: orderForm.deliveryAddress
            }]);
            if (insErr) throw insErr;

            // Adjust local stock ONLY if DB insert succeeds
            if (product) {
                product.quantity -= quantity;
            }

            setOrders(prev => [...prev, newOrder]);
            showNotification('Order placed successfully!');
            toggleModal('order', false);
            setCurrentSection('orders');
        } catch (err) {
            console.error("Supabase Single Order insertion failed:", err);
            showNotification(`Order placement failed: ${err.message || err.details || 'Check RLS Policies'}`);
        }
    };

    // Open Single Order Form
    const openOrderModal = (productId, presetQty = 1) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const farmer = farmers.find(f => f.id === product.farmerId) || { name: 'Unknown Farm' };

        setOrderForm({
            productId: String(product.id),
            farmerId: String(product.farmerId),
            productName: product.name,
            farmerName: farmer.name,
            price: product.price,
            quantity: presetQty,
            total: product.price * presetQty,
            deliveryAddress: buyerInfo.deliveryAddress,
            instructions: ''
        });

        toggleModal('productDetail', false);
        toggleModal('order', true);
    };

    const handleOrderFormQtyChange = (val) => {
        const qty = parseFloat(val) || 1;
        setOrderForm(prev => ({
            ...prev,
            quantity: qty,
            total: prev.price * qty
        }));
    };

    const changeOrderFormQtyBy = (delta) => {
        const newQty = Math.max(0.1, orderForm.quantity + delta);
        setOrderForm(prev => ({
            ...prev,
            quantity: newQty,
            total: prev.price * newQty
        }));
    };

    // Settings Update
    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('businesses')
                .update({
                    business_name: buyerInfo.businessName,
                    full_name: buyerInfo.contactPerson,
                    phone: buyerInfo.phone,
                    email: buyerInfo.email,
                    delivery_address: buyerInfo.deliveryAddress
                })
                .eq('id', buyerInfo.id);

            if (error) throw error;
            showNotification('Settings saved successfully!');
        } catch (err) {
            console.error("Error saving settings details:", err);
            showNotification("Failed to update settings");
        }
    };

    // Profile Save
    const handleSaveProfile = async () => {
        const newBusinessName = document.getElementById('profileBusinessName')?.value || buyerInfo.businessName;
        const newContactPerson = document.getElementById('profileContactPerson')?.value || buyerInfo.contactPerson;
        const newPhone = document.getElementById('profilePhone')?.value || buyerInfo.phone;
        const newEmail = document.getElementById('profileEmail')?.value || buyerInfo.email;
        const newAddress = document.getElementById('profileAddress')?.value || buyerInfo.deliveryAddress;

        try {
            const { error } = await supabase
                .from('businesses')
                .update({
                    business_name: newBusinessName,
                    full_name: newContactPerson,
                    phone: newPhone,
                    email: newEmail,
                    delivery_address: newAddress
                })
                .eq('id', buyerInfo.id);

            if (error) throw error;

            setBuyerInfo(prev => ({
                ...prev,
                businessName: newBusinessName,
                contactPerson: newContactPerson,
                phone: newPhone,
                email: newEmail,
                deliveryAddress: newAddress
            }));
            showNotification('Profile updated successfully!');
            toggleModal('profile', false);
        } catch (err) {
            console.error("Error saving profile details:", err);
            showNotification("Failed to update profile");
        }
    };

    // received pitch responses
    const handleRespondToPitch = async (pitchId, response) => {
        const pitch = receivedPitches.find(p => p.id === pitchId);
        if (pitch) {
            try {
                const { error } = await supabase
                    .from('pitches')
                    .update({ status: response })
                    .eq('id', pitchId);

                if (error) throw error;

                pitch.status = response;
                showNotification(response === 'interested' ? `Interested in ${pitch.productName}` : `Declined pitch from ${pitch.farmerName}`);
                setReceivedPitches([...receivedPitches]);
            } catch (err) {
                console.error("Error responding to pitch:", err);
                showNotification("Failed to update pitch status");
            }
        }
    };

    // Track order modal popup
    const trackOrder = (orderId) => {
        const o = orders.find(o => o.id === orderId);
        if (o) {
            setTrackedOrder(o);
            toggleModal('tracking', true);
        }
    };

    // Farm details view
    const openFarmDetailsModal = (farmerId) => {
        const farmer = farmers.find(f => f.id === farmerId);
        if (farmer) {
            setSelectedFarmer(farmer);
            toggleModal('favorites', false);
            toggleModal('farmDetails', true);
        }
    };

    // Farmer products view
    const openFarmerProductsModal = (farmerId, farmerName) => {
        const list = products.filter(p => p.farmerId === farmerId);
        setFarmerProductsModalData({
            title: `${farmerName} - Products`,
            productsList: list,
            farmerId
        });
        toggleModal('farmDetails', false);
        toggleModal('favorites', false);
        toggleModal('farmerProducts', true);
    };

    // Product details view
    const openProductDetailsModal = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setSelectedProduct(product);
            setDetailQuantity(1);
            toggleModal('wishlist', false);
            toggleModal('farmerProducts', false);
            toggleModal('productDetail', true);
        }
    };

    // PDF Report Export
    const downloadPDFReport = async () => {
        const el = document.getElementById('reportContainer');
        if (!el || !el.innerHTML) {
            showNotification('No report data found!');
            return;
        }

        showNotification('Generating PDF report...');
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `${buyerInfo.businessName.toLowerCase().replace(/ /g, '-')}-report-${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
        };

        try {
            await html2pdf().set(opt).from(el).save();
            showNotification('PDF downloaded successfully!');
        } catch (e) {
            console.error("PDF generation failed:", e);
            showNotification('PDF generation error');
        }
    };

    // ============ CHART CONFIGS ============
    // Monthly purchases chart data
    const purchaseChartData = {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
            label: 'Monthly Purchase (₹)',
            data: [150000, 175000, 185000, 210000, 235000, 265000, 287500, 310000],
            borderColor: '#27ae60',
            backgroundColor: 'rgba(39, 174, 96, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };

    const purchaseChartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    };

    // Category distribution data
    const categoryChartData = {
        labels: ['Grains', 'Vegetables', 'Fruits', 'Dairy', 'Spices', 'Others'],
        datasets: [{
            data: [40, 25, 15, 10, 5, 5],
            backgroundColor: [
                '#27ae60',
                '#219653',
                '#f2c94c',
                '#f2994a',
                '#2d9cdb',
                '#e74c3c'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    };

    // ============ RENDERING COMPUTATIONS ============
    const totalSpent = orders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status)).reduce((s, o) => s + o.amount, 0);
    const activeOrdersCount = orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status)).length;
    const pendingPitchesCount = receivedPitches.filter(p => p.status === 'pending').length;

    // Filtered products list
    const filteredProductsList = products.filter(p => {
        const farmer = farmers.find(f => f.id === p.farmerId) || {};
        if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
        if (productLocationFilter !== 'all' && farmer.location !== productLocationFilter) return false;
        return true;
    });

    // Farmer-wise summary report computation - only confirmed, shipped, and delivered orders
    const farmerPurchasesReportMap = {};
    filteredOrders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status)).forEach(order => {
        if (!farmerPurchasesReportMap[order.farmerName]) {
            farmerPurchasesReportMap[order.farmerName] = { quantity: 0, amount: 0, orders: 0 };
        }
        farmerPurchasesReportMap[order.farmerName].quantity += order.quantity;
        farmerPurchasesReportMap[order.farmerName].amount += order.amount;
        farmerPurchasesReportMap[order.farmerName].orders += 1;
    });

    if (loading) {
        return (
            <div className="buyer-dashboard-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8f9fa' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem', borderRightColor: 'transparent', borderRadius: '50%', border: '4px solid var(--primary-green)', animation: 'spin 1s linear infinite' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h3 style={{ marginTop: '20px', color: 'var(--dark-green)', fontFamily: 'Poppins, sans-serif' }}>Connecting to Supabase...</h3>
                    <p style={{ color: '#666' }}>Fetching fresh database records...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="buyer-dashboard-page">
            {/* Header section (strictly visual wrapper around dynamic data) */}
            <header className="main-header" style={{ display: 'none' }}>
                {/* Embedded within the layout header or dynamically updating Navbar */}
            </header>

            {/* Custom slide-in notifications portal */}
            <div className="notifications-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999' }}>
                {notifications.map(n => (
                    <div key={n.id} className="notification" style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="fas fa-check-circle" style={{ color: 'var(--primary-green)', marginRight: '10px' }}></i>
                        {n.message}
                    </div>
                ))}
            </div>

            {/* Cart Sidebar */}
            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`} id="cartSidebar">
                <div className="cart-header">
                    <h3><i className="fas fa-shopping-cart"></i> Your Cart</h3>
                    <button className="close-cart" onClick={() => setIsCartOpen(false)}>&times;</button>
                </div>
                <div className="cart-items" id="cartItems">
                    {cart.length === 0 ? (
                        <div className="empty-state" style={{ padding: '40px' }}>
                            <i className="fas fa-shopping-cart"></i>
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div className="cart-item" key={index}>
                                <div className="cart-item-image">
                                    {products.find(p => p.id === item.productId)?.imageData ? (
                                        <img src={products.find(p => p.id === item.productId).imageData} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                    ) : (
                                        <i className="fas fa-seedling"></i>
                                    )}
                                </div>
                                <div className="cart-item-details">
                                    <div className="cart-item-name">{item.productName}</div>
                                    <div className="cart-item-farmer"><i className="fas fa-tractor"></i> {item.farmerName}</div>
                                    <div className="cart-item-price">{formatCurrency(item.price)}/kg</div>
                                    <div className="cart-item-actions">
                                        <div className="quantity-input" style={{ margin: '0' }}>
                                            <button className="qty-btn" onClick={() => updateCartItemQtyBy(index, -1)}>-</button>
                                            <input
                                                type="number"
                                                className="cart-item-qty"
                                                value={item.quantity}
                                                min="0.1"
                                                step="0.1"
                                                onChange={(e) => updateCartItemQty(index, e.target.value)}
                                            />
                                            <button className="qty-btn" onClick={() => updateCartItemQtyBy(index, 1)}>+</button>
                                        </div>
                                        <button className="remove-item" onClick={() => removeFromCart(index)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {cart.length > 0 && (
                    <div className="cart-footer" id="cartFooter">
                        <div className="cart-total">
                            <span>Total Amount:</span>
                            <span id="cartTotal">{formatCurrency(cart.reduce((sum, i) => sum + i.price * i.quantity, 0))}</span>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>

            {/* Dashboard Workspace */}
            <div className="dashboard">
                {/* Sidebar Navigation */}
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h2><i className="fas fa-shopping-cart"></i> {buyerInfo.businessName || buyerInfo.name || 'Buyer Dashboard'}</h2>
                    </div>
                    <nav className="sidebar-nav">
                        <ul>
                            <li>
                                <a
                                    onClick={() => setCurrentSection('overview')}
                                    className={currentSection === 'overview' ? 'active' : ''}
                                >
                                    <i className="fas fa-home"></i> Overview
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => { setCurrentSection('products'); setProductCategoryFilter('all'); setProductLocationFilter('all'); }}
                                    className={currentSection === 'products' ? 'active' : ''}
                                >
                                    <i className="fas fa-seedling"></i> Browse Products
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => setCurrentSection('orders')}
                                    className={currentSection === 'orders' ? 'active' : ''}
                                >
                                    <i className="fas fa-shopping-cart"></i> My Orders
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => setCurrentSection('purchaseReport')}
                                    className={currentSection === 'purchaseReport' ? 'active' : ''}
                                >
                                    <i className="fas fa-chart-line"></i> Purchase Report
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => setCurrentSection('pitches')}
                                    className={currentSection === 'pitches' ? 'active' : ''}
                                >
                                    <i className="fas fa-handshake"></i> Received Pitches
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={() => setCurrentSection('settings')}
                                    className={currentSection === 'settings' ? 'active' : ''}
                                >
                                    <i className="fas fa-cog"></i> Settings
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content Areas */}
                <main className="main-content">


                    {/* OVERVIEW SECTION */}
                    {currentSection === 'overview' && (
                        <div id="overview" className="dashboard-section">
                            <div className="dashboard-header">
                                <div className="dashboard-title">
                                    <h1>Welcome back, {buyerInfo.name}!</h1>
                                    <p>Discover fresh farm products directly from farmers</p>
                                </div>
                                <div className="dashboard-actions">
                                    <button className="btn btn-primary" onClick={() => setCurrentSection('products')}>
                                        <i className="fas fa-search"></i> Browse Products
                                    </button>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="stats-grid" id="statsGrid">
                                <div className="stat-card">
                                    <div className="stat-icon"><i className="fas fa-rupee-sign"></i></div>
                                    <div className="stat-value">{formatCurrency(totalSpent)}</div>
                                    <div className="stat-label">Total Spent</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon"><i className="fas fa-truck"></i></div>
                                    <div className="stat-value">{activeOrdersCount}</div>
                                    <div className="stat-label">Active Orders</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon"><i className="fas fa-shopping-basket"></i></div>
                                    <div className="stat-value">{orders.length}</div>
                                    <div className="stat-label">Total Orders</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon"><i className="fas fa-handshake"></i></div>
                                    <div className="stat-value">{pendingPitchesCount}</div>
                                    <div className="stat-label">Pending Pitches</div>
                                </div>
                            </div>

                            {/* Recent Orders table */}
                            <div className="dashboard-section">
                                <div className="section-header">
                                    <h2><i className="fas fa-clock"></i> Recent Orders</h2>
                                    <a onClick={() => setCurrentSection('orders')} className="btn btn-secondary btn-small" style={{ cursor: 'pointer' }}>
                                        View All
                                    </a>
                                </div>
                                <div className="orders-table-container">
                                    <table className="orders-table" id="recentOrdersTable">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Farmer</th>
                                                <th>Product</th>
                                                <th>Quantity</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.slice(0, 4).map(o => (
                                                <tr key={o.id}>
                                                    <td>{o.displayId || o.id}</td>
                                                    <td>{o.farmerName}</td>
                                                    <td>{o.productName}</td>
                                                    <td>{o.quantity} kg</td>
                                                    <td>{formatCurrency(o.amount)}</td>
                                                    <td>
                                                        <span className={`order-status status-${o.status}`}>
                                                            {o.status}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(o.date)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recommended Products Grid */}
                            <div className="dashboard-section">
                                <div className="section-header">
                                    <h2><i className="fas fa-fire"></i> Recommended for You</h2>
                                </div>
                                <div className="products-grid" id="recommendedGrid">
                                    {products.slice(0, 3).map(p => {
                                        const farmer = farmers.find(f => f.id === p.farmerId) || { name: 'Verified Farmer' };
                                        const isInWishlist = wishlist.includes(p.id);
                                        return (
                                            <div className="product-card" key={p.id}>
                                                <div className="product-image">
                                                    {p.imageData ? (
                                                        <img src={p.imageData} alt={p.name} />
                                                    ) : (
                                                        <div className="image-placeholder"><i className="fas fa-seedling"></i></div>
                                                    )}
                                                </div>
                                                <div className="product-info">
                                                    <div className="product-name">{p.name}</div>
                                                    <div className="farmer-info">
                                                        <span className="farmer-name"><i className="fas fa-tractor"></i> {farmer.name}</span>
                                                        <button className="view-farm-btn" onClick={() => openFarmDetailsModal(p.farmerId)}>
                                                            <i className="fas fa-eye"></i> View Farm
                                                        </button>
                                                    </div>
                                                    <div className="product-price">{formatCurrency(p.price)}/kg</div>
                                                    <div className="product-stock"><i className="fas fa-box"></i> {p.quantity} kg</div>
                                                    <div className="product-actions">
                                                        <button className="btn btn-primary btn-small" onClick={() => openProductDetailsModal(p.id)}>
                                                            View Details
                                                        </button>
                                                        <button
                                                            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                                                            onClick={() => toggleWishlist(p.id)}
                                                        >
                                                            <i className="fas fa-heart"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BROWSE PRODUCTS SECTION */}
                    {currentSection === 'products' && (
                        <div id="products" className="dashboard-section">
                            <div className="section-header">
                                <h2><i className="fas fa-seedling"></i> Browse Products from Farmers</h2>
                                <div className="filter-group">
                                    <select
                                        value={productCategoryFilter}
                                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">All Categories</option>
                                        <option value="grains">Grains</option>
                                        <option value="vegetables">Vegetables</option>
                                        <option value="fruits">Fruits</option>
                                    </select>
                                    <select
                                        value={productLocationFilter}
                                        onChange={(e) => setProductLocationFilter(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">All Locations</option>
                                        {[...new Set(farmers.map(f => f.location).filter(Boolean))].map(loc => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="products-grid" id="productsGrid">
                                {filteredProductsList.length === 0 ? (
                                    <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                                        <i className="fas fa-search"></i>
                                        <h3>No products found</h3>
                                    </div>
                                ) : (
                                    filteredProductsList.map(p => {
                                        const farmer = farmers.find(f => f.id === p.farmerId) || { name: 'Verified Farmer', location: 'India', rating: 4.8, verified: true };
                                        const isInWishlist = wishlist.includes(p.id);
                                        return (
                                            <div className="product-card" key={p.id}>
                                                <div className="product-image">
                                                    {p.imageData ? (
                                                        <img src={p.imageData} alt={p.name} />
                                                    ) : (
                                                        <div className="image-placeholder"><i className="fas fa-seedling"></i></div>
                                                    )}
                                                    {farmer.verified && <div className="farmer-badge">✓ Verified</div>}
                                                </div>
                                                <div className="product-info">
                                                    <div className="product-name">{p.name}</div>
                                                    <div className="farmer-info">
                                                        <span className="farmer-name"><i className="fas fa-tractor"></i> {farmer.name} • ⭐ {farmer.rating}</span>
                                                        <button className="view-farm-btn" onClick={() => openFarmDetailsModal(p.farmerId)}>
                                                            <i className="fas fa-eye"></i> View Farm
                                                        </button>
                                                    </div>
                                                    <div className="product-price">{formatCurrency(p.price)}/kg</div>
                                                    <div className="product-stock"><i className="fas fa-box"></i> {p.quantity} kg</div>
                                                    <div className="product-actions">
                                                        <button className="btn btn-primary btn-small" onClick={() => openProductDetailsModal(p.id)}>
                                                            View Details
                                                        </button>
                                                        <button
                                                            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                                                            onClick={() => toggleWishlist(p.id)}
                                                        >
                                                            <i className="fas fa-heart"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {/* MY ORDERS SECTION */}
                    {currentSection === 'orders' && (
                        <div id="orders" className="dashboard-section">
                            <div className="section-header">
                                <h2><i className="fas fa-shopping-cart"></i> My Orders</h2>
                                <select
                                    value={orderStatusFilter}
                                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="all">All Orders</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                            </div>
                            <div className="orders-table-container">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Farmer</th>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders
                                            .filter(o => orderStatusFilter === 'all' ? true : o.status === orderStatusFilter)
                                            .map(o => (
                                                <tr key={o.id}>
                                                    <td>{o.displayId || o.id}</td>
                                                    <td>{o.farmerName}</td>
                                                    <td>{o.productName}</td>
                                                    <td>{o.quantity} kg</td>
                                                    <td>{formatCurrency(o.amount)}</td>
                                                    <td>
                                                        <span className={`order-status status-${o.status}`}>
                                                            {o.status}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(o.date)}</td>
                                                    <td>
                                                        <button className="btn btn-secondary btn-small" onClick={() => trackOrder(o.id)}>
                                                            Track
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* PURCHASE REPORT SECTION */}
                    {currentSection === 'purchaseReport' && (
                        <div id="purchaseReport" className="dashboard-section">
                            <div className="section-header">
                                <h2><i className="fas fa-chart-line"></i> Purchase Report & Analytics</h2>
                                <div className="dashboard-actions">
                                    <button className="btn btn-secondary" onClick={() => { setReportFromDate(''); setReportToDate(''); }}>
                                        <i className="fas fa-calendar-alt"></i> Clear Dates
                                    </button>
                                    <button className="btn btn-primary" onClick={downloadPDFReport}>
                                        <i className="fas fa-download"></i> Download PDF Report
                                    </button>
                                </div>
                            </div>

                            {/* Date Filter Inputs */}
                            <div className="filter-section" style={{ background: 'var(--light-gray)', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                                <div className="date-filter-group" style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
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

                            {/* Analytics Charts Row */}
                            <div className="charts-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                                <div className="chart-card-wrapper" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
                                    <h3 style={{ fontSize: '14px', marginBottom: '15px', color: 'var(--dark-green)' }}>Purchase Trend</h3>
                                    <Line data={purchaseChartData} options={purchaseChartOptions} />
                                </div>
                                <div className="chart-card-wrapper" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
                                    <h3 style={{ fontSize: '14px', marginBottom: '15px', color: 'var(--dark-green)' }}>Category Distribution</h3>
                                    <Doughnut data={categoryChartData} />
                                </div>
                            </div>

                            {/* PDF Printable Container */}
                            <div id="reportContainer" className="report-preview" style={{ position: 'relative', padding: '25px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
                                {/* Top Right Corner Brand Logo */}
                                <div style={{ position: 'absolute', top: '25px', right: '25px' }}>
                                    <img
                                        src={logo}
                                        alt="Farm Vantara Logo"
                                        style={{ height: '40px', width: 'auto' }}
                                    />
                                </div>

                                <div className="report-header" style={{ paddingRight: '180px', marginBottom: '20px' }}>
                                    <h2>{buyerInfo.businessName} - Purchase Report</h2>
                                    <p>{new Date().toLocaleString('en-IN')}</p>
                                </div>
                                <div className="report-summary">
                                    <div className="report-summary-card">
                                        <div className="value">{formatCurrency(filteredOrders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status)).reduce((s, o) => s + o.amount, 0))}</div>
                                        <div>Total Spend</div>
                                    </div>
                                    <div className="report-summary-card">
                                        <div className="value">{filteredOrders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status)).length}</div>
                                        <div>Orders</div>
                                    </div>
                                    <div className="report-summary-card">
                                        <div className="value">{filteredOrders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status)).reduce((s, o) => s + o.quantity, 0)} kg</div>
                                        <div>Quantity</div>
                                    </div>
                                    <div className="report-summary-card">
                                        <div className="value">
                                            {filteredOrders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status)).length > 0
                                                ? formatCurrency(Math.round(filteredOrders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status)).reduce((s, o) => s + o.amount, 0) / filteredOrders.filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status)).length))
                                                : '₹0'}
                                        </div>
                                        <div>Avg Order</div>
                                    </div>
                                </div>

                                <div className="report-section-title">Farmer-wise Summary</div>
                                <table className="report-table">
                                    <thead>
                                        <tr>
                                            <th>Farmer</th>
                                            <th>Orders</th>
                                            <th>Quantity</th>
                                            <th>Total Purchases</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(farmerPurchasesReportMap).map(([farmName, data]) => (
                                            <tr key={farmName}>
                                                <td><strong>{farmName}</strong></td>
                                                <td>{data.orders}</td>
                                                <td>{data.quantity} kg</td>
                                                <td>{formatCurrency(data.amount)}</td>
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
                                            <th>Farmer</th>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map(o => (
                                            <tr key={o.id}>
                                                <td>{o.displayId || o.id}</td>
                                                <td>{formatDate(o.date)}</td>
                                                <td>{o.farmerName}</td>
                                                <td>{o.productName}</td>
                                                <td>{o.quantity} kg</td>
                                                <td>{formatCurrency(o.amount)}</td>
                                                <td>{o.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="report-footer" style={{ color: '#94a3b8', fontWeight: '500' }}>
                                    &copy; {new Date().getFullYear()} Farm Vantara India Pvt Ltd. All Rights Reserved.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RECEIVED PITCHES SECTION */}
                    {currentSection === 'pitches' && (
                        <div id="pitches" className="dashboard-section">
                            <div className="section-header">
                                <h2><i className="fas fa-handshake"></i> Received Pitches from Farmers</h2>
                                <select
                                    value={pitchStatusFilter}
                                    onChange={(e) => setPitchStatusFilter(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="all">All Pitches</option>
                                    <option value="pending">Pending</option>
                                    <option value="interested">Interested</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div id="pitchesGrid">
                                {receivedPitches.filter(p => pitchStatusFilter === 'all' ? true : p.status === pitchStatusFilter).length === 0 ? (
                                    <div className="empty-state">
                                        <i className="fas fa-handshake"></i>
                                        <h3>No pitches received</h3>
                                    </div>
                                ) : (
                                    <div className="products-grid">
                                        {receivedPitches
                                            .filter(p => pitchStatusFilter === 'all' ? true : p.status === pitchStatusFilter)
                                            .map(p => (
                                                <div className="product-card" key={p.id}>
                                                    <div className="product-image">
                                                        <div className="image-placeholder"><i className="fas fa-handshake"></i></div>
                                                    </div>
                                                    <div className="product-info">
                                                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary-green)', background: 'rgba(39,174,96,0.1)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '5px' }}>
                                                            {p.displayId}
                                                        </span>
                                                        <div className="product-name">Pitch from {p.farmerName}</div>
                                                        <div className="product-price">{p.productName} - {formatCurrency(p.price)}/kg</div>
                                                        <div className="interest-area">
                                                            <strong>Message:</strong><br />{p.message}
                                                        </div>
                                                        <div className="product-actions">
                                                            {p.status === 'pending' ? (
                                                                <>
                                                                    <button className="btn btn-success btn-small" onClick={() => handleRespondToPitch(p.id, 'interested')}>
                                                                        Interested
                                                                    </button>
                                                                    <button className="btn btn-danger btn-small" onClick={() => handleRespondToPitch(p.id, 'rejected')}>
                                                                        Decline
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <span className={`order-status status-${p.status === 'interested' ? 'confirmed' : 'delivered'}`}>
                                                                    {p.status.toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SETTINGS SECTION */}
                    {currentSection === 'settings' && (
                        <div id="settings" className="dashboard-section">
                            <div className="section-header">
                                <h2><i className="fas fa-cog"></i> Account Settings</h2>
                            </div>
                            <form id="settingsForm" onSubmit={handleUpdateSettings}>
                                <div className="form-group">
                                    <label>Business Name</label>
                                    <input
                                        type="text"
                                        value={buyerInfo.businessName}
                                        onChange={(e) => setBuyerInfo({ ...buyerInfo, businessName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact Person</label>
                                    <input
                                        type="text"
                                        value={buyerInfo.contactPerson}
                                        onChange={(e) => setBuyerInfo({ ...buyerInfo, contactPerson: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={buyerInfo.phone}
                                        onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={buyerInfo.email}
                                        onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Delivery Address</label>
                                    <textarea
                                        rows="2"
                                        value={buyerInfo.deliveryAddress}
                                        onChange={(e) => setBuyerInfo({ ...buyerInfo, deliveryAddress: e.target.value })}
                                    />
                                </div>
                                <div className="form-buttons">
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>

            {/* ============ MODAL POPUPS ============ */}
            {/* Wishlist Modal */}
            {modals.wishlist && (
                <div id="wishlistSectionModal" className="modal active">
                    <div className="modal-content" style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h2><i className="fas fa-heart"></i> My Wishlist</h2>
                            <button className="modal-close" onClick={() => toggleModal('wishlist', false)}>&times;</button>
                        </div>
                        <div id="wishlistModalContent" className="products-grid" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {products.filter(p => wishlist.includes(p.id)).length === 0 ? (
                                <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                                    <i className="fas fa-heart"></i>
                                    <h3>Wishlist is empty</h3>
                                    <p>Save products you are interested in</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => { toggleModal('wishlist', false); setCurrentSection('products'); }}
                                    >
                                        Browse Products
                                    </button>
                                </div>
                            ) : (
                                products.filter(p => wishlist.includes(p.id)).map(p => {
                                    const farmer = farmers.find(f => f.id === p.farmerId) || { name: 'Verified Farmer' };
                                    return (
                                        <div className="product-card" key={p.id}>
                                            <div className="product-image">
                                                {p.imageData ? (
                                                    <img src={p.imageData} alt={p.name} />
                                                ) : (
                                                    <div className="image-placeholder"><i className="fas fa-seedling"></i></div>
                                                )}
                                            </div>
                                            <div className="product-info">
                                                <div className="product-name">{p.name}</div>
                                                <div className="farmer-info">
                                                    <span className="farmer-name"><i className="fas fa-tractor"></i> {farmer.name}</span>
                                                </div>
                                                <div className="product-price">{formatCurrency(p.price)}/kg</div>
                                                <div className="product-stock">{p.quantity} kg available</div>
                                                <div className="product-actions">
                                                    <button className="btn btn-primary btn-small" onClick={() => openProductDetailsModal(p.id)}>
                                                        View Details
                                                    </button>
                                                    <button className="btn btn-outline btn-small" onClick={() => toggleWishlist(p.id)}>
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Favorite Farmers Modal */}
            {modals.favorites && (
                <div id="favoritesSectionModal" className="modal active">
                    <div className="modal-content" style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h2><i className="fas fa-star"></i> My Favorite Farmers</h2>
                            <button className="modal-close" onClick={() => toggleModal('favorites', false)}>&times;</button>
                        </div>
                        <div id="favoritesModalContent" className="products-grid" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {farmers.filter(f => favoriteFarmers.includes(f.id)).length === 0 ? (
                                <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                                    <i className="fas fa-star"></i>
                                    <h3>No favorite farmers yet</h3>
                                    <p>Browse products and add farmers to favorites</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => { toggleModal('favorites', false); setCurrentSection('products'); }}
                                    >
                                        Browse Products
                                    </button>
                                </div>
                            ) : (
                                farmers.filter(f => favoriteFarmers.includes(f.id)).map(f => (
                                    <div className="product-card" key={f.id}>
                                        <div className="product-image"><div className="image-placeholder"><i className="fas fa-tractor"></i></div></div>
                                        <div className="product-info">
                                            <div className="product-name">{f.name}</div>
                                            <div className="farmer-info">
                                                <span className="farmer-name">📍 {f.location} • ⭐ {f.rating}</span>
                                                <button className="view-farm-btn" onClick={() => openFarmDetailsModal(f.id)}>
                                                    View Farm
                                                </button>
                                            </div>
                                            <div className="product-stock">{f.verified ? '✓ Verified Farmer' : 'Verification Pending'}</div>
                                            <div className="product-actions">
                                                <button className="btn btn-primary btn-small" onClick={() => openFarmerProductsModal(f.id, f.name)}>
                                                    View Products
                                                </button>
                                                <button className="btn btn-outline btn-small" onClick={() => toggleFavoriteFarmer(f.id)}>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Farmer Products Modal */}
            {modals.farmerProducts && (
                <div id="farmerProductsModal" className="modal active">
                    <div className="modal-content" style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h2><i className="fas fa-tractor"></i> {farmerProductsModalData.title}</h2>
                            <button className="modal-close" onClick={() => toggleModal('farmerProducts', false)}>&times;</button>
                        </div>
                        <div id="farmerProductsContent" className="products-grid" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {farmerProductsModalData.productsList.length === 0 ? (
                                <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                                    <i className="fas fa-seedling"></i>
                                    <p>No products available from this farmer</p>
                                </div>
                            ) : (
                                farmerProductsModalData.productsList.map(p => {
                                    const isInWishlist = wishlist.includes(p.id);
                                    return (
                                        <div className="product-card" style={{ cursor: 'pointer' }} onClick={() => openProductDetailsModal(p.id)} key={p.id}>
                                            <div className="product-image">
                                                {p.imageData ? (
                                                    <img src={p.imageData} alt={p.name} />
                                                ) : (
                                                    <div className="image-placeholder"><i className="fas fa-seedling"></i></div>
                                                )}
                                            </div>
                                            <div className="product-info">
                                                <div className="product-name">{p.name}</div>
                                                <div className="product-price">{formatCurrency(p.price)}/kg</div>
                                                <div className="product-stock"><i className="fas fa-box"></i> {p.quantity} kg available</div>
                                                <div className="product-actions">
                                                    <button className="btn btn-primary btn-small" onClick={(e) => { e.stopPropagation(); openProductDetailsModal(p.id); }}>
                                                        View Details
                                                    </button>
                                                    <button
                                                        className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleWishlist(p.id);
                                                            setFarmerProductsModalData(prev => ({
                                                                ...prev,
                                                                productsList: products.filter(item => item.farmerId === prev.farmerId)
                                                            }));
                                                        }}
                                                    >
                                                        <i className="fas fa-heart"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Product Detail Modal */}
            {modals.productDetail && selectedProduct && (
                <div id="productDetailModal" className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Product Details</h2>
                            <button className="modal-close" onClick={() => toggleModal('productDetail', false)}>&times;</button>
                        </div>
                        <div id="productDetailContent">
                            <div className="product-detail-container">
                                <div className="product-detail-image">
                                    {selectedProduct.imageData ? (
                                        <img src={selectedProduct.imageData} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                    ) : (
                                        <i className="fas fa-seedling"></i>
                                    )}
                                </div>
                                <div className="product-detail-info">
                                    <div className="detail-row">
                                        <span className="detail-label">Product:</span>
                                        <strong>{selectedProduct.name}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Farmer:</span>
                                        {(farmers.find(f => f.id === selectedProduct.farmerId) || {}).name || 'Verified Farmer'}
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Category:</span>
                                        {selectedProduct.category}
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Price:</span>
                                        {formatCurrency(selectedProduct.price)}/kg
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Stock:</span>
                                        {selectedProduct.quantity} kg
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Description:</span>
                                        {selectedProduct.description}
                                    </div>

                                    <div className="form-group" style={{ marginTop: '20px' }}>
                                        <label>Quantity (kg):</label>
                                        <div className="quantity-input">
                                            <button type="button" className="qty-btn" onClick={() => setDetailQuantity(Math.max(0.1, detailQuantity - 1))}>-</button>
                                            <input
                                                type="number"
                                                className="qty-input"
                                                value={detailQuantity}
                                                min="0.1"
                                                max={selectedProduct.quantity}
                                                step="0.1"
                                                onChange={(e) => setDetailQuantity(Math.min(selectedProduct.quantity, Math.max(0.1, parseFloat(e.target.value) || 1)))}
                                            />
                                            <button type="button" className="qty-btn" onClick={() => setDetailQuantity(Math.min(selectedProduct.quantity, detailQuantity + 1))}>+</button>
                                        </div>
                                    </div>

                                    <div className="form-buttons">
                                        <button className="btn btn-success" onClick={() => openOrderModal(selectedProduct.id, detailQuantity)}>
                                            <i className="fas fa-bolt"></i> Buy Now
                                        </button>
                                        <button className="btn btn-primary" onClick={() => { addToCart(selectedProduct.id, detailQuantity); toggleModal('productDetail', false); }}>
                                            <i className="fas fa-cart-plus"></i> Add to Cart
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => toggleModal('productDetail', false)}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Farm Details Modal */}
            {modals.farmDetails && selectedFarmer && (
                <div id="farmDetailsModal" className="modal active">
                    <div className="modal-content" style={{ maxWidth: '680px' }}>
                        <div className="modal-header">
                            <h2><i className="fas fa-tractor"></i> Farm Details</h2>
                            <button className="modal-close" onClick={() => toggleModal('farmDetails', false)}>&times;</button>
                        </div>
                        <div id="farmDetailsContent">
                            <div className="farm-detail-container">
                                <div className="farm-detail-image">
                                    <i className="fas fa-tractor" style={{ fontSize: '80px', color: 'var(--primary-green)' }}></i>
                                    <div className="farm-stats">
                                        <div className="farm-stat-card">
                                            <strong>⭐ Rating</strong>
                                            <span className="value">{selectedFarmer.rating} ★</span>
                                        </div>
                                        <div className="farm-stat-card">
                                            <strong>Since</strong>
                                            <span className="value">{selectedFarmer.established}</span>
                                        </div>
                                        <div className="farm-stat-card">
                                            <strong>Products</strong>
                                            <span className="value">{products.filter(p => p.farmerId === selectedFarmer.id).length}</span>
                                        </div>
                                        <div className="farm-stat-card">
                                            <strong>Inventory Value</strong>
                                            <span className="value">
                                                {formatCurrency(products.filter(p => p.farmerId === selectedFarmer.id).reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity)), 0))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="farm-detail-info">
                                    <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>{selectedFarmer.name}</h3>
                                    <p style={{ margin: '0 0 6px 0', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <i className="fas fa-map-marker-alt" style={{ color: '#64748b' }}></i> {selectedFarmer.location}
                                    </p>
                                    <p style={{ margin: '0 0 12px 0', color: '#27ae60', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <i className="fas fa-check-circle" style={{ color: '#27ae60' }}></i> {selectedFarmer.verified ? 'Verified Farmer' : 'Verification Pending'}
                                    </p>
                                    <p style={{ margin: '0 0 15px 0', color: '#334155', fontSize: '14px', lineHeight: '1.5' }}>
                                        <strong style={{ color: '#1e293b', display: 'block', marginBottom: '4px' }}>About Farm:</strong>
                                        {selectedFarmer.description}
                                    </p>

                                    {/* Products Summary Box */}
                                    <div className="farmer-products-box" style={{ background: '#f4faf6', padding: '12px 15px', borderRadius: '8px', border: '1px solid rgba(39, 174, 96, 0.1)', marginTop: '15px', marginBottom: '20px' }}>
                                        <div style={{ fontWeight: '600', color: 'var(--dark-green)', marginBottom: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            📦 Products:
                                        </div>
                                        {products.filter(p => p.farmerId === selectedFarmer.id).length === 0 ? (
                                            <div style={{ fontSize: '12px', color: '#888' }}>No products listed</div>
                                        ) : (
                                            <ul style={{ margin: 0, paddingLeft: '15px', listStyleType: 'disc', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                                                {products.filter(p => p.farmerId === selectedFarmer.id).map(p => (
                                                    <li key={p.id} style={{ marginBottom: '4px' }}>
                                                        {p.name} ({p.quantity}kg @ {formatCurrency(p.price)}/kg)
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="form-buttons" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => openFarmerProductsModal(selectedFarmer.id, selectedFarmer.name)}
                                            style={{ background: '#27ae60', borderColor: '#27ae60', color: 'white', fontWeight: '600', height: '36px', padding: '0 16px', borderRadius: '6px' }}
                                        >
                                            View Products
                                        </button>
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => {
                                                toggleFavoriteFarmer(selectedFarmer.id);
                                                setSelectedFarmer(prev => ({ ...prev }));
                                            }}
                                            style={{
                                                borderColor: '#27ae60',
                                                color: '#27ae60',
                                                background: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontWeight: '600',
                                                height: '36px',
                                                padding: '0 16px',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {favoriteFarmers.includes(selectedFarmer.id) ? (
                                                <>
                                                    <span style={{ color: '#e74c3c' }}>❤️</span> Remove from Favorites
                                                </>
                                            ) : (
                                                <>
                                                    <span style={{ color: '#e74c3c' }}>❤️</span> Add to Favorites
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Place Order Modal */}
            {modals.order && (
                <div id="orderModal" className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Place Order</h2>
                            <button className="modal-close" onClick={() => toggleModal('order', false)}>&times;</button>
                        </div>
                        <form id="orderForm" onSubmit={handlePlaceSingleOrder}>
                            <div className="form-group">
                                <label>Product</label>
                                <input type="text" value={orderForm.productName} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Farmer</label>
                                <input type="text" value={orderForm.farmerName} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Price per kg (₹)</label>
                                <input type="text" value={orderForm.price} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Quantity (kg)</label>
                                <div className="quantity-input">
                                    <button type="button" className="qty-btn" onClick={() => changeOrderFormQtyBy(-1)}>-</button>
                                    <input
                                        type="number"
                                        className="qty-input"
                                        value={orderForm.quantity}
                                        min="0.1"
                                        step="0.1"
                                        onChange={(e) => handleOrderFormQtyChange(e.target.value)}
                                    />
                                    <button type="button" className="qty-btn" onClick={() => changeOrderFormQtyBy(1)}>+</button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Total Amount</label>
                                <input type="text" value={formatCurrency(orderForm.total)} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Delivery Address</label>
                                <textarea
                                    rows="2"
                                    value={orderForm.deliveryAddress}
                                    onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Special Instructions</label>
                                <textarea
                                    rows="2"
                                    value={orderForm.instructions}
                                    onChange={(e) => setOrderForm({ ...orderForm, instructions: e.target.value })}
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="button" className="btn btn-secondary" onClick={() => toggleModal('order', false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Place Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Order Tracking Modal */}
            {modals.tracking && trackedOrder && (
                <div id="trackingModal" className="modal active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div className="modal-content" style={{ maxWidth: '550px', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: 'white' }}>
                        <div className="modal-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fas fa-truck" style={{ color: '#27ae60' }}></i> Track Order
                            </h2>
                            <button className="modal-close" onClick={() => toggleModal('tracking', false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                        </div>

                        {/* Order Summary Grid */}
                        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '4px' }}>Order ID</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{trackedOrder.displayId || trackedOrder.id}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '4px' }}>Farmer Partner</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{trackedOrder.farmerName}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '4px' }}>Product & Qty</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{trackedOrder.productName} ({trackedOrder.quantity} kg)</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '4px' }}>Total Amount</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#27ae60' }}>{formatCurrency(trackedOrder.amount)}</div>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', marginBottom: '4px' }}>Delivery Address</div>
                                <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>{trackedOrder.deliveryAddress}</div>
                            </div>
                        </div>

                        {/* Visual Timeline Stepper */}
                        <div style={{ marginBottom: '10px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '20px', textAlign: 'left' }}>Delivery Timeline</h4>
                            
                            {trackedOrder.status === 'cancelled' ? (
                                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 80px' }}>
                                    {/* Horizontal timeline bar - Red, connects center-to-center perfectly without extending beyond */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        left: '115px',
                                        right: '115px',
                                        height: '4px',
                                        background: '#e74c3c',
                                        zIndex: 1
                                    }}></div>

                                    {/* Step 1: Placed */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '70px', textAlign: 'center' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: '#27ae60',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            marginBottom: '8px',
                                            boxShadow: '0 4px 6px rgba(39, 174, 96, 0.2)'
                                        }}>
                                            <i className="fas fa-clipboard-check"></i>
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#1e293b' }}>Placed</span>
                                        <span style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>{trackedOrder.date}</span>
                                    </div>

                                    {/* Step 2: Cancelled */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '70px', textAlign: 'center' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: '#e74c3c',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            marginBottom: '8px',
                                            boxShadow: '0 4px 6px rgba(231, 76, 60, 0.2)'
                                        }}>
                                            <i className="fas fa-times-circle"></i>
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#e74c3c' }}>Cancelled</span>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 10px' }}>
                                    {/* Horizontal timeline bar - center-aligned */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        left: '45px',
                                        right: '45px',
                                        height: '4px',
                                        background: '#e2e8f0',
                                        zIndex: 1
                                    }}></div>

                                    {/* Active connection bar depending on status - center-aligned */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        left: '45px',
                                        width: 
                                            trackedOrder.status === 'pending' ? '0%' :
                                            trackedOrder.status === 'confirmed' ? 'calc((100% - 90px) * 0.3333)' :
                                            trackedOrder.status === 'shipped' ? 'calc((100% - 90px) * 0.6666)' :
                                            trackedOrder.status === 'delivered' ? 'calc(100% - 90px)' : '0%',
                                        height: '4px',
                                        background: '#27ae60',
                                        zIndex: 2,
                                        transition: 'width 0.4s ease'
                                    }}></div>

                                    {/* Step 1: Placed / Pending */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '70px', textAlign: 'center' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: '#27ae60',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            marginBottom: '8px',
                                            boxShadow: '0 4px 6px rgba(39, 174, 96, 0.2)'
                                        }}>
                                            <i className="fas fa-clipboard-check"></i>
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#1e293b' }}>Placed</span>
                                        <span style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>{trackedOrder.date}</span>
                                    </div>

                                    {/* Step 2: Confirmed */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '70px', textAlign: 'center' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: ['confirmed', 'shipped', 'delivered'].includes(trackedOrder.status) ? '#27ae60' : '#e2e8f0',
                                            color: ['confirmed', 'shipped', 'delivered'].includes(trackedOrder.status) ? 'white' : '#64748b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            marginBottom: '8px',
                                            transition: 'all 0.3s'
                                        }}>
                                            <i className="fas fa-check-circle"></i>
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: ['confirmed', 'shipped', 'delivered'].includes(trackedOrder.status) ? '#1e293b' : '#64748b' }}>Confirmed</span>
                                    </div>

                                    {/* Step 3: Shipped */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '70px', textAlign: 'center' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: ['shipped', 'delivered'].includes(trackedOrder.status) ? '#27ae60' : '#e2e8f0',
                                            color: ['shipped', 'delivered'].includes(trackedOrder.status) ? 'white' : '#64748b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            marginBottom: '8px',
                                            transition: 'all 0.3s'
                                        }}>
                                            <i className="fas fa-truck"></i>
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: ['shipped', 'delivered'].includes(trackedOrder.status) ? '#1e293b' : '#64748b' }}>Shipped</span>
                                    </div>

                                    {/* Step 4: Delivered */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '70px', textAlign: 'center' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: trackedOrder.status === 'delivered' ? '#27ae60' : '#e2e8f0',
                                            color: trackedOrder.status === 'delivered' ? 'white' : '#64748b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            marginBottom: '8px',
                                            transition: 'all 0.3s'
                                        }}>
                                            <i className="fas fa-home"></i>
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: trackedOrder.status === 'delivered' ? '#1e293b' : '#64748b' }}>Delivered</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-buttons" style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', border: 'none', padding: '0' }}>
                            <button className="btn btn-primary btn-sm" onClick={() => toggleModal('tracking', false)} style={{ background: '#27ae60', borderColor: '#27ae60', padding: '8px 24px', borderRadius: '8px', fontWeight: '600', color: 'white', cursor: 'pointer', height: 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyerDashboard;