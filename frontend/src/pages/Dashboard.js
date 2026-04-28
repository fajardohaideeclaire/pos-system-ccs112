import React from 'react';

function Dashboard({ user }) {
    return (
        <div style={{
            padding: '24px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            backgroundColor: '#f0f4f8',
            minHeight: 'calc(100vh - 48px)'
        }}>
            <h2 style={{
                fontSize: '22px',
                fontWeight: 600,
                color: '#111827',
                margin: '0 0 24px 0'
            }}>
                Dashboard
            </h2>

            <div style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                marginBottom: '8px'
            }}>
                <div style={{
                    flex: '1 1 220px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    padding: '24px',
                    boxSizing: 'border-box'
                }}>
                    <h3 style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#4b5563',
                        margin: '0 0 12px 0'
                    }}>
                        Total Sales
                    </h3>
                    <p style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#111827',
                        margin: 0
                    }}>
                        ₱0.00
                    </p>
                </div>

                <div style={{
                    flex: '1 1 220px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    padding: '24px',
                    boxSizing: 'border-box'
                }}>
                    <h3 style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#4b5563',
                        margin: '0 0 12px 0'
                    }}>
                        Products
                    </h3>
                    <p style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#111827',
                        margin: 0
                    }}>
                        0 items
                    </p>
                </div>

                <div style={{
                    flex: '1 1 220px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    padding: '24px',
                    boxSizing: 'border-box'
                }}>
                    <h3 style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#4b5563',
                        margin: '0 0 12px 0'
                    }}>
                        Users
                    </h3>
                    <p style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#111827',
                        margin: 0
                    }}>
                        0 users
                    </p>
                </div>
            </div>

            <div style={{
                marginTop: '20px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                padding: '24px',
                boxSizing: 'border-box'
            }}>
                <h3 style={{
                    fontSize: '17px',
                    fontWeight: 600,
                    color: '#111827',
                    margin: '0 0 12px 0'
                }}>
                    Welcome
                </h3>
                <p style={{
                    fontSize: '15px',
                    color: '#374151',
                    margin: 0,
                    lineHeight: '1.5'
                }}>
                    Hello, {user.name}. Manage your POS system here.
                </p>
            </div>
        </div>
    );
}

export default Dashboard;