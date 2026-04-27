import React from 'react';

export default function Sidebar({ page, setPage, user, onLogout }) {
    return (
        <div style={{ width: '200px', background: '#eee', padding: '20px' }}>
            <h3>POS</h3>

            <button onClick={() => setPage('dashboard')}>Dashboard</button><br /><br />
            <button onClick={() => setPage('sales')}>Sales</button><br /><br />
            <button onClick={() => setPage('products')}>Products</button><br /><br />
            <button onClick={() => setPage('users')}>Users</button><br /><br />

            {(user.role === 'admin' || user.role === 'supervisor') && (
                <>
                    <button onClick={() => setPage('audit')}>Audit Logs</button><br /><br />
                </>
            )}

            <button onClick={onLogout}>Logout</button>
        </div>
    );
}