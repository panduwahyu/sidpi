import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
  refreshToken: () => api.post('/refresh-token'),
};

// Public Story API
export const storyAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/stories${queryString ? `?${queryString}` : ''}`);
  },
  getBySlug: (slug) => api.get(`/stories/${slug}`),
  getDataTable: (slug) => api.get(`/stories/${slug}/data`),
  search: (query) => api.get(`/stories/search?q=${encodeURIComponent(query)}`),
  getCategories: () => api.get('/stories/categories'),
  getFeatured: () => api.get('/stories/featured'),
};

// Admin Story API
export const adminStoryAPI = {
  // Get all stories (with admin filters)
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/stories${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get single story by ID
  getById: (id) => api.get(`/admin/stories/${id}`),
  
  // Create new story
  create: (data) => {
    // For FormData, let axios set the content type
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.post('/admin/stories', data, config);
  },
  
  // Update story
  update: (id, data) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    return api.post(`/admin/stories/${id}`, data, config); // Using POST with _method for FormData
  },
  
  // Delete story
  delete: (id) => api.delete(`/admin/stories/${id}`),
  
  // Submit for approval
  submitForApproval: (id) => api.post(`/admin/stories/${id}/submit-approval`),
  
  // Approve story (admin_approval only)
  approve: (id, data = {}) => api.post(`/admin/stories/${id}/approve`, data),
  
  // Reject story (admin_approval only)
  reject: (id, data) => api.post(`/admin/stories/${id}/reject`, data),
  
  // Get activity logs
  getActivityLogs: (storyId = null) => {
    const url = storyId ? `/admin/activity-logs?story_id=${storyId}` : '/admin/activity-logs';
    return api.get(url);
  },
  
  // Bulk operations
  bulkDelete: (ids) => api.post('/admin/stories/bulk-delete', { ids }),
  bulkApprove: (ids) => api.post('/admin/stories/bulk-approve', { ids }),
  
  // Clone story
  clone: (id) => api.post(`/admin/stories/${id}/clone`),
};

// File Upload API
export const fileAPI = {
  uploadImage: (file, type = 'story') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    return api.post('/admin/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  uploadData: (file) => {
    const formData = new FormData();
    formData.append('data_file', file);
    return api.post('/admin/upload/data', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  deleteFile: (filePath) => api.delete(`/admin/files?path=${encodeURIComponent(filePath)}`),
  
  getFileInfo: (filePath) => api.get(`/admin/files/info?path=${encodeURIComponent(filePath)}`),
};

// Statistics API
export const statsAPI = {
  getDashboardStats: () => api.get('/admin/stats/dashboard'),
  getStoryStats: (storyId) => api.get(`/admin/stats/story/${storyId}`),
  getUsageStats: (period = '30d') => api.get(`/admin/stats/usage?period=${period}`),
  getPopularStories: (limit = 10) => api.get(`/admin/stats/popular?limit=${limit}`),
};

// User Management API (for future enhancement)
export const userAPI = {
  getAll: () => api.get('/admin/users'),
  getById: (id) => api.get(`/admin/users/${id}`),
  create: (userData) => api.post('/admin/users', userData),
  update: (id, userData) => api.put(`/admin/users/${id}`, userData),
  delete: (id) => api.delete(`/admin/users/${id}`),
  updateProfile: (userData) => api.put('/admin/profile', userData),
  changePassword: (passwordData) => api.put('/admin/password', passwordData),
};

// Export and Import API
export const exportAPI = {
  exportStory: (id, format = 'pdf') => {
    return api.get(`/admin/export/story/${id}?format=${format}`, {
      responseType: 'blob'
    });
  },
  
  exportAllStories: (format = 'zip') => {
    return api.get(`/admin/export/stories?format=${format}`, {
      responseType: 'blob'
    });
  },
  
  importStories: (file) => {
    const formData = new FormData();
    formData.append('import_file', file);
    return api.post('/admin/import/stories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// Settings API
export const settingsAPI = {
  getAll: () => api.get('/admin/settings'),
  update: (settings) => api.put('/admin/settings', settings),
  reset: () => api.post('/admin/settings/reset'),
};

// Default export
export default api;

// Error Handler Utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Permintaan tidak valid';
      case 401:
        return 'Anda tidak memiliki akses. Silakan login kembali.';
      case 403:
        return 'Anda tidak memiliki izin untuk melakukan aksi ini';
      case 404:
        return 'Data tidak ditemukan';
      case 422:
        if (data.errors) {
          // Laravel validation errors
          const errors = Object.values(data.errors).flat();
          return errors.join(', ');
        }
        return data.message || 'Data tidak valid';
      case 429:
        return 'Terlalu banyak permintaan. Coba lagi nanti.';
      case 500:
        return 'Terjadi kesalahan server. Silakan coba lagi.';
      default:
        return data.message || `Error ${status}: Terjadi kesalahan`;
    }
  } else if (error.request) {
    // Network error
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  } else {
    // Other error
    return error.message || 'Terjadi kesalahan yang tidak diketahui';
  }
};

// Request helpers
export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      if (value.length > 0 && value[0] instanceof File) {
        // Array of files
        value.forEach((file, index) => {
          formData.append(`${key}[${index}]`, file);
        });
      } else {
        // Array of other values
        formData.append(key, JSON.stringify(value));
      }
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  
  return formData;
};

// Retry mechanism for failed requests
export const withRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Don't retry on 4xx errors (client errors)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

// Cache mechanism for GET requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const withCache = async (cacheKey, apiCall) => {
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await apiCall();
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
};

// Clear cache
export const clearCache = (pattern = null) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};
