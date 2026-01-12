// services/post.service.ts
import { supabase } from '../api/supabaseClient'

export type Post = {
  id: string
  title: string
  content: string
  slug: string
  excerpt: string,
  category: string,
  readtime:number,
  author:string,
  views: string,
  published: boolean
  created_at: string
  user_id: string
}


export type PostCreate =  Omit<Post , 'id' | 'created_at'>
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

  createDraft: async (data: Omit<PostCreate, 'published'>) => {
    return postService.createPost({ ...data, published: false })
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

  getDrafts: async (userId: string) => {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .eq('published', false)
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

  likePost: async (postId: string, userId: string) => {
    const { error } = await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: userId })
    
    if (error) throw error
  },

  unlikePost: async (postId: string, userId: string) => {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
    
    if (error) throw error
  },

  incrementViewCount: async (id: string) => {
    const { data: post } = await postService.getPost(id)
    const currentViews = post.views || 0
    
    return postService.updatePost(id, { views: currentViews + 1 })
  },

  // DELETE
  deletePost: async (id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
  deleteDraft: async (id: string) => {
    return postService.deletePost(id)
  },
}
