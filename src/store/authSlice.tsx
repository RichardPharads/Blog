import { createSlice , } from "@reduxjs/toolkit";
import type {PayloadAction }from "@reduxjs/toolkit"
import type {User} from '@supabase/supabase-js'

interface AuthState {
    user: User | null;
    authorized: boolean,
}

const initialState: AuthState = {
    user: null,
    authorized: false
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