import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Attach token from localStorage if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-handle 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const logoutUser = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.put(`/auth/reset-password/${token}`, { password });
export const verifyEmail = (token) => API.get(`/auth/verify-email/${token}`);

// User endpoints
export const updateProfile = (data) => API.put('/users/profile', data);
export const changePassword = (data) => API.put('/users/password', data);
export const uploadAvatar = (formData) =>
  API.put('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getActivityLog = () => API.get('/users/activity');

// Admin endpoints
export const getAllUsers = (page = 1) => API.get(`/admin/users?page=${page}`);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

export default API;
