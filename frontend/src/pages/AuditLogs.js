import React, { useState, useEffect } from 'react';
import api from '../api';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    module: '',
    date_from: '',
    date_to: ''
  });
  const [page, setPage] = useState(1);

  const loadLogs = async () => {
    const params = new URLSearchParams({
      page,
      ...filters
    });

    const data = await api.get(`/audit-logs?${params}`);
    setLogs(data.data || []);
  };

  useEffect(() => {
    loadLogs();
  }, [page, filters]);

  return (
    <div>
      <h2>Audit Logs</h2>

      <input
        placeholder="Module"
        onChange={(e) => setFilters({ ...filters, module: e.target.value })}
      />

      <input
        type="date"
        onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
      />

      <input
        type="date"
        onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
      />

      {logs.map(log => (
        <div key={log.id}>
          {log.created_at} | 
          {log.user?.name} | 
          {log.module} | 
          {log.action} | 
          {log.description} | 
          {log.ip_address}
        </div>
      ))}

      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Prev
      </button>

      <button onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
}

export default AuditLogs;
