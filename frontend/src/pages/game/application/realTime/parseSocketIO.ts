import {Server} from "socket.io"
import socket from "./socket"
export const socketIO = () =>socket("http://localhost:5001/socket.io/", { 
    transports : ['websocket'],
    Headers: {
        "x-token": localStorage.getItem("token"),
        "gameId": "34474664646"
    }
}) as Server