import React from 'react';

function Modal({ show, onClose, children }) {
    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="card" style={{ width: 400 }}>
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default Modal;