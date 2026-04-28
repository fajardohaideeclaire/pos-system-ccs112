import React, { useState, useEffect } from 'react';
import api from '../api';

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', barcode: '', price: '', stock_quantity: '' });
  const [loading, setLoading] = useState(false);

  const COLORS = {
    bg: '#F8FAFC', textMain: '#0F172A', textMuted: '#64748B', white: '#FFFFFF',
    border: '#E2E8F0', accent: '#2563EB', success: '#10B981', danger: '#EF4444'
  };

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.get('/products');
      setProducts(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return alert("Name and Price are required");
    try {
      const newItem = await api.post('/products', {
        ...form,
        price: parseFloat(form.price),
        stock_quantity: parseInt(form.stock_quantity) || 0
      });
      setProducts(prev => [newItem, ...prev]); // DYNAMIC ADD
      setForm({ name: '', barcode: '', price: '', stock_quantity: '' });
    } catch (err) { alert(err.message); }
  };

  const toggleStatus = async (p) => {
    const endpoint = p.status === 'active' ? 'deactivate' : 'activate';
    try {
      const updated = await api.patch(`/products/${p.id}/${endpoint}`);
      setProducts(prev => prev.map(item => item.id === p.id ? updated : item)); // DYNAMIC TOGGLE
    } catch (err) { alert("Update failed"); }
  };

  return (
    <div style={{ flex: 1, padding: '40px', backgroundColor: COLORS.bg, minHeight: '100vh', fontFamily: 'Inter' }}>
      <header style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Inventory</h2>
      </header>

      <div style={{ backgroundColor: COLORS.white, padding: '24px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input value={form.name} placeholder="Product Name" onChange={e => setForm({...form, name: e.target.value})} style={inputStyle}/>
          <input value={form.barcode} placeholder="Barcode" onChange={e => setForm({...form, barcode: e.target.value})} style={inputStyle}/>
          <input value={form.price} type="number" placeholder="Price" onChange={e => setForm({...form, price: e.target.value})} style={inputStyle}/>
          <input value={form.stock_quantity} type="number" placeholder="Qty" onChange={e => setForm({...form, stock_quantity: e.target.value})} style={inputStyle}/>
          <button onClick={handleSubmit} style={btnStyle}>Add Item</button>
        </div>
      </div>

      <div style={{ backgroundColor: COLORS.white, borderRadius: '12px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#F8FAFC' }}>
            <tr>
              <th style={cellStyle}>PRODUCT</th><th style={cellStyle}>BARCODE</th>
              <th style={cellStyle}>PRICE</th><th style={cellStyle}>STOCK</th>
              <th style={cellStyle}>STATUS</th><th style={cellStyle}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{padding: '20px', textAlign: 'center'}}>Loading...</td></tr> : 
              products.map(p => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={cellStyle}><strong>{p.name}</strong></td>
                  <td style={cellStyle}>{p.barcode || '—'}</td>
                  <td style={cellStyle}>₱{parseFloat(p.price).toFixed(2)}</td>
                  <td style={cellStyle}>{p.stock_quantity}</td>
                  <td style={cellStyle}>
                    <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, backgroundColor: p.status === 'active' ? '#DCFCE7' : '#FEE2E2', color: p.status === 'active' ? COLORS.success : COLORS.danger }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <button onClick={() => toggleStatus(p)} style={{ cursor: 'pointer', border: '1px solid #E2E8F0', padding: '4px 8px', borderRadius: '4px' }}>
                      {p.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', flex: 1 };
const btnStyle = { padding: '10px 20px', borderRadius: '8px', backgroundColor: '#2563EB', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' };
const cellStyle = { padding: '16px', textAlign: 'left', fontSize: '14px' };

export default Products;