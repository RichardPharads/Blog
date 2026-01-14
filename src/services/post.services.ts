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
  // createPost: async (data: PostCreate) => {
  //   const { data: post, error } = await supabase
  //     .from('posts')
  //     .insert(data)
  //     .select()
  //     .single()
  //   if (error) throw error

  //   return post
  // },

  createPost: async (data: PostCreate , file?:File) => {
      let imageUrl = data.image_url || null
      if (file) {
        const filePath = `posts/${Date.now()}-${file.name}`
    
        // 1. Upload file
        const { error: uploadError } = await supabase.storage
          .from("blog_images")
          .upload(filePath, file)
        if (uploadError) throw uploadError
    
        // 2. Get public URL
        const { data: urlData } = supabase.storage
          .from("blog_images")
          .getPublicUrl(filePath)
        
        imageUrl = urlData.publicUrl
      }

      const { data: post, error } = await supabase
      .from("posts")
      .insert({ ...data, image_url: imageUrl })
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

  getPostPaggination: async (page:number , pageSize:number) => {
    const from = (page - 1) * pageSize
    const to = from + (pageSize - 1)
    const {data , error } = await supabase
    .from('posts')
    .select("*")
    .order("created_at" , {ascending: false})
    .range(from , to)
    if(error){
      throw error
    }
    return data
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
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
  
    return {
      posts: posts || [],
      error
    }
  },

  // UPDATE
  updatePost: async (id: string, data: PostUpdate, file?: File) => {
    try {
      let imageUrl = data.image_url || null;
  
      if (file) {
        // Create unique file path
        const filePath = `posts/${Date.now()}-${file.name}`;
        
        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from("blog_images")
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
  
        // Get public URL - IMPORTANT: add await!
        const { data: urldata } = await supabase.storage
          .from('blog_images')
          .getPublicUrl(filePath);
        
        imageUrl = urldata.publicUrl;
      }
  
      // Prepare update data
      const updateData: any = { ...data };
      
      // Only update image_url if we have a new value
      if (imageUrl !== null) {
        updateData.image_url = imageUrl; // Use the correct field name
      }
      
      // Add updated_at timestamp
      updateData.updated_at = new Date().toISOString();
  
      // Update the post
      const { data: post, error } = await supabase
        .from('posts')
        .update(updateData) // Pass the prepared object
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return post;
      
    } catch (error: any) {
      console.error("Update post error:", error);
      throw error;
    }
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
