import { useEffect, useState } from 'react'
import { Loader2, PackageSearch, Star, Check } from 'lucide-react'
import { servicesService } from '../services/api'
import { useSearchParams, useNavigate } from 'react-router-dom'

const ServicesPage = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const categoryParam = searchParams.get('category')
  const [activeCategory, setActiveCategory] = useState(categoryParam ? decodeURIComponent(categoryParam) : 'All Services')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesService.getAllServices()
        setServices(response.data.data.services || [])
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Failed to load services.')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  useEffect(() => {
    const current = categoryParam ? decodeURIComponent(categoryParam) : 'All Services'
    setActiveCategory(current)
  }, [categoryParam])

  const formatPrice = (price) => {
    if (!price?.amount) return ''
    const symbol = price.currency === 'USD' ? '$' : '₹'
    return `${symbol}${price.amount.toLocaleString()}`
  }

  // Generate categories from services data
  const getCategories = () => {
    const categoryMap = new Map()
    categoryMap.set('All Services', services.length)

    services.forEach(service => {
      const category = service.category
      if (category) {
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
      }
    })

    return Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))
  }

  const categories = getCategories()

  const filteredServices = activeCategory === 'All Services'
    ? services
    : services.filter(service => service.category === activeCategory)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="animate-spin w-6 h-6 text-primary-500" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>
  }

  if (services.length === 0) {
    return (
      <div className="container-custom section-padding text-center">
        <PackageSearch className="mx-auto text-gray-400 w-12 h-12 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No services available</h2>
        <p className="text-gray-500 text-sm">
          We're working hard to add our best offerings. Please check back later!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of services designed to meet all your needs
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                if (category.name === 'All Services') {
                  navigate('/services')
                } else {
                  navigate(`/services?category=${encodeURIComponent(category.name)}`)
                }
              }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 border ${activeCategory === category.name
                  ? 'bg-primary-500 text-white shadow-md border-primary-500'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
            >
              {category.name} ({category.count})
          </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredServices.map((service) => {
            const isPopular = service.ratings?.average >= 4.7
            const priceDisplay = service.formattedPrice || formatPrice(service.price)
            const cycleLabel = service.price?.billingCycle === 'one-time' ? 'one-time' : '/month'

            return (
              <div
                key={service._id}
                className={`relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border-2 group hover:-translate-y-1 ${isPopular ? 'border-gray-200 hover:border-primary-100' : 'border-gray-100 hover:border-gray-200'
                  }`}
              >
                {/* Popular Badge - only visible on hover and positioned correctly */}
                {isPopular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                      ⭐ Most Popular
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6">
                  {/* Service Header */}
                  <div className="mb-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-4">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{service.name}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold text-primary-600">
                          {priceDisplay}
                        </div>
                        <div className="text-gray-500 text-xs font-medium">{cycleLabel}</div>
                      </div>
                    </div>

                    {/* Rating */}
                    {service.ratings && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-gray-900 text-sm">{service.ratings.average}</span>
                        </div>
                        <span className="text-gray-500 text-xs">({service.ratings.count.toLocaleString()} reviews)</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {service.features?.slice(0, 4).map((feature, idx) => (
                        <li key={feature._id || idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-xs leading-relaxed">{feature.name || feature}</span>
                        </li>
                      ))}
                      {service.features?.length > 4 && (
                        <li className="text-gray-500 text-xs ml-5">
                          +{service.features.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 text-xs hover:shadow-md">
                      Add to Plan
                    </button>
                    <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-3 rounded-lg transition-all duration-200 text-xs border border-gray-200 hover:border-gray-300">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* No results message */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <PackageSearch className="mx-auto text-gray-400 w-16 h-16 mb-6" />
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                No services found in {activeCategory}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Try selecting a different category or check back later for new services.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ServicesPage