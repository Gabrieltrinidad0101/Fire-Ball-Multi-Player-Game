export const constants = {
    xToken: ()=>localStorage.getItem("x-token"),
    serverUrlUser: import.meta.env.VITE_MICROSERVICE_USER,
    serverUrlGame: import.meta.env.VITE_MICROSERVICE_GAME
} 