// Get all blogs (for blog listing page)
export const ALL_BLOGS_QUERY = `*[_type == "blog"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  mainImage,
  excerpt,
  publishedAt,
  readTime,
  featured,
  tags,
  "author": author->{
    name,
    image,
    role
  },
  "categories": categories[]->{
    title,
    slug
  }
}`

// Get single blog by slug (for blog detail page)
export const SINGLE_BLOG_QUERY = `*[_type == "blog" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  mainImage,
  body,
  excerpt,
  publishedAt,
  readTime,
  featured,
  tags,
  "author": author->{
    name,
    image,
    role,
    bio
  },
  "categories": categories[]->{
    title,
    slug
  },
  seo
}`

// Get featured blogs only
export const FEATURED_BLOGS_QUERY = `*[_type == "blog" && featured == true] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  mainImage,
  excerpt,
  publishedAt,
  readTime,
  "author": author->{
    name,
    image,
    role
  },
  "categories": categories[]->{
    title,
    slug
  }
}`

// Get blogs by category
export const BLOGS_BY_CATEGORY_QUERY = `*[_type == "blog" && $category in categories[]->slug.current] | order(publishedAt desc) {
  _id,
  title,
  slug,
  mainImage,
  excerpt,
  publishedAt,
  readTime,
  "author": author->{
    name,
    image,
    role
  },
  "categories": categories[]->{
    title,
    slug
  }
}`

// Get all categories
export const ALL_CATEGORIES_QUERY = `*[_type == "category"] {
  _id,
  title,
  slug,
  description
}`

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
  location,
  completionStatus,
  amenities,
  featured,
  publishedAt,
  tags
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
  location,
  completionStatus,
  amenities,
  featured,
  virtualTourUrl,
  developer,
  handoverDate,
  publishedAt,
  tags,
  seo
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
  location,
  featured,
  tags
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
  location,
  featured,
  tags
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
  location,
  featured,
  tags
}`