import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const SOCKET_SERVER_URL = "http://localhost:3000";

const VideoCall = () => {
    const { roomId } = useParams();
    const ROOM_ID = roomId;

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null); // Using ref for peer connection

    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [callStatus, setCallStatus] = useState("Connecting...");

    // Call duration timer
    useEffect(() => {
        let interval;
        if (isConnected) {
            interval = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isConnected]);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const createPeerConnection = (socketInstance) => {
        if (!localStreamRef.current) {
            console.error("localStreamRef is null. Cannot create peer connection.");
            return null;
        }

        const pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "turn:127.0.0.1:3476",
                    username: "dasdemo",
                    credential: "dastesting",
                },
                {
                    urls: "stun:stun.l.google.com:19302" // Adding a fallback STUN server
                }
            ],
        });

        // Add local tracks to the connection
        localStreamRef.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStreamRef.current);
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketInstance.emit("ice-candidate", { candidate: event.candidate, roomId: ROOM_ID });
            }
        };

        pc.ontrack = (event) => {
            console.log("Received remote tracks:", event.streams);
            if (event.streams && event.streams.length > 0) {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                    console.log("Remote video stream set");
                    setIsConnected(true);
                    setCallStatus("Connected");
                }
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log("ICE connection state:", pc.iceConnectionState);
            if (pc.iceConnectionState === "connected") {
                setIsConnected(true);
                setCallStatus("Connected");
            } else if (["disconnected", "failed"].includes(pc.iceConnectionState)) {
                setIsConnected(false);
                setCallStatus("Connection lost");
            }
        };

        return pc;
    };

    useEffect(() => {
        const socketInstance = io(SOCKET_SERVER_URL);
        setSocket(socketInstance);

        const initMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                    console.log("Local video stream set");
                }
                socketInstance.emit("join-room", ROOM_ID);
            } catch (err) {
                console.error("Media access error:", err);
                setCallStatus("Failed to access media devices");
            }
        };

        socketInstance.on("connect", () => {
            console.log("Connected to socket server:", socketInstance.id);
            initMedia();
        });

        socketInstance.on("created", () => {
            console.log("Room created");
            setCallStatus("Waiting for another participant...");
        });

        socketInstance.on("joined", () => {
            console.log("Joined room");
            setCallStatus("Connected to room");
        });

        socketInstance.on("create-offer", async () => {
            console.log("Creating offer...");
            if (!localStreamRef.current) {
                console.error("Local stream not available for creating offer");
                return;
            }

            const pc = createPeerConnection(socketInstance);
            if (!pc) return;

            peerConnectionRef.current = pc;

            try {
                const offer = await pc.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true
                });
                await pc.setLocalDescription(offer);
                socketInstance.emit("offer", { offer, roomId: ROOM_ID });
            } catch (err) {
                console.error("Error creating offer:", err);
            }
        });

        socketInstance.on("offer", async ({ offer }) => {
            console.log("Received offer");

            // Ensure local media is ready
            if (!localStreamRef.current) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    localStreamRef.current = stream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Media access error (offer):", err);
                    return;
                }
            }

            const pc = createPeerConnection(socketInstance);
            if (!pc) return;

            peerConnectionRef.current = pc;

            try {
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true
                });
                await pc.setLocalDescription(answer);
                socketInstance.emit("answer", { answer, roomId: ROOM_ID });
            } catch (err) {
                console.error("Error handling offer:", err);
            }
        });

        socketInstance.on("answer", async ({ answer }) => {
            console.log("Received answer");
            if (peerConnectionRef.current) {
                try {
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                } catch (err) {
                    console.error("Error setting remote description:", err);
                }
            }
        });

        socketInstance.on("ice-candidate", async ({ candidate }) => {
            console.log("Received ICE candidate");
            if (peerConnectionRef.current) {
                try {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error("Error adding ICE candidate:", err);
                }
            }
        });

        socketInstance.on("disconnect", () => {
            console.log("Disconnected from socket server");
            setCallStatus("Disconnected");
            setIsConnected(false);
        });

        return () => {
            socketInstance.disconnect();
            if (peerConnectionRef.current) peerConnectionRef.current.close();
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const toggleMute = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    const endCall = () => {
        if (socket) socket.disconnect();
        if (peerConnectionRef.current) peerConnectionRef.current.close();
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        setIsConnected(false);
        setCallStatus("Call ended");
    };

    return (
        <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                <div>
                    <h3>You</h3>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{ width: 300, border: "2px solid blue", borderRadius: "8px" }}
                    />
                </div>
                <div>
                    <h3>Remote</h3>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{ width: 300, border: "2px solid green", borderRadius: "8px" }}
                    />
                </div>
            </div>
            <div style={{ margin: "20px 0" }}>
                <div>Status: {callStatus}</div>
                <div>Call Time: {formatDuration(callDuration)}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <button onClick={toggleMute} style={{ padding: "8px 16px" }}>
                    {isMuted ? "Unmute" : "Mute"}
                </button>
                <button onClick={toggleVideo} style={{ padding: "8px 16px" }}>
                    {isVideoOff ? "Turn On Video" : "Turn Off Video"}
                </button>
                <button
                    onClick={endCall}
                    style={{ padding: "8px 16px", backgroundColor: "red", color: "white" }}
                >
                    End Call
                </button>
            </div>
        </div>
    );
};

export default VideoCall;
