import {Server} from "socket.io"
import socket from "./socket"
import { constants } from "../../../../share/application/constants"
export const socketIO = (gameUuid: string) =>socket(`http://localhost:5001/socket.io?gameUuid=${gameUuid}&xToken=${constants.xToken()}`, { 
    transports : ['websocket'],
}) as Server