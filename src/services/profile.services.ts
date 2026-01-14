    import {supabase} from '../api/supabaseClient'

    export type Profile = { 
        id: string,
        username: string,
        avatar_url:string,
        bio: string,
        created_at: string,
        updated_at: string
    }

    export type ProfileCreate = Omit<Profile , 'id' | 'created_at' | 'updated_at'> 
    export type ProfileUpdate = Partial<ProfileCreate>

    export const profileServices = {
        // CREATE PROFILE
        createProfile : async (data: ProfileCreate) => {
            const {data: profile , error } = await supabase
            .from ("profiles")
            .insert(data)
            .select()
            .single()
            if(error){
                throw error
            }
            return profile
        },
        //Get User profile
        getProfile: async (id:string) => {
            const {data: profile , error} = await supabase
            .from("profiles")
            .select()
            .eq('id', id)
            .single()
            if(error){
                throw error
            }

            return profile
        },

        updateProfile: async (id:string, data:ProfileUpdate) => {
            const {data: profileUpdate , error } = await supabase
            .from('Profiles')
            .update(data)
            .eq('id', id)
            .select()
            .single()

            if(error){
                throw error
            }
            console.log("Profile is updated ")
            return profileUpdate
        },

    }

