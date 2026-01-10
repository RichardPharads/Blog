import { useEffect } from 'react'
import { supabase } from '../../api/supabaseClient'
import { useNavigate } from 'react-router-dom' 
import { useDispatch } from 'react-redux'
import { clearUser } from '../../store/authSlice'

export const Logout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(()=> {
        const signOutUser = async () => {
            await supabase.auth.signOut();
        }
        signOutUser()
        dispatch(clearUser())
        navigate('/login')
    },[])
    return <p>Signing out</p>
}

