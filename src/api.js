/**
 * Centralized API client for talking to the Django backend.
 * All requests automatically attach the JWT access token if available.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname.includes('onrender.com') 
    ? 'https://assessment-hub-backend.onrender.com/api'
    : 'http://127.0.0.1:8000/api');

// ── Auth helpers ──────────────────────────────────────────────────────────────
export const getTokens = () => ({
    access: localStorage.getItem('csa_access'),
    refresh: localStorage.getItem('csa_refresh'),
});

export const saveTokens = (access, refresh) => {
    localStorage.setItem('csa_access', access);
    localStorage.setItem('csa_refresh', refresh);
};

export const clearTokens = () => {
    localStorage.removeItem('csa_access');
    localStorage.removeItem('csa_refresh');
};

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
    const { access } = getTokens();
    const headers = {
        'Content-Type': 'application/json',
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Try to refresh the token silently
        const { refresh } = getTokens();
        if (refresh) {
            const refreshRes = await fetch(`${BASE_URL}/auth/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh }),
            });
            if (refreshRes.ok) {
                const data = await refreshRes.json();
                saveTokens(data.access, refresh);
                // Retry the original request with the new token
                headers.Authorization = `Bearer ${data.access}`;
                const retryRes = await fetch(`${BASE_URL}${path}`, { ...options, headers });
                return retryRes.json();
            }
        }
        clearTokens();
        throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(JSON.stringify(err) || 'API error');
    }

    if (response.status === 204) return null;
    return response.json();
}

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authApi = {
    register: (username, email, password, password2) =>
        apiFetch('/auth/register/', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, password2 }),
        }),

    login: async (username, password) => {
        const data = await apiFetch('/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        saveTokens(data.access, data.refresh);
        return data;
    },

    googleLogin: async (credential) => {
        const data = await apiFetch('/auth/google/', {
            method: 'POST',
            body: JSON.stringify({ credential }),
        });
        saveTokens(data.access, data.refresh);
        return data;
    },

    me: () => apiFetch('/auth/me/'),

    logout: () => clearTokens(),
};

// ── Quiz API ──────────────────────────────────────────────────────────────────
export const quizApi = {
    getTests: () => apiFetch('/tests/'),
    getQuestions: (slug) => apiFetch(`/tests/${slug}/questions/`),

    submitAttempt: (testId, mode, answers) =>
        apiFetch('/attempts/submit/', {
            method: 'POST',
            body: JSON.stringify({ test_id: testId, mode, answers }),
        }),

    getMyAttempts: () => apiFetch('/attempts/'),
    getAttemptDetail: (id) => apiFetch(`/attempts/${id}/`),
};
