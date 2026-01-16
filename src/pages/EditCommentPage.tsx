import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../api/supabaseClient"
import { commentService } from "../services/comment.services"
import { useAuth } from "../hooks/AuthHook"

export default function EditCommentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load comment
  useEffect(() => {
    const loadComment = async () => {
      if (!id) return

      const { data, error } = await supabase
        .from("comments")
        .select("id, content, user_id")
        .eq("id", id)
        .single()

      if (error || !data) {
        setError("Comment not found")
        return
      }

      if (data.user_id !== user?.id) {
        setError("You are not allowed to edit this comment")
        return
      }

      setContent(data.content)
    }

    loadComment()
  }, [id, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id) return

    try {
      setLoading(true)
      setError(null)

      await commentService.updateComment(id, { content })

      navigate(-1)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (error) return <p className="text-red-500 p-6">{error}</p>

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Edit Comment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full border rounded p-3"
          rows={4}
        />

        <div className="flex gap-2">
          <button
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
