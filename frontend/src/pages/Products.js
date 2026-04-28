import React, { useState, useEffect } from 'react';
import api from '../api';

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name:'', barcode:'', price:'', stock_quantity:'' });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    api.get('/products').then(setProducts);
  };

  const handleSubmit = async () => {
    await api.post('/products', form);
    loadProducts();
  };

  const toggleStatus = async (p) => {
    const endpoint = p.status === 'active' ? 'deactivate' : 'activate';
    await api.patch(`/products/${p.id}/${endpoint}`);
    loadProducts();
  };

  return (
    <div>
      <h2>Products</h2>

      <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})}/>
      <input placeholder="Barcode" onChange={e => setForm({...form, barcode:e.target.value})}/>
      <input placeholder="Price" onChange={e => setForm({...form, price:e.target.value})}/>
      <input placeholder="Stock" onChange={e => setForm({...form, stock_quantity:e.target.value})}/>

      <button onClick={handleSubmit}>Add Product</button>

      {products.map(p => (
        <div key={p.id}>
          {p.name} - {p.price} - {p.status}
          <button onClick={() => toggleStatus(p)}>Toggle</button>
        </div>
      ))}
    </div>
  );
}

export default Products;