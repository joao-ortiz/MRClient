import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const poolSlice = createSlice({
    name: 'pool',
    initialState,
    reducers: {
        userPoint(state, action) {
            state.push(action.payload)
        },
        removeUserPoint(state, action) {
            return state.filter(point => {
                return point.user.id !== action.payload
            })
        },
        clearVotes(state) {
            return []
        }
    }
})

export const {userPoint, clearVotes, removeUserPoint} = poolSlice.actions

export default poolSlice.reducer