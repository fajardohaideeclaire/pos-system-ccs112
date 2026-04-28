import React from 'react';

function Modal({ show, onClose, title, children }) {
    if (!show) return null;

    const COLORS = {
        overlay: 'rgba(15, 23, 42, 0.65)', // Deeper navy overlay for focus
        white: '#FFFFFF',
        textMain: '#1E293B',
        textMuted: '#64748B',
        border: '#E2E8F0',
        danger: '#EF4444'
    };

    return (
        <div 
            onClick={onClose} // Closes modal when clicking outside (on overlay)
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: COLORS.overlay,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(4px)', // Modern glass effect
                padding: '20px'
            }}
        >
            <div 
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
                style={{
                    backgroundColor: COLORS.white,
                    width: '100%',
                    maxWidth: '450px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden',
                    animation: 'modalSlideIn 0.3s ease-out'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ 
                        margin: 0, 
                        fontSize: '18px', 
                        fontWeight: 700, 
                        color: COLORS.textMain 
                    }}>
                        {title || 'Confirmation'}
                    </h3>
                    <button 
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            color: COLORS.textMuted,
                            cursor: 'pointer',
                            lineHeight: '1',
                            padding: '4px'
                        }}
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px' }}>
                    <div style={{ color: COLORS.textMain, fontSize: '15px', lineHeight: '1.6' }}>
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px',
                    backgroundColor: '#F8FAFC',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    <button 
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: `1px solid ${COLORS.border}`,
                            backgroundColor: 'white',
                            color: COLORS.textMain,
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Injected Animation */}
            <style>
                {`
                @keyframes modalSlideIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                `}
            </style>
        </div>
    );
}

export default Modal;