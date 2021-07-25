import { useState, useEffect, useRef } from 'react'
import UserCard from "../UserCard"
import socket from '../../socket'
import { useSelector, useDispatch } from 'react-redux'
import UsersToSpeakList from '../UsersToSpeakList'
import { userSpoke } from '../../reducers/usersSlice'
import "./index.css"

const UserSpeaking = () => {
    const [isCurrentUser, setIsCurrentUser] = useState(false)
    const [showUserList, setShowUserList] = useState(false)
    const [user, setUser] = useState({})
    const [peers, setPeers] = useState([])

    const videoRef = useRef()
    const myStreamRef = useRef()
    const handleAnswerRef = useRef()
    const handleNewICECandidateRef = useRef()
    const handleNewUserToSpeakRef = useRef()
    const handleReceivingSignalRef = useRef()
    const handleEndCallRef = useRef()

    const currentUserSelect = useSelector(state => state.currentUser)
    const usersSelect = useSelector(state => state.users)
    const usersToSpeak = usersSelect.filter(user => !user.alreadySpoke)

    const dispatch = useDispatch()

    const video = document.createElement('video')
    
    const renderUserSpeaking = () => {
        if (user.hasOwnProperty('id')) {
            return <div><h3>Current user speaking</h3><UserCard speaking={true} user={user} /></div>
        }
        return <span>There is no user speaking.</span>
    }

    const addVideoStream = (video, stream) => {
        video.srcObject = stream
        video.onloadedmetadata = function(e) {
            video.play();
          };
    }

    const handleNewUserToSpeak = userId => {
        setIsCurrentUser(userId === currentUserSelect.id)
        if (userId === currentUserSelect.id) {
            setUser(currentUserSelect)
            streamToRoomUsers(usersSelect)
        } else {
            setUser(usersSelect.find(user => user.id === userId));
            dispatch(userSpoke(userId))
        }

    }

    function streamToRoomUsers(users) {
        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          }).then(stream => {
            myStreamRef.current = stream
            const streamTrack = stream.getAudioTracks()[0]
            setPeers(createPeersList(users, streamTrack, stream))
          })
    }

    const createPeersList = (users, streamTrack, stream) => {
        return users.map(user => {
            let peer = createPeer(user.id, stream)
            peer.addTrack(streamTrack, stream)
            return {peer, id: user.id}
        })
    }

    const handleAnswer = (message) => {
        const desc = new RTCSessionDescription(message.sdp)
        const {peer} = peers.find(p => p.id === message.answerId)
        
        peer.setRemoteDescription(desc).catch(e => console.log(e))
    }

    const  createPeer = (userId) => {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls:'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webretc@live.com'
                },
            ]
        })
        peer.onicecandidate = (e) => handleICECandiadate(e, userId);
        peer.ontrack = handleTrack
        peer.onnegotiationneeded = () => handleNegotiationNeeded(userId, peer)

        return peer
    }

    const handleNegotiationNeeded = (userId, peer) => {
        peer.createOffer().then(offer => {
            return peer.setLocalDescription(offer)
        }).then( ()=> {
            const payload = createPeerSDPResponse(userId, currentUserSelect.id, peer.localDescription)
            socket.emit("Offer", payload)
        }).catch(e => console.log(e))

    }

    const handleReceivingSignal = ({incomingSignal, callerId}) => {
        const peer = createPeer()
        const desc = new RTCSessionDescription(incomingSignal)
        peer.setRemoteDescription(desc).then(() => {
            return peer.createAnswer()
        }).then(answear => {
            return peer.setLocalDescription(answear)
        }).then(() => {
            const payload = createPeerSDPResponse(callerId, currentUserSelect.id, peer.localDescription)
            socket.emit("Answer", payload)
        })
        return peer
    }

    const createPeerSDPResponse = (target, caller, sdp) => {
        return { target, caller, sdp }
    }

    const closeConnections = () => {
        closeStream()
        peers.forEach(i => {
            i.peer.close()
        })
    }

    const closeStream = () => {
        const userStream = myStreamRef.current
        if (userStream.active) {
            userStream.getTracks()[0].stop()
        }
    }
    const handleICECandiadate = (e, userId) => {
        if (e.candidate) {
            const payload ={
                target: isCurrentUser ? userId : user.id,
                candidate: e.candidate
            }
            socket.emit("ICECandidate", payload)
        }
    }

    const handleNewICECandidate = incoming => {
        const candidate = new RTCIceCandidate(incoming.candidate)
        const {peer} = peers.find(p => p.id === incoming.iceId)

        peer.addIceCandidate(candidate).catch(e => console.log(e))
    }

    const handleTrack = e => {
        addVideoStream(videoRef.current, e.streams[0])
    }

    const handleEndCall = () => {
        setUser({})
        setPeers([])
        closeStream()
        setIsCurrentUser(false)
    }

    videoRef.current = video
    handleAnswerRef.current = handleAnswer
    handleNewICECandidateRef.current = handleNewICECandidate
    handleNewUserToSpeakRef.current = handleNewUserToSpeak
    handleReceivingSignalRef.current = handleReceivingSignal
    handleEndCallRef.current = handleEndCall

    useEffect(() => {
        socket.on('Signal', data => {
            const peer = handleReceivingSignalRef.current(data)

            setPeers(peers => [...peers, {peer, id: data.callerId}])
        })

        socket.on('UserToSpeak', data => {
            handleNewUserToSpeakRef.current(data)
        })
    
        socket.on("ReceivingAnswer", payload => {
            handleAnswerRef.current(payload)
        })
        
        socket.on("NewICECandidate", payload => {
            handleNewICECandidateRef.current(payload)
        })
        
        socket.on("EndCall", () => {
            handleEndCallRef.current()
        })
    },[])
    return (
        <div className="user-speaking-container">
            {renderUserSpeaking()}

            <video autoPlay={true} id="video-secret-container"></video>
            {isCurrentUser && <input value="Select next user" className="input-button" type="button" onClick={() => setShowUserList(true)} />}

            {showUserList && <UsersToSpeakList users={usersToSpeak} closeConnections={closeConnections} hide={() => setShowUserList(false)} />}
        </div>
    )
}

export default UserSpeaking