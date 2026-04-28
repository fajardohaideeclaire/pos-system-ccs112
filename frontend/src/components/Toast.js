import React from 'react';

function Toast({ message, type = 'success' }) {
    if (!message) return null;

    const COLORS = {
        success: {
            bg: '#F0FDF4',
            border: '#10B981',
            text: '#166534'
        },
        error: {
            bg: '#FEF2F2',
            border: '#EF4444',
            text: '#991B1B'
        },
        info: {
            bg: '#EFF6FF',
            border: '#3B82F6',
            text: '#1E40AF'
        }
    };

    const currentTheme = COLORS[type] || COLORS.success;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            minWidth: '280px',
            maxWidth: '400px',
            backgroundColor: currentTheme.bg,
            color: currentTheme.text,
            padding: '16px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderLeft: `6px solid ${currentTheme.border}`,
            zIndex: 9999,
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            animation: 'toastPopIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
        }}>
            <div style={{ marginRight: '12px', fontSize: '18px' }}>
                {type === 'success' && '✅'}
                {type === 'error' && '⚠️'}
                {type === 'info' && 'ℹ️'}
            </div>
            
            <div style={{ flex: 1 }}>
                {message}
            </div>

            <style>
                {`
                @keyframes toastPopIn {
                    from { transform: translateX(100%) scale(0.9); opacity: 0; }
                    to { transform: translateX(0) scale(1); opacity: 1; }
                }
                `}
            </style>
        </div>
    );
}

export default Toast;