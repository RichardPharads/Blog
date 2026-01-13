import BlogCard from '../components/BlogCard'
import { postService } from '../services/post.services'
import { useEffect, useState } from 'react'
import type { Post } from '../services/post.services'

function Blog() {
  const [loading , setLoading ] = useState(true)
  const [posts, setPosts] = useState<Post[] | null>([])
  const [error , setError ] = useState<string | null>(null)
  useEffect(() => {
    loadPosts()
  },[])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await  postService.getPosts()
      setPosts(data)
    } catch (error:any) {
      console.log("failed to load post", error)
      setError(error?.message || "Error")
      setError(null)
    }
    finally{
      setLoading(false)
    }
  }

  if(loading){
    return <h1>Loading</h1>
  }
  if(error) {
    return <div>
        <h1>Error</h1>
        <button onClick={loadPosts}>Reload</button>
      </div>
  }

  if(posts?.length === 0){
    return <div>
      <h1>No Posts Yet!</h1>
      <button onClick={loadPosts}> reload </button>
    </div>
  }


  return (
    <div className=' bg-gray-100 flex gap-2 p-10'>
        {
          posts?.map((post) => (
            <BlogCard 
            post={{
                id:post.id,
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt,
                category: post.category,
                publishedAt: post.created_at,
                readTimeMinutes: post.readtime,
                author: post.author || 'user',
            }}
            className='mt-4'
            />
          ))
        }
          
    </div>
  )
}

export default Blog