import {supabase} from '../supabaseClient'

export const checkSession = async () => {
    const {data:{session}, error} = await supabase.auth.getSession()
    if(error){
        console.log("Error", error)
        return null
    }

    if(!session){
        return null
    }
    console.log('User ID:', session.user.id)
    console.log('Email:', session.user.email)
     console.log('Session expires at:', session.expires_at)
    return session
}