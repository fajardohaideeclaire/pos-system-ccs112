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

        const text = await res.text();
        let data;

        // 1. Try to parse JSON first
        try {
            data = JSON.parse(text);
        } catch (e) {
            // This happens if the server crashes and sends back HTML (Xdebug/Laravel error page)
            console.error('❌ NON-JSON RESPONSE:', text);
            throw new Error('Server returned an invalid format. Check Laravel logs.');
        }

        // 2. Handle Logic Errors (like 401 Unauthenticated)
        if (!res.ok) {
            // If the error is auth-related, you probably want to clear the stale token
            if (res.status === 401) {
                console.warn('⚠️ Session expired or token invalid. Redirecting to login...');
                localStorage.removeItem('pos_token');
                // Optional: window.location.href = '/login';
            }

            // Throw the ACTUAL message from the server (e.g., "Unauthenticated.")
            throw new Error(data.message || `Request failed with status ${res.status}`);
        }

        return data;
    },

    get(path) { return this.request('GET', path); },
    post(path, body) { return this.request('POST', path, body); },
    put(path, body) { return this.request('PUT', path, body); },
    patch(path, body) { return this.request('PATCH', path, body); },
};

export default api;