const API_BASE = 'http://127.0.0.1:8000/api';

const api = {
    async request(method, path, body) {
        const token = localStorage.getItem('pos_token');
        const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        };

        if (body) options.body = JSON.stringify(body);

        try {
            const res = await fetch(url, options);

            // 1. Handle Token Expiry / Invalid Token
            if (res.status === 401) {
                localStorage.removeItem('pos_token');
                // Only redirect if not already on login to avoid loops
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                throw new Error("Session expired. Please login again.");
            }

            const data = await res.json();

            // 2. Handle Backend Errors (422, 500, etc)
            if (!res.ok) {
                const errorMsg = data.errors 
                    ? Object.values(data.errors)[0][0] 
                    : (data.message || 'Server Error');
                throw new Error(errorMsg);
            }

            return data; 
        } catch (error) {
            console.error("API Request Failed:", error.message);
            throw error;
        }
    },

    get(path) { return this.request('GET', path); },
    post(path, body) { return this.request('POST', path, body); },
    patch(path, body) { return this.request('PATCH', path, body); },
    put(path, body) { return this.request('PUT', path, body); },
    delete(path) { return this.request('DELETE', path); }
};

export default api;