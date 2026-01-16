import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../api/supabaseClient"
import { commentService } from "../services/comment.services"

export default function CommentSectionPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [postId, setPostId] = useState<string | null>(null)
  const [data, setData] = useState({ content: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get post_id from slug
  useEffect(() => {
    const fetchPostId = async () => {
      if (!slug) return

      const { data, error } = await supabase
        .from("posts")
        .select("id")
        .eq("slug", slug)
        .single()

      if (error) return setError("Post not found")

      setPostId(data.id)
    }

    fetchPostId()
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!postId) return setError("Post not loaded")

    try {
      setLoading(true)
      setError(null)

      await commentService.createComment({
        post_id: postId,
        content: data.content,
      })

      setData({ content: "" })
      navigate(-1)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  if (!slug) return <p>Invalid post.</p>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Add Comment</h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <textarea
          name="content"
          value={data.content}
          onChange={handleChange}
          placeholder="Write your comment..."
          className="w-full border rounded p-3"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>

      </form>
    </div>
  )
}
