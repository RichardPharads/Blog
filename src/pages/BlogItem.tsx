import { useEffect, useState } from 'react'
import { postService } from '../services/post.services'
import type { Post } from '../services/post.services' // Use Post, not PostUpdate
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../hooks'

function PostItem() {
  const navigate = useNavigate()


  const { slug } = useParams<{ slug: string }>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Post | null>(null)
  const [editable , setEditable ] = useState<boolean>(false)
  const user = useAppSelector(state => state.auth.user?.id)
  
  useEffect(() => {
    if (slug) {
     getItemSlug()
      
    } else {
      setError("No slug provided in URL")
      setLoading(false)
    }
  }, [slug])

  const getItemSlug = async () => {
    if (!slug) return
    
    try {
      setLoading(true)
      setError(null)
      
      console.log("Fetching post with slug:", slug)
      const item = await postService.getPostBySlug(slug)
      setData(item)
      return item.id
      
    } catch (error: any) {
      console.error("Error fetching post:", error)
      setError(error.message || "Failed to load post")
      setData(null)
    } finally {
      setLoading(false)
    }
  }
  const handleDeletePost = async () => {
    const id = await getItemSlug()
    await postService.deletePost(id)
    navigate('/blog')
  }


  
  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-700 mb-2">Error</h1>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">Slug: {slug}</p>
        </div>
      </div>
    )
  }

  // Handle no data state
  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Post Not Found</h1>
          <p className="text-gray-600">The post you're looking for doesn't exist.</p>
          <p className="text-sm text-gray-500 mt-2">Slug: {slug}</p>
        </div>
      </div>
    )
  }

  return (
    <div  className="max-w-4xl mx-auto m-10">
      <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        {/* Category */}
        <div className="mb-4 flex  justify-between">
          <span className="inline-block px-3 py-2 text-center bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {data.category || "Uncategorized"}
          </span>
          <div className='flex gap-2'>
          
          {
            data.user_id === user && (
              <>
              <button
           className='border text-center py-1.5 px-3 rounded-md' onClick={() => setEditable(prev => !prev)}>
              {editable ? "Save" : "Edit"}
          </button>
          <button
              onClick={handleDeletePost}
             className='border bg-red-500 text-center py-1.5 px-3 rounded-md'>
                Delete
            </button> 
              </>
              
            
            
            )
          }
         
          </div>
        </div>

        {/* Title */}
        <h1  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {data.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6 gap-4">
          <span>By {data.author}</span>
          <span>•</span>
          <span>{data.readtime || "5 min"} read</span>
          <span>•</span>
          <span>
            {new Date(data.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span>•</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${data.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {data.published ? 'Published' : 'Draft'}
          </span>
        </div>

        {/* Excerpt */}
        {data.excerpt && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-lg italic text-gray-700">{data.excerpt}</p>
          </div>
        )}
        {
          data.image_url && (
            <div className='w-full aspect-video'>
          <img src={data.image_url} alt={data.title} />
          </div>
          )
        }
        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div  className="whitespace-pre-line text-gray-800 leading-relaxed">
            {data.content}
          </div>
        </div>
        
        {/* Slug */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Slug: <code className="bg-gray-100 px-2 py-1 rounded">{data.slug}</code>
          </p>
        </div>
      </article>
    </div>
  )
}

export default PostItem