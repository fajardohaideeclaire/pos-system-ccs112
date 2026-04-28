import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Users from './pages/Users';
import Sales from './pages/Sales';
import AuditLogs from './pages/AuditLogs';
import Sidebar from './components/Sidebar';

function App() {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('pos_user'));
        } catch {
            return null;
        }
    });

    const [page, setPage] = useState('dashboard');

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('pos_token');
            await fetch('http://127.0.0.1:8000/api/logout', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
        } catch {}

        localStorage.removeItem('pos_token');
        localStorage.removeItem('pos_user');
        setUser(null);
    };

    if (!user) return <Login onLogin={setUser} />;

    const renderPage = () => {
        switch (page) {
            case 'dashboard': return <Dashboard user={user} />;
            case 'sales': return <Sales user={user} />;
            case 'products': return <Products />;
            case 'users': return <Users />;
            case 'audit': return <AuditLogs />;
            default: return <Dashboard user={user} />;
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
            <main style={{ flex: 1, padding: '24px' }}>
                {renderPage()}
            </main>
        </div>
    );
}

export default App;