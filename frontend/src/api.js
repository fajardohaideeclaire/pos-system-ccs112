const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = {
    getToken: () => localStorage.getItem('pos_token'),

    headers() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    },

    async get(path) {
        const res = await fetch(`${API_BASE}${path}`, {
            headers: this.headers()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
    },

    async post(path, body) {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
    },

    async put(path, body) {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'PUT',
            headers: this.headers(),
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
    },

    async patch(path, body = {}) {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'PATCH',
            headers: this.headers(),
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
    },
};

export default api;