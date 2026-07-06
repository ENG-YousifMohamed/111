'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import './dashboard.css';
import { getProducts, deleteProduct, updateProductStock, type DashboardProduct } from '@/actions/productActions';
import type { DashboardData } from '@/lib/dashboard-types';

export default function DashboardUltimate() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [currentDate, setCurrentDate] = useState('');
    const dashboardRef = useRef<HTMLDivElement>(null);

    const [products, setProducts] = useState<DashboardProduct[]>([]);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            const response = await fetch('/api/dashboard', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Dashboard API failed');
            }
            const data = (await response.json()) as DashboardData;
            setDashboardData(data);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            setDashboardData(null);
        }
    }, []);

    const fetchRealProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const [data] = await Promise.all([getProducts(), fetchDashboardData()]);
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchDashboardData]);

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('⚠️ هل أنت متأكد من مسح هذا المنتج نهائياً من قاعدة البيانات؟')) return;
        
        const res = await deleteProduct(id);
        if (res.success) {
            setProducts((currentProducts) => currentProducts.filter(p => p.id !== id));
            void fetchDashboardData();
            alert('✅ تم مسح المنتج بنجاح!');
        } else {
            alert('❌ حدث خطأ أثناء الحذف');
        }
    };

    const handleEditProductStock = async (product: DashboardProduct) => {
        const nextStock = prompt(`Update stock for ${product.name}`, String(product.stock));
        if (nextStock === null) return;

        const stock = Number(nextStock);
        if (!Number.isFinite(stock) || stock < 0) {
            alert('Please enter a valid stock number.');
            return;
        }

        const result = await updateProductStock(product.id, stock);
        if (!result.success) {
            alert('Could not update product stock.');
            return;
        }

        const normalizedStock = Math.floor(stock);
        setProducts((currentProducts) =>
            currentProducts.map((currentProduct) =>
                currentProduct.id === product.id
                    ? { ...currentProduct, stock: normalizedStock }
                    : currentProduct,
            ),
        );
        void fetchDashboardData();
        alert('Stock updated successfully.');
    };

    useEffect(() => {
        queueMicrotask(() => {
            void fetchRealProducts();
        });

        const dashboard = dashboardRef.current;
        if (!dashboard) return;
        const dashboardElement = dashboard;
        const counterIntervals: number[] = [];
        const resetTimers: number[] = [];

        // ===== PARTICLES GENERATOR =====
        const container = dashboardElement.querySelector('#particles');
        if (container && container.childNodes.length === 0) {
            const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDuration = (15 + Math.random() * 20) + 's';
                particle.style.animationDelay = (Math.random() * 15) + 's';
                particle.style.width = (2 + Math.random() * 4) + 'px';
                particle.style.height = particle.style.width;
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.opacity = String(0.3 + Math.random() * 0.4);
                container.appendChild(particle);
            }
        }

        // ===== COUNTER ANIMATION =====
        function animateCounters() {
            dashboardElement.querySelectorAll('.counter').forEach(counter => {
                const htmlCounter = counter as HTMLElement;
                const target = parseFloat(htmlCounter.dataset.target || '0');
                const isFloat = target % 1 !== 0;
                let current = 0;
                const increment = target / 80;
                const interval = window.setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        window.clearInterval(interval);
                        htmlCounter.style.transform = 'scale(1.1)';
                        resetTimers.push(window.setTimeout(() => { htmlCounter.style.transform = ''; }, 200));
                    }
                    htmlCounter.textContent = isFloat ? current.toFixed(1) : Math.round(current).toString();
                }, 20);
                counterIntervals.push(interval);
            });
        }
        const counterTimer = window.setTimeout(animateCounters, 400);

        // ===== DATE =====
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
        setCurrentDate(now.toLocaleDateString('ar-EG', options));

        // ===== THEME =====
        const savedTheme = localStorage.getItem('theme');
        const shouldUseDarkTheme = savedTheme !== 'light';
        document.documentElement.setAttribute('data-theme', shouldUseDarkTheme ? 'dark' : 'light');
        const themeFrame = window.requestAnimationFrame(() => setIsDark(shouldUseDarkTheme));

        // ===== KEYBOARD SHORTCUTS =====
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key >= '1' && e.key <= '7') {
                e.preventDefault();
                const tabs = ['dashboard', 'sales', 'inventory', 'customers', 'settings', 'activity', 'analytics'];
                const index = parseInt(e.key) - 1;
                setActiveTab(tabs[index]);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput')?.focus();
            }
            if (e.key === 'Escape') {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            window.clearTimeout(counterTimer);
            window.cancelAnimationFrame(themeFrame);
            counterIntervals.forEach(window.clearInterval);
            resetTimers.forEach(window.clearTimeout);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [fetchRealProducts]);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const getPageTitle = () => {
        switch(activeTab) {
            case 'sales': return { title: <>Sales <span>Analytics</span></>, badge: 'ANALYTICS // SALES_DEPTH' };
            case 'inventory': return { title: <>Product <span>Inventory</span></>, badge: 'INVENTORY // STOCK_CONTROL' };
            case 'customers': return { title: <>Admin <span>Accounts</span></>, badge: 'AUTH // ADMIN_ACCESS' };
            case 'settings': return { title: <>Store <span>Settings</span></>, badge: 'SETTINGS // SYSTEM_CONFIG' };
            case 'activity': return { title: <>Activity <span>Feed</span></>, badge: 'ACTIVITY // LIVE_STREAM' };
            case 'analytics': return { title: <>Advanced <span>Analytics</span></>, badge: 'ADVANCED // DEEP_INSIGHTS' };
            default: return { title: <>Command <span>Center</span></>, badge: 'DASHBOARD // ULTIMATE_VIEW' };
        }
    };
    const handleToggleClick = (e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.classList.toggle('active');
    };

    const totalInventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
    const inStockCount = products.filter((product) => product.stock > 0).length;
    const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= 10).length;
    const outOfStockCount = products.filter((product) => product.stock === 0).length;
    const stats = dashboardData?.stats;
    const recentOrders = dashboardData?.recentOrders ?? [];
    const topProducts = dashboardData?.topProducts ?? [];
    const categoryDistribution = dashboardData?.categories ?? [];
    const adminAccounts = dashboardData?.admins ?? [];
    const totalRevenue = stats?.totalRevenue ?? 0;
    const orderCount = stats?.orderCount ?? 0;
    const customerCount = stats?.customerCount ?? 0;
    const averageOrder = stats?.averageOrder ?? 0;
    const conversionRate = stats?.conversionRate ?? 0;
    const liveStatsLabel = dashboardData ? 'Database Live' : 'Database Loading';
    const maxTopProductRevenue = Math.max(...topProducts.map((product) => product.revenue), 1);
    const formatCurrency = (value: number) =>
        value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        });
    const getOrderStatusClass = (status: string) => {
        const normalized = status.toLowerCase();
        if (normalized.includes('deliver') || normalized.includes('complete')) return 'completed';
        if (normalized.includes('ship')) return 'shipped';
        if (normalized.includes('process')) return 'processing';
        return 'pending';
    };
    const lowStockProducts = products.filter((product) => product.stock > 0 && product.stock <= 10).slice(0, 3);
    const dashboardNotifications = [
        ...recentOrders.slice(0, 3).map((order) => ({
            key: `order-${order.id}`,
            title: `New order #${order.orderNumber}`,
            desc: `${order.customer} placed an order worth ${formatCurrency(order.total)}`,
            time: order.status,
        })),
        ...lowStockProducts.map((product) => ({
            key: `stock-${product.id}`,
            title: 'Low stock alert',
            desc: `${product.name} has ${product.stock} pieces left`,
            time: 'Database inventory',
        })),
        ...adminAccounts.slice(0, 2).map((admin) => ({
            key: `admin-${admin.id}`,
            title: 'Admin account',
            desc: `${admin.name} can access the dashboard as ${admin.role}`,
            time: new Date(admin.createdAt).toLocaleDateString('en-US'),
        })),
    ].slice(0, 5);
    const activityEvents = [
        ...recentOrders.slice(0, 5).map((order) => ({
            key: `activity-order-${order.id}`,
            avatar: 'O',
            dotClass: 'dot-green',
            time: order.status,
            text: <>Order <strong>#{order.orderNumber}</strong> was loaded from the database for <strong>{order.customer}</strong></>,
        })),
        ...adminAccounts.slice(0, 5).map((admin) => ({
            key: `activity-admin-${admin.id}`,
            avatar: (admin.name.trim()[0] ?? 'A').toUpperCase(),
            dotClass: 'dot-blue',
            time: new Date(admin.createdAt).toLocaleDateString('en-US'),
            text: <><strong>{admin.name}</strong> has {admin.role} dashboard access for <strong>{admin.phone}</strong></>,
        })),
        ...products.slice(0, 3).map((product) => ({
            key: `activity-product-${product.id}`,
            avatar: 'P',
            dotClass: product.stock === 0 ? 'dot-rose' : product.stock <= 10 ? 'dot-amber' : 'dot-green',
            time: `${product.stock} in stock`,
            text: <><strong>{product.name}</strong> is available from the product database</>,
        })),
    ].slice(0, 8);

    return (
        <div ref={dashboardRef} dir="rtl" className="dashboard-page flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-all duration-400">
            
            {/* PARTICLES BACKGROUND */}
            <div id="particles"></div>

            {/* OVERLAY */}
            <div className={`overlay ${isNotifOpen ? 'open' : ''}`} onClick={() => setIsNotifOpen(false)}></div>

            {/* NOTIFICATION PANEL */}
            <div className={`notif-panel ${isNotifOpen ? 'open' : ''}`} id="notifPanel">
                <div className="header">
                    <h3>🔔 الإشعارات</h3>
                    <span className="close" onClick={() => setIsNotifOpen(false)}>✕</span>
                </div>
                {dashboardNotifications.length === 0 ? (
                    <div className="notif-item">
                        <div className="title">Database ready</div>
                        <div className="desc">No orders, admin updates, or low stock alerts yet.</div>
                        <div className="time">Live</div>
                    </div>
                ) : (
                    dashboardNotifications.map((notification) => (
                        <div className="notif-item" key={notification.key}>
                            <div className="title">{notification.title}</div>
                            <div className="desc">{notification.desc}</div>
                            <div className="time">{notification.time}</div>
                        </div>
                    ))
                )}
            </div>

            {/* SIDEBAR */}
            <nav className="sidebar">
                <Link href="/" className="logo">
                    α
                    <span className="badge-logo">3</span>
                </Link>

                <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')} title="Dashboard">
                    📊<span className="badge">5</span><span className="tooltip">Dashboard</span>
                </button>
                <button className={`nav-item ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')} title="Sales">
                    📈<span className="tooltip">Sales</span>
                </button>
                <button className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')} title="Inventory">
                    📦<span className="badge">{products.length}</span><span className="tooltip">Inventory</span>
                </button>
                <button className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')} title="Admins">
                    👥<span className="tooltip">Admins</span>
                </button>
                <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} title="Settings">
                    ⚙️<span className="tooltip">Settings</span>
                </button>
                <button className={`nav-item ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')} title="Activity">
                    📋<span className="badge">5</span><span className="tooltip">Activity</span>
                </button>
                <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')} title="Advanced">
                    🚀<span className="tooltip">Advanced</span>
                </button>

                <div className="spacer"></div>
                <button className="nav-item bottom-item" title="Profile">
                    👤<span className="tooltip">Profile</span>
                </button>
            </nav>

            {/* MAIN CONTENT */}
            <div className="main">
                {/* HEADER */}
                <header className="header">
                    <div className="header-left">
                        <div className="badge">
                            <span className="dot"></span>
                            <span>{getPageTitle().badge}</span>
                        </div>
                        <h1>{getPageTitle().title}</h1>
                    </div>
                    <div className="header-right">
                        <div className="search-box">
                            <span className="icon">🔍</span>
                            <input type="text" placeholder="Search..." id="searchInput" onKeyUp={(e) => {
                                if (e.key === 'Enter') alert(`🔍 جاري البحث عن: "${e.currentTarget.value}"`);
                            }} />
                            <span style={{fontSize:'9px', color:'var(--text-muted)', fontWeight:700}}>⌘K</span>
                        </div>
                        <span className="date">{currentDate}</span>
                        <button className="notif-btn" onClick={() => setIsNotifOpen(true)} title="Notifications">
                            🔔<span className="notif-badge">5</span>
                        </button>
                        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
                            {isDark ? '🌙' : '☀️'}
                        </button>
                        <div className="avatar">
                            أ<span className="online"></span>
                        </div>
                    </div>
                </header>

                {/* TAB 1: DASHBOARD */}
                <div className={`tab-content ${activeTab === 'dashboard' ? 'active' : ''}`}>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="top"><span className="icon">💰</span><span className="change up">↑ 12.5%</span></div>
                            <div className="value">{formatCurrency(totalRevenue)}</div>
                            <div className="label">Total Revenue</div>
                            <div className="mini-chart">
                                <div className="bar" style={{height:'40%'}}></div><div className="bar" style={{height:'60%'}}></div>
                                <div className="bar" style={{height:'80%'}}></div><div className="bar" style={{height:'50%'}}></div>
                                <div className="bar" style={{height:'90%'}}></div><div className="bar" style={{height:'70%'}}></div>
                                <div className="bar" style={{height:'100%'}}></div><div className="bar" style={{height:'55%'}}></div>
                                <div className="bar" style={{height:'85%'}}></div><div className="bar" style={{height:'65%'}}></div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="top"><span className="icon">🛒</span><span className="change up">↑ 8.2%</span></div>
                            <div className="value">{orderCount}</div>
                            <div className="label">Orders</div>
                            <div className="mini-chart">
                                <div className="bar" style={{height:'30%'}}></div><div className="bar" style={{height:'70%'}}></div>
                                <div className="bar" style={{height:'50%'}}></div><div className="bar" style={{height:'90%'}}></div>
                                <div className="bar" style={{height:'60%'}}></div><div className="bar" style={{height:'80%'}}></div>
                                <div className="bar" style={{height:'40%'}}></div><div className="bar" style={{height:'100%'}}></div>
                                <div className="bar" style={{height:'75%'}}></div><div className="bar" style={{height:'55%'}}></div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="top"><span className="icon">👥</span><span className="change up">↑ 23.1%</span></div>
                            <div className="value">{customerCount}</div>
                            <div className="label">Customers</div>
                            <div className="mini-chart">
                                <div className="bar" style={{height:'45%'}}></div><div className="bar" style={{height:'65%'}}></div>
                                <div className="bar" style={{height:'85%'}}></div><div className="bar" style={{height:'55%'}}></div>
                                <div className="bar" style={{height:'95%'}}></div><div className="bar" style={{height:'75%'}}></div>
                                <div className="bar" style={{height:'60%'}}></div><div className="bar" style={{height:'100%'}}></div>
                                <div className="bar" style={{height:'80%'}}></div><div className="bar" style={{height:'70%'}}></div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="top"><span className="icon">📈</span><span className="change down">↓ 0.5%</span></div>
                            <div className="value">{conversionRate.toFixed(1)}%</div>
                            <div className="label">Conversion Rate</div>
                            <div className="mini-chart">
                                <div className="bar" style={{height:'70%'}}></div><div className="bar" style={{height:'80%'}}></div>
                                <div className="bar" style={{height:'60%'}}></div><div className="bar" style={{height:'90%'}}></div>
                                <div className="bar" style={{height:'50%'}}></div><div className="bar" style={{height:'75%'}}></div>
                                <div className="bar" style={{height:'85%'}}></div><div className="bar" style={{height:'65%'}}></div>
                                <div className="bar" style={{height:'95%'}}></div><div className="bar" style={{height:'55%'}}></div>
                            </div>
                        </div>
                    </div>

                    <div className="quick-actions">
                        <Link href="/dashboard/add-product" className="action-btn primary">+ Add Product</Link>
                        <button className="action-btn success" onClick={() => setActiveTab('sales')}>Sales Report</button>
                        <button className="action-btn" onClick={() => setActiveTab('customers')}>Admins</button>
                        <button className="action-btn" onClick={() => setActiveTab('settings')}>Settings</button>
                        <button className="action-btn" onClick={() => setActiveTab('inventory')}>Inventory</button>
                        <button className="action-btn" onClick={() => setActiveTab('analytics')}>Analytics</button>
                    </div>

                    <div className="grid-2">
                        <div className="card">
                            <div className="title">📊 Revenue Overview <span className="action-link">View Full →</span></div>
                            <div className="chart-3d">
                                <div className="bar-3d"><div className="front" style={{height:'65%'}}><span className="tooltip">$1,980</span></div><div className="label">W1</div></div>
                                <div className="bar-3d"><div className="front" style={{height:'78%'}}><span className="tooltip">$2,340</span></div><div className="label">W2</div></div>
                                <div className="bar-3d"><div className="front" style={{height:'92%'}}><span className="tooltip">$2,760</span></div><div className="label">W3</div></div>
                                <div className="bar-3d"><div className="front" style={{height:'88%'}}><span className="tooltip">$2,640</span></div><div className="label">W4</div></div>
                                <div className="bar-3d"><div className="front" style={{height:'95%'}}><span className="tooltip">$2,850</span></div><div className="label">W5</div></div>
                                <div className="bar-3d"><div className="front" style={{height:'82%'}}><span className="tooltip">$2,460</span></div><div className="label">W6</div></div>
                                <div className="bar-3d"><div className="front" style={{height:'70%'}}><span className="tooltip">$2,100</span></div><div className="label">W7</div></div>
                                <div className="bar-3d"><div className="front" style={{height:'98%'}}><span className="tooltip">$2,940</span></div><div className="label">W8</div></div>
                                <div className="bar-3d"><div className="front" style={{height:'85%'}}><span className="tooltip">$2,550</span></div><div className="label">W9</div></div>
                                <div className="bar-3d"><div className="front" style={{height:'72%'}}><span className="tooltip">$2,160</span></div><div className="label">W10</div></div>
                                <div className="bar-3d"><div className="front" style={{height:'90%'}}><span className="tooltip">$2,700</span></div><div className="label">W11</div></div>
                                <div className="bar-3d"><div className="front" style={{height:'78%'}}><span className="tooltip">$2,340</span></div><div className="label">W12</div></div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="title">Recent Orders <span className="action-link">Database</span></div>
                            {recentOrders.length === 0 ? (
                                <div className="order-item">
                                    <div><div className="id">No orders yet</div><div className="name">Completed checkouts will appear here.</div></div>
                                    <div><div className="amount">{formatCurrency(0)}</div><span className="status pending">Pending</span></div>
                                </div>
                            ) : (
                                recentOrders.map((order) => (
                                    <div className="order-item" key={order.id}>
                                        <div><div className="id">#{order.orderNumber}</div><div className="name">{order.customer}</div></div>
                                        <div><div className="amount">{formatCurrency(order.total)}</div><span className={`status ${getOrderStatusClass(order.status)}`}>{order.status}</span></div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="grid-3">
                        <div className="card">
                            <div className="title">🌤️ Weather</div>
                            <div className="weather-widget">
                                <div className="temp">28°</div>
                                <div className="info">
                                    <div className="city">الرياض</div>
                                    <div className="desc">مشمس ☀️</div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="title">🏆 الإنجازات</div>
                            <div className="gamification">
                                <span className="badge-item gold"><span className="emoji">⭐</span> 5 نجوم</span>
                                <span className="badge-item platinum"><span className="emoji">💎</span> Platinum</span>
                                <span className="badge-item"><span className="emoji">🔥</span> 30 يوم</span>
                                <span className="badge-item"><span className="emoji">🚀</span> Level 7</span>
                            </div>
                        </div>

                        <div className="card">
                            <div className="title">Live Stats <span className="action-link">{liveStatsLabel}</span></div>
                            <div style={{fontSize:'12px', color:'var(--text-muted)'}}>
                                <div style={{display:'flex', justifyContent:'space-between', padding:'4px 0'}}><span>👥 Online</span><span style={{color:'#34d399'}}>{customerCount}</span></div>
                                <div style={{display:'flex', justifyContent:'space-between', padding:'4px 0'}}><span>🛒 Today</span><span style={{color:'#06b6d4'}}>{orderCount}</span></div>
                                <div style={{display:'flex', justifyContent:'space-between', padding:'4px 0'}}><span>💰 Revenue</span><span style={{color:'#f59e0b'}}>{formatCurrency(totalRevenue || totalInventoryValue)}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TAB 2: SALES */}
                <div className={`tab-content ${activeTab === 'sales' ? 'active' : ''}`}>
                    <div className="stats-grid">
                        <div className="stat-card"><div className="top"><span className="icon">📊</span><span className="change up">↑ 12.5%</span></div><div className="value">{formatCurrency(totalRevenue)}</div><div className="label">Total Sales</div></div>
                        <div className="stat-card"><div className="top"><span className="icon">🛒</span><span className="change up">↑ 8.2%</span></div><div className="value">{orderCount}</div><div className="label">Orders</div></div>
                        <div className="stat-card"><div className="top"><span className="icon">👤</span><span className="change up">↑ 23.1%</span></div><div className="value">{customerCount}</div><div className="label">Customers</div></div>
                        <div className="stat-card"><div className="top"><span className="icon">⭐</span><span className="change up">↑ 5.4%</span></div><div className="value">{formatCurrency(averageOrder)}</div><div className="label">Avg. Order</div></div>
                    </div>
                    <div className="grid-2">
                        <div className="card">
                            <div className="title">Top Selling Products <span className="action-link">Database</span></div>
                            {topProducts.length === 0 ? (
                                <div className="product-item"><div className="icon">0</div><div className="info"><div className="name">No order data yet</div><div className="meta"><span>0 units</span><span className="revenue">{formatCurrency(0)}</span></div></div><div className="bar"><div className="fill fill-cyan" style={{width:'0%'}}></div></div></div>
                            ) : (
                                topProducts.map((product, index) => (
                                    <div className="product-item" key={product.id}>
                                        <div className="icon">{index + 1}</div>
                                        <div className="info"><div className="name">{product.name}</div><div className="meta"><span>{product.units} units</span><span className="revenue">{formatCurrency(product.revenue)}</span></div></div>
                                        <div className="bar"><div className="fill fill-cyan" style={{width: `${Math.max(8, Math.round((product.revenue / maxTopProductRevenue) * 100))}%`}}></div></div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="card">
                            <div className="title">Category Distribution <span className="action-link">Database</span></div>
                            {categoryDistribution.length === 0 ? (
                                <div className="category-item"><div className="top"><span>No categories</span><span className="percent">0%</span></div><div className="bar"><div className="fill fill-cyan" style={{width:'0%'}}></div></div></div>
                            ) : (
                                categoryDistribution.map((category) => (
                                    <div className="category-item" key={category.name}>
                                        <div className="top"><span>{category.name}</span><span className="percent">{category.percent}%</span></div>
                                        <div className="bar"><div className="fill fill-cyan" style={{width: `${category.percent}%`}}></div></div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* TAB 3: INVENTORY */}
                <div className={`tab-content ${activeTab === 'inventory' ? 'active' : ''}`}>
                    <div className="stats-grid">
                        <div className="stat-card"><div className="top"><span className="icon">📦</span></div><div className="value">{products.length}</div><div className="label">Total Products</div></div>
                        <div className="stat-card"><div className="top"><span className="icon">✅</span></div><div className="value">{inStockCount}</div><div className="label">In Stock</div></div>
                        <div className="stat-card"><div className="top"><span className="icon">⚠️</span></div><div className="value">{lowStockCount}</div><div className="label">Low Stock</div></div>
                        <div className="stat-card"><div className="top"><span className="icon">❌</span></div><div className="value">{outOfStockCount}</div><div className="label">Out of Stock</div></div>
                    </div>
                    <div className="card">
                        <div className="title">📋 Product Inventory <Link href="/dashboard/add-product" className="action-link">+ Add Product</Link></div>
                        <div className="table-container">
                            <table>
                                <thead><tr><th>Product</th><th>SKU</th><th>Stock</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan={6} style={{textAlign: 'center', padding: '30px'}}>جاري تحميل المنتجات... ⏳</td></tr>
                                    ) : products.length === 0 ? (
                                        <tr><td colSpan={6} style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>لا يوجد منتجات حالياً، ابدأ بإضافة منتج! 📦</td></tr>
                                    ) : (
                                        products.map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <div className="cell-product">
                                                        <div className="icon">📦</div>
                                                        <span className="name">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td><span className="sku">{product.sku || '---'}</span></td>
                                                <td><span className="stock">{product.stock}</span></td>
                                                <td><span className="price">${product.price}</span></td>
                                                <td>
                                                    {product.stock > 10 ? <span className="status-badge in-stock">✅ In Stock</span> :
                                                     product.stock > 0 ? <span className="status-badge low-stock">⚠️ Low Stock</span> :
                                                     <span className="status-badge out-of-stock">❌ Out of Stock</span>}
                                                </td>
                                                <td>
                                                    <div className="actions">
                                                        <button title="Edit stock" onClick={() => handleEditProductStock(product)}>Edit</button>
                                                        <button className="danger" title="مسح" onClick={() => handleDeleteProduct(product.id)}>🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* TAB 4: ADMIN ACCOUNTS */}
                <div className={`tab-content ${activeTab === 'customers' ? 'active' : ''}`}>
                    <div className="stats-grid">
                        <div className="stat-card"><div className="top"><span className="icon">👥</span></div><div className="value">{adminAccounts.length}</div><div className="label">Admin Accounts</div></div>
                        <div className="stat-card"><div className="top"><span className="icon">🆕</span></div><div className="value">{recentOrders.length}</div><div className="label">Recent Orders</div></div>
                        <div className="stat-card"><div className="top"><span className="icon">📊</span></div><div className="value">{formatCurrency(averageOrder)}</div><div className="label">Average Order</div></div>
                        <div className="stat-card"><div className="top"><span className="icon">🏆</span></div><div className="value">{conversionRate.toFixed(1)}%</div><div className="label">Conversion Rate</div></div>
                    </div>
                    <div className="card">
                        <div className="title">Admin Accounts <span className="action-link">Database</span></div>
                        {adminAccounts.length === 0 ? (
                            <div className="customer-item">
                                <div className="left"><div className="avatar avatar-1">A</div><div className="info"><div className="name">No admin accounts yet</div><div className="meta"><span>Register the first account to create a Super Admin.</span></div></div></div>
                                <div className="right"><div className="tier tier-gold">SUPER ADMIN</div><div className="orders">0 accounts</div></div>
                            </div>
                        ) : (
                            adminAccounts.map((admin, index) => (
                                <div className="customer-item" key={admin.id}>
                                    <div className="left">
                                        <div className={`avatar avatar-${(index % 4) + 1}`}>{(admin.name.trim()[0] ?? 'A').toUpperCase()}</div>
                                        <div className="info">
                                            <div className="name">{admin.name}</div>
                                            <div className="meta"><span>{admin.phone}</span><span>{new Date(admin.createdAt).toLocaleDateString('en-US')}</span></div>
                                        </div>
                                    </div>
                                    <div className="right"><div className="tier tier-gold">{admin.role}</div><div className="orders">Dashboard access</div></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* TAB 5: SETTINGS */}
                <div className={`tab-content ${activeTab === 'settings' ? 'active' : ''}`}>
                    <div className="settings-grid">
                        <div className="card setting-card">
                            <div className="title">💳 Payment Gateways</div>
                            <div className="gateway-item gateway-stripe"><div className="left"><div className="icon">S</div><span className="name">Stripe</span></div><div className="right"><span className="status active">✅ Active</span><span className="configure">Configure</span></div></div>
                            <div className="gateway-item gateway-paypal"><div className="left"><div className="icon">P</div><span className="name">PayPal</span></div><div className="right"><span className="status active">✅ Active</span><span className="configure">Configure</span></div></div>
                            <div className="gateway-item gateway-fawry"><div className="left"><div className="icon">F</div><span className="name">Fawry</span></div><div className="right"><span className="status inactive">⏳ Inactive</span><span className="configure">Configure</span></div></div>
                            <div className="gateway-item gateway-cod"><div className="left"><div className="icon">C</div><span className="name">Cash on Delivery</span></div><div className="right"><span className="status active">✅ Active</span><span className="configure">Configure</span></div></div>
                        </div>
                        <div className="card setting-card">
                            <div className="title">🛡️ Security</div>
                            <div className="toggle-item"><div className="info"><div className="name">Two-Factor Authentication</div><div className="desc">Require 2FA for admin accounts</div></div><div className="toggle active" onClick={handleToggleClick}><div className="handle"></div></div></div>
                            <div className="toggle-item"><div className="info"><div className="name">SSL Certificate</div><div className="desc">Force HTTPS on all pages</div></div><div className="toggle active" onClick={handleToggleClick}><div className="handle"></div></div></div>
                            <div className="toggle-item"><div className="info"><div className="name">GDPR Compliance</div><div className="desc">Enable cookie consent banner</div></div><div className="toggle" onClick={handleToggleClick}><div className="handle"></div></div></div>
                            <div className="toggle-item"><div className="info"><div className="name">Login Attempts Limit</div><div className="desc">Block after 5 failed attempts</div></div><div className="toggle active" onClick={handleToggleClick}><div className="handle"></div></div></div>
                        </div>
                        <div className="card setting-card">
                            <div className="title">🔔 Notifications</div>
                            <div className="toggle-item"><div className="info"><div className="name">Email Notifications</div><div className="desc">Order confirmations & updates</div></div><div className="toggle active" onClick={handleToggleClick}><div className="handle"></div></div></div>
                            <div className="toggle-item"><div className="info"><div className="name">SMS Alerts</div><div className="desc">Real-time order tracking</div></div><div className="toggle" onClick={handleToggleClick}><div className="handle"></div></div></div>
                            <div className="toggle-item"><div className="info"><div className="name">Push Notifications</div><div className="desc">Browser push for promotions</div></div><div className="toggle active" onClick={handleToggleClick}><div className="handle"></div></div></div>
                            <div className="toggle-item"><div className="info"><div className="name">Weekly Reports</div><div className="desc">Send summary every Monday</div></div><div className="toggle active" onClick={handleToggleClick}><div className="handle"></div></div></div>
                        </div>
                        <div className="card setting-card">
                            <div className="title">⚙️ Advanced</div>
                            <div className="toggle-item"><div className="info"><div className="name">Developer Mode</div><div className="desc">Enable advanced debugging tools</div></div><div className="toggle" onClick={handleToggleClick}><div className="handle"></div></div></div>
                            <div className="toggle-item"><div className="info"><div className="name">API Access</div><div className="desc">Allow external API integrations</div></div><div className="toggle active" onClick={handleToggleClick}><div className="handle"></div></div></div>
                            <div className="toggle-item"><div className="info"><div className="name">Maintenance Mode</div><div className="desc">Put store in maintenance</div></div><div className="toggle" onClick={handleToggleClick}><div className="handle"></div></div></div>
                        </div>
                    </div>
                </div>

                {/* TAB 6: ACTIVITY */}
                <div className={`tab-content ${activeTab === 'activity' ? 'active' : ''}`}>
                    <div className="card">
                        <div className="title">📋 Recent Activity Feed <span className="action-link">Database</span></div>
                        {activityEvents.length === 0 ? (
                            <div className="activity-item"><div className="avatar-sm" style={{background:'var(--gradient-1)', color:'#000'}}>D</div><div className="content"><div className="text">No database activity yet.</div><div className="time">Live</div></div><div className="dot dot-blue"></div></div>
                        ) : (
                            activityEvents.map((event, index) => (
                                <div className="activity-item" key={event.key}>
                                    <div className="avatar-sm" style={{background: index % 4 === 3 ? 'linear-gradient(135deg,#f43f5e,#fb7185)' : `var(--gradient-${(index % 4) + 1})`, color:'#000'}}>{event.avatar}</div>
                                    <div className="content"><div className="text">{event.text}</div><div className="time">{event.time}</div></div>
                                    <div className={`dot ${event.dotClass}`}></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* TAB 7: ADVANCED ANALYTICS */}
                <div className={`tab-content ${activeTab === 'analytics' ? 'active' : ''}`}>
                    <div className="grid-2">
                        <div className="card">
                            <div className="title">📊 Advanced Analytics <span className="action-link">Export →</span></div>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                                <div style={{background:'var(--bg-hover)', padding:'12px', borderRadius:'10px', textAlign:'center'}}>
                                    <div style={{fontSize:'24px', fontWeight:900, color:'#06b6d4'}}>89%</div>
                                    <div style={{fontSize:'10px', color:'var(--text-muted)'}}>Customer Satisfaction</div>
                                </div>
                                <div style={{background:'var(--bg-hover)', padding:'12px', borderRadius:'10px', textAlign:'center'}}>
                                    <div style={{fontSize:'24px', fontWeight:900, color:'#34d399'}}>2.4K</div>
                                    <div style={{fontSize:'10px', color:'var(--text-muted)'}}>Social Reach</div>
                                </div>
                                <div style={{background:'var(--bg-hover)', padding:'12px', borderRadius:'10px', textAlign:'center'}}>
                                    <div style={{fontSize:'24px', fontWeight:900, color:'#f59e0b'}}>67%</div>
                                    <div style={{fontSize:'10px', color:'var(--text-muted)'}}>Retention Rate</div>
                                </div>
                                <div style={{background:'var(--bg-hover)', padding:'12px', borderRadius:'10px', textAlign:'center'}}>
                                    <div style={{fontSize:'24px', fontWeight:900, color:'#8b5cf6'}}>4.8</div>
                                    <div style={{fontSize:'10px', color:'var(--text-muted)'}}>Avg Rating</div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="title">📈 Growth Trends <span className="action-link">Details →</span></div>
                            <div style={{height:'120px', display:'flex', alignItems:'flex-end', gap:'4px', paddingTop:'8px'}}>
                                <div style={{flex:1, background:'linear-gradient(to top,rgba(6,182,212,0.2),rgba(6,182,212,0.6))', height:'45%', borderRadius:'3px 3px 0 0', transition:'var(--transition)', cursor:'pointer'}} onMouseOver={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(6,182,212,0.4),#06b6d4)'} onMouseOut={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(6,182,212,0.2),rgba(6,182,212,0.6))'}></div>
                                <div style={{flex:1, background:'linear-gradient(to top,rgba(245,158,11,0.2),rgba(245,158,11,0.6))', height:'65%', borderRadius:'3px 3px 0 0', transition:'var(--transition)', cursor:'pointer'}} onMouseOver={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(245,158,11,0.4),#f59e0b)'} onMouseOut={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(245,158,11,0.2),rgba(245,158,11,0.6))'}></div>
                                <div style={{flex:1, background:'linear-gradient(to top,rgba(16,185,129,0.2),rgba(16,185,129,0.6))', height:'80%', borderRadius:'3px 3px 0 0', transition:'var(--transition)', cursor:'pointer'}} onMouseOver={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(16,185,129,0.4),#10b981)'} onMouseOut={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(16,185,129,0.2),rgba(16,185,129,0.6))'}></div>
                                <div style={{flex:1, background:'linear-gradient(to top,rgba(139,92,246,0.2),rgba(139,92,246,0.6))', height:'55%', borderRadius:'3px 3px 0 0', transition:'var(--transition)', cursor:'pointer'}} onMouseOver={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(139,92,246,0.4),#8b5cf6)'} onMouseOut={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(139,92,246,0.2),rgba(139,92,246,0.6))'}></div>
                                <div style={{flex:1, background:'linear-gradient(to top,rgba(244,63,94,0.2),rgba(244,63,94,0.6))', height:'70%', borderRadius:'3px 3px 0 0', transition:'var(--transition)', cursor:'pointer'}} onMouseOver={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(244,63,94,0.4),#f43f5e)'} onMouseOut={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(244,63,94,0.2),rgba(244,63,94,0.6))'}></div>
                                <div style={{flex:1, background:'linear-gradient(to top,rgba(6,182,212,0.2),rgba(6,182,212,0.6))', height:'90%', borderRadius:'3px 3px 0 0', transition:'var(--transition)', cursor:'pointer'}} onMouseOver={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(6,182,212,0.4),#06b6d4)'} onMouseOut={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(6,182,212,0.2),rgba(6,182,212,0.6))'}></div>
                                <div style={{flex:1, background:'linear-gradient(to top,rgba(245,158,11,0.2),rgba(245,158,11,0.6))', height:'60%', borderRadius:'3px 3px 0 0', transition:'var(--transition)', cursor:'pointer'}} onMouseOver={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(245,158,11,0.4),#f59e0b)'} onMouseOut={(e) => e.currentTarget.style.background='linear-gradient(to top,rgba(245,158,11,0.2),rgba(245,158,11,0.6))'}></div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'8px', color:'var(--text-muted)', marginTop:'4px'}}>
                                <span>يناير</span><span>فبراير</span><span>مارس</span><span>أبريل</span><span>مايو</span><span>يونيو</span><span>يوليو</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div style={{textAlign: 'center', padding: '16px 0', borderTop: '1px solid var(--border-color)', marginTop: '16px'}}>
                    <p style={{fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em'}}>
                        © 2026 Alpha Electronics — Ultimate Management System v4.0
                    </p>
                    <p style={{fontSize: '8px', color: 'var(--text-muted)', marginTop: '4px', opacity: 0.5}}>
                        🚀 All Systems Online • 🔒 Secure Connection • ⚡ Real-time Sync
                    </p>
                </div>
            </div>
        </div>
    );
}
