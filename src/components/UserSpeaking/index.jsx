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
        if (user.id) {
            return <div><h3>Current user speaking</h3><UserCard speaking={true} user={user} /></div>
        }
        return <span>There is no user speaking.</span>
    }

    const addVideoStream = (video, stream) => {
        video.srcObject = stream
        console.log(video.srcObject);
        console.log(video);
        video.onloadedmetadata = function(e) {
            video.play();
          };
    }

    const handleNewUserToSpeak = userId => {
        if (userId === currentUserSelect.id) {
            setIsCurrentUser(true)
            setUser(currentUserSelect)
            streamToRoomUsers(usersSelect)
        } else {
            setIsCurrentUser(false)
            console.log("bbbbb");
            usersSelect.forEach(user => {
                if (userId === user.id) {
                    setUser(user)
                }
            });

            dispatch(userSpoke(userId))
        }

    }

    function streamToRoomUsers(users) {
        const newPeers = []
        console.log(users);
        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          }).then(stream => {
            myStreamRef.current = stream
            const streamTrack = stream.getAudioTracks()[0]
            users.forEach(user => {
                const peer = createPeer(user.id, stream)
                peer.addTrack(streamTrack, stream)
                console.log("peer track", peer);
                newPeers.push({peer, id: user.id})
            })
            setPeers(newPeers)
          })
          
    }

    const handleAnswer = (message) => {
        
        const desc = new RTCSessionDescription(message.sdp)
        const {peer} = peers.find(p => p.id === message.answerId)
        console.log("answer",message, peer);
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
        console.log("userId on create peer",userId);
        peer.onicecandidate = (e) => handleICECandiadate(e, userId);
        peer.ontrack = handleTrack
        peer.onnegotiationneeded = () => handleNegotiationNeeded(userId, peer)

        return peer
    }

    const handleNegotiationNeeded = (userId, peer) => {
        peer.createOffer().then(offer => {
            return peer.setLocalDescription(offer)
        }).then( ()=> {
            const payload = {
                target: userId,
                caller: currentUserSelect.id,
                sdp: peer.localDescription
            }
            console.log("negotiation", payload);
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
            const payload = {
                target: callerId,
                caller: currentUserSelect.id,
                sdp: peer.localDescription
            }
            console.log("handleREceiving", payload);
            socket.emit("Answer", payload)
        })
        return peer
    }

    const closeConnections = () => {
        const userStream = myStreamRef.current
        if (userStream.active) {
            userStream.getTracks()[0].stop()
        }
        peers.forEach(i => {
            i.peer.close()
        })
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
        console.log("new ice", incoming, "peers", peers);
        const {peer} = peers.find(p => p.id === incoming.iceId)

        peer.addIceCandidate(candidate).catch(e => console.log(e))
    }

    const handleTrack = e => {
        console.log("stream arrived", e);
        addVideoStream(videoRef.current, e.streams[0])
    }

    const handleEndCall = () => {
        setUser({})
        setPeers([])
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