import { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, MessageSquare, MoreVertical, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useParams } from "react-router-dom";

const SOCKET_SERVER_URL = "http://localhost:3000" // Your backend URL


const VideoCall = () => {
    const { roomId } = useParams();
    const ROOM_ID = roomId

    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const [socket, setSocket] = useState(null)
    const [peerConnection, setPeerConnection] = useState(null)
    const localStreamRef = useRef(null)

    // UI state
    const [isConnected, setIsConnected] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [callDuration, setCallDuration] = useState(0)
    const [callStatus, setCallStatus] = useState("Connecting...")

    // Timer for call duration
    useEffect(() => {
        let interval

        if (isConnected) {
            interval = setInterval(() => {
                setCallDuration((prev) => prev + 1)
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isConnected])

    // Format call duration
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    useEffect(() => {
        const socketInstance = io(SOCKET_SERVER_URL);
        setSocket(socketInstance);

        // Error handling
        socketInstance.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
            setCallStatus("Connection error");
        });

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localStreamRef.current = stream
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream
                }
                socketInstance.emit("join-room", ROOM_ID)
                setCallStatus("Waiting for other participant...")
            })
            .catch((error) => {
                console.error("Error accessing media devices:", error)
                setCallStatus("Failed to access camera/microphone")
            })

        socketInstance.on("created", () => {
            // First user - wait for second user
            setCallStatus("Waiting for other participant...");
        });

        socketInstance.on("joined", () => {
            // Second user - connection will be established via offer/answer
            setCallStatus("Connected to room...");
        });

        socketInstance.on("create-offer", async () => {
            const pc = createPeer()
            setPeerConnection(pc)
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            socketInstance.emit("offer", { offer, roomId: ROOM_ID })
        })

        socketInstance.on("offer", async ({ offer }) => {
            const pc = createPeer()
            setPeerConnection(pc)
            await pc.setRemoteDescription(new RTCSessionDescription(offer))
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            socketInstance.emit("answer", { answer, roomId: ROOM_ID })
        })

        socketInstance.on("answer", async ({ answer }) => {
            if (peerConnection) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
                setIsConnected(true)
                setCallStatus("Connected")
            }
        })

        socketInstance.on("ice-candidate", async ({ candidate }) => {
            if (peerConnection && candidate) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
            }
        })

        return () => {
            socketInstance.disconnect()
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop())
            }
        }
    }, [])

    const createPeer = () => {
        const pc = new RTCPeerConnection({
            iceServers: [
                // Free STUN servers
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:global.stun.twilio.com:3478" },

                // Your TURN server configuration
                {
                    urls: "turn:your-turn-server.com:3478",
                    username: "your-username",
                    credential: "your-credential"
                },
                // Backup TURN server
                {
                    urls: "turn:your-backup-turn-server.com:3478?transport=tcp",
                    username: "your-username",
                    credential: "your-credential"
                }
            ],
            iceTransportPolicy: "relay" // Optional: force TURN in development
        });

        pc.onicecandidate = (event) => {
            if (event.candidate && socket) {
                socket.emit("ice-candidate", { candidate: event.candidate, roomId: ROOM_ID })
            }
        }

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0]
                setIsConnected(true)
                setCallStatus("Connected")
            }
        }

        pc.oniceconnectionstatechange = () => {
            if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed") {
                setIsConnected(false)
                setCallStatus("Connection lost")
            }
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                if (localStreamRef.current) {
                    pc.addTrack(track, localStreamRef.current)
                }
            })
        }

        return pc
    }

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTracks = localStreamRef.current.getAudioTracks();
            audioTracks.forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTracks = localStreamRef.current.getVideoTracks();
            videoTracks.forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    const endCall = () => {
        if (socket) {
            socket.disconnect()
        }
        if (peerConnection) {
            peerConnection.close()
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop())
        }
        setIsConnected(false)
        setCallStatus("Call ended")

        // Redirect or show end call screen
        // window.location.href = "/call-ended";
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <img src="public/EasyCare.png" className="w-[24px] h-[24px]"/>
                    <h1 className="text-lg font-semibold">Easy Care</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={isConnected ? "success" : "secondary"} className="gap-1 px-2 py-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(callDuration)}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        {callStatus}
                    </Badge>
                </div>
            </div>

            {/* Video Container */}
            <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
                {/* Remote Video (Doctor/Patient) - Larger */}
                <div className="relative flex-1 min-h-[300px] bg-black rounded-xl overflow-hidden">
                    <video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover" />

                    {!isConnected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 text-white">
                            <div className="text-center">
                                <div className="animate-pulse mb-2">
                                    <Phone className="h-12 w-12 mx-auto" />
                                </div>
                                <p>{callStatus}</p>
                            </div>
                        </div>
                    )}

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <Avatar className="border-2 border-white">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Remote user" />
                            <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div className="bg-black/50 text-white px-2 py-1 rounded-md text-sm">Dr. Smith</div>
                    </div>
                </div>

                {/* Local Video (Self view) - Smaller */}
                <div className="relative md:w-1/4 h-[200px] md:h-auto bg-gray-800 rounded-xl overflow-hidden">
                    <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />

                    {isVideoOff && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                            <Avatar className="h-20 w-20">
                                <AvatarFallback>YOU</AvatarFallback>
                            </Avatar>
                        </div>
                    )}

                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                            You
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white border-t p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={isMuted ? "destructive" : "secondary"}
                                    size="icon"
                                    className="rounded-full h-12 w-12"
                                    onClick={toggleMute}
                                >
                                    {isMuted ? <MicOff /> : <Mic />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={isVideoOff ? "destructive" : "secondary"}
                                    size="icon"
                                    className="rounded-full h-12 w-12"
                                    onClick={toggleVideo}
                                >
                                    {isVideoOff ? <VideoOff /> : <Video />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{isVideoOff ? "Turn on camera" : "Turn off camera"}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="destructive" size="icon" className="rounded-full h-14 w-14" onClick={endCall}>
                                    <PhoneOff />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>End call</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}

export default VideoCall
