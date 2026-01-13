// services/post.service.ts
import { supabase } from '../api/supabaseClient'

export type Post = {
  id:string,
  title: string
  content: string
  slug: string
  excerpt: string
  category: string
  readtime: string
  author: string
  image_url?: string,
  created_at: string | any
  published: boolean
  user_id: string
}


export type PostCreate =  Omit<Post , 'id'>
export type PostUpdate = Partial<PostCreate>


export const postService = {
  // CREATE POST
  createPost: async (data: PostCreate) => {
    const { data: post, error } = await supabase
      .from('posts')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return post
  },
  // READ
  getPost: async (id: string) => {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return post
  },

  getPosts: async (options?: { limit?: number; page?: number }) => {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('published', true)

    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    if (options?.page && options?.limit) {
      const from = (options.page - 1) * options.limit
      query = query.range(from, from + options.limit - 1)
    }
    
    const { data: posts, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return posts
  },

  getPostBySlug: async (slug: string) => {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return post
  },

  getUserPosts: async (userId: string) => {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return posts
  },

  // UPDATE
  updatePost: async (id: string, data: PostUpdate) => {
    const { data: post, error } = await supabase
      .from('posts')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return post
  },

  publishPost: async (id: string) => {
    return postService.updatePost(id, { published: true })
  },

  unpublishPost: async (id: string) => {
    return postService.updatePost(id, { published: false })
  },
  // DELETE
  deletePost: async (id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

}
