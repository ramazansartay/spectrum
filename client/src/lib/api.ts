const BASE_URL = process.env.VITE_API_URL || '';

function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body = options.body;

  // Stringify body if it's a JSON object
  if (body && !(body instanceof FormData) && typeof body !== 'string') {
    try {
        const jsonBody = JSON.stringify(body);
        // Check if Content-Type is not already set to something else
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
        body = jsonBody;
    } catch (error) {
        console.error("Failed to stringify body", error);
        // Decide how to handle this error. Maybe re-throw it.
        throw new Error("Invalid body provided for request.");
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      body,
    });

    if (!response.ok) {
      // Attempt to parse a JSON error response from the server
      const errorPayload = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorPayload.message || 'API request failed');
    }
    
    // Handle responses with no content
    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error; // Re-throw the error to be handled by the calling code
  }
}
