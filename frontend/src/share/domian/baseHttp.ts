import { type IOptionsFetch } from './customFecth'

export interface TMicroservice {
  user: string
  game: string  
}

export default interface IBaseHttp {
  url: string
  data?: object
  headers?: object | undefined
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  optionsFetch?: IOptionsFetch
  microservice: keyof TMicroservice
}
