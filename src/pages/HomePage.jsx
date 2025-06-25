import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { highlightService } from '../services/api' // Adjust path if needed
// At top of file
import { Star, Users, Shield, Zap } from 'lucide-react'

const iconMap = {
  Star,
  Users,
  Shield,
  Zap,
}

const HomePage = () => {
  const [features, setFeatures] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuresRes, servicesRes] = await Promise.all([
          highlightService.getHomeFeatures(),
          highlightService.getHomeServices(),
        ])
        setFeatures(featuresRes.data.data)
        setServices(servicesRes.data.data)
      } catch (err) {
        console.error('Failed to fetch homepage data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-primary-50 to-white py-20 sm:py-24 lg:py-32">
        <div className="container-custom px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight mb-6 tracking-tight">
              Premium Services for Your <br />
              <span className="text-primary-600">Home & Business</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              From Cable TV and Internet to Silver Care and Design Services — we deliver reliable, customized solutions for your evolving needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-600 border border-primary-600 rounded-xl hover:bg-primary-50 hover:text-primary-700 hover:border-primary-700 transition"
              >
                Explore Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Mugesh Media?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional service quality and customer satisfaction
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-400">Loading features...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || null
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {IconComponent ? (
                        <IconComponent className="w-8 h-8 text-primary-600" />
                      ) : (
                        <span className="text-xl">✨</span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions for all your home and business needs
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-400">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="card card-hover p-6">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold">{service.price}</span>
                    <Link
                      to="/services"
                      className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                    >
                      Learn More
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/services" className="btn btn-primary btn-lg">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of satisfied customers who trust Mugesh Media for their service needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-secondary btn-lg">Create Account</Link>
              <Link to="/contact" className="btn btn-lg bg-white/10 text-white border-white/20 hover:bg-white/20">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage