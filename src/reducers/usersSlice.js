import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addUser(state, action) {
            state.push(action.payload)
        },
        removeUser(state, action) {
            return state = state.filter(user => {
                return user.id !== action.payload
            })
        },
        userSpoke(state, action) {
            state.forEach(user => {
                if(user.id === action.payload) {
                    user.alreadySpoke = true
                }
            })
        },
        setUsers(state, action) {
            return state = action.payload
        },
    }
})

export const {addUser, removeUser, userSpoke, setUsers} = usersSlice.actions

export default usersSlice.reducer