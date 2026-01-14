import { useEffect, useState } from 'react'
import { postService } from '../services/post.services'
import type { Post, PostUpdate } from '../services/post.services'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../hooks'

function PostItem() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Post | null>(null)
  const [editable, setEditable] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [editData, setEditData] = useState<PostUpdate | null>(null)
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
      setEditData({
        title: item.title,
        excerpt: item.excerpt || '',
        content: item.content,
        category: item.category || '',
        image_url: item.image_url,
        published: item.published,
        readtime: item.readtime || '5 min'
      })
      return item.id
      
    } catch (error: any) {
      console.error("Error fetching post:", error)
      setError(error.message || "Failed to load post")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    if (!data || !editData) return
    
    try {
      setIsSaving(true)
      
      const updatePayload: PostUpdate = {
        title: editData.title,
        content: editData.content,
        excerpt: editData.excerpt,
        category: editData.category,
        image_url: editData.image_url,
        published: editData.published,
        readtime: editData.readtime
      }
      
      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key as keyof PostUpdate] === '' || 
            updatePayload[key as keyof PostUpdate] === undefined) {
          delete updatePayload[key as keyof PostUpdate]
        }
      })
      
      await postService.updatePost(data.id, updatePayload)
      
      await getItemSlug()
      setEditable(false)
      
    } catch (error: any) {
      console.error("Error updating post:", error)
      alert(`Failed to update post: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePost = async () => {
    if (!data) return
    
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }
    
    try {
      await postService.deletePost(data.id)
      navigate('/blog')
    } catch (error: any) {
      console.error("Error deleting post:", error)
      alert(`Failed to delete post: ${error.message}`)
    }
  }

  const handleEditToggle = () => {
    if (editable) {
      handleSaveChanges()
    } else {
      setEditable(true)
    }
  }

  const handleFieldChange = (field: keyof PostUpdate, value: string | boolean) => {
    if (editData) {
      setEditData({
        ...editData,
        [field]: value
      })
    }
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

  if (!data || !editData) {
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

  const backHistory = () => {
    window.history.back()
  }

  return (
    <div className="max-w-4xl mx-auto m-10">
            <div className='flex border border-neutral-400 py-1.5  px-3 cursor-pointer rounded mb-4 w-[50px]' onClick={backHistory}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z" data-name="4-Arrow Left"/></svg>
            </div>

      <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        {/* Category */}
        <div className="mb-4 flex justify-between">
          {editable ? (
            <input
              type="text"
              value={editData.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              className="inline-block px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border-2 border-blue-300 focus:outline-none focus:border-blue-500"
              placeholder="Category"
            />
          ) : (
            <span className="inline-block px-3 py-2 text-center bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {data.category || "Uncategorized"}
            </span>
          )}
          
          <div className='flex gap-2'>
            {data.user_id === user && (
              <>
                <button
                  className={`border text-center py-1.5 px-3 rounded-md flex items-center gap-2 ${
                    editable 
                      ? 'bg-green-500 text-white border-green-600 hover:bg-green-600' 
                      : 'border-neutral-500 hover:bg-gray-50'
                  } ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={handleEditToggle}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : editable ? (
                    "Save Changes"
                  ) : (
                    "Edit"
                  )}
                </button>
                {editable && (
                  <button
                    className='border text-center py-1.5 border-gray-400 text-gray-700 px-3 rounded-md hover:bg-gray-50'
                    onClick={() => {
                      setEditData({
                        title: data.title,
                        excerpt: data.excerpt || '',
                        content: data.content,
                        category: data.category || '',
                        image_url: data.image_url || '',
                        published: data.published,
                        readtime: data.readtime || '5 min'
                      })
                      setEditable(false)
                    }}
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  onClick={handleDeletePost}
                  className='border bg-red-500 text-white text-center py-1.5 px-3 rounded-md hover:bg-red-600'
                  disabled={editable}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        {editable ? (
          <textarea
            value={editData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full text-3xl md:text-4xl font-bold mb-4 border-2 border-blue-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 min-h-[60px] bg-blue-50 resize-none"
            placeholder="Post Title"
            rows={2}
          />
        ) : (
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {data.title}
          </h1>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6 gap-4">
          <span>By {data.author}</span>
          <span>•</span>
          
          {editable ? (
            <input
              type="text"
              value={editData.readtime}
              onChange={(e) => handleFieldChange('readtime', e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="5 min"
            />
          ) : (
            <span>{data.readtime || "5 min"} read</span>
          )}
          
          <span>•</span>
          <span>
            {new Date(data.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span>•</span>
          
          {editable ? (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editData.published}
                onChange={(e) => handleFieldChange('published', e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className={`px-2 py-1 rounded text-xs font-medium ${editData.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {editData.published ? 'Published' : 'Draft'}
              </span>
            </label>
          ) : (
            <span className={`px-2 py-1 rounded text-xs font-medium ${data.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {data.published ? 'Published' : 'Draft'}
            </span>
          )}
        </div>

        {/* Excerpt */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          {editable ? (
            <textarea
              value={editData.excerpt || ''}
              onChange={(e) => handleFieldChange('excerpt', e.target.value)}
              className="w-full text-lg italic text-gray-700 border-2 border-blue-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 min-h-[60px] bg-white resize-none"
              placeholder="Add an excerpt... (optional)"
              rows={3}
            />
          ) : editData.excerpt ? (
            <p className="text-lg italic text-gray-700">{editData.excerpt}</p>
          ) : null}
        </div>

        {/* Image URL */}
        {editable ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={editData.image_url}
              onChange={(e) => handleFieldChange('image_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        ): <><div><img src={data.image_url} alt={data.slug} /></div></>}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {editable ? (
            <textarea
              value={editData.content}
              onChange={(e) => handleFieldChange('content', e.target.value)}
              className="w-full whitespace-pre-line leading-relaxed border-2 border-blue-300 rounded-lg p-4 focus:outline-none focus:border-blue-500 min-h-[300px] bg-blue-50 resize-y"
              placeholder="Write your content here..."
              rows={15}
            />
          ) : (
            <div className="whitespace-pre-line text-gray-800 leading-relaxed mt-4">
              {data.content}
            </div>
          )}
        </div>
        
        {/* Editing instructions */}
        {editable && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Editing Mode:</strong> Make your changes in the fields above. 
              Click "Save Changes" when done or "Cancel" to discard changes.
            </p>
          </div>
        )}
        
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