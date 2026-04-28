import React, { useState, useEffect } from 'react';
import api from '../api';

function Dashboard({ user }) {
    const [stats, setStats] = useState({
        totalSales: 0,
        productCount: 0,
        userCount: 0,
        loading: true
    });

    const COLORS = {
        bg: '#F8FAFC',
        sidebar: '#0F172A',
        accent: '#2563EB',
        textMain: '#0F172A',
        textMuted: '#64748B',
        white: '#FFFFFF',
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetching multiple resources simultaneously for the stats cards
                const [products, users, transactions] = await Promise.all([
                    api.get('/products'),
                    api.get('/users'),
                    api.get('/transactions')
                ]);

                // Calculate total sales from completed transactions
                const total = (transactions || []).reduce((sum, t) => 
                    t.status === 'completed' ? sum + parseFloat(t.total_amount) : sum, 0
                );

                setStats({
                    totalSales: total,
                    productCount: (products || []).length,
                    userCount: (users || []).length,
                    loading: false
                });
            } catch (err) {
                console.error("Dashboard failed to load stats", err);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchDashboardData();
    }, []);

    const statCardStyle = {
        flex: '1 1 280px',
        backgroundColor: COLORS.white,
        padding: '28px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: '1px solid #E2E8F0',
        transition: 'transform 0.2s ease-in-out'
    };

    return (
        <div style={{ 
            flex: 1, padding: '40px', backgroundColor: COLORS.bg, 
            fontFamily: "'Inter', sans-serif", minHeight: '100vh', boxSizing: 'border-box' 
        }}>
            {/* TOP BAR */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: COLORS.textMain, margin: 0, letterSpacing: '-0.025em' }}>
                        Dashboard
                    </h2>
                    <p style={{ color: COLORS.textMuted, fontSize: '15px', margin: '6px 0 0 0' }}>
                        Welcome back, <span style={{ fontWeight: 600, color: COLORS.accent }}>{user?.name || 'System Admin'}</span>
                    </p>
                </div>
                
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', 
                    padding: '8px 20px', borderRadius: '30px', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ 
                        width: '36px', height: '36px', borderRadius: '50%', backgroundColor: COLORS.accent, 
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 
                    }}>
                        {user?.name?.substring(0, 2).toUpperCase() || 'SA'}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textMain }}>
                        {user?.role?.toUpperCase() || 'ADMIN'}
                    </span>
                </div>
            </header>

            {/* STATS GRID */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <div style={statCardStyle}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Sales
                    </span>
                    <p style={{ fontSize: '36px', fontWeight: 900, color: COLORS.textMain, margin: 0 }}>
                        ₱{stats.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div style={statCardStyle}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Inventory Size
                    </span>
                    <p style={{ fontSize: '36px', fontWeight: 900, color: COLORS.textMain, margin: 0 }}>
                        {stats.productCount} <span style={{ fontSize: '18px', fontWeight: 500, color: COLORS.textMuted }}>Items</span>
                    </p>
                </div>

                <div style={statCardStyle}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Staff Accounts
                    </span>
                    <p style={{ fontSize: '36px', fontWeight: 900, color: COLORS.textMain, margin: 0 }}>
                        {stats.userCount} <span style={{ fontSize: '18px', fontWeight: 500, color: COLORS.textMuted }}>Users</span>
                    </p>
                </div>
            </div>

            {/* QUICK OVERVIEW SECTION */}
            <div style={{ 
                backgroundColor: COLORS.white, borderRadius: '20px', padding: '40px', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', border: '1px solid #E2E8F0'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: COLORS.textMain, margin: 0 }}>
                            Quick Overview
                        </h3>
                        <p style={{ color: COLORS.textMuted, fontSize: '16px', marginTop: '10px', maxWidth: '550px', lineHeight: '1.6' }}>
                            {stats.productCount < 10 
                                ? "Your inventory is running low. Consider adding more products soon." 
                                : "Your system is performing optimally. Check the audit logs for recent activity."}
                        </p>
                    </div>
                    <button 
                        onClick={() => window.location.href = '/sales'}
                        style={{
                            backgroundColor: COLORS.sidebar, color: 'white', border: 'none', 
                            padding: '14px 28px', borderRadius: '10px', fontWeight: 700, 
                            fontSize: '15px', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)'
                        }}
                    >
                        + Start New Sale
                    </button>
                </div>
                
                {/* Visual Data Representation */}
                <div style={{ 
                    height: '280px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '2px dashed #CBD5E1', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px'
                }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#E2E8F0', borderRadius: '50%' }}></div>
                    <span style={{ color: COLORS.textMuted, fontSize: '15px', fontWeight: 500 }}>
                        Live sales performance chart will appear here.
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;