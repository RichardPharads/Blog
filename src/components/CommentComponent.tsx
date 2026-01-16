import { useAuth } from "../hooks/AuthHook"
import { commentService } from "../services/comment.services"
import { useNavigate } from "react-router-dom"

interface CommentProps {
  id: string
  user_id: string
  username: string
  comment: string
  created_at: string
  onDeleted?: () => void
}

export default function CommentComponent({
  id,
  user_id,
  username,
  comment,
  created_at,
  onDeleted
}: CommentProps) {

  const { user } = useAuth()
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return
    await commentService.deleteComment(id)
    onDeleted?.()
  }

  return (
    <div className="border-l p-4 rounded-md w-[300px]">

      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium">{username}</h2>
        <span className="text-xs text-neutral-500">•</span>
        <span className="text-xs text-neutral-500">
          {new Date(created_at).toLocaleDateString()}
        </span>
      </div>

      <p className="py-3 text-neutral-700">{comment}</p>

      {user?.id === user_id && (
        <div className="flex gap-2">
          <button
          onClick={() => navigate(`/comment/${id}/edit`)}
          className="p-1 px-2 rounded bg-black text-white text-sm"
        >
          Edit
        </button>

          <button
            onClick={handleDelete}
            className="p-1 px-2 rounded bg-red-600 text-white text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
