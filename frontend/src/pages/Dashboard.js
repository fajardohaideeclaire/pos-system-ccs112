import React from 'react';

function Dashboard({ user }) {
    return (
        <div>
            <h2>Dashboard</h2>

            <div className="flex">
                <div className="card">
                    <h3>Total Sales</h3>
                    <p>₱0.00</p>
                </div>

                <div className="card">
                    <h3>Products</h3>
                    <p>0 items</p>
                </div>

                <div className="card">
                    <h3>Users</h3>
                    <p>0 users</p>
                </div>
            </div>

            <div className="card" style={{ marginTop: 20 }}>
                <h3>Welcome</h3>
                <p>Hello, {user.name}. Manage your POS system here.</p>
            </div>
        </div>
    );
}

export default Dashboard;