// Socket.js
import { Server } from "socket.io";

export const setupSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // replace with your actual local IP
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("join-room", (roomId) => {
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);

            const usersInRoom = io.sockets.adapter.rooms.get(roomId);
            const numUsers = usersInRoom ? usersInRoom.size : 0;

            if (numUsers === 1) {
                socket.emit("created");
            } else if (numUsers === 2) {
                socket.to(roomId).emit("create-offer");
            }
        });

        // WebRTC signaling handlers
        socket.on("offer", ({ offer, roomId }) => {
            socket.to(roomId).emit("offer", { offer });
        });

        socket.on("answer", ({ answer, roomId }) => {
            socket.to(roomId).emit("answer", { answer });
        });

        socket.on("ice-candidate", ({ candidate, roomId }) => {
            socket.to(roomId).emit("ice-candidate", { candidate });
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
};
