const API_BASE = '/api/v1';

async function request(path, options = {}, token) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      ...options,
      headers,
    });
  } catch {
    throw new Error('Cannot reach backend API. Start server and verify VITE_BACKEND_URL or proxy target.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    const message = data.errMessage || data.message || 'Request failed';
    throw new Error(message);
  }

  return data;
}

export const api = {
  register: (payload) =>
    request('/users/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request('/users/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  profile: (token) => request('/users/profile', { method: 'GET' }, token),

  logout: (token) => request('/users/logout', { method: 'POST' }, token),

  uploadPdf: (file, token) => {
    const formData = new FormData();
    formData.append('pdf', file);

    return request(
      '/pdf/upload',
      {
        method: 'POST',
        body: formData,
      },
      token,
    );
  },

  askPdf: (payload, token) =>
    request(
      '/chat',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token,
    ),
};
