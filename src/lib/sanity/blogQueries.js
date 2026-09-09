export const ALL_BLOGS_QUERY = `*[_type == "blog"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  mainImage,
  coverImageUrl,
  excerpt,
  publishedAt,
  readTime,
  featured,
  tags,
  "author": author->{
    name,
    image,
    role
  },
  "categories": categories[]->{
    title,
    slug
  }
}`;
export const SINGLE_BLOG_QUERY = `*[_type == "blog" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  mainImage,
  coverImageUrl,
  coverImageCredit,
  body,
  excerpt,
  publishedAt,
  readTime,
  featured,
  tags,
  "author": author->{
    name,
    image,
    role,
    bio
  },
  "categories": categories[]->{
    title,
    slug
  },
  seo
}`;
export const FEATURED_BLOGS_QUERY = `*[_type == "blog" && featured == true] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  mainImage,
  coverImageUrl,
  excerpt,
  publishedAt,
  readTime,
  "author": author->{
    name,
    image,
    role
  },
  "categories": categories[]->{
    title,
    slug
  }
}`;
export const BLOGS_BY_CATEGORY_QUERY = `*[_type == "blog" && $category in categories[]->slug.current] | order(publishedAt desc) {
  _id,
  title,
  slug,
  mainImage,
  coverImageUrl,
  excerpt,
  publishedAt,
  readTime,
  "author": author->{
    name,
    image,
    role
  },
  "categories": categories[]->{
    title,
    slug
  }
}`;
export const ALL_CATEGORIES_QUERY = `*[_type == "category"] {
  _id,
  title,
  slug,
  description
}`;
