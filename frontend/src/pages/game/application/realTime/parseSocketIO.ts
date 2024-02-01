import {Server} from "socket.io"
import socket from "./socket"
import { constants } from "../../../../share/application/constants"
export const socketIO = (gameUuid: string) =>socket(constants.serverUrlGame, { 
    path: "/socket.io/",
    transports : ['websocket'],
    query: {
        gameUuid,
        "x-token": constants.xToken()
    }
}) as Server