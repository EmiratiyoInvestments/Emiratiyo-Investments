import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PortableText } from '@portabletext/react'
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react'
import Header from '../components/global/Header'
import { client, urlFor } from '../lib/sanityClient'
import { SINGLE_BLOG_QUERY } from '../lib/sanityQueries'

const BlogDetailPage = () => {
  const { slug } = useParams()

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => client.fetch(SINGLE_BLOG_QUERY, { slug })
  })

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#e83f25] border-t-transparent rounded-full animate-spin"></div>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-gray-500">
              Loading article...
            </p>
          </div>
        </div>
      </>
    )
  }

  if (!blog) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Article not found
            </h2>
            <Link
              to="/blog"
              className="text-[#e83f25] font-medium"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">

          {/* BACK BUTTON */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#e83f25] transition-colors mb-8"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* CATEGORIES */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.categories?.map((cat) => (
              <span
                key={cat.title}
                className="text-xs font-semibold text-[#e83f25] uppercase tracking-wide bg-[#e83f25]/10 px-3 py-1 rounded-full"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {cat.title}
              </span>
            ))}
          </div>

          {/* TITLE */}
          <h1
            className="text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {blog.title}
          </h1>

          {/* META */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            {blog.author && (
              <div className="flex items-center gap-3">
                {blog.author.image ? (
                  <img
                    src={urlFor(blog.author.image).width(48).height(48).url()}
                    alt={blog.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#e83f25] flex items-center justify-center text-white font-bold">
                    {blog.author.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-black" style={{ fontFamily: 'var(--font-body)' }}>
                    {blog.author.name}
                  </p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
                    {blog.author.role}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span style={{ fontFamily: 'var(--font-body)' }}>
                {formatDate(blog.publishedAt)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span style={{ fontFamily: 'var(--font-body)' }}>
                {blog.readTime} min read
              </span>
            </div>
          </div>

          {/* MAIN IMAGE */}
          {blog.mainImage && (
            <div className="relative h-72 lg:h-[450px] rounded-2xl overflow-hidden mb-10">
              <img
                src={urlFor(blog.mainImage).width(1200).url()}
                alt={blog.mainImage.alt || blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* BODY CONTENT */}
          <div
            className="prose prose-lg max-w-none"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {blog.body && (
              <PortableText
                value={blog.body}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <p className="text-gray-700 leading-relaxed mb-6" style={{ fontFamily: 'var(--font-body)' }}>
                        {children}
                      </p>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-4xl font-bold text-black mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-3xl font-bold text-black mt-8 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-2xl font-bold text-black mt-6 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                        {children}
                      </h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#e83f25] pl-6 italic text-gray-600 my-6">
                        {children}
                      </blockquote>
                    ),
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                        {children}
                      </ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700">
                        {children}
                      </ol>
                    ),
                  },
                  types: {
                    image: ({ value }) => (
                      <div className="my-8 rounded-xl overflow-hidden">
                        <img
                          src={urlFor(value).width(800).url()}
                          alt={value.alt || ''}
                          className="w-full object-cover"
                        />
                        {value.caption && (
                          <p className="text-center text-sm text-gray-400 mt-2">
                            {value.caption}
                          </p>
                        )}
                      </div>
                    ),
                  },
                  marks: {
                    link: ({ children, value }) => (
                      <a
                        href={value.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#e83f25] underline hover:opacity-80"
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-black">{children}</strong>
                    ),
                  },
                }}
              />
            )}
          </div>

          {/* TAGS */}
          {blog.tags?.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap mt-10 pt-8 border-t border-gray-200">
              <Tag className="w-4 h-4 text-gray-400" />
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm text-gray-500 bg-[#f7f7f7] px-3 py-1 rounded-full"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* AUTHOR BIO */}
          {blog.author?.bio && (
            <div className="mt-10 p-8 bg-[#f7f7f7] rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                {blog.author.image ? (
                  <img
                    src={urlFor(blog.author.image).width(64).height(64).url()}
                    alt={blog.author.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#e83f25] flex items-center justify-center text-white font-bold text-xl">
                    {blog.author.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-black text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                    {blog.author.name}
                  </p>
                  <p className="text-sm text-[#e83f25]" style={{ fontFamily: 'var(--font-body)' }}>
                    {blog.author.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                {blog.author.bio}
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default BlogDetailPage