import React, { useState, useEffect } from 'react';
import api from '../api';

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name:'', username:'', email:'', password:'', role:'cashier' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    api.get('/users').then(setUsers);
  };

  const handleSubmit = async () => {
    await api.post('/users', form);
    loadUsers();
  };

  const deactivate = async (u) => {
    await api.patch(`/users/${u.id}/deactivate`);
    loadUsers();
  };

  const unlock = async (u) => {
    await api.patch(`/users/${u.id}/unlock`);
    loadUsers();
  };

  return (
    <div>
      <h2>Users</h2>

      <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})}/>
      <input placeholder="Username" onChange={e => setForm({...form, username:e.target.value})}/>
      <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})}/>
      <input placeholder="Password" onChange={e => setForm({...form, password:e.target.value})}/>

      <select onChange={e => setForm({...form, role:e.target.value})}>
        <option value="cashier">Cashier</option>
        <option value="supervisor">Supervisor</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleSubmit}>Add User</button>

      {users.map(u => (
        <div key={u.id}>
          {u.name} - {u.role} - {u.status}
          <button onClick={() => deactivate(u)}>Deactivate</button>
          <button onClick={() => unlock(u)}>Unlock</button>
        </div>
      ))}
    </div>
  );
}

export default Users;