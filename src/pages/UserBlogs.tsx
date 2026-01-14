import { useState, useEffect } from "react"
import { useAppSelector } from "../hooks"
import { postService } from "../services/post.services"
import type { Post } from "../services/post.services"
import ParentLayout from "../components/Layout/ParentLayout"
import BlogCard from "../components/BlogCard"
function UserBlogs (){

  const user = useAppSelector(state => state.auth.user)

  const [data, setData] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.id) {
      handlePersonalBlog()
    }
  }, [user])

  const handlePersonalBlog = async () => {
    try {
      setLoading(true)

      const { posts, error } = await postService.getUserPosts(user!.id)

      if (error) throw error

      setData(posts)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-700 mb-2">Error</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }


  return (
    <div className='w-full min-h-lvh'>
       
          <ParentLayout>
          {
          data?.map((post) => (
            <BlogCard 
            post={{
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt,
                category: post.category,
                published: post.created_at,
                readtime: post.readtime,
                author: post.author || 'user',
                image_url:post.image_url || 'https://api.dicebear.com/9.x/pixel-art/svg?seed=John&hair=short01,short02,short03,short04,short05'
            }}
            className='mt-4'
            />
          ))
        }
          </ParentLayout>
    </div>
  )
}

export default UserBlogs
