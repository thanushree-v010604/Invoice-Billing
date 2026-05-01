const API_BASE = 'https://invoice-backend-siqh.onrender.com';
const REQUEST_TIMEOUT = 15000; // 15 seconds

export const apiFetch = async (url: string, options: any = {}) => {
  const token = localStorage.getItem('token');
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const res = await fetch(fullUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Log errors for debugging
    if (!res.ok && res.status >= 500) {
      console.error(`API Error: ${res.status} - ${fullUrl}`, await res.text());
    }

    return res;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`Request timeout: ${fullUrl}`);
      throw new Error('Request timeout - backend may be starting up');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};