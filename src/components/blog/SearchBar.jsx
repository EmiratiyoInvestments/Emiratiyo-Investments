import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
const SearchBar = ({
  value,
  onChange
}) => {
  const inputRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return <div className="relative w-full max-w-xl group" id="blog-search-bar">      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#e83f25] transition-colors duration-200" />
      </div>      <input ref={inputRef} type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Search by title, tags, or keywords..." className="w-full pl-12 pr-20 py-3.5 bg-[#f7f7f7] border border-transparent rounded-xl text-sm text-black placeholder-gray-400 outline-none focus:border-[#e83f25]/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(232,63,37,0.08)] transition-all duration-300" style={{
      fontFamily: "var(--font-body)"
    }} id="blog-search-input" />      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value ? <button onClick={() => onChange("")} className="p-1 rounded-lg hover:bg-gray-200 transition-colors" aria-label="Clear search" id="blog-search-clear">
            <X className="w-4 h-4 text-gray-400" />
          </button> : <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded-md" style={{
        fontFamily: "var(--font-body)"
      }}>
            <span className="text-xs">⌘</span>K
          </kbd>}
      </div>
    </div>;
};
export default SearchBar;
