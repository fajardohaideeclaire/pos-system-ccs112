import React, { useState } from 'react';
import api from '../api';

function Login({ onLogin }) {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const res = await api.post('/login', form);

            localStorage.setItem('pos_token', res.token);
            localStorage.setItem('pos_user', JSON.stringify(res.user));

            onLogin(res.user);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="card" style={{ width: 300 }}>
                <h2>POS Login</h2>

                <input
                    placeholder="Username"
                    onChange={e => setForm({ ...form, username: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={e => setForm({ ...form, password: e.target.value })}
                />

                <button style={{ width: '100%', marginTop: 10 }} onClick={handleLogin}>
                    Login
                </button>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
}

export default Login;