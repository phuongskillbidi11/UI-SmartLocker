// api.js - Simple client for Smart Locker backend

const API_BASE_URL = 'http://192.168.2.168:4000';

function getAuthToken() {
  return localStorage.getItem('smartlocker_token') || '';
}

function setAuthToken(token) {
  if (token) localStorage.setItem('smartlocker_token', token);
}

function setAuthUser(user) {
  if (user) localStorage.setItem('smartlocker_user', JSON.stringify(user));
}

function getAuthUser() {
  try {
    const raw = localStorage.getItem('smartlocker_user');
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Cannot parse stored user', err);
    return null;
  }
}

async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }

  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return response.json();
  return response.text();
}

async function loginApi(payload) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function fetchProductsApi() {
  return apiRequest('/api/products', { method: 'GET' });
}

async function fetchImagesApi(productId) {
  return apiRequest(`/api/images/${productId}`, { method: 'GET' });
}

async function updateProductApi(productId, body) {
  return apiRequest(`/api/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// Upload product image (multipart)
async function uploadImageApi(file, productId) {
  const token = getAuthToken();
  const form = new FormData();
  form.append('file', file);
  if (productId) form.append('productId', String(productId));

  const res = await fetch(`${API_BASE_URL}/api/images`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

async function recordHistoryApi(entry) {
  return apiRequest('/api/history', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

async function fetchHistoryApi(params = {}) {
  const query = new URLSearchParams({ limit: params.limit || 100 });
  if (params.from) query.append('from', params.from);
  if (params.to) query.append('to', params.to);
  const endpoint = params.scope === 'my' ? '/api/history/my' : '/api/history/all';
  return apiRequest(`${endpoint}?${query.toString()}`, { method: 'GET' });
}

function buildImageUrl(imageName) {
  if (!imageName) return 'https://via.placeholder.com/67/009edb/ffffff?text=IMG';
  if (/^https?:\/\//i.test(imageName)) return imageName;
  return `${API_BASE_URL}/uploads/${imageName}`;
}

window.SLApi = {
  loginApi,
  fetchProductsApi,
  updateProductApi,
  recordHistoryApi,
  fetchHistoryApi,
  fetchImagesApi,
  uploadImageApi,
  buildImageUrl,
  setAuthToken,
  getAuthToken,
  setAuthUser,
  getAuthUser,
};
