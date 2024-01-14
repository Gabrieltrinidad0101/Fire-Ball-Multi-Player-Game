import { type IOptionsFetch } from './customFecth'

export default interface IBaseHttp {
  url: string
  data?: object
  headers?: object | undefined
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  optionsFetch?: IOptionsFetch

}
