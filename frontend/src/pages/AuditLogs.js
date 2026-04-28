import React, { useState, useEffect } from 'react';
import api from '../api';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    module: '',
    date_from: '',
    date_to: ''
  });
  const [page, setPage] = useState(1);

  const COLORS = {
    bg: '#F1F5F9',
    textMain: '#1E293B',
    textMuted: '#64748B',
    white: '#FFFFFF',
    border: '#E2E8F0',
    accent: '#3B82F6'
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        ...filters
      });
      const response = await api.get(`/audit-logs?${params}`);
      setLogs(response.data || []);
    } catch (error) {
      console.error("Failed to load logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [page, filters]);

  const inputStyle = {
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1px solid ${COLORS.border}`,
    fontSize: '14px',
    color: COLORS.textMain,
    outline: 'none',
    width: '200px'
  };

  const tableHeaderStyle = {
    textAlign: 'left',
    padding: '16px',
    fontSize: '12px',
    fontWeight: 600,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    borderBottom: `1px solid ${COLORS.border}`
  };

  const tableRowStyle = {
    padding: '16px',
    fontSize: '14px',
    color: COLORS.textMain,
    borderBottom: `1px solid ${COLORS.border}`
  };

  return (
    <div style={{ flex: 1, padding: '40px', backgroundColor: COLORS.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: COLORS.textMain, margin: 0 }}>Audit Logs</h2>
        <p style={{ color: COLORS.textMuted, fontSize: '14px', marginTop: '4px' }}>Track system activities and security events.</p>
      </header>

      {/* FILTERS */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px', 
        backgroundColor: COLORS.white, 
        padding: '20px', 
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textMuted }}>Module</label>
          <input
            placeholder="Search module..."
            style={inputStyle}
            onChange={(e) => setFilters({ ...filters, module: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textMuted }}>Date From</label>
          <input
            type="date"
            style={inputStyle}
            onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: COLORS.textMuted }}>Date To</label>
          <input
            type="date"
            style={inputStyle}
            onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div style={{ 
        backgroundColor: COLORS.white, 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', 
        overflow: 'hidden',
        border: `1px solid ${COLORS.border}`
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#F8FAFC' }}>
            <tr>
              <th style={tableHeaderStyle}>Timestamp</th>
              <th style={tableHeaderStyle}>User</th>
              <th style={tableHeaderStyle}>Module</th>
              <th style={tableHeaderStyle}>Action</th>
              <th style={tableHeaderStyle}>Description</th>
              <th style={tableHeaderStyle}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: COLORS.textMuted }}>Loading logs...</td></tr>
            ) : logs.length > 0 ? (
              logs.map(log => (
                <tr key={log.id}>
                  <td style={tableRowStyle}>{new Date(log.created_at).toLocaleString()}</td>
                  <td style={{ ...tableRowStyle, fontWeight: 600 }}>{log.user?.name || 'System'}</td>
                  <td style={tableRowStyle}><span style={{ backgroundColor: '#E2E8F0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{log.module}</span></td>
                  <td style={tableRowStyle}>{log.action}</td>
                  <td style={tableRowStyle}>{log.description}</td>
                  <td style={{ ...tableRowStyle, color: COLORS.textMuted, fontFamily: 'monospace' }}>{log.ip_address}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: COLORS.textMuted }}>No logs found.</td></tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div style={{ 
          padding: '16px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          borderTop: `1px solid ${COLORS.border}`
        }}>
          <span style={{ fontSize: '14px', color: COLORS.textMuted }}>Page {page}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1 || loading}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: `1px solid ${COLORS.border}`,
                backgroundColor: COLORS.white,
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 600
              }}
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={loading || logs.length < 10} // Assuming 10 per page
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: COLORS.textMain,
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;