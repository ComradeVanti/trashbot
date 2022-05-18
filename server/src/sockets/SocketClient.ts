import {errorCode, roomId} from "../domain";
import {Server, Socket} from "socket.io";

export type SocketClient = {
    send(event: string, data: any): void,
    sendToRoom(id: roomId, event: string, data: any): void,
    sendError(code: errorCode): void,
    joinRoom(id: roomId): void,
    leaveRoom(id: roomId): void,
}

export function makeSocketClient(io: Server, socket: Socket): SocketClient {

    function send(event: string, data: any) {
        socket.emit(event, data)
    }

    function sendToRoom(id: roomId, event: string, data: any) {
        io.to(id.toString()).emit(event, data)
    }

    function sendError(code: errorCode) {
        send("me/error", {errorCode: code})
    }

    function joinRoom(id: roomId) {
        socket.join(id.toString())
    }

    function leaveRoom(id: roomId) {
        socket.leave(id.toString())
    }

    return {send, sendToRoom, sendError, joinRoom, leaveRoom}
}
