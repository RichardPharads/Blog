import BlogCard from '../components/BlogCard'
import { postService } from '../services/post.services'
import { useEffect, useState } from 'react'
import type { Post } from '../services/post.services'
import ParentLayout from '../components/Layout/ParentLayout'
import { useAppSelector } from '../hooks'

function Blog() {
  const [loading , setLoading ] = useState(true)
  const [posts, setPosts] = useState<Post[] | null>([])
  const [error , setError ] = useState<string | null>(null)
  const page = useAppSelector(state => state.page.pageCount)
  useEffect(() => {
    loadPostsPages()
  },[page])

  const loadPostsPages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await postService.getPostPaggination(page , 10)
      if(error){
        throw error
      }else{
        setPosts(data)
      }
      setPosts(data)
    } catch (error:any) {
      setError(error)
    }
    finally{
      setLoading(false)
    }
  }

  //Infinite Pagination
  // const loadPosts = async () => {
  //   try {
  //     setLoading(true)
  //     setError(null)
  //     const data = await  postService.getPosts({limit:page * 10})
  //     setPosts(data)
  //   } catch (error:any) {
  //     console.log("failed to load post", error)
  //     setError(error?.message || "Error")
  //     setError(null)
  //   }
  //   finally{
  //     setLoading(false)
  //   }
  // }

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

  if(posts?.length === 0){
    return <div>
      <h1>No Posts Yet!</h1>
      <button onClick={loadPostsPages}> reload </button>
    </div>
  }


  return (
    <div className='w-full min-h-lvh'>
         
          <ParentLayout >
          
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