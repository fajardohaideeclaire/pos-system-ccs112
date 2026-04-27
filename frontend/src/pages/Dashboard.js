import React from 'react';

export default function Dashboard({ user }) {
    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {user.name}</p>
        </div>
    );
}