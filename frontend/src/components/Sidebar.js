import React from 'react';

function Sidebar({ page, setPage, user, onLogout }) {
    const menu = [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'sales', label: 'Sales' },
        { key: 'products', label: 'Products' },
        { key: 'users', label: 'Users' },
        { key: 'audit', label: 'Audit Logs' },
    ];

    return (
        <div style={{
            width: '260px',
            minWidth: '260px', // Prevents shrinking
            backgroundColor: '#0F172A', // Using the deeper Navy from the redesign
            color: 'white',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            position: 'sticky', // Keeps it in place while scrolling content
            top: 0
        }}>
            {/* Logo Area */}
            <div style={{ padding: '32px 24px' }}>
                <h1 style={{ 
                    fontSize: '20px', 
                    fontWeight: 800, 
                    margin: 0, 
                    letterSpacing: '-0.5px' 
                }}>
                    Retail<span style={{ color: '#3B82F6' }}>POS</span>
                </h1>
                <p style={{ 
                    fontSize: '12px', 
                    opacity: 0.5, 
                    marginTop: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {user.role || 'System Admin'}
                </p>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '0 12px' }}>
                {menu.map(m => (
                    <div
                        key={m.key}
                        onClick={() => setPage(m.key)}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '4px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: page === m.key ? '#FFFFFF' : '#94A3B8',
                            background: page === m.key ? '#1E293B' : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {m.label}
                    </div>
                ))}
            </nav>

            {/* Bottom Section */}
            <div style={{ padding: '20px' }}>
                <button 
                    onClick={onLogout}
                    style={{ 
                        width: '100%', 
                        padding: '12px',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)', 
                        color: '#ef4444',
                        border: 'none',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;