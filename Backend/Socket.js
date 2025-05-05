// socket.js
import { Server } from "socket.io";

export const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // match your frontend
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("join-room", ({ roomId, userId }) => {
            socket.join(roomId);
            socket.to(roomId).emit("user-connected", userId);

            socket.on("signal", (data) => {
                socket.to(roomId).emit("signal", data);
            });

            socket.on("disconnect", () => {
                socket.to(roomId).emit("user-disconnected", userId);
            });
        });
    });
};
