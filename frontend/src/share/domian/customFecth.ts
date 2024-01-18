import type BaseHttp from '../../share/domian/baseHttp'
import type IToast from './IToast'

interface IHttpResult<T>{
  error?: T
  message?: T
}

export default interface ICustomFecth {
  post: <T>(url: string, body: object, headers?: object) => Promise<IHttpResult<T> | undefined>
  get: <T>(url: string, headers?: object, fetchOptions?: IOptionsFetch) => Promise<IHttpResult<T> | undefined>
  put: <T>(url: string, body?: object, headers?: object) => Promise<IHttpResult<T> | undefined>
  delete: <T>(url: string, headers?: object) => Promise<IHttpResult<T> | undefined>
  patch: <T>(url: string, body?: object, headers?: object) => Promise<IHttpResult<T> | undefined>
  baseHttp: <T>(baseHttp: BaseHttp) => Promise<IHttpResult<T> | undefined>
}

export interface IOptionsFetch {
  showLoader?: boolean
  showErrors?: boolean
  removeDefaultHeaders?: boolean
}

export interface IFecthAlert {
  toast: IToast
  customFecth: ICustomFecth
}

export class CustomFetchError extends Error {
}
