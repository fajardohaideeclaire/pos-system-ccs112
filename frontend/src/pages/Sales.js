import React, { useState, useEffect } from 'react';
import api from '../api';

function Sales() {
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]); // Added for discounts
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null); // Track applied discount
  const [transaction, setTransaction] = useState(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [loading, setLoading] = useState(false);

  const COLORS = {
    bg: '#F8FAFC', textMain: '#0F172A', textMuted: '#64748B', white: '#FFFFFF',
    border: '#E2E8F0', accent: '#2563EB', success: '#10B981', danger: '#EF4444', dark: '#1E293B'
  };

  useEffect(() => {
    loadProducts();
    loadDiscounts(); // Fetch available discounts on mount
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.get('/products');
      setProducts(data.filter(p => p.status === 'active') || []);
    } catch (err) { console.error(err); }
  };

  const loadDiscounts = async () => {
    try {
      const data = await api.get('/discounts');
      setDiscounts(data.filter(d => d.is_active) || []);
    } catch (err) { console.error(err); }
  };

  const addToCart = (product) => {
    if (product.stock_quantity <= 0) return alert("Item out of stock!");
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock_quantity) return alert("Stock limit reached!");
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // --- Dynamic Calculations ---
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = selectedDiscount ? (subtotal * (selectedDiscount.percentage / 100)) : 0;
  const total = subtotal - discountAmount;
  const change = amountPaid ? parseFloat(amountPaid) - total : 0;

  const createTransaction = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const data = await api.post('/transactions', { 
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
        discount_id: selectedDiscount?.id || null, // Send discount ID to backend
        subtotal: subtotal,
        discount_amount: discountAmount,
        total_amount: total
      });
      setTransaction(data);
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  const completePayment = async () => {
    const paid = parseFloat(amountPaid);
    if (isNaN(paid) || paid < total) return alert("Insufficient payment");
    setLoading(true);
    try {
      await api.post(`/transactions/${transaction.id}/complete`, { amount_paid: paid });
      alert("Sale Complete!");
      setCart([]); setTransaction(null); setAmountPaid(''); setSelectedDiscount(null);
      loadProducts();
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: COLORS.bg, fontFamily: 'Inter, sans-serif' }}>
      
      {/* LEFT: CATALOG */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '20px' }}>Terminal</h2>
        <input 
          placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, marginBottom: '20px', outline: 'none' }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', overflowY: 'auto' }}>
          {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
            <div key={p.id} onClick={() => addToCart(p)} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: `1px solid ${COLORS.border}`, cursor: 'pointer' }}>
              <div style={{ fontWeight: 700 }}>{p.name}</div>
              <div style={{ color: COLORS.accent, fontWeight: 800 }}>₱{parseFloat(p.price).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: CART & CHECKOUT */}
      <div style={{ width: '420px', backgroundColor: 'white', borderLeft: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', fontWeight: 800, borderBottom: `1px solid ${COLORS.border}` }}>Current Order</div>
        
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
              <span>{item.name} x{item.quantity}</span>
              <span style={{ fontWeight: 600 }}>₱{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* DISCOUNT & TOTAL SECTION */}
        <div style={{ padding: '24px', backgroundColor: '#F8FAFC', borderTop: `1px solid ${COLORS.border}` }}>
          
          {/* Discount Dropdown */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: COLORS.textMuted, display: 'block', marginBottom: '8px' }}>APPLY DISCOUNT</label>
            <select 
              disabled={!!transaction}
              value={selectedDiscount ? selectedDiscount.id : ''} 
              onChange={(e) => setSelectedDiscount(discounts.find(d => d.id === parseInt(e.target.value)) || null)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, backgroundColor: 'white' }}
            >
              <option value="">No Discount</option>
              {discounts.map(d => <option key={d.id} value={d.id}>{d.name} ({d.percentage}%)</option>)}
            </select>
          </div>

          <div style={{ fontSize: '14px', color: COLORS.textMuted, display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Subtotal</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          {selectedDiscount && (
            <div style={{ fontSize: '14px', color: COLORS.danger, display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Discount ({selectedDiscount.name})</span>
              <span>-₱{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ fontSize: '24px', fontWeight: 900, display: 'flex', justifyContent: 'space-between', margin: '16px 0', color: COLORS.dark }}>
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </div>

          {!transaction ? (
            <button onClick={createTransaction} disabled={cart.length === 0 || loading} style={mainBtnStyle(COLORS.dark)}>
              {loading ? 'Processing...' : 'Checkout'}
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="number" placeholder="Cash Received" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} style={cashInputStyle(COLORS.accent)} />
              <button onClick={completePayment} style={mainBtnStyle(COLORS.success)}>Complete Payment</button>
              <div style={{ textAlign: 'center', fontWeight: 700, color: change < 0 ? COLORS.danger : COLORS.success }}>
                {change < 0 ? `Short: ₱${Math.abs(change).toFixed(2)}` : `Change: ₱${change.toFixed(2)}`}
              </div>
              <button onClick={() => setTransaction(null)} style={{ background: 'none', border: 'none', color: COLORS.textMuted, fontSize: '12px', cursor: 'pointer' }}>Cancel Payment</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const mainBtnStyle = (color) => ({ width: '100%', padding: '18px', borderRadius: '12px', backgroundColor: color, color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '16px' });
const cashInputStyle = (color) => ({ width: '100%', padding: '16px', borderRadius: '12px', border: `2px solid ${color}`, fontSize: '22px', fontWeight: 800, textAlign: 'center', outline: 'none', boxSizing: 'border-box' });

export default Sales;