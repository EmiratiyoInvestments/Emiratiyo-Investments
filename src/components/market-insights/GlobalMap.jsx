import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { urlFor } from "../../services/sanityClient";
import {
  MapPin,
  Bed,
  Bath,
  ExternalLink,
  X,
  Maximize,
  Minimize,
} from "lucide-react";

// Format price - numbers only
const formatPriceLabel = (price, priceLabel) => {
  if (priceLabel) return priceLabel;
  if (!price) return "POA";
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
  return `${price.toLocaleString()}`;
};

// Get label colors based on status
const getLabelColors = (status, isSelected) => {
  if (isSelected) {
    return {
      bg: "#e83f25",
      text: "white",
      border: "#c73519",
      shadow: "0 4px 15px rgba(232,63,37,0.5)",
    };
  }
  switch (status) {
    case "for-rent":
      return {
        bg: "#3b82f6",
        text: "white",
        border: "#2563eb",
        shadow: "0 2px 8px rgba(59,130,246,0.4)",
      };
    case "sold":
    case "rented":
      return {
        bg: "#22c55e",
        text: "white",
        border: "#16a34a",
        shadow: "0 2px 8px rgba(34,197,94,0.4)",
      };
    case "off-plan":
      return {
        bg: "#8b5cf6",
        text: "white",
        border: "#7c3aed",
        shadow: "0 2px 8px rgba(139,92,246,0.4)",
      };
    default:
      return {
        bg: "#1a1a1a",
        text: "white",
        border: "#333",
        shadow: "0 2px 8px rgba(0,0,0,0.3)",
      };
  }
};

// Create price label icon
const createPriceIcon = (price, priceLabel, status, isSelected) => {
  const label = formatPriceLabel(price, priceLabel);
  const colors = getLabelColors(status, isSelected);

  return L.divIcon({
    className: "custom-price-icon",
    html: `
      <div style="
        background: ${colors.bg};
        color: ${colors.text};
        border: 2px solid ${colors.border};
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
        cursor: pointer;
        box-shadow: ${colors.shadow};
        font-family: system-ui, sans-serif;
        display: inline-block;
        transform: ${isSelected ? "scale(1.15)" : "scale(1)"};
        transition: transform 0.2s ease;
      ">${label}</div>
    `,
    iconSize: null,
    iconAnchor: null,
  });
};

// Fly to location helper
const FlyToLocation = ({ coords }) => {
  const map = useMap();
  if (coords) {
    map.flyTo([coords.lat, coords.lng], 15, { duration: 1.2 });
  }
  return null;
};

// Fullscreen Button Component
const FullscreenButton = ({ containerRef }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return (
    <button
      onClick={toggleFullscreen}
      title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2 px-4 py-2 border border-gray-200"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {isFullscreen ? (
        <>
          <Minimize className="w-4 h-4 text-gray-700" />
          <span className="text-xs font-semibold text-gray-700">
            Exit Fullscreen
          </span>
        </>
      ) : (
        <>
          <Maximize className="w-4 h-4 text-gray-700" />
          <span className="text-xs font-semibold text-gray-700">
            Fullscreen
          </span>
        </>
      )}
    </button>
  );
};

const GlobalMap = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const containerRef = React.useRef(null);

  const validProperties = properties?.filter(
    (p) => p.location?.geopoint?.lat && p.location?.geopoint?.lng,
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "for-rent":
        return "bg-blue-500";
      case "sold":
      case "rented":
        return "bg-green-500";
      case "off-plan":
        return "bg-purple-500";
      default:
        return "bg-[#e83f25]";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "for-sale":
        return "For Sale";
      case "for-rent":
        return "For Rent";
      case "sold":
        return "Sold";
      case "rented":
        return "Rented";
      case "off-plan":
        return "Off-Plan";
      default:
        return status;
    }
  };

  const formatPrice = (price, label) => {
    if (label) return label;
    if (!price) return "Price on Request";
    return `AED ${price.toLocaleString()}`;
  };

  if (!validProperties || validProperties.length === 0) {
    return (
      <div
        className="w-full rounded-2xl overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center"
        style={{ height: "600px" }}
      >
        <div className="text-center px-6">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p
            className="text-gray-500 text-lg mb-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            No properties with location data yet.
          </p>
          <p
            className="text-gray-400 text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Add geopoint coordinates in Sanity Studio to see them on the map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: "600px" }}>
      {/* MAP */}
      <MapContainer
        center={[25.2048, 55.2708]}
        zoom={10}
        style={{ height: "100%", width: "100%", borderRadius: "16px" }}
        scrollWheelZoom={true}
      >
        {/* English Map Tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Fly to selected */}
        {selectedProperty && (
          <FlyToLocation coords={selectedProperty.location.geopoint} />
        )}

        {/* Price Label Markers */}
        {validProperties.map((property) => {
          const isSelected = selectedProperty?._id === property._id;
          return (
            <Marker
              key={property._id}
              position={[
                property.location.geopoint.lat,
                property.location.geopoint.lng,
              ]}
              icon={createPriceIcon(
                property.price,
                property.priceLabel,
                property.status,
                isSelected,
              )}
              eventHandlers={{
                click: () => setSelectedProperty(isSelected ? null : property),
              }}
              zIndexOffset={isSelected ? 1000 : 0}
            />
          );
        })}
      </MapContainer>

      {/* FULLSCREEN BUTTON */}
      <FullscreenButton containerRef={containerRef} />

      {/* LEGEND - top right */}
      <div
        className="absolute top-4 right-4 z-[1000] bg-white rounded-xl shadow-lg p-3"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Legend
        </p>
        <div className="space-y-1.5">
          {[
            { color: "#1a1a1a", label: "For Sale" },
            { color: "#3b82f6", label: "For Rent" },
            { color: "#8b5cf6", label: "Off-Plan" },
            { color: "#22c55e", label: "Sold / Rented" },
            { color: "#e83f25", label: "Selected" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="rounded-full px-2 py-0.5 text-white text-xs font-bold"
                style={{ background: item.color, fontSize: "10px" }}
              >
                1.5M
              </div>
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PROPERTY DETAIL CARD - bottom left */}
      {selectedProperty && (
        <div
          className="absolute bottom-4 left-4 z-[1000] bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{ width: "300px", maxWidth: "calc(100% - 32px)" }}
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
              style={{ fontFamily: "var(--font-body)" }}
            >
              {selectedProperty.title}
            </h3>

            {selectedProperty.location?.area && (
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <p
                  className="text-xs text-gray-500 line-clamp-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {selectedProperty.location.area}
                </p>
              </div>
            )}

            <p
              className="text-[#e83f25] font-bold text-base mb-3"
              style={{ fontFamily: "var(--font-body)" }}
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
                style={{ fontFamily: "var(--font-body)" }}
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
