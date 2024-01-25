import type BaseHttp from '../../share/domian/baseHttp'
import { TMicroservice } from '../../share/domian/baseHttp'
import type IToast from './IToast'

interface IHttpResult<T>{
  error?: T
  message?: T
}

export default interface ICustomFecth {
  post: <T>(microservice: keyof TMicroservice, url: string, body: object, headers?: object) => Promise<IHttpResult<T> | undefined>
  get: <T>(microservice: keyof TMicroservice,url: string, headers?: object, fetchOptions?: IOptionsFetch) => Promise<IHttpResult<T> | undefined>
  put: <T>(microservice: keyof TMicroservice,url: string, body?: object, headers?: object) => Promise<IHttpResult<T> | undefined>
  delete: <T>(microservice: keyof TMicroservice,url: string, headers?: object) => Promise<IHttpResult<T> | undefined>
  patch: <T>(microservice: keyof TMicroservice,url: string, body?: object, headers?: object) => Promise<IHttpResult<T> | undefined>
  baseHttp: <T>(baseHttp: BaseHttp) => Promise<IHttpResult<T> | undefined>
}

export interface IOptionsFetch {
  showLoader?: boolean
  showErrors?: boolean
}

export interface IFecthAlert {
  toast: IToast
  customFecth: ICustomFecth
}

export class CustomFetchError extends Error {
}
