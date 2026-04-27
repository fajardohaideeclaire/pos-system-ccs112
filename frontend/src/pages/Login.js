import React, { useState } from 'react';
import api from '../api';

export default function Login({ onLogin }) {
    const [form, setForm] = useState({ username: '', password: '' });

    const handleLogin = async () => {
        try {
            const res = await api.post('/login', form);
            localStorage.setItem('pos_token', res.token);
            localStorage.setItem('pos_user', JSON.stringify(res.user));
            onLogin(res.user);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h2>Login</h2>

            <input
                placeholder="Username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
            /><br /><br />

            <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
            /><br /><br />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}