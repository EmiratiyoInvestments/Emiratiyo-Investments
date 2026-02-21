import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin } from "lucide-react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const PropertyMap = ({ address, geopoint, title }) => {
  // If geopoint exists use it for accuracy
  // Otherwise use address for geocoding
  const mapQuery = geopoint
    ? `${geopoint.lat},${geopoint.lng}`
    : `${address}, Dubai, UAE`;

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed&hl=en`;

  return (
    <div className="mb-12">
      <h2
        className="text-2xl font-bold text-black mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Property Location
      </h2>
      <div
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      </div>
      <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
        <MapPin size={14} strokeWidth={2.5} /> {address}
      </p>
    </div>
  );
};

export default PropertyMap;
