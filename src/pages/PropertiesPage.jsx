import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Bed, Bath, Maximize, MapPin, Tag } from 'lucide-react'
import { client, urlFor } from '../services/sanityClient'
import { ALL_PROPERTIES_QUERY } from '../lib/propertyQueries'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#e83f25] border-t-transparent rounded-full animate-spin"></div>
          <p style={{ fontFamily: 'var(--font-body)' }} className="text-gray-500">
            Loading properties...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <main className="min-h-screen">
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Properties</h1>
          <p className="text-lg text-gray-700">Explore our exclusive property listings.</p>
        </section>
      </main>
    </div>
  )
}

export default PropertiesPage;