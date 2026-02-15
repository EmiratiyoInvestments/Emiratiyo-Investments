import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, TrendingUp, Home } from 'lucide-react';
import Header from '../components/global/Header';
import GlobalMap from '../components/market-insights/GlobalMap';
import { client } from '../services/sanityClient';
import { ALL_PROPERTIES_QUERY } from '../lib/propertyQueries';

const MarketInsightsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties-map'],
    queryFn: () => client.fetch(ALL_PROPERTIES_QUERY)
  });

  // Filter properties
  const filteredProperties = properties?.filter(property => {
    const statusMatch = selectedStatus === 'all' || property.status === selectedStatus;
    const typeMatch = selectedType === 'all' || property.propertyType === selectedType;
    return statusMatch && typeMatch;
  });

  // Calculate stats
  const totalProperties = filteredProperties?.length || 0;
  const forSaleCount = filteredProperties?.filter(p => p.status === 'for-sale').length || 0;
  const forRentCount = filteredProperties?.filter(p => p.status === 'for-rent').length || 0;

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#e83f25] border-t-transparent rounded-full animate-spin"></div>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-gray-500">
              Loading market insights...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}
          <div className="mb-12 text-center">
            <p
              className="text-sm font-semibold uppercase tracking-widest text-[#e83f25] mb-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Market Insights
            </p>
            <h1
              className="text-5xl font-bold text-black mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Dubai Real Estate Market
            </h1>
            <p
              className="text-gray-500 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Explore all our listed properties across Dubai on an interactive map.
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-[#e83f25] to-[#d63620] p-6 rounded-xl shadow-lg text-white">
              <Home className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {totalProperties}
              </p>
              <p className="text-sm opacity-90" style={{ fontFamily: 'var(--font-body)' }}>
                Total Properties
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
              <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {forSaleCount}
              </p>
              <p className="text-sm opacity-90" style={{ fontFamily: 'var(--font-body)' }}>
                For Sale
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
              <Home className="w-8 h-8 mb-3 opacity-80" />
              <p className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {forRentCount}
              </p>
              <p className="text-sm opacity-90" style={{ fontFamily: 'var(--font-body)' }}>
                For Rent
              </p>
            </div>
          </div>

          {/* FILTERS */}
          <div className="bg-[#f7f7f7] p-6 rounded-xl mb-12">
            <h2 className="text-lg font-bold text-black mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Filter Properties
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Filter */}
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block" style={{ fontFamily: 'var(--font-body)' }}>
                  Property Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'for-sale', 'for-rent', 'off-plan'].map(status => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedStatus === status 
                          ? 'bg-[#e83f25] text-white' 
                          : 'bg-white text-black hover:bg-[#e83f25] hover:text-white'
                      }`}
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {status === 'all' ? 'All' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block" style={{ fontFamily: 'var(--font-body)' }}>
                  Property Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'apartment', 'villa', 'townhouse', 'penthouse'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedType === type 
                          ? 'bg-[#e83f25] text-white' 
                          : 'bg-white text-black hover:bg-[#e83f25] hover:text-white'
                      }`}
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MAP */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-[#e83f25]" />
              <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'var(--font-display)' }}>
                Properties Map
              </h2>
            </div>
            
            <GlobalMap properties={filteredProperties} />

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-6 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">For Sale / Off-Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">For Rent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Sold / Rented</span>
              </div>
            </div>
          </div>

          {/* INFO BOX */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
            <p className="text-sm text-blue-800" style={{ fontFamily: 'var(--font-body)' }}>
              <strong>💡 Tip:</strong> Click on any marker to see property details. Use the filters above to narrow down by status and type.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default MarketInsightsPage;