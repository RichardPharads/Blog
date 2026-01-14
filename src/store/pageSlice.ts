import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageCount: 1
}
const pagination = createSlice({
    name: "page",
    initialState,
    reducers:{
        incrementByNumber: (state , actions) => {
            state.pageCount += actions.payload
        },
        decrementByNumber:(state, actions) => {
            state.pageCount -= actions.payload
        }
       
    }

})
export const {incrementByNumber  , decrementByNumber } = pagination.actions
export default pagination.reducer