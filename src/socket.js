import { io } from 'socket.io-client'
import store from './store'
import { addUser, removeUser, setUsers } from './reducers/usersSlice'
import { userIsHost, setUserId } from './reducers/currentUserSlice'
import { setPoolOptions, userVote, removeUserVote } from './reducers/poolSlice'

const socket = io('http://localhost:8888', { transports: ["websocket"] })

const {dispatch} = store

socket.on('connect', () => {
    dispatch(setUserId(socket.id))
})

socket.on('UsersInRoom', users => {
    dispatch(setUsers(users))
})

socket.on('UserIsHost', () => {
    dispatch(userIsHost())
})

socket.on('UserJoinedRoom', user => {
    dispatch(addUser(user))
})

socket.on('UserDisconnect', user => {
    dispatch(removeUser(user))
})

socket.on('NewVotingSesh', poolOptions => {
    dispatch(setPoolOptions(poolOptions))
})

socket.on('UserVote', data => {
    dispatch(userVote(data))
})

socket.on('RemoveVote', data => {
    dispatch(removeUserVote(data))
})


export default socket