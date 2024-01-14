export type TypeRol = "admin" | "user"
export type TypeAuthentication = "Login" | "Register"

export default interface IUser {
    name: string
    password: string
    email: string
    typeAuthentication?: TypeAuthentication
    _id?: string
}