import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { urlFor } from '../../services/sanityClient';
import { MapPin, Bed, Bath, ExternalLink, X } from 'lucide-react';

// Fix default marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Brand red marker
const redMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper to fly to location when property selected
const FlyToLocation = ({ coords }) => {
  const map = useMap();
  if (coords) {
    map.flyTo([coords.lat, coords.lng], 15, { duration: 1.2 });
  }
  return null;
};

const GlobalMap = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Only use properties with geopoint
  const validProperties = properties?.filter(p =>
    p.location?.geopoint?.lat && p.location?.geopoint?.lng
  );

  const getMarkerIcon = (status) => {
    if (status === 'sold' || status === 'rented') return greenMarker;
    if (status === 'for-rent') return blueMarker;
    return redMarker;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'for-rent': return 'bg-blue-500';
      case 'sold':
      case 'rented': return 'bg-green-500';
      default: return 'bg-[#e83f25]';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'for-sale': return 'For Sale';
      case 'for-rent': return 'For Rent';
      case 'sold': return 'Sold';
      case 'rented': return 'Rented';
      case 'off-plan': return 'Off-Plan';
      default: return status;
    }
  };

  const formatPrice = (price, label) => {
    if (label) return label;
    if (!price) return 'Price on Request';
    return `AED ${price.toLocaleString()}`;
  };

  if (!validProperties || validProperties.length === 0) {
    return (
      <div
        className="w-full rounded-2xl overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center"
        style={{ height: '600px' }}
      >
        <div className="text-center px-6">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg mb-2" style={{ fontFamily: 'var(--font-body)' }}>
            No properties with location data yet.
          </p>
          <p className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            Add geopoint coordinates in Sanity Studio to see them on the map.
          </p>
        </div>
      </div>
    );
  }

  // Center of all properties
  const centerLat = validProperties.reduce((sum, p) => sum + p.location.geopoint.lat, 0) / validProperties.length;
  const centerLng = validProperties.reduce((sum, p) => sum + p.location.geopoint.lng, 0) / validProperties.length;

  return (
    <div className="relative" style={{ height: '600px' }}>

      {/* MAP - Full Width */}
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={11}
        style={{ height: '100%', width: '100%', borderRadius: '16px' }}
        scrollWheelZoom={true}
      >
        {/* English Map Tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Fly to selected property */}
        {selectedProperty && (
          <FlyToLocation coords={selectedProperty.location.geopoint} />
        )}

        {/* All Property Markers */}
        {validProperties.map((property) => (
          <Marker
            key={property._id}
            position={[property.location.geopoint.lat, property.location.geopoint.lng]}
            icon={getMarkerIcon(property.status)}
            eventHandlers={{
              click: () => setSelectedProperty(property)
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'var(--font-body)', minWidth: '150px' }}>
                <p className="font-bold text-black text-sm">{property.title}</p>
                <p className="text-[#e83f25] font-semibold text-xs mt-1">
                  {formatPrice(property.price, property.priceLabel)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* PROPERTY DETAIL CARD - Overlaid on map bottom left */}
      {selectedProperty && (
        <div
          className="absolute bottom-4 left-4 z-[1000] bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{ width: '300px', maxWidth: 'calc(100% - 32px)' }}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-2 right-2 z-10 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-black" />
          </button>

          {/* Property Image */}
          <div className="relative h-40">
            {selectedProperty.mainImage ? (
              <img
                src={urlFor(selectedProperty.mainImage).width(400).url()}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-300" />
              </div>
            )}
            {selectedProperty.status && (
              <span
                className={`absolute top-2 left-2 ${getStatusColor(selectedProperty.status)} text-white text-xs font-bold px-2 py-1 rounded-full`}
              >
                {getStatusLabel(selectedProperty.status)}
              </span>
            )}
          </div>

          {/* Property Info */}
          <div className="p-4">
            <h3
              className="font-bold text-black text-base mb-1 line-clamp-1"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {selectedProperty.title}
            </h3>

            {selectedProperty.location?.area && (
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-500 line-clamp-1" style={{ fontFamily: 'var(--font-body)' }}>
                  {selectedProperty.location.area}
                </p>
              </div>
            )}

            <p
              className="text-[#e83f25] font-bold text-base mb-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {formatPrice(selectedProperty.price, selectedProperty.priceLabel)}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-3 text-xs text-gray-500">
                {selectedProperty.bedrooms && (
                  <span className="flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    {selectedProperty.bedrooms} Beds
                  </span>
                )}
                {selectedProperty.bathrooms && (
                  <span className="flex items-center gap-1">
                    <Bath className="w-3 h-3" />
                    {selectedProperty.bathrooms} Baths
                  </span>
                )}
              </div>
              <Link
                to={`/properties/${selectedProperty.slug?.current}`}
                className="flex items-center gap-1 bg-[#e83f25] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#d63620] transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                View
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalMap;