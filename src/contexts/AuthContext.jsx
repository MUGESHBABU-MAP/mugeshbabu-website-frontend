import { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null,
}

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
}

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      }
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      }
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set axios default header when token changes
  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token)
      authAPI.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
    } else {
      localStorage.removeItem('token')
      delete authAPI.defaults.headers.common['Authorization']
    }
  }, [state.token])

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
        return
      }

      try {
        authAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const response = await authAPI.get('/auth/me')
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.data.data.user,
            token,
          },
        })
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
        delete authAPI.defaults.headers.common['Authorization']
        dispatch({ type: AUTH_ACTIONS.LOGOUT })
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      const response = await authAPI.post('/auth/login', {
        email,
        password,
      })

      const { user, token } = response.data.data

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      })

      toast.success(`Welcome back, ${user.name}!`)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      const response = await authAPI.post('/auth/register', userData)
      const { user, token } = response.data.data

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      })

      toast.success(`Welcome to Mugesh Media, ${user.name}!`)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage })
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await authAPI.post('/auth/logout')
    } catch (error) {
      // Continue with logout even if server call fails
      console.error('Logout API call failed:', error)
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      toast.success('Logged out successfully')
    }
  }

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.put('/auth/profile', profileData)
      const updatedUser = response.data.data.user

      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: updatedUser,
      })

      toast.success('Profile updated successfully')
      return { success: true, user: updatedUser }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      await authAPI.put('/auth/change-password', passwordData)
      toast.success('Password changed successfully')
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await authAPI.post('/auth/refresh-token')
      const { token } = response.data.data

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: state.user, token },
      })

      return { success: true }
    } catch (error) {
      console.error('Token refresh failed:', error)
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      return { success: false }
    }
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.role === 'admin'
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!state.user && !!state.token
  }

  const value = {
    // State
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken,
    clearError,
    
    // Helpers
    isAdmin,
    isAuthenticated,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export default AuthContext
