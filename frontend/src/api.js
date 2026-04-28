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

    async request(method, path, body) {
        const res = await fetch(`${API_BASE}${path}`, {
            method,
            headers: this.headers(),
            ...(body ? { body: JSON.stringify(body) } : {})
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
    },

    get(path) { return this.request('GET', path); },
    post(path, body) { return this.request('POST', path, body); },
    put(path, body) { return this.request('PUT', path, body); },
    patch(path, body) { return this.request('PATCH', path, body); },
};

export default api;