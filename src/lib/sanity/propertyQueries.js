// ==================== PROPERTY QUERIES ====================

// Get all properties (for properties listing page)
export const ALL_PROPERTIES_QUERY = `*[_type == "property"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  propertyId,
  mainImage,
  excerpt,
  price,
  priceLabel,
  propertyType,
  status,
  bedrooms,
  bathrooms,
  area,
  areaUnit,
  location {
    area,
    city,
    fullAddress,
    geopoint {
      lat,
      lng
    }
  },
  completionStatus,
  amenities,
  featured,
  publishedAt,
  tags,
  "agent": agent->{
    name,
    image,
    role,
    phone,
    email,
    whatsapp
  }
}`

// Get single property by slug (for property detail page)
export const SINGLE_PROPERTY_QUERY = `*[_type == "property" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  propertyId,
  mainImage,
  gallery,
  excerpt,
  description,
  price,
  priceLabel,
  propertyType,
  status,
  bedrooms,
  bathrooms,
  area,
  areaUnit,
  location {
    area,
    city,
    fullAddress,
    geopoint {
      lat,
      lng
    }
  },
  completionStatus,
  amenities,
  featured,
  virtualTourUrl,
  developer,
  handoverDate,
  publishedAt,
  tags,
  seo,
  "agent": agent->{
    name,
    image,
    role,
    phone,
    email,
    whatsapp,
    bio,
    licenseNumber,
    languages,
    specialization
  }
}`

// Get featured properties only
export const FEATURED_PROPERTIES_QUERY = `*[_type == "property" && featured == true] | order(publishedAt desc)[0...6] {
  _id,
  title,
  slug,
  propertyId,
  mainImage,
  excerpt,
  price,
  priceLabel,
  propertyType,
  status,
  bedrooms,
  bathrooms,
  area,
  areaUnit,
  location {
    area,
    city,
    fullAddress,
    geopoint {
      lat,
      lng
    }
  },
  featured,
  tags,
  "agent": agent->{
    name,
    image,
    role,
    phone,
    email,
    whatsapp
  }
}`

// Get properties by status (for-sale, for-rent, etc.)
export const PROPERTIES_BY_STATUS_QUERY = `*[_type == "property" && status == $status] | order(publishedAt desc) {
  _id,
  title,
  slug,
  propertyId,
  mainImage,
  excerpt,
  price,
  priceLabel,
  propertyType,
  status,
  bedrooms,
  bathrooms,
  area,
  areaUnit,
  location {
    area,
    city,
    fullAddress,
    geopoint {
      lat,
      lng
    }
  },
  featured,
  tags,
  "agent": agent->{
    name,
    image,
    role,
    phone,
    email,
    whatsapp
  }
}`

// Get properties by type (apartment, villa, etc.)
export const PROPERTIES_BY_TYPE_QUERY = `*[_type == "property" && propertyType == $type] | order(publishedAt desc) {
  _id,
  title,
  slug,
  propertyId,
  mainImage,
  excerpt,
  price,
  priceLabel,
  propertyType,
  status,
  bedrooms,
  bathrooms,
  area,
  areaUnit,
  location {
    area,
    city,
    fullAddress,
    geopoint {
      lat,
      lng
    }
  },
  featured,
  tags,
  "agent": agent->{
    name,
    image,
    role,
    phone,
    email,
    whatsapp
  }
}`

// ==================== AGENT QUERIES ====================

// Get all agents
export const ALL_AGENTS_QUERY = `*[_type == "agent"] | order(name asc) {
  _id,
  name,
  slug,
  image,
  role,
  phone,
  email,
  whatsapp,
  bio,
  licenseNumber,
  languages,
  specialization
}`

// Get single agent by slug
export const SINGLE_AGENT_QUERY = `*[_type == "agent" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  image,
  role,
  phone,
  email,
  whatsapp,
  bio,
  licenseNumber,
  languages,
  specialization
}`