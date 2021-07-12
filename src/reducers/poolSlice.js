import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const poolSlice = createSlice({
    name: 'pool',
    initialState,
    reducers: {
        setPoolOptions(state, action) {
            return state = action.payload
        },
        addOption(state, action) {
            state.push(action.payload)
        },
        removeOption(state, action) {
            return state = state.filter( option => {
                return option.id !== action.payload
            })
        },
        updateOption(state, action) {
            state.forEach(option => {
                if (option.id === action.payload.id) {
                    option = action.payload
                }
            })
        },
        userVote(state, action) {
            state.forEach(option => {
                if (option.id === action.payload.optionId) {
                    option.votes.push(action.payload.user)
                }
            })
        },
        removeUserVote(state, action) {
            state.forEach(option => {
                if (option.id === action.payload.optionId) {
                    option.votes = option.votes.filter(vote => {
                        return vote.userId !== action.payload.userId
                    })
                }
            })
        }
    }
})

export const {setPoolOptions, addOption, removeOption, updateOption, userVote, removeUserVote} = poolSlice.actions

export default poolSlice.reducer