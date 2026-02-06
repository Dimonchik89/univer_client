import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(token: string) {
    socket = io("http://localhost:3005", {
        auth: { token },
        reconnection: true,
        autoConnect: false,
    });

    // socket.on("connect_error", (err) => {
    //     console.error("❌ Помилка підключення:", err.message);
    //     console.log("Додаткові дані помилки:", err.data);
    // });

    return socket;
}

// export function getSocket() {
//     return socket;
// }
