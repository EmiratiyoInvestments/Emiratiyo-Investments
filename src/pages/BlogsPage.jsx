import React from "react";
import { useQuery } from "@tanstack/react-query";
import { client } from "../config/sanityClient";
import { ALL_BLOGS_QUERY, ALL_CATEGORIES_QUERY } from "../lib/sanity/blogQueries";
import { useBlogFilters } from "../hooks/useBlogFilters";
import SearchBar from "../components/blog/SearchBar";
import SortFilter from "../components/blog/SortFilter";
import BlogList from "../components/blog/BlogList";
import Pagination from "../components/blog/Pagination";
const BlogsPage = () => {
  const {
    data: blogs,
    isLoading: blogsLoading
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => client.fetch(ALL_BLOGS_QUERY)
  });
  const {
    data: categories
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => client.fetch(ALL_CATEGORIES_QUERY)
  });
  const {
    search,
    sortOrder,
    selectedMonth,
    selectedCategory,
    currentPage,
    totalPages,
    availableMonths,
    hasActiveFilters,
    paginatedBlogs,
    totalResults,
    handleSearch,
    handleSort,
    handleMonthFilter,
    handleCategoryFilter,
    handlePageChange,
    clearAllFilters
  } = useBlogFilters(blogs);
  return <div>
      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#e83f25] mb-3" style={{
            fontFamily: "var(--font-body)"
          }}>
              Our Blog
            </p>
            <h1 className="text-5xl font-bold text-black mb-4" style={{
            fontFamily: "var(--font-display)"
          }}>
              Market Insights & News
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto" style={{
            fontFamily: "var(--font-body)"
          }}>
              Stay ahead with the latest Dubai real estate trends, investment
              strategies, and market analysis.
            </p>
          </div>          <div className="space-y-5 mb-12">            <div className="flex justify-center">
              <SearchBar value={search} onChange={handleSearch} />
            </div>            <SortFilter sortOrder={sortOrder} onSortChange={handleSort} selectedMonth={selectedMonth} onMonthChange={handleMonthFilter} availableMonths={availableMonths} selectedCategory={selectedCategory} onCategoryChange={handleCategoryFilter} categories={categories} hasActiveFilters={hasActiveFilters} onClearAll={clearAllFilters} totalResults={totalResults} />
          </div>          <BlogList blogs={paginatedBlogs} isLoading={blogsLoading} onClearFilters={clearAllFilters} hasActiveFilters={hasActiveFilters} />          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </main>
    </div>;
};
export default BlogsPage;
