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
            width: 240,
            background: '#1f2937',
            color: 'white',
            height: '100vh',
            padding: 20
        }}>
            <h2 style={{ marginBottom: 30 }}>POS System</h2>

            <p style={{ fontSize: 14, opacity: 0.7 }}>
                {user.name}
            </p>

            {menu.map(m => (
                <div
                    key={m.key}
                    onClick={() => setPage(m.key)}
                    style={{
                        padding: 12,
                        borderRadius: 6,
                        marginTop: 8,
                        background: page === m.key ? '#374151' : 'transparent',
                        cursor: 'pointer'
                    }}
                >
                    {m.label}
                </div>
            ))}

            <div style={{ marginTop: 30 }}>
                <button style={{ width: '100%', background: '#ef4444' }} onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;