import {Server} from "socket.io"
import socket from "./socket"
import { constants } from "../../../../share/application/constants"
export const socketIO = () =>socket(`http://localhost:5001/socket.io?gameId=123&xToken=${constants.xToken()}`, { 
    transports : ['websocket'],
}) as Server