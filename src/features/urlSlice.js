import { createSlice } from "@reduxjs/toolkit";


export const urlSlice = createSlice({
    name: 'url',
    initialState: {
        value: 'http://localhost:4001'
    },
    reducers: {
        getUrl: (state) => {
            state.url = 'http://localhost:4001'
        }
    }
})

export const { getUrl } = urlSlice.actions;

export default urlSlice.reducer;