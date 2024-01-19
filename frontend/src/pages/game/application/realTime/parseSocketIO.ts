import {Server} from "socket.io"
import socket from "./socket"
export const socketIO = () =>socket("http://localhost:5001/socket.io/", { transports : ['websocket'] }) as Server