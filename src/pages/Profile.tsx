import React, { useState } from 'react'
import {profileServices} from '../services/profile.services' 
import type { ProfileUpdate , ProfileCreate } from '../services/profile.services'
import { supabase } from '../api/supabaseClient'


function Profile() {
    
    
    const [profileDetails , setCreateProfile ] = useState<ProfileCreate>({
        username: "richard",
        bio: "Programmer",
        avatar_url: "https://api.dicebear.com/9.x/pixel-art/svg?seed=John"
    })

    const getUserID = async () => {
      const {data} = await supabase.auth.getUser()
      console.log(data)
    }
    const id = getUserID()
    
  const handleProfile = async (e:any)  => {
    e.preventDefault()
    try {
        const profile = await profileServices.createProfile(id , profileDetails)
        console.log("Success updated profile")
        console.log(profile)
    } catch (error) {
        console.log(error)
    }
  }



  return (
    <form onSubmit={handleProfile}>
        <input type="text" placeholder='username' />
        <input type="text" placeholder='bio' />
        <input type="text" placeholder='profile url' />
        <button type='submit'>Submit</button>
    </form>
  )
}

export default Profile