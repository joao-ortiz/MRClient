import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userName: '',
    id: '',
    alreadySpoke: false,
    type: 'guest'
}

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState,
    reducers: {
        setUserName(state, action) {
            state.userName = action.payload
        },
        userSpoke(state) {
            state.alreadySpoke = true
        },
        userIsHost(state) {
            state.type = 'host'
        },
        setUserId(state, action) {
            state.id = action.payload
        }
    }
})

export const {setUserName, userSpoke, userIsHost, setUserId} = currentUserSlice.actions

export default currentUserSlice.reducer