import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ChevronRight, Tag } from 'lucide-react'
import { client, urlFor } from '../services/sanityClient'
import { ALL_BLOGS_QUERY, ALL_CATEGORIES_QUERY } from '../lib/blogQueries'

const BlogsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data: blogs, isLoading: blogsLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => client.fetch(ALL_BLOGS_QUERY)
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => client.fetch(ALL_CATEGORIES_QUERY)
  })

  const filteredBlogs = selectedCategory === 'all'
    ? blogs
    : blogs?.filter(blog =>
      blog.categories?.some(cat => cat.slug.current === selectedCategory)
    )

  const featuredBlog = filteredBlogs?.[0]
  const remainingBlogs = filteredBlogs?.slice(1)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (blogsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#e83f25] border-t-transparent rounded-full animate-spin"></div>
          <p style={{ fontFamily: 'var(--font-body)' }} className="text-gray-500">
            Loading articles...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* PAGE HEADER */}
          <div className="mb-12 text-center">
            <p
              className="text-sm font-semibold uppercase tracking-widest text-[#e83f25] mb-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Our Blog
            </p>
            <h1
              className="text-5xl font-bold text-black mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Market Insights & News
            </h1>
            <p
              className="text-gray-500 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Stay ahead with the latest Dubai real estate trends, investment strategies, and market analysis.
            </p>
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all'
                ? 'bg-[#e83f25] text-white'
                : 'bg-[#f7f7f7] text-black hover:bg-[#e83f25] hover:text-white'
                }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              All
            </button>
            {categories?.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category.slug.current)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.slug.current
                  ? 'bg-[#e83f25] text-white'
                  : 'bg-[#f7f7f7] text-black hover:bg-[#e83f25] hover:text-white'
                  }`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {category.title}
              </button>
            ))}
          </div>

          {/* NO BLOGS STATE */}
          {filteredBlogs?.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg" style={{ fontFamily: 'var(--font-body)' }}>
                No articles found in this category.
              </p>
            </div>
          )}

          {/* FEATURED BLOG */}
          {featuredBlog && (
            <Link to={`/blog/${featuredBlog.slug.current}`} className="block mb-16 group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-xl">

                {/* Featured Image */}
                <div className="relative h-72 lg:h-full min-h-[400px] overflow-hidden">
                  {featuredBlog.mainImage ? (
                    <img
                      src={urlFor(featuredBlog.mainImage).width(800).url()}
                      alt={featuredBlog.mainImage.alt || featuredBlog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#939393]"></div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span
                      className="bg-[#e83f25] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Featured
                    </span>
                  </div>
                </div>

                {/* Featured Content */}
                <div className="bg-[#f7f7f7] p-10 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredBlog.categories?.map((cat) => (
                      <span
                        key={cat.title}
                        className="text-xs font-semibold text-[#e83f25] uppercase tracking-wide"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {cat.title}
                      </span>
                    ))}
                  </div>

                  <h2
                    className="text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight group-hover:text-[#e83f25] transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {featuredBlog.title}
                  </h2>

                  <p
                    className="text-gray-500 text-base leading-relaxed mb-6 line-clamp-3"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {featuredBlog.excerpt}
                  </p>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span style={{ fontFamily: 'var(--font-body)' }}>
                        {formatDate(featuredBlog.publishedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span style={{ fontFamily: 'var(--font-body)' }}>
                        {featuredBlog.readTime} min read
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {featuredBlog.author && (
                      <div className="flex items-center gap-3">
                        {featuredBlog.author.image ? (
                          <img
                            src={urlFor(featuredBlog.author.image).width(40).height(40).url()}
                            alt={featuredBlog.author.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#e83f25] flex items-center justify-center text-white font-bold text-sm">
                            {featuredBlog.author.name?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-black" style={{ fontFamily: 'var(--font-body)' }}>
                            {featuredBlog.author.name}
                          </p>
                          <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
                            {featuredBlog.author.role}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[#e83f25] font-semibold text-sm group-hover:gap-3 transition-all">
                      <span style={{ fontFamily: 'var(--font-body)' }}>Read More</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* BLOG GRID */}
          {remainingBlogs?.length > 0 && (
            <>
              <h2
                className="text-2xl font-bold text-black mb-8"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingBlogs.map((blog) => (
                  <Link
                    to={`/blog/${blog.slug.current}`}
                    key={blog._id}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-52 overflow-hidden">
                      {blog.mainImage ? (
                        <img
                          src={urlFor(blog.mainImage).width(500).url()}
                          alt={blog.mainImage.alt || blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#939393]"></div>
                      )}
                      {blog.categories?.[0] && (
                        <div className="absolute top-3 left-3">
                          <span
                            className="bg-white text-[#e83f25] text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            {blog.categories[0].title}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3
                        className="text-lg font-bold text-black mb-3 leading-tight group-hover:text-[#e83f25] transition-colors line-clamp-2"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {blog.title}
                      </h3>

                      <p
                        className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {blog.excerpt}
                      </p>

                      {blog.tags?.length > 0 && (
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <Tag className="w-3 h-3 text-gray-400" />
                          {blog.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-gray-400"
                              style={{ fontFamily: 'var(--font-body)' }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          {blog.author?.image ? (
                            <img
                              src={urlFor(blog.author.image).width(32).height(32).url()}
                              alt={blog.author.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#e83f25] flex items-center justify-center text-white font-bold text-xs">
                              {blog.author?.name?.charAt(0)}
                            </div>
                          )}
                          <p className="text-xs font-medium text-black" style={{ fontFamily: 'var(--font-body)' }}>
                            {blog.author?.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span style={{ fontFamily: 'var(--font-body)' }}>
                            {blog.readTime} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default BlogsPage;