import BlogCard from '../components/BlogCard'
import { postService } from '../services/post.services'
import { useEffect, useState } from 'react'
import type { Post } from '../services/post.services'
import ParentLayout from '../components/Layout/ParentLayout'

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
    <div className='w-full min-h-lvh'>
       
          <ParentLayout>
          {
          posts?.map((post) => (
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

export default Blog