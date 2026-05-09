import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis logic
  const pages = useMemo(() => {
    const items = [];
    const delta = 1; // pages around current page

    const addPage = (n) => items.push({ type: "page", value: n });
    const addEllipsis = () => items.push({ type: "ellipsis", value: items.length });

    addPage(1);

    if (currentPage > 2 + delta) addEllipsis();

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      addPage(i);
    }

    if (currentPage < totalPages - 1 - delta) addEllipsis();

    if (totalPages > 1) addPage(totalPages);

    return items;
  }, [currentPage, totalPages]);

  return (
    <nav className="flex items-center justify-center gap-2 mt-16" aria-label="Blog pagination" id="blog-pagination">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-[#f7f7f7] text-gray-600 hover:bg-gray-200 hover:text-black"
        style={{ fontFamily: "var(--font-body)" }}
        id="blog-pagination-prev"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pages.map((item) =>
          item.type === "ellipsis" ? (
            <span key={`ellipsis-${item.value}`} className="px-2 text-gray-400 text-sm select-none">…</span>
          ) : (
            <button
              key={item.value}
              onClick={() => onPageChange(item.value)}
              className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentPage === item.value
                  ? "bg-[#e83f25] text-white shadow-lg shadow-[#e83f25]/25"
                  : "bg-[#f7f7f7] text-gray-600 hover:bg-gray-200 hover:text-black"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {item.value}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-[#f7f7f7] text-gray-600 hover:bg-gray-200 hover:text-black"
        style={{ fontFamily: "var(--font-body)" }}
        id="blog-pagination-next"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;
