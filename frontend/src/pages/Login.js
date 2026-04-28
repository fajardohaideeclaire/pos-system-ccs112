import React, { useState } from 'react';
import api from '../api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  .login-root * {
    box-sizing: border-box;
    font-family: 'DM Sans', sans-serif;
  }

  .login-root {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8fafc;
    padding: 16px;
  }

  .login-card {
    width: 100%;
    max-width: 380px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 36px 32px 32px;
  }

  .login-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 28px;
  }

  .login-brand-icon {
    width: 34px;
    height: 34px;
    background: #1e293b;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .login-brand-name {
    margin: 0;
    font-size: 21px;
    font-weight: 600;
    color: #1e293b;
    letter-spacing: -0.2px;
  }

  .login-title {
    font-size: 15px;
    font-weight: 400;
    color: #64748b;
    text-align: center;
    margin: 0 0 26px 0;
  }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 18px;
  }

  .login-label {
    font-size: 13px;
    font-weight: 500;
    color: #334155;
  }

  .login-input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14.5px;
    color: #1e293b;
    background: #ffffff;
    outline: none;
    transition: all 0.15s ease;
  }

  .login-input::placeholder {
    color: #94a3b8;
  }

  .login-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.06);
  }

  .login-btn {
    width: 100%;
    padding: 12px;
    margin-top: 6px;
    background: #1e293b;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease;
    letter-spacing: 0.2px;
  }

  .login-btn:hover:not(:disabled) {
    background: #0f172a;
  }

  .login-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .login-error {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 18px;
    padding: 11px 14px;
 background: #fff5f5;
    border: 1px solid #fecaca;
    border-radius: 6px;
    color: #dc2626;
    font-size: 13.5px;
    line-height: 1.4;
  }

  .login-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 0 0 24px;
  }
`;

function Login({ onLogin }) {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!form.username.trim() || !form.password.trim()) {
            setError('Please enter your username and password.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/login', form);
            localStorage.setItem('pos_token', res.token);
            localStorage.setItem('pos_user', JSON.stringify(res.user));
            onLogin(res.user);
        } catch (err) {
            setError(err.message || 'Login failed. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !loading) handleLogin();
    };

    return (
        <>
            <style>{styles}</style>
            <div className="login-root">
                <div className="login-card">
                    {/* Brand */}
                    <div className="login-brand">
                        <div className="login-brand-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 3H21C21.55 3 22 3.45 22 4V20C22 20.55 21.55 21 21 21H3C2.45 21 2 20.55 2 20V4C2 3.45 2.45 3 3 3Z" fill="#fff" fillOpacity="0.15"/>
                                <path d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H13V17H7V15Z" fill="#ffffff"/>
                            </svg>
                        </div>
                        <h2 className="login-brand-name">RetailPOS</h2>
                    </div>

                    <div className="login-divider" />

                    <p className="login-title">Sign in to your account to continue</p>

                    {/* Username */}
                    <div className="login-field">
                        <label className="login-label">Username</label>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
                            onKeyDown={handleKeyDown}
                            autoComplete="username"
                            autoFocus
                        />
                    </div>

                    {/* Password */}
                    <div className="login-field">
                        <label className="login-label">Password</label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            onKeyDown={handleKeyDown}
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        className="login-btn"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? 'Please wait…' : 'Sign In'}
                    </button>

                    {error && (
                        <div className="login-error">
                            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="9" stroke="#dc2626" strokeWidth="1.5"/>
                                <path d="M10 6v5M10 14h.01" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Login;