import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { supabase } from '../supabaseClient'
import { setUser, clearUser } from '../../store/authSlice'

export default function AuthListener() {
  const dispatch = useDispatch()

  useEffect(() => {
    // 1. Get current user right away (important on page refresh)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        dispatch(setUser(user))
      } else {
        dispatch(clearUser())
      }
    })

    // 2. Subscribe to auth changes (login, logout, token refresh, etc)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session?.user?.email)

      if (session?.user) {
        dispatch(setUser(session.user))
      } else {
        dispatch(clearUser())
      }
    })

    // Cleanup
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [dispatch])

  return null

}