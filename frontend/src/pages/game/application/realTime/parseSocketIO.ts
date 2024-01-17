import {Server} from "socket.io"
import socket from "./socket"
export const socketIO = socket("https://b6c7-2001-1308-b365-e00-c1ff-5120-cfe0-cab0.ngrok-free.app/socket.io/", { transports : ['websocket'] }) as Server