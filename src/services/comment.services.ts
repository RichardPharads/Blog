// services/comment.services.ts
import { supabase } from '../api/supabaseClient'

export type Comment = {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  file_url:File | string
  profiles?: {
    username: string
    avatar_url?: string
    bio?: string
  }
}
export type CreateComment = Omit<Comment , 'id' | 'profiles'>
export type UpdateComment = Partial<CreateComment>

export interface CreateCommentData {
  post_id: string
  content: string
}

export interface UpdateCommentData {
  content: string
}

export const commentService = {
  // ============================================
  // GET COMMENTS
  // ============================================

  /**
   * Get comments for a specific post
   */
  getCommentsByPostId: async (postId: string): Promise<Comment[]> => {
    try {
      const { data: comments, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            bio
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true }) // Oldest first for comments
        
      if (error) throw error
      return comments || []
    } catch (error: any) {
      console.error('Error fetching comments by post ID:', error)
      throw error
    }
  },

  /**
   * Get comments by post slug (more user-friendly)
   */
  getCommentsBySlug: async (slug: string): Promise<{postId: string, comments: Comment[]}> => {
    try {
      // First, get the post ID from slug
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', slug)
        .single()
      
      if (postError) {
        if (postError.code === 'PGRST116') {
          throw new Error('Post not found')
        }
        throw postError
      }

      // Then get comments for that post
      const comments = await commentService.getCommentsByPostId(post.id)
      
      return {
        postId: post.id,
        comments
      }
    } catch (error: any) {
      console.error('Error fetching comments by slug:', error)
      throw error
    }
  },

  /**
   * Get a single comment by ID
   */
  getCommentById: async (commentId: string): Promise<Comment> => {
    try {
      const { data: comment, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            bio
          )
        `)
        .eq('id', commentId)
        .single()
      
      if (error) throw error
      return comment
    } catch (error: any) {
      console.error('Error fetching comment by ID:', error)
      throw error
    }
  },

  /**
   * Get comment count for a post
   */
  getCommentCount: async (postId: string): Promise<number> => {
    try {
      // Using the SQL function you created
      const { data, error } = await supabase.rpc('get_post_comment_count', {
        post_id: postId
      })
      
      if (error) {
        // Fallback to regular count if function doesn't exist
        const { count, error: countError } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postId)
        
        if (countError) throw countError
        return count || 0
      }
      
      return data || 0
    } catch (error: any) {
      console.error('Error getting comment count:', error)
      return 0 // Return 0 instead of throwing for UX
    }
  },

  // ============================================
  // CREATE COMMENTS
  // ============================================

  /**
   * Create a new comment
   */
  createComment: async (data: CreateCommentData): Promise<Comment> => {
    try {
      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        throw new Error('You must be logged in to comment')
      }

      // Validate input
      if (!data.content?.trim()) {
        throw new Error('Comment content is required')
      }

      if (!data.post_id) {
        throw new Error('Post ID is required')
      }

      // Check if post exists and is published (optional)
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('published')
        .eq('id', data.post_id)
        .single()
      
      if (postError) {
        throw new Error('Post not found')
      }

      if (!post.published) {
        throw new Error('Cannot comment on unpublished posts')
      }

      // Create the comment
      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          post_id: data.post_id,
          content: data.content.trim(),
          user_id: session.user.id
        })
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            bio
          )
        `)
        .single()
      
      if (error) throw error
      return comment
      
    } catch (error: any) {
      console.error('Error creating comment:', error)
      throw error
    }
  },

  // ============================================
  // UPDATE COMMENTS
  // ============================================

  /**
   * Update an existing comment
   */
  updateComment: async (commentId: string, data: UpdateCommentData): Promise<Comment> => {
    try {
      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        throw new Error('Authentication error')
      }

      // Validate input
      if (!data.content?.trim()) {
        throw new Error('Comment content is required')
      }

      // Update the comment (RLS ensures user can only update their own)
      const { data: comment, error } = await supabase
        .from('comments')
        .update({
          content: data.content.trim()
        })
        .eq('id', commentId)
        .eq('user_id', session.user.id) // Extra safety check
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            bio
          )
        `)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') { // No rows updated
          throw new Error('Comment not found or you do not have permission to edit it')
        }
        throw error
      }
      
      return comment
      
    } catch (error: any) {
      console.error('Error updating comment:', error)
      throw error
    }
  },

  // ============================================
  // DELETE COMMENTS
  // ============================================

  /**
   * Delete a comment
   */
  deleteComment: async (commentId: string): Promise<void> => {
    try {
      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        throw new Error('Authentication error')
      }

      // Delete the comment (RLS ensures user can only delete their own)
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', session.user.id) // Extra safety check
      
      if (error) {
        if (error.code === 'PGRST116') { // No rows deleted
          throw new Error('Comment not found or you do not have permission to delete it')
        }
        throw error
      }
      
    } catch (error: any) {
      console.error('Error deleting comment:', error)
      throw error
    }
  },

  /**
   * Delete all comments for a post (Admin only)
   */
  deleteCommentsByPostId: async (postId: string): Promise<void> => {
    try {
      // Note: This should be admin-only in RLS
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('post_id', postId)
      
      if (error) throw error
      
    } catch (error: any) {
      console.error('Error deleting comments by post ID:', error)
      throw error
    }
  },

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Get user's recent comments
   */
  getUserComments: async (userId: string, limit = 10): Promise<Comment[]> => {
    try {
      const { data: comments, error } = await supabase
        .from('comments')
        .select(`
          *,
          posts!inner (
            title,
            slug
          ),
          profiles (
            username,
            avatar_url,
            bio
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return comments || []
    } catch (error: any) {
      console.error('Error fetching user comments:', error)
      throw error
    }
  },

  /**
   * Get recent comments across all posts
   */
  getRecentComments: async (limit = 20): Promise<Comment[]> => {
    try {
      const { data: comments, error } = await supabase
        .from('comments')
        .select(`
          *,
          posts!inner (
            title,
            slug,
            published
          ),
          profiles (
            username,
            avatar_url,
            bio
          )
        `)
        .eq('posts.published', true) // Only published posts
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return comments || []
    } catch (error: any) {
      console.error('Error fetching recent comments:', error)
      throw error
    }
  },

  /**
   * Check if user has commented on a post
   */
  hasUserCommented: async (postId: string, userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('user_id', userId)
        .limit(1)
      
      if (error) throw error
      return (data?.length || 0) > 0
    } catch (error: any) {
      console.error('Error checking user comment:', error)
      return false
    }
  }
}