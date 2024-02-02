export const constants = {
    xToken: ()=>localStorage.getItem("x-token"),
    playerId: ()=>localStorage.getItem("playerId"),
    serverUrlUser: import.meta.env.VITE_MICROSERVICE_USER,
    serverUrlGame: import.meta.env.VITE_MICROSERVICE_GAME
} 