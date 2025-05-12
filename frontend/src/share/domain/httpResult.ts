export default interface IHttpResult<T>{
    error?: T
    message?: T
}

export interface IHttpStatusCode extends IHttpResult<any>{
    statusCode?: number
}