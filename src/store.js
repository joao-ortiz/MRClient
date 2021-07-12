import { configureStore } from '@reduxjs/toolkit'
import usersSlice from './reducers/usersSlice'
import currentUserSlice from './reducers/currentUserSlice'
import poolSlice from './reducers/poolSlice'

export default configureStore({
    reducer: {
        users: usersSlice,
        currentUser: currentUserSlice,
        pool: poolSlice
    }
})