import React from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'


interface Author {
  name: string
  avatar?: string
}

interface BlogPost {
  id:string,
  slug: string
  title: string
  excerpt: string
  coverImage?: string
  category: string
  publishedAt?: string
  readTimeMinutes: number
  author: string
}

interface BlogPostCardProps {
  post: BlogPost
  className?: string
}



function BlogCard({ className = '', post }: BlogPostCardProps) {
  const {
    id,
    slug,
    title,
    excerpt,
    coverImage,
    category,
    publishedAt,
    readTimeMinutes,
    author,
  } = post

  const formatDate = publishedAt
    ? format(new Date(publishedAt), 'MMM d, yyyy')
    : 'Recent'

  return (
    <Link
      to={`/blog/${slug}`}
      className={`group block overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition ${className}`}
    >
      {/* Image */}
      <div key={id} className="relative h-48 w-full overflow-hidden">
        <img
          src={coverImage || '/placeholder.jpg'}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {author}
          </div>

          <div className="flex items-center gap-2">
            <span>{formatDate}</span>
            <span>•</span>
            <span>{readTimeMinutes} min</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BlogCard
