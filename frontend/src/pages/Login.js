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
            justifyContent: 'center',
            backgroundColor: '#f0f4f8',
            padding: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '380px',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0',
                padding: '36px 32px',
                boxSizing: 'border-box'
            }}>
                {/* Header matches your sidebar branding */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '28px'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3Z" fill="#111827"/>
                        <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z" fill="#2563eb"/>
                    </svg>
                    <h2 style={{
                        margin: 0,
                        fontSize: '22px',
                        fontWeight: 600,
                        color: '#111827'
                    }}>
                        RetailPOS
                    </h2>
                </div>

                <h3 style={{
                    textAlign: 'center',
                    color: '#374151',
                    fontSize: '18px',
                    fontWeight: 500,
                    margin: '0 0 24px 0'
                }}>
                    Sign in to your account
                </h3>

                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '12px 14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '15px',
                            color: '#111827',
                            backgroundColor: '#ffffff',
                            outline: 'none',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#2563eb';
                            e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '12px 14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '15px',
                            color: '#111827',
                            backgroundColor: '#ffffff',
                            outline: 'none',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#2563eb';
                            e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                <button
                    onClick={handleLogin}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                    Login
                </button>

                {error && (
                    <p style={{
                        color: '#dc2626',
                        textAlign: 'center',
                        marginTop: '16px',
                        marginBottom: 0,
                        fontSize: '14px',
                        padding: '8px',
                        backgroundColor: '#fef2f2',
                        borderRadius: '4px',
                        border: '1px solid #fecaca'
                    }}>
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;
