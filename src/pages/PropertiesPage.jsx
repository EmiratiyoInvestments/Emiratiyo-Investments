import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Tag,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { client, urlFor } from "../config/sanityClient";
import { ALL_PROPERTIES_QUERY } from "../lib/sanity/propertyQueries";
import { usePropertyFilters } from "../hooks/usePropertyFilters";
import Pagination from "../components/blog/Pagination";

const PropertiesPage = () => {
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => client.fetch(ALL_PROPERTIES_QUERY),
  });

  const {
    searchQuery,
    filters,
    sortBy,
    currentPage,
    totalPages,
    filteredProperties,
    paginatedProperties,
    featuredProperty,
    remainingProperties,
    resultsCount,
    totalCount,
    handleSearch,
    handleStatusChange,
    handleTypeChange,
    handleBedroomsChange,
    handlePriceChange,
    handleSortChange,
    handlePageChange,
    clearAllFilters,
    removeFilter,
    getActiveFilters,
  } = usePropertyFilters(properties || []);

  const activeFilters = getActiveFilters();
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  // Helper for price range label
  const getPriceRangeLabel = () => {
    const isSale =
      filters.status === "all" ||
      filters.status === "for-sale" ||
      filters.status === "off-plan";
    const priceLabels = {
      "under-1m": "Under 1M",
      "1m-3m": "1M-3M",
      "3m-5m": "3M-5M",
      "5m-plus": "5M+",
      "under-50k": "Under 50K",
      "50k-100k": "50K-100K",
      "100k-200k": "100K-200K",
      "200k-plus": "200K+",
    };
    return priceLabels[filters.priceRange] || "Any";
  };

  const getFilterBadgeLabel = (filterKey, value) => {
    const labels = {
      search: `"${value}"`,
      status: {
        "for-sale": "For Sale",
        "for-rent": "For Rent",
        "off-plan": "Off-Plan",
        sold: "Sold",
      },
      propertyType: {
        apartment: "Apartment",
        villa: "Villa",
        townhouse: "Townhouse",
        penthouse: "Penthouse",
        studio: "Studio",
      },
      bedrooms: value,
      priceRange: getPriceRangeLabel(),
    };

    if (filterKey === "status" || filterKey === "propertyType") {
      return labels[filterKey][value] || value;
    }
    return labels[filterKey] || value;
  };

  const formatPrice = (price, label) => {
    if (typeof price === "number" && price > 0) {
      const priceStr = `AED ${price.toLocaleString()}`;
      return label ? `${priceStr} ${label}` : priceStr;
    }
    return label || "Price on Request";
  };

  const formatArea = (area, unit) => {
    if (!area) return null;
    const unitLabel = unit === "sqm" ? "sq m" : "sq ft";
    return `${area.toLocaleString()} ${unitLabel}`;
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "for-sale":
        return "bg-green-500";
      case "for-rent":
        return "bg-blue-500";
      case "sold":
        return "bg-gray-500";
      case "rented":
        return "bg-gray-500";
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

  if (propertiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#e83f25] border-t-transparent rounded-full animate-spin"></div>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="text-gray-500"
          >
            Loading properties...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* PAGE HEADER */}
          <div className="mb-8 text-center">
            <p
              className="text-sm font-semibold uppercase tracking-widest text-[#e83f25] mb-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Properties
            </p>
            <h1
              className="text-5xl font-bold text-black mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Find Your Dream Property
            </h1>
            <p
              className="text-gray-500 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Explore our exclusive collection of premium properties in Dubai's
              most sought-after locations.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="🔍 Search by title, location, building name..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#f7f7f7] rounded-lg border border-gray-200 focus:outline-none focus:border-[#e83f25] transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* FILTER PILLS SECTION */}
          <div className="mb-8 space-y-6 bg-[#f7f7f7] p-6 rounded-lg">
            {/* Status Filter */}
            <div>
              <p
                className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Status
              </p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "All", value: "all" },
                  { label: "For Sale", value: "for-sale" },
                  { label: "For Rent", value: "for-rent" },
                  { label: "Off-Plan", value: "off-plan" },
                  { label: "Sold", value: "sold" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filters.status === option.value
                        ? "bg-[#e83f25] text-white"
                        : "bg-white text-black hover:bg-[#e83f25] hover:text-white border border-gray-200"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <p
                className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Type
              </p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "All", value: "all" },
                  { label: "Apartment", value: "apartment" },
                  { label: "Villa", value: "villa" },
                  { label: "Townhouse", value: "townhouse" },
                  { label: "Penthouse", value: "penthouse" },
                  { label: "Studio", value: "studio" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTypeChange(option.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filters.propertyType === option.value
                        ? "bg-[#e83f25] text-white"
                        : "bg-white text-black hover:bg-[#e83f25] hover:text-white border border-gray-200"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <p
                className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Bedrooms
              </p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Any", value: "any" },
                  { label: "1+", value: "1+" },
                  { label: "2+", value: "2+" },
                  { label: "3+", value: "3+" },
                  { label: "4+", value: "4+" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleBedroomsChange(option.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filters.bedrooms === option.value
                        ? "bg-[#e83f25] text-white"
                        : "bg-white text-black hover:bg-[#e83f25] hover:text-white border border-gray-200"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <p
                className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Price
              </p>
              <div className="flex gap-2 flex-wrap">
                {(filters.status === "all" ||
                filters.status === "for-sale" ||
                filters.status === "off-plan"
                  ? [
                      { label: "Any", value: "any" },
                      { label: "Under 1M", value: "under-1m" },
                      { label: "1M - 3M", value: "1m-3m" },
                      { label: "3M - 5M", value: "3m-5m" },
                      { label: "5M+", value: "5m-plus" },
                    ]
                  : [
                      { label: "Any", value: "any" },
                      { label: "Under 50K", value: "under-50k" },
                      { label: "50K - 100K", value: "50k-100k" },
                      { label: "100K - 200K", value: "100k-200k" },
                      { label: "200K+", value: "200k-plus" },
                    ]
                ).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePriceChange(option.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filters.priceRange === option.value
                        ? "bg-[#e83f25] text-white"
                        : "bg-white text-black hover:bg-[#e83f25] hover:text-white border border-gray-200"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SORT & RESULTS ROW */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p
              className="text-sm text-gray-600"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Showing{" "}
              <span className="font-semibold text-black">
                {resultsCount === 0 ? 0 : (currentPage - 1) * 9 + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-black">
                {Math.min(currentPage * 9, resultsCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-black">{resultsCount}</span>{" "}
              properties
            </p>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer hover:border-[#e83f25] focus:outline-none focus:border-[#e83f25] transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <option value="newest">Sort: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="bedrooms">Most Bedrooms</option>
              <option value="area">Largest Area</option>
            </select>
          </div>

          {/* ACTIVE FILTERS BADGES */}
          {hasActiveFilters && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {Object.entries(activeFilters).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 bg-[#e83f25] text-white px-3 py-1.5 rounded-full text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <span>{getFilterBadgeLabel(key, value)}</span>
                  <button
                    onClick={() => removeFilter(key)}
                    className="ml-1 hover:opacity-70 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-sm font-medium text-gray-600 hover:text-[#e83f25] transition-colors ml-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Clear all
              </button>
            </div>
          )}

          {/* NO RESULTS STATE */}
          {filteredProperties?.length === 0 && (
            <div className="text-center py-20">
              <p
                className="text-gray-400 text-lg mb-4"
                style={{ fontFamily: "var(--font-body)" }}
              >
                No properties match your search.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-[#e83f25] text-white rounded-lg font-medium hover:bg-[#d63620] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* FEATURED PROPERTY */}
          {featuredProperty && (
            <Link
              to={`/properties/${featuredProperty.slug.current}`}
              className="block mb-16 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-xl">
                {/* Featured Image */}
                <div className="relative h-72 lg:h-full min-h-[400px] overflow-hidden">
                  {featuredProperty.mainImage ? (
                    <img
                      src={urlFor(featuredProperty.mainImage).width(800).url()}
                      alt={
                        featuredProperty.mainImage.alt || featuredProperty.title
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#939393]"></div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span
                      className="bg-[#e83f25] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Featured
                    </span>
                    {featuredProperty.status && (
                      <span
                        className={`${getStatusBadgeColor(featuredProperty.status)} text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full`}
                        style={{ fontFamily: "var(--font-body)" }}
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
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {featuredProperty.propertyType.replace("-", " ")}
                    </p>
                  )}

                  <h2
                    className="text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight group-hover:text-[#e83f25] transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {featuredProperty.title}
                  </h2>

                  {featuredProperty.location?.area && (
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span
                        style={{ fontFamily: "var(--font-body)" }}
                        className="text-sm"
                      >
                        {featuredProperty.location.area}
                      </span>
                    </div>
                  )}

                  <p
                    className="text-gray-500 text-base leading-relaxed mb-6 line-clamp-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {featuredProperty.excerpt}
                  </p>

                  {/* Property Details */}
                  <div className="flex items-center gap-6 mb-6">
                    {featuredProperty.bedrooms && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Bed className="w-5 h-5" />
                        <span
                          style={{ fontFamily: "var(--font-body)" }}
                          className="text-sm font-medium"
                        >
                          {featuredProperty.bedrooms} Beds
                        </span>
                      </div>
                    )}
                    {featuredProperty.bathrooms && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Bath className="w-5 h-5" />
                        <span
                          style={{ fontFamily: "var(--font-body)" }}
                          className="text-sm font-medium"
                        >
                          {featuredProperty.bathrooms} Baths
                        </span>
                      </div>
                    )}
                    {featuredProperty.area && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Maximize className="w-5 h-5" />
                        <span
                          style={{ fontFamily: "var(--font-body)" }}
                          className="text-sm font-medium"
                        >
                          {formatArea(
                            featuredProperty.area,
                            featuredProperty.areaUnit,
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                    <p
                      className="text-2xl font-bold text-[#e83f25]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {formatPrice(
                        featuredProperty.price,
                        featuredProperty.priceLabel,
                      )}
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
                style={{ fontFamily: "var(--font-display)" }}
              >
                All Properties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                            style={{ fontFamily: "var(--font-body)" }}
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
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {property.propertyType.replace("-", " ")}
                        </p>
                      )}

                      <h3
                        className="text-lg font-bold text-black mb-2 leading-tight group-hover:text-[#e83f25] transition-colors line-clamp-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {property.title}
                      </h3>

                      {property.location?.area && (
                        <div className="flex items-center gap-1 text-gray-500 mb-3">
                          <MapPin className="w-3 h-3" />
                          <span
                            style={{ fontFamily: "var(--font-body)" }}
                            className="text-xs"
                          >
                            {property.location.area}
                          </span>
                        </div>
                      )}

                      <p
                        className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {property.excerpt}
                      </p>

                      {/* Property Details */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        {property.bedrooms && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Bed className="w-4 h-4" />
                            <span style={{ fontFamily: "var(--font-body)" }}>
                              {property.bedrooms}
                            </span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Bath className="w-4 h-4" />
                            <span style={{ fontFamily: "var(--font-body)" }}>
                              {property.bathrooms}
                            </span>
                          </div>
                        )}
                        {property.area && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Maximize className="w-4 h-4" />
                            <span
                              style={{ fontFamily: "var(--font-body)" }}
                              className="text-xs"
                            >
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
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-100">
                        <p
                          className="text-xl font-bold text-[#e83f25]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {formatPrice(property.price, property.priceLabel)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PropertiesPage;
