import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const usePropertyFilters = (properties = []) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    propertyType: searchParams.get("type") || "all",
    bedrooms: searchParams.get("beds") || "any",
    priceRange: searchParams.get("price") || "any",
  });
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );

  const itemsPerPage = 9;

  // Update URL when any state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.propertyType !== "all") params.set("type", filters.propertyType);
    if (filters.bedrooms !== "any") params.set("beds", filters.bedrooms);
    if (filters.priceRange !== "any") params.set("price", filters.priceRange);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", currentPage);

    setSearchParams(params, { replace: true });
  }, [searchQuery, filters, sortBy, currentPage, setSearchParams]);

  // Apply all filters and sorting
  const filteredProperties = useMemo(() => {
    let result = properties;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (property) =>
          property.title?.toLowerCase().includes(query) ||
          property.location?.area?.toLowerCase().includes(query) ||
          property.buildingName?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }

    // Type filter
    if (filters.propertyType !== "all") {
      result = result.filter((p) => p.propertyType === filters.propertyType);
    }

    // Bedrooms filter
    if (filters.bedrooms !== "any") {
      const minBeds = parseInt(filters.bedrooms);
      result = result.filter((p) => p.bedrooms >= minBeds);
    }

    // Price filter - different ranges for sale vs rent
    if (filters.priceRange !== "any" && result.length > 0) {
      const isSaleStatus =
        filters.status === "all" || filters.status === "for-sale" || filters.status === "off-plan";
      result = result.filter((property) => {
        if (!property.price) return false;
        const price = property.price;

        if (isSaleStatus) {
          // For sale: price in AED
          switch (filters.priceRange) {
            case "under-1m":
              return price < 1000000;
            case "1m-3m":
              return price >= 1000000 && price < 3000000;
            case "3m-5m":
              return price >= 3000000 && price < 5000000;
            case "5m-plus":
              return price >= 5000000;
            default:
              return true;
          }
        } else {
          // For rent: price is annual
          switch (filters.priceRange) {
            case "under-50k":
              return price < 50000;
            case "50k-100k":
              return price >= 50000 && price < 100000;
            case "100k-200k":
              return price >= 100000 && price < 200000;
            case "200k-plus":
              return price >= 200000;
            default:
              return true;
          }
        }
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "bedrooms":
        result = [...result].sort(
          (a, b) => (b.bedrooms || 0) - (a.bedrooms || 0)
        );
        break;
      case "area":
        result = [...result].sort((a, b) => (b.area || 0) - (a.area || 0));
        break;
      case "newest":
      default:
        result = [...result].sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );
    }

    return result;
  }, [properties, searchQuery, filters, sortBy]);

  // Paginate results
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredProperties.slice(startIdx, endIdx);
  }, [filteredProperties, currentPage, itemsPerPage]);

  // Get featured property from filtered results
  const featuredProperty = paginatedProperties?.find((p) => p.featured);
  const remainingProperties = paginatedProperties?.filter(
    (p) => p._id !== featuredProperty?._id
  );

  // Handlers
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sortOption) => {
    setSortBy(sortOption);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleStatusChange = useCallback((status) => {
    handleFilterChange("status", status);
  }, [handleFilterChange]);

  const handleTypeChange = useCallback((type) => {
    handleFilterChange("propertyType", type);
  }, [handleFilterChange]);

  const handleBedroomsChange = useCallback((beds) => {
    handleFilterChange("bedrooms", beds);
  }, [handleFilterChange]);

  const handlePriceChange = useCallback((price) => {
    handleFilterChange("priceRange", price);
  }, [handleFilterChange]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setFilters({
      status: "all",
      propertyType: "all",
      bedrooms: "any",
      priceRange: "any",
    });
    setSortBy("newest");
    setCurrentPage(1);
  }, []);

  const removeFilter = useCallback((filterKey) => {
    if (filterKey === "search") {
      setSearchQuery("");
    } else {
      const defaultValues = {
        status: "all",
        propertyType: "all",
        bedrooms: "any",
        priceRange: "any",
      };
      handleFilterChange(filterKey, defaultValues[filterKey]);
    }
    setCurrentPage(1);
  }, [handleFilterChange]);

  const getActiveFilters = useCallback(() => {
    const active = {};
    if (searchQuery) active.search = searchQuery;
    if (filters.status !== "all") active.status = filters.status;
    if (filters.propertyType !== "all") active.propertyType = filters.propertyType;
    if (filters.bedrooms !== "any") active.bedrooms = filters.bedrooms;
    if (filters.priceRange !== "any") active.priceRange = filters.priceRange;
    return active;
  }, [searchQuery, filters]);

  return {
    // State
    searchQuery,
    filters,
    sortBy,
    currentPage,
    totalPages,

    // Data
    allProperties: properties,
    filteredProperties,
    paginatedProperties,
    featuredProperty,
    remainingProperties,
    resultsCount: filteredProperties.length,
    totalCount: properties.length,

    // Handlers
    handleSearch,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handleStatusChange,
    handleTypeChange,
    handleBedroomsChange,
    handlePriceChange,
    clearAllFilters,
    removeFilter,
    getActiveFilters,

    // Utils
    itemsPerPage,
  };
};
