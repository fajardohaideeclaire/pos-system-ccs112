import React, { useState, useEffect } from 'react';
import api from '../api';

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', role: 'cashier' });
  const [loading, setLoading] = useState(false);

  const COLORS = {
    bg: '#F8FAFC',
    textMain: '#0F172A',
    textMuted: '#64748B',
    white: '#FFFFFF',
    border: '#E2E8F0',
    accent: '#2563EB',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B'
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/users');
      // Directly using 'data' because your api.js handles the response extraction
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Form Validation
    if (!form.username || !form.password || !form.email || !form.name) {
      return alert("All fields are required to register staff.");
    }

    try {
      // 1. Post to backend
      const newUser = await api.post('/users', form);
      
      // 2. DYNAMIC UPDATE: Add new user to the list immediately
      setUsers(prev => [newUser, ...prev]);
      
      // 3. Reset form
      setForm({ name: '', username: '', email: '', password: '', role: 'cashier' });
      
      alert("Staff account created successfully!");
    } catch (err) {
      // Show the actual error message from Laravel (e.g., "Username already taken")
      alert(err.message || "Error creating user");
    }
  };

  const handleAction = async (id, action) => {
    try {
      const updatedUser = await api.patch(`/users/${id}/${action}`);
      
      // DYNAMIC UPDATE: Update the specific user in state
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    } catch (err) {
      alert(err.message || `Failed to ${action} user`);
    }
  };

  const inputStyle = {
    padding: '12px 14px',
    borderRadius: '10px',
    border: `1px solid ${COLORS.border}`,
    fontSize: '14px',
    outline: 'none',
    flex: '1 1 200px',
    backgroundColor: COLORS.white
  };

  return (
    <div style={{ flex: 1, padding: '40px', backgroundColor: COLORS.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: COLORS.textMain, margin: 0 }}>Staff Management</h2>
        <p style={{ color: COLORS.textMuted, fontSize: '15px', marginTop: '4px' }}>Register and manage system access for your team.</p>
      </header>

      {/* REGISTER FORM */}
      <div style={{ 
        backgroundColor: COLORS.white, 
        padding: '28px', 
        borderRadius: '16px', 
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        marginBottom: '32px'
      }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, color: COLORS.textMuted, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Register New Staff</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <input value={form.name} placeholder="Full Name" style={inputStyle} onChange={e => setForm({...form, name:e.target.value})}/>
          <input value={form.username} placeholder="Username" style={inputStyle} onChange={e => setForm({...form, username:e.target.value})}/>
          <input value={form.email} type="email" placeholder="Email Address" style={inputStyle} onChange={e => setForm({...form, email:e.target.value})}/>
          <input value={form.password} type="password" placeholder="Password" style={inputStyle} onChange={e => setForm({...form, password:e.target.value})}/>
          
          <select 
            value={form.role} 
            style={{ ...inputStyle, cursor: 'pointer' }}
            onChange={e => setForm({...form, role:e.target.value})}
          >
            <option value="cashier">Cashier</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>

          <button 
            onClick={handleSubmit}
            style={{
              padding: '12px 30px',
              borderRadius: '10px',
              backgroundColor: COLORS.accent,
              color: 'white',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
            }}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* STAFF TABLE */}
      <div style={{ 
        backgroundColor: COLORS.white, 
        borderRadius: '16px', 
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', 
        overflow: 'hidden',
        border: `1px solid ${COLORS.border}`
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#F8FAFC' }}>
            <tr>
              <th style={tableHeaderStyle}>USER DETAILS</th>
              <th style={tableHeaderStyle}>ROLE</th>
              <th style={tableHeaderStyle}>STATUS</th>
              <th style={{...tableHeaderStyle, textAlign: 'right'}}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: COLORS.textMuted }}>Loading staff...</td></tr>
            ) : users.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: COLORS.textMuted }}>No staff accounts found.</td></tr>
            ) : users.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={tableRowStyle}>
                  <div style={{ fontWeight: 700, color: COLORS.textMain }}>{u.name}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted }}>@{u.username} • {u.email}</div>
                </td>
                <td style={tableRowStyle}>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    color: '#475569',
                    backgroundColor: '#F1F5F9',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    textTransform: 'uppercase'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={tableRowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                        width: '8px', height: '8px', borderRadius: '50%', 
                        backgroundColor: u.status === 'active' ? COLORS.success : COLORS.textMuted 
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: u.status === 'active' ? COLORS.success : COLORS.textMuted }}>
                        {u.status === 'active' ? 'Active' : 'Deactivated'}
                    </span>
                    {u.is_locked && (
                      <span style={{ fontSize: '10px', color: COLORS.danger, fontWeight: 900, border: `1px solid ${COLORS.danger}`, padding: '2px 6px', borderRadius: '4px' }}>LOCKED</span>
                    )}
                  </div>
                </td>
                <td style={{...tableRowStyle, textAlign: 'right'}}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {u.status === 'active' ? (
                        <button 
                            onClick={() => handleAction(u.id, 'deactivate')}
                            style={actionButtonStyle(COLORS.danger)}
                        >
                            Deactivate
                        </button>
                    ) : (
                        <span style={{ fontSize: '12px', color: COLORS.textMuted, fontStyle: 'italic' }}>Account Disabled</span>
                    )}
                    
                    {u.is_locked && (
                      <button 
                        onClick={() => handleAction(u.id, 'unlock')}
                        style={{ ...actionButtonStyle(COLORS.accent) }}
                      >
                        Unlock Account
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableHeaderStyle = {
  textAlign: 'left',
  padding: '20px 24px',
  fontSize: '11px',
  fontWeight: 700,
  color: '#94A3B8',
  letterSpacing: '0.05em',
  borderBottom: '2px solid #F1F5F9'
};

const tableRowStyle = {
  padding: '20px 24px',
  fontSize: '14px',
  color: '#334155'
};

const actionButtonStyle = (color) => ({
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  border: `1px solid ${color}`,
  backgroundColor: 'transparent',
  color: color,
  transition: 'all 0.2s'
});

export default Users;