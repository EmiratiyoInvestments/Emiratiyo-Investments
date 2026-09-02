import React from "react";
import BlogCard, { BlogCardSkeleton } from "./BlogCard";
import { SearchX } from "lucide-react";
const BlogList = ({
  blogs,
  isLoading,
  onClearFilters,
  hasActiveFilters
}) => {
  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blog-skeleton-grid">
        {Array.from({
        length: 6
      }).map((_, i) => <BlogCardSkeleton key={i} />)}
      </div>;
  }
  if (!blogs?.length) {
    return <div className="flex flex-col items-center justify-center py-24 text-center" id="blog-empty-state">
        <div className="w-20 h-20 rounded-2xl bg-[#f7f7f7] flex items-center justify-center mb-6">
          <SearchX className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-black mb-2" style={{
        fontFamily: "var(--font-display)"
      }}>
          No articles found
        </h3>
        <p className="text-gray-400 text-sm max-w-md mb-6" style={{
        fontFamily: "var(--font-body)"
      }}>
          We couldn't find any articles matching your criteria. Try adjusting your search or filters.
        </p>
        {hasActiveFilters && <button onClick={onClearFilters} className="px-6 py-2.5 bg-[#e83f25] text-white text-sm font-semibold rounded-xl hover:bg-[#d13520] transition-colors duration-200" style={{
        fontFamily: "var(--font-body)"
      }} id="blog-empty-clear-filters">
            Clear All Filters
          </button>}
      </div>;
  }
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blog-grid">
      {blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}
    </div>;
};
export default BlogList;
