import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import LoadingSpinner from './components/UI/LoadingSpinner'

// Public Pages
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ContactPage from './pages/ContactPage'

// Protected Pages
import DashboardPage from './pages/Dashboard/DashboardPage'
import MySubscriptionsPage from './pages/Dashboard/MySubscriptionsPage'
import ProfilePage from './pages/Dashboard/ProfilePage'
import PlanBuilderPage from './pages/PlanBuilderPage'

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminUsers from './pages/Admin/AdminUsers'
import AdminServices from './pages/Admin/AdminServices'
import AdminSubscriptions from './pages/Admin/AdminSubscriptions'
import AdminAnalytics from './pages/Admin/AdminAnalytics'

// Static Pages
import HelpCenter from './pages/support/HelpCenter'
import FAQ from './pages/support/FAQ'
import ServiceStatus from './pages/support/ServiceStatus'
import InstallationGuide from './pages/support/InstallationGuide'
import Troubleshooting from './pages/support/Troubleshooting'

// Company Pages
import AboutUs from './pages/company/AboutUs'
import Careers from './pages/company/Careers'
import Blog from './pages/company/Blog'
import Press from './pages/company/Press'

// Legal Pages
import LegalPage from './pages/legal/LegalPage'

// Error Pages
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  // ✅ Handle GitHub Pages 404 redirect
  useEffect(() => {
    const redirect = new URLSearchParams(window.location.search).get('redirect')
    if (redirect) {
      navigate(redirect, { replace: true })
    }
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:id" element={<ServiceDetailPage />} />
          <Route path="contact" element={<ContactPage />} />
          
          {/* Auth Routes - Redirect if already logged in */}
          <Route 
            path="login" 
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
          />
          <Route 
            path="register" 
            element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
          />
          
          {/* Protected Customer Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="subscriptions" element={
            <ProtectedRoute>
              <MySubscriptionsPage />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="plan-builder" element={
            <ProtectedRoute>
              <PlanBuilderPage />
            </ProtectedRoute>
          } />
          
          {/* Protected Admin Routes */}
          <Route path="admin" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="admin/users" element={
            <ProtectedRoute requireAdmin>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="admin/services" element={
            <ProtectedRoute requireAdmin>
              <AdminServices />
            </ProtectedRoute>
          } />
          <Route path="admin/subscriptions" element={
            <ProtectedRoute requireAdmin>
              <AdminSubscriptions />
            </ProtectedRoute>
          } />
          <Route path="admin/analytics" element={
            <ProtectedRoute requireAdmin>
              <AdminAnalytics />
            </ProtectedRoute>
          } />
          
          {/* Static Pages */}
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/service-status" element={<ServiceStatus />} />
          <Route path="/installation-guide" element={<InstallationGuide />} />
          <Route path="/troubleshooting" element={<Troubleshooting />} />

          {/* Company Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/press" element={<Press />} />

          {/* Legal Pages */}
          <Route path="/:type" element={<LegalPage />} />
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="/cookies" element={<LegalPage />} />
          <Route path="/refund" element={<LegalPage />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
