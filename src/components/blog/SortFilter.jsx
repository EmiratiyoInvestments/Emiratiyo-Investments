import React, { useState, useRef, useEffect } from "react";
import { ArrowUpDown, CalendarDays, ChevronDown, FilterX } from "lucide-react";
const Dropdown = ({
  icon: Icon,
  label,
  value,
  options,
  onChange,
  id
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const selectedLabel = options.find(o => o.value === value)?.label || label;
  return <div className="relative" ref={ref} id={id}>
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${value !== options[0]?.value ? "bg-[#e83f25]/5 border-[#e83f25]/20 text-[#e83f25]" : "bg-[#f7f7f7] border-transparent text-gray-600 hover:bg-gray-100"}`} style={{
      fontFamily: "var(--font-body)"
    }}>
        <Icon className="w-4 h-4" />
        <span className="max-w-[140px] truncate">{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>      {open && <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map(option => <button key={option.value} onClick={() => {
        onChange(option.value);
        setOpen(false);
      }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === option.value ? "bg-[#e83f25]/5 text-[#e83f25] font-semibold" : "text-gray-600 hover:bg-[#f7f7f7]"}`} style={{
        fontFamily: "var(--font-body)"
      }}>
              {option.label}
            </button>)}
        </div>}
    </div>;
};
const SortFilter = ({
  sortOrder,
  onSortChange,
  selectedMonth,
  onMonthChange,
  availableMonths,
  selectedCategory,
  onCategoryChange,
  categories,
  hasActiveFilters,
  onClearAll,
  totalResults
}) => {
  const sortOptions = [{
    value: "latest",
    label: "Latest → Oldest"
  }, {
    value: "oldest",
    label: "Oldest → Latest"
  }];
  const monthOptions = [{
    value: "all",
    label: "All Months"
  }, ...availableMonths];
  const categoryOptions = [{
    value: "all",
    label: "All Categories"
  }, ...(categories?.map(cat => ({
    value: cat.slug.current,
    label: cat.title
  })) || [])];
  return <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full" id="blog-sort-filter">      <div className="flex flex-wrap items-center gap-3">
        <Dropdown icon={ArrowUpDown} label="Sort" value={sortOrder} options={sortOptions} onChange={onSortChange} id="blog-sort-dropdown" />

        <Dropdown icon={CalendarDays} label="Month" value={selectedMonth} options={monthOptions} onChange={onMonthChange} id="blog-month-dropdown" />

        {categories?.length > 0 && <Dropdown icon={CalendarDays} label="Category" value={selectedCategory} options={categoryOptions} onChange={onCategoryChange} id="blog-category-dropdown" />}

        {hasActiveFilters && <button onClick={onClearAll} className="flex items-center gap-1.5 px-3 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-[#e83f25] hover:bg-[#e83f25]/5 transition-all duration-200" style={{
        fontFamily: "var(--font-body)"
      }} id="blog-clear-filters">
            <FilterX className="w-4 h-4" />
            Clear
          </button>}
      </div>      <p className="text-sm text-gray-400 whitespace-nowrap" style={{
      fontFamily: "var(--font-body)"
    }}>
        {totalResults} {totalResults === 1 ? "article" : "articles"} found
      </p>
    </div>;
};
export default SortFilter;
