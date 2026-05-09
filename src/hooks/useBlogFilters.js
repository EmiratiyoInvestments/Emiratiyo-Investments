import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const BLOGS_PER_PAGE = 12;

/**
 * Custom hook for managing blog search, sort, filter, and pagination state.
 * Persists state in URL query params for shareability and browser back/forward.
 */
export const useBlogFilters = (blogs = []) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial state from URL params
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sort") || "latest"
  );
  const [selectedMonth, setSelectedMonth] = useState(
    searchParams.get("month") || "all"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  // Sync state → URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (sortOrder !== "latest") params.set("sort", sortOrder);
    if (selectedMonth !== "all") params.set("month", selectedMonth);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (currentPage > 1) params.set("page", String(currentPage));
    setSearchParams(params, { replace: true });
  }, [search, sortOrder, selectedMonth, selectedCategory, currentPage, setSearchParams]);

  // Reset pagination when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOrder, selectedMonth, selectedCategory]);

  // Generate available months from the blog data
  const availableMonths = useMemo(() => {
    if (!blogs?.length) return [];
    const monthSet = new Map();
    blogs.forEach((blog) => {
      if (!blog.publishedAt) return;
      const date = new Date(blog.publishedAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthSet.has(key)) {
        monthSet.set(key, {
          value: key,
          label: date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        });
      }
    });
    return Array.from(monthSet.values()).sort((a, b) =>
      b.value.localeCompare(a.value)
    );
  }, [blogs]);

  // Filtered + sorted blogs
  const processedBlogs = useMemo(() => {
    if (!blogs?.length) return [];

    let result = [...blogs];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((blog) =>
        blog.categories?.some(
          (cat) => cat.slug.current === selectedCategory
        )
      );
    }

    // Search filter (title, tags, excerpt)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((blog) => {
        const titleMatch = blog.title?.toLowerCase().includes(q);
        const excerptMatch = blog.excerpt?.toLowerCase().includes(q);
        const tagMatch = blog.tags?.some((tag) =>
          tag.toLowerCase().includes(q)
        );
        const categoryMatch = blog.categories?.some((cat) =>
          cat.title.toLowerCase().includes(q)
        );
        return titleMatch || excerptMatch || tagMatch || categoryMatch;
      });
    }

    // Month filter
    if (selectedMonth !== "all") {
      const [year, month] = selectedMonth.split("-").map(Number);
      result = result.filter((blog) => {
        if (!blog.publishedAt) return false;
        const date = new Date(blog.publishedAt);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      });
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0);
      const dateB = new Date(b.publishedAt || 0);

      // Compare dates without time for accurate daily grouping
      const timeA = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate()).getTime();
      const timeB = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate()).getTime();

      const diff = sortOrder === "latest" ? timeB - timeA : timeA - timeB;

      // If published on the same day, sequence by time in mins (readTime)
      if (diff === 0) {
        const readTimeA = a.readTime || 0;
        const readTimeB = b.readTime || 0;
        return sortOrder === "latest" ? readTimeB - readTimeA : readTimeA - readTimeB;
      }

      return diff;
    });

    return result;
  }, [blogs, search, sortOrder, selectedMonth, selectedCategory]);

  // Pagination calculations
  const totalPages = Math.ceil(processedBlogs.length / BLOGS_PER_PAGE);
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * BLOGS_PER_PAGE;
    return processedBlogs.slice(start, start + BLOGS_PER_PAGE);
  }, [processedBlogs, currentPage]);

  // Handlers
  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleSort = useCallback((value) => {
    setSortOrder(value);
  }, []);

  const handleMonthFilter = useCallback((value) => {
    setSelectedMonth(value);
  }, []);

  const handleCategoryFilter = useCallback((value) => {
    setSelectedCategory(value);
  }, []);

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        // Smooth scroll to top of blog list
        window.scrollTo({ top: 300, behavior: "smooth" });
      }
    },
    [totalPages]
  );

  const clearAllFilters = useCallback(() => {
    setSearch("");
    setSortOrder("latest");
    setSelectedMonth("all");
    setSelectedCategory("all");
    setCurrentPage(1);
  }, []);

  const hasActiveFilters =
    search.trim() !== "" ||
    sortOrder !== "latest" ||
    selectedMonth !== "all" ||
    selectedCategory !== "all";

  return {
    // State
    search,
    sortOrder,
    selectedMonth,
    selectedCategory,
    currentPage,
    totalPages,
    availableMonths,
    hasActiveFilters,

    // Data
    processedBlogs,
    paginatedBlogs,
    totalResults: processedBlogs.length,

    // Handlers
    handleSearch,
    handleSort,
    handleMonthFilter,
    handleCategoryFilter,
    handlePageChange,
    clearAllFilters,
  };
};
