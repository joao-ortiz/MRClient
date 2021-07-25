import Room from "./components/Room";
import { useState } from 'react'
import { useSelector } from 'react-redux'
import socket from './socket'
import Login from "./components/Login";
import './App.css'
function App() {
  const [mode, setMode] = useState("call")
  const currentUserSelect = useSelector(state=> state.currentUser)

  const renderLoginIfThereIsNoUser = () => {
    if (currentUserSelect.userName !== '') {
      return <Room mode ={mode} />
    }
    return <Login />
  }

  socket.on("SetRoomMode", mode => {
    setMode(mode)
  })
  
  return (
    <div className="App">
      {renderLoginIfThereIsNoUser()}
    </div>
  );
}

export default App;
