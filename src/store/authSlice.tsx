import { createSlice , } from "@reduxjs/toolkit";
import type {PayloadAction }from "@reduxjs/toolkit"
import type {User , Session} from '@supabase/supabase-js'

interface AuthState {
    user: User | null;
    session: Session | null;
    authorized: boolean;
    loading: boolean;
    error: string | null;
    
}

const initialState: AuthState = {
    user: null,
    session: null,
    authorized: false,
    loading:false,
    error:null
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state , action:PayloadAction<User>) => {
            state.user = action.payload;
            state.authorized = true
        },
        clearUser: (state) => {
            state.user = null;
            state.authorized = false;
        }
    }
})  

export const {setUser , clearUser } = authSlice.actions
export default authSlice.reducer