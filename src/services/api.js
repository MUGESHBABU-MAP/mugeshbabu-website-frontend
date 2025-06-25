import axios from 'axios'
import toast from 'react-hot-toast'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api'

// Create axios instances
export const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
const handleResponseError = (error) => {
  if (error.response) {
    const { status, data } = error.response
    
    switch (status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token')
        if (window.location.pathname !== '/login') {
          toast.error('Session expired. Please login again.')
          window.location.href = '/login'
        }
        break
      case 403:
        toast.error('Access denied. You do not have permission to perform this action.')
        break
      case 404:
        toast.error('Resource not found.')
        break
      case 422:
        // Validation errors
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach(err => toast.error(err.msg || err.message))
        } else {
          toast.error(data.message || 'Validation failed.')
        }
        break
      case 429:
        toast.error('Too many requests. Please try again later.')
        break
      case 500:
        toast.error('Server error. Please try again later.')
        break
      default:
        toast.error(data.message || 'An unexpected error occurred.')
    }
  } else if (error.request) {
    // Network error
    toast.error('Network error. Please check your connection.')
  } else {
    // Other error
    toast.error('An unexpected error occurred.')
  }
  
  return Promise.reject(error)
}

// Add response interceptors
authAPI.interceptors.response.use(
  (response) => response,
  handleResponseError
)

api.interceptors.response.use(
  (response) => response,
  handleResponseError
)

// Auth API endpoints
export const authService = {
  login: (credentials) => authAPI.post('/auth/login', credentials),
  register: (userData) => authAPI.post('/auth/register', userData),
  logout: () => authAPI.post('/auth/logout'),
  getProfile: () => authAPI.get('/auth/me'),
  updateProfile: (profileData) => authAPI.put('/auth/profile', profileData),
  changePassword: (passwordData) => authAPI.put('/auth/change-password', passwordData),
  refreshToken: () => authAPI.post('/auth/refresh-token'),
}

// Services API endpoints
export const servicesService = {
  getAll: (params = {}) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  getBySlug: (slug) => api.get(`/services/slug/${slug}`),
  getCategories: () => api.get('/services/categories'),
  getFeatured: () => api.get('/services/featured'),
  checkAvailability: (id) => api.get(`/services/${id}/availability`),
  getSimilar: (id) => api.get(`/services/${id}/similar`),
  getAllServices: () => api.get('/services'),
}

// Subscriptions API endpoints
export const subscriptionsService = {
  create: (subscriptionData) => api.post('/subscriptions', subscriptionData),
  getAll: (params = {}) => api.get('/subscriptions', { params }),
  getById: (id) => api.get(`/subscriptions/${id}`),
  update: (id, updateData) => api.put(`/subscriptions/${id}`, updateData),
  cancel: (id, reason) => api.put(`/subscriptions/${id}/cancel`, { reason }),
  pause: (id, reason) => api.put(`/subscriptions/${id}/pause`, { reason }),
  resume: (id) => api.put(`/subscriptions/${id}/resume`),
}

// Admin API endpoints
export const adminService = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: () => api.get('/admin/analytics'),
  
  // Users management
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  updateUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
  
  // Services management
  createService: (serviceData) => api.post('/admin/services', serviceData),
  updateService: (id, serviceData) => api.put(`/admin/services/${id}`, serviceData),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
  
  // Subscriptions management
  getSubscriptions: (params = {}) => api.get('/admin/subscriptions', { params }),
  updateSubscriptionStatus: (id, status, reason) => 
    api.put(`/admin/subscriptions/${id}/status`, { status, reason }),
}

// Users API endpoints
export const usersService = {
  getProfile: (id) => api.get(`/users/profile/${id}`),
  getSubscriptions: (id, params = {}) => api.get(`/users/${id}/subscriptions`, { params }),
  getAnalytics: (id) => api.get(`/users/${id}/analytics`),
  search: (query, limit = 10) => api.get('/users/search', { params: { q: query, limit } }),
  getStats: () => api.get('/users/stats'),
}

// Utility functions
export const apiUtils = {
  // Handle file uploads
  uploadFile: async (file, endpoint) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  // Download file
  downloadFile: async (url, filename) => {
    const response = await api.get(url, {
      responseType: 'blob',
    })
    
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)
  },
  
  // Format currency
  formatCurrency: (amount, currency = 'INR') => {
    const symbol = currency === 'INR' ? '₹' : '$'
    return `${symbol}${amount.toLocaleString()}`
  },
  
  // Format date
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  },
  
  // Format relative time
  formatRelativeTime: (date) => {
    const now = new Date()
    const targetDate = new Date(date)
    const diffInSeconds = Math.floor((now - targetDate) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    
    return targetDate.toLocaleDateString()
  },
  
  // Debounce function for search
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },
  
  // Validate email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  // Validate phone number (Indian format)
  isValidPhone: (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
  },
  
  // Validate pincode (Indian format)
  isValidPincode: (pincode) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/
    return pincodeRegex.test(pincode)
  },
  
  // Generate random ID
  generateId: () => {
    return Math.random().toString(36).substr(2, 9)
  },
  
  // Truncate text
  truncateText: (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  },
  
  // Get status color
  getStatusColor: (status) => {
    const colors = {
      active: 'success',
      pending: 'warning',
      cancelled: 'error',
      expired: 'secondary',
      paused: 'warning',
      failed: 'error',
    }
    return colors[status] || 'secondary'
  },
  
  // Get category icon
  getCategoryIcon: (category) => {
    const icons = {
      Cable: '📺',
      Internet: '🌐',
      Silver: '🥈',
      Snacks: '🍿',
      Gaming: '🎮',
      Design: '🎨',
      Development: '💻',
    }
    return icons[category] || '📦'
  },
}

// Highlight service API endpoints
export const highlightService = {
  getHomeServices: () => api.get('/home-services'),
  getHomeFeatures: () => api.get('/home-features'),
}

export default api
