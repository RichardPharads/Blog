import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import type {PostUpdate} from '../services/post.services'


interface BlogPostCardProps {
  post: PostUpdate
  className?: string
}

function BlogCard({ className = '', post }: BlogPostCardProps) {
  const {
    title,
    slug,
    excerpt,
    created_at,
    image_url,
    category,
    author,
    readtime
  } = post

  const formatDate = created_at
    ? format(new Date(created_at), 'MMM d, yyyy')
    : 'Recent'

  return (
    <Link
      
      to={`/blog/${slug}`}
      className={`group block w-full overflow-hidden rounded-2xl bg-white border border-neutral-400/50 hover:shadow-xl transition ${className}`}
    >
      {/* Image */}
      <div key={title} className="relative h-48 w-full overflow-hidden pb-10 px-4">
        <img
          src={image_url || '/placeholder.jpg'}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-batween border h-full">
        <div className='flex flex-col'>
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
          {title}
        </h3>

        <p  className="mt-2 text-sm text-gray-600 line-clamp-2">
          {excerpt}
        </p>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {author}
          </div>

          <div className="flex items-center gap-2">
            <span>{formatDate}</span>
            <span>•</span>
            <span>{readtime} min</span>
          </div>
        </div>
      </div>
      
    </Link>
  )
}

export default BlogCard
