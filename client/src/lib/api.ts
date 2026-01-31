const BASE_URL = process.env.VITE_API_URL || '';

function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  let body = options.body;

  if (!(body instanceof FormData)) {
    headers.append('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'API request failed');
  }

  if (response.status === 204) { // No Content
    return;
  }

  return response.json();
}

export const api = {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, data: unknown) => request(path, { method: 'POST', body: data as BodyInit }),
  put: (path: string, data: unknown) => request(path, { method: 'PUT', body: data as BodyInit }),
  delete: (path: string) => request(path, { method: 'DELETE' }),
};
