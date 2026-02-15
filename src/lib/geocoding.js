// FREE Geocoding - Converts any address to coordinates
// Uses OpenStreetMap Nominatim API (100% FREE, no API key)

// Common Dubai areas for fast lookup
const DUBAI_AREAS = {
  'downtown dubai': { lat: 25.1972, lng: 55.2744 },
  'dubai marina': { lat: 25.0805, lng: 55.1396 },
  'palm jumeirah': { lat: 25.1124, lng: 55.1390 },
  'business bay': { lat: 25.1860, lng: 55.2608 },
  'jbr': { lat: 25.0776, lng: 55.1332 },
  'jumeirah beach residence': { lat: 25.0776, lng: 55.1332 },
  'arabian ranches': { lat: 25.0529, lng: 55.2650 },
  'dubai hills estate': { lat: 25.1108, lng: 55.2453 },
  'difc': { lat: 25.2138, lng: 55.2826 },
  'al barsha': { lat: 25.1124, lng: 55.2005 },
  'jumeirah': { lat: 25.2332, lng: 55.2709 },
  'deira': { lat: 25.2744, lng: 55.3337 },
  'bur dubai': { lat: 25.2632, lng: 55.2972 },
  'dubai': { lat: 25.2048, lng: 55.2708 }
};

export async function geocodeAddress(address) {
  if (!address) return null;
  
  try {
    // Add delay to respect Nominatim usage policy
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const query = encodeURIComponent(`${address}, Dubai, UAE`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      {
        headers: {
          'User-Agent': 'EmiratiYoInvestments/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export async function getCoordinates(address) {
  if (!address) {
    return { lat: 25.2048, lng: 55.2708 }; // Default Dubai center
  }
  
  // Normalize address
  const normalized = address.toLowerCase().trim();
  
  // Check hardcoded list first (fast)
  if (DUBAI_AREAS[normalized]) {
    console.log(`✅ Found in cache: ${address}`);
    return DUBAI_AREAS[normalized];
  }
  
  // Try geocoding API for any address
  console.log(`🔍 Geocoding: ${address}`);
  const coords = await geocodeAddress(address);
  
  if (coords) {
    console.log(`✅ Geocoded successfully: ${address}`, coords);
    return coords;
  }
  
  // Fallback to Dubai center
  console.log(`⚠️ Using default location for: ${address}`);
  return { lat: 25.2048, lng: 55.2708 };
}

export { DUBAI_AREAS };