import {errorCode, id} from "../domain";
import {Server, Socket} from "socket.io";

export type SocketClient = {
    send(event: string, data: any): void,
    sendToRoom(id: id, event: string, data: any): void,
    sendError(event: string, code: errorCode): void,
    joinRoom(id: id): void,
    leaveRoom(id: id): void,
}

export function makeSocketClient(io: Server, socket: Socket): SocketClient {

    function send(event: string, data: any) {
        console.log(`Server -> Socket ${socket.id}: ${event}`)
        socket.emit(event, data)
    }

    function sendToRoom(id: id, event: string, data: any) {
        console.log(`Server -> Room ${id}: ${event}`)
        io.to(id.toString()).emit(event, data)
    }

    function sendError(event: string, code: errorCode) {
        console.log(`Server -> Socket ${socket.id}: ${event} / ${code}`)
        socket.emit("me/error", {event, errorCode: code})
    }

    function joinRoom(id: id) {
        console.log(`Socket ${socket.id} joined ${id}`)
        socket.join(id.toString())
    }

    function leaveRoom(id: id) {
        console.log(`Socket ${socket.id} left ${id}`)
        socket.leave(id.toString())
    }

    return {send, sendToRoom, sendError, joinRoom, leaveRoom}
}
