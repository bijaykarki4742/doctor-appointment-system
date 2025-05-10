import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import { useParams } from "react-router-dom"
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Users } from "lucide-react"

const SOCKET_SERVER_URL = "http://localhost:3000"

const VideoCall = () => {
    const { roomId } = useParams()
    const ROOM_ID = roomId

    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const localStreamRef = useRef(null)
    const peerConnectionRef = useRef(null)

    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [callDuration, setCallDuration] = useState(0)
    const [callStatus, setCallStatus] = useState("Connecting...")

    // Call duration timer
    useEffect(() => {
        let interval;
        if (isConnected) {
            interval = setInterval(() => setCallDuration((prev) => prev + 1), 1000)
        }
        return () => clearInterval(interval)
    }, [isConnected])

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const createPeerConnection = (socketInstance) => {
        if (!localStreamRef.current) {
            console.error("localStreamRef is null. Cannot create peer connection.")
            return null
        }

        const pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "turn:127.0.0.1:3476",
                    username: "dasdemo",
                    credential: "dastesting",
                }
            ],
        })

        // Add local tracks to the connection
        localStreamRef.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStreamRef.current)
        })

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketInstance.emit("ice-candidate", { candidate: event.candidate, roomId: ROOM_ID })
            }
        }

        pc.ontrack = (event) => {
            console.log("Received remote tracks:", event.streams)
            if (event.streams && event.streams.length > 0) {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0]
                    console.log("Remote video stream set")
                    setIsConnected(true)
                    setCallStatus("Connected")
                }
            }
        }

        pc.oniceconnectionstatechange = () => {
            console.log("ICE connection state:", pc.iceConnectionState)
            if (pc.iceConnectionState === "connected") {
                setIsConnected(true)
                setCallStatus("Connected")
            } else if (["disconnected", "failed"].includes(pc.iceConnectionState)) {
                setIsConnected(false)
                setCallStatus("Connection lost")
            }
        }

        return pc
    }

    useEffect(() => {
        const socketInstance = io(SOCKET_SERVER_URL)
        setSocket(socketInstance)

        const initMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                })
                localStreamRef.current = stream
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream
                    console.log("Local video stream set")
                }
                socketInstance.emit("join-room", ROOM_ID)
            } catch (err) {
                console.error("Media access error:", err)
                setCallStatus("Failed to access media devices")
            }
        }

        socketInstance.on("connect", () => {
            console.log("Connected to socket server:", socketInstance.id)
            initMedia()
        })

        socketInstance.on("created", () => {
            console.log("Room created")
            setCallStatus("Waiting for another participant...")
        })

        socketInstance.on("joined", () => {
            console.log("Joined room")
            setCallStatus("Connected to room")
        })

        socketInstance.on("create-offer", async () => {
            console.log("Creating offer...")
            if (!localStreamRef.current) {
                console.error("Local stream not available for creating offer")
                return
            }

            const pc = createPeerConnection(socketInstance)
            if (!pc) return

            peerConnectionRef.current = pc

            try {
                const offer = await pc.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true,
                })
                await pc.setLocalDescription(offer)
                socketInstance.emit("offer", { offer, roomId: ROOM_ID })
            } catch (err) {
                console.error("Error creating offer:", err)
            }
        })

        socketInstance.on("offer", async ({ offer }) => {
            console.log("Received offer")

            // Ensure local media is ready
            if (!localStreamRef.current) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    localStreamRef.current = stream
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream
                    }
                } catch (err) {
                    console.error("Media access error (offer):", err)
                    return
                }
            }

            const pc = createPeerConnection(socketInstance)
            if (!pc) return

            peerConnectionRef.current = pc

            try {
                await pc.setRemoteDescription(new RTCSessionDescription(offer))
                const answer = await pc.createAnswer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true,
                })
                await pc.setLocalDescription(answer)
                socketInstance.emit("answer", { answer, roomId: ROOM_ID })
            } catch (err) {
                console.error("Error handling offer:", err)
            }
        })

        socketInstance.on("answer", async ({ answer }) => {
            console.log("Received answer")
            if (peerConnectionRef.current) {
                try {
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer))
                } catch (err) {
                    console.error("Error setting remote description:", err)
                }
            }
        })

        socketInstance.on("ice-candidate", async ({ candidate }) => {
            console.log("Received ICE candidate")
            if (peerConnectionRef.current) {
                try {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
                } catch (err) {
                    console.error("Error adding ICE candidate:", err)
                }
            }
        })

        socketInstance.on("disconnect", () => {
            console.log("Disconnected from socket server")
            setCallStatus("Disconnected")
            setIsConnected(false)
        })

        return () => {
            socketInstance.disconnect()
            if (peerConnectionRef.current) peerConnectionRef.current.close()
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop())
            }
        }
    }, [])

    const toggleMute = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled
            })
            setIsMuted(!isMuted)
        }
    }

    const toggleVideo = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled
            })
            setIsVideoOff(!isVideoOff)
        }
    }

    const endCall = () => {
        if (socket) socket.disconnect()
        if (peerConnectionRef.current) peerConnectionRef.current.close()
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop())
        }
        setIsConnected(false)
        setCallStatus("Call ended")
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-teal-500 text-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        {/*<Users className="h-6 w-6" />*/}
                        <img src="../../public/EasyCare.png" className="w-8 h-8" />
                        <h1 className="text-xl font-semibold">Easy Care</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium bg-teal-600 px-3 py-1 rounded-full">Room: {ROOM_ID}</span>
                        <span className="text-sm font-medium bg-teal-600 px-3 py-1 rounded-full">
              {formatDuration(callDuration)}
            </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 container mx-auto p-4 flex flex-col">
                {/* Status Bar */}
                <div className="mb-4 bg-white rounded-lg shadow-sm p-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-yellow-500"}`}></div>
                        <span className="text-gray-700">{callStatus}</span>
                    </div>
                </div>

                {/* Video Grid */}
                <div className="flex-1 flex flex-col md:flex-row gap-4 mb-4">
                    {/* Local Video */}
                    <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden relative">
                        <div className="absolute top-4 left-4 z-10 bg-black/30 text-white px-3 py-1 rounded-full flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span className="text-sm">You</span>
                        </div>
                        {isVideoOff && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                <User className="h-20 w-20 text-gray-400" />
                            </div>
                        )}
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className={`w-full h-full object-cover ${isVideoOff ? "opacity-0" : ""}`}
                        />
                        <div className="absolute bottom-4 left-4 flex space-x-2">
                            {isMuted && (
                                <div className="bg-red-500 text-white p-1 rounded-full">
                                    <MicOff className="h-4 w-4" />
                                </div>
                            )}
                            {isVideoOff && (
                                <div className="bg-red-500 text-white p-1 rounded-full">
                                    <VideoOff className="h-4 w-4" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Remote Video */}
                    <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden relative">
                        <div className="absolute top-4 left-4 z-10 bg-black/30 text-white px-3 py-1 rounded-full flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span className="text-sm">Remote</span>
                        </div>
                        {!isConnected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                <div className="text-center">
                                    <User className="h-20 w-20 mx-auto text-gray-400" />
                                    <p className="text-white mt-4">Waiting for participant...</p>
                                </div>
                            </div>
                        )}
                        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-md p-4 flex justify-center items-center space-x-4">
                    <button
                        onClick={toggleMute}
                        className={`p-4 rounded-full ${
                            isMuted ? "bg-red-500 text-white" : "bg-teal-500 text-white hover:bg-teal-600"
                        } transition-colors duration-200`}
                    >
                        {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`p-4 rounded-full ${
                            isVideoOff ? "bg-red-500 text-white" : "bg-teal-500 text-white hover:bg-teal-600"
                        } transition-colors duration-200`}
                    >
                        {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                    </button>

                    <button
                        onClick={endCall}
                        className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                    >
                        <PhoneOff className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VideoCall
