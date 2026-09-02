import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Tag } from "lucide-react";
import { urlFor } from "../../config/sanityClient";
const formatDate = date => new Date(date).toLocaleDateString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric"
});
export const BlogCardSkeleton = () => <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="h-52 bg-gray-200" />
    <div className="p-6">
      <div className="w-20 h-5 bg-gray-200 rounded-full mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-5 bg-gray-200 rounded-md w-full" />
        <div className="h-5 bg-gray-200 rounded-md w-3/4" />
      </div>
      <div className="space-y-2 mb-5">
        <div className="h-3.5 bg-gray-100 rounded w-full" />
        <div className="h-3.5 bg-gray-100 rounded w-5/6" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="w-20 h-3 bg-gray-200 rounded" />
        </div>
        <div className="w-16 h-3 bg-gray-200 rounded" />
      </div>
    </div>
  </div>;
const BlogCard = ({
  blog
}) => <Link to={`/blog/${blog.slug.current}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#e83f25]/10 transition-all duration-400 hover:-translate-y-1.5" id={`blog-card-${blog._id}`}>
    <div className="relative h-52 overflow-hidden">
      {blog.mainImage ? <img src={urlFor(blog.mainImage).width(500).height(300).url()} alt={blog.mainImage.alt || blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" /> : <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-400 text-4xl" style={{
        fontFamily: "var(--font-display)"
      }}>E</span>
        </div>}
      {blog.categories?.[0] && <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-[#e83f25] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm" style={{
        fontFamily: "var(--font-body)"
      }}>
            {blog.categories[0].title}
          </span>
        </div>}
      {blog.featured && <div className="absolute top-4 right-4">
          <span className="bg-[#e83f25] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{
        fontFamily: "var(--font-body)"
      }}>Featured</span>
        </div>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>

    <div className="p-6">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          <span style={{
          fontFamily: "var(--font-body)"
        }}>{formatDate(blog.publishedAt)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span style={{
          fontFamily: "var(--font-body)"
        }}>{blog.readTime} min</span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-black mb-3 leading-snug group-hover:text-[#e83f25] transition-colors duration-300 line-clamp-2" style={{
      fontFamily: "var(--font-display)"
    }}>
        {blog.title}
      </h3>

      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2" style={{
      fontFamily: "var(--font-body)"
    }}>
        {blog.excerpt}
      </p>

      {blog.tags?.length > 0 && <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Tag className="w-3 h-3 text-gray-300" />
          {blog.tags.slice(0, 3).map(tag => <span key={tag} className="text-[11px] text-gray-400 bg-[#f7f7f7] px-2 py-0.5 rounded-md" style={{
        fontFamily: "var(--font-body)"
      }}>#{tag}</span>)}
        </div>}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5">
          {blog.author?.image ? <img src={urlFor(blog.author.image).width(32).height(32).url()} alt={blog.author.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100" loading="lazy" /> : blog.author?.name ? <div className="w-8 h-8 rounded-full bg-[#e83f25] flex items-center justify-center text-white font-bold text-xs">{blog.author.name.charAt(0)}</div> : null}
          {blog.author?.name && <span className="text-xs font-medium text-gray-600" style={{
          fontFamily: "var(--font-body)"
        }}>{blog.author.name}</span>}
        </div>
        <span className="text-xs font-semibold text-[#e83f25] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
        fontFamily: "var(--font-body)"
      }}>Read →</span>
      </div>
    </div>
  </Link>;
export default BlogCard;
