import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Bed, Bath, Maximize, MapPin, Tag } from 'lucide-react'
import Header from '../components/global/Header';
import { client, urlFor } from '../lib/sanityClient'
import { ALL_PROPERTIES_QUERY } from '../lib/sanityQueries'

const PropertiesPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: () => client.fetch(ALL_PROPERTIES_QUERY)
  })

  // Filter properties based on selected status and type
  const filteredProperties = properties?.filter(property => {
    const statusMatch = selectedStatus === 'all' || property.status === selectedStatus
    const typeMatch = selectedType === 'all' || property.propertyType === selectedType
    return statusMatch && typeMatch
  })

  const featuredProperty = filteredProperties?.find(p => p.featured)
  const remainingProperties = filteredProperties?.filter(p => p._id !== featuredProperty?._id)

  const formatPrice = (price, label) => {
    if (label) return label
    if (!price) return 'Price on Request'
    return `AED ${price.toLocaleString()}`
  }

  const formatArea = (area, unit) => {
    if (!area) return null
    const unitLabel = unit === 'sqm' ? 'sq m' : 'sq ft'
    return `${area.toLocaleString()} ${unitLabel}`
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'for-sale': return 'bg-green-500'
      case 'for-rent': return 'bg-blue-500'
      case 'sold': return 'bg-gray-500'
      case 'rented': return 'bg-gray-500'
      case 'off-plan': return 'bg-purple-500'
      default: return 'bg-[#e83f25]'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'for-sale': return 'For Sale'
      case 'for-rent': return 'For Rent'
      case 'sold': return 'Sold'
      case 'rented': return 'Rented'
      case 'off-plan': return 'Off-Plan'
      default: return status
    }
  }

  if (propertiesLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#e83f25] border-t-transparent rounded-full animate-spin"></div>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-gray-500">
              Loading properties...
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* PAGE HEADER */}
          <div className="mb-12 text-center">
            <p
              className="text-sm font-semibold uppercase tracking-widest text-[#e83f25] mb-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Properties
            </p>
            <h1
              className="text-5xl font-bold text-black mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Find Your Dream Property
            </h1>
            <p
              className="text-gray-500 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Explore our exclusive collection of premium properties in Dubai's most sought-after locations.
            </p>
          </div>

          {/* FILTERS */}
          <div className="mb-12 space-y-4">
            {/* Status Filter */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                Property Status
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedStatus === 'all'
                      ? 'bg-[#e83f25] text-white'
                      : 'bg-[#f7f7f7] text-black hover:bg-[#e83f25] hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedStatus('for-sale')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedStatus === 'for-sale'
                      ? 'bg-[#e83f25] text-white'
                      : 'bg-[#f7f7f7] text-black hover:bg-[#e83f25] hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  For Sale
                </button>
                <button
                  onClick={() => setSelectedStatus('for-rent')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedStatus === 'for-rent'
                      ? 'bg-[#e83f25] text-white'
                      : 'bg-[#f7f7f7] text-black hover:bg-[#e83f25] hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  For Rent
                </button>
                <button
                  onClick={() => setSelectedStatus('off-plan')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedStatus === 'off-plan'
                      ? 'bg-[#e83f25] text-white'
                      : 'bg-[#f7f7f7] text-black hover:bg-[#e83f25] hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Off-Plan
                </button>
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                Property Type
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedType === 'all'
                      ? 'bg-[#e83f25] text-white'
                      : 'bg-[#f7f7f7] text-black hover:bg-[#e83f25] hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  All Types
                </button>
                <button
                  onClick={() => setSelectedType('apartment')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedType === 'apartment'
                      ? 'bg-[#e83f25] text-white'
                      : 'bg-[#f7f7f7] text-black hover:bg-[#e83f25] hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Apartment
                </button>
                <button
                  onClick={() => setSelectedType('villa')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedType === 'villa'
                      ? 'bg-[#e83f25] text-white'
                      : 'bg-[#f7f7f7] text-black hover:bg-[#e83f25] hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Villa
                </button>
                <button
                  onClick={() => setSelectedType('townhouse')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedType === 'townhouse'
                      ? 'bg-[#e83f25] text-white'
                      : 'bg-[#f7f7f7] text-black hover:bg-[#e83f25] hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Townhouse
                </button>
                <button
                  onClick={() => setSelectedType('penthouse')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedType === 'penthouse'
                      ? 'bg-[#e83f25] text-white'
                      : 'bg-[#f7f7f7] text-black hover:bg-[#e83f25] hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Penthouse
                </button>
              </div>
            </div>
          </div>

          {/* NO PROPERTIES STATE */}
          {filteredProperties?.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg" style={{ fontFamily: 'var(--font-body)' }}>
                No properties found matching your criteria.
              </p>
            </div>
          )}

          {/* FEATURED PROPERTY */}
          {featuredProperty && (
            <Link to={`/properties/${featuredProperty.slug.current}`} className="block mb-16 group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-xl">
                
                {/* Featured Image */}
                <div className="relative h-72 lg:h-full min-h-[400px] overflow-hidden">
                  {featuredProperty.mainImage ? (
                    <img
                      src={urlFor(featuredProperty.mainImage).width(800).url()}
                      alt={featuredProperty.mainImage.alt || featuredProperty.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#939393]"></div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span
                      className="bg-[#e83f25] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Featured
                    </span>
                    {featuredProperty.status && (
                      <span
                        className={`${getStatusBadgeColor(featuredProperty.status)} text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full`}
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {getStatusLabel(featuredProperty.status)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Featured Content */}
                <div className="bg-[#f7f7f7] p-10 flex flex-col justify-center">
                  {featuredProperty.propertyType && (
                    <p
                      className="text-xs font-semibold text-[#e83f25] uppercase tracking-wide mb-2"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {featuredProperty.propertyType.replace('-', ' ')}
                    </p>
                  )}

                  <h2
                    className="text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight group-hover:text-[#e83f25] transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {featuredProperty.title}
                  </h2>

                  {featuredProperty.location?.area && (
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span style={{ fontFamily: 'var(--font-body)' }} className="text-sm">
                        {featuredProperty.location.area}
                      </span>
                    </div>
                  )}

                  <p
                    className="text-gray-500 text-base leading-relaxed mb-6 line-clamp-2"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {featuredProperty.excerpt}
                  </p>

                  {/* Property Details */}
                  <div className="flex items-center gap-6 mb-6">
                    {featuredProperty.bedrooms && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Bed className="w-5 h-5" />
                        <span style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-medium">
                          {featuredProperty.bedrooms} Beds
                        </span>
                      </div>
                    )}
                    {featuredProperty.bathrooms && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Bath className="w-5 h-5" />
                        <span style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-medium">
                          {featuredProperty.bathrooms} Baths
                        </span>
                      </div>
                    )}
                    {featuredProperty.area && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Maximize className="w-5 h-5" />
                        <span style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-medium">
                          {formatArea(featuredProperty.area, featuredProperty.areaUnit)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                    <p
                      className="text-2xl font-bold text-[#e83f25]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {formatPrice(featuredProperty.price, featuredProperty.priceLabel)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* PROPERTIES GRID */}
          {remainingProperties?.length > 0 && (
            <>
              <h2
                className="text-2xl font-bold text-black mb-8"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                All Properties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingProperties.map((property) => (
                  <Link
                    to={`/properties/${property.slug.current}`}
                    key={property._id}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-52 overflow-hidden">
                      {property.mainImage ? (
                        <img
                          src={urlFor(property.mainImage).width(500).url()}
                          alt={property.mainImage.alt || property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#939393]"></div>
                      )}
                      {property.status && (
                        <div className="absolute top-3 left-3">
                          <span
                            className={`${getStatusBadgeColor(property.status)} text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full`}
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            {getStatusLabel(property.status)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {property.propertyType && (
                        <p
                          className="text-xs font-semibold text-[#e83f25] uppercase tracking-wide mb-2"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {property.propertyType.replace('-', ' ')}
                        </p>
                      )}

                      <h3
                        className="text-lg font-bold text-black mb-2 leading-tight group-hover:text-[#e83f25] transition-colors line-clamp-2"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {property.title}
                      </h3>

                      {property.location?.area && (
                        <div className="flex items-center gap-1 text-gray-500 mb-3">
                          <MapPin className="w-3 h-3" />
                          <span style={{ fontFamily: 'var(--font-body)' }} className="text-xs">
                            {property.location.area}
                          </span>
                        </div>
                      )}

                      <p
                        className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {property.excerpt}
                      </p>

                      {/* Property Details */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        {property.bedrooms && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Bed className="w-4 h-4" />
                            <span style={{ fontFamily: 'var(--font-body)' }}>{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Bath className="w-4 h-4" />
                            <span style={{ fontFamily: 'var(--font-body)' }}>{property.bathrooms}</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Maximize className="w-4 h-4" />
                            <span style={{ fontFamily: 'var(--font-body)' }} className="text-xs">
                              {formatArea(property.area, property.areaUnit)}
                            </span>
                          </div>
                        )}
                      </div>

                      {property.tags?.length > 0 && (
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <Tag className="w-3 h-3 text-gray-400" />
                          {property.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-gray-400"
                              style={{ fontFamily: 'var(--font-body)' }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-100">
                        <p
                          className="text-xl font-bold text-[#e83f25]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {formatPrice(property.price, property.priceLabel)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default PropertiesPage;