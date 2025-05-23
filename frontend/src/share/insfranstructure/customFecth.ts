import axios, { AxiosError, AxiosInstance } from 'axios'
import type BaseHttp from '../domain/baseHttp'
import { Toast} from './dependencies'
import ICustomFecth, { type IOptionsFetch } from '../domain/customFecth'
import LoaderAnimation from './loaderAnimation'
import { constants } from '../application/constants'
import { TMicroservice } from '../domain/baseHttp'
import IHttpResult from '../domain/httpResult'
import { toast } from 'react-toastify'

export class CustomFecth implements ICustomFecth  {
  private readonly errorMsg: string = 'Internal error try later'
  
  private readonly microservices = new Map<keyof TMicroservice,AxiosInstance>([
    ["player",axios.create({baseURL: constants.serverUrlUser})],
    ["game",axios.create({baseURL: constants.serverUrlGame})]
  ])


  async post<T>(microservice: keyof TMicroservice, url: string, data: object, headers?: object | undefined): Promise<IHttpResult<T> | undefined> {
    return await this.baseHttp<T>({
      microservice,
      url,
      data,
      headers,
      method: 'post'
    })
  }

  async get<T>(microservice: keyof TMicroservice, url: string, headers?: object | undefined, optionsFetch?: IOptionsFetch): Promise<IHttpResult<T> | undefined> {
    const response = await this.baseHttp<T>({
      microservice,
      url,
      headers,
      method: 'get',
      optionsFetch
    })
    return response
  }

  async delete<T>(microservice: keyof TMicroservice, url: string, headers?: object | undefined): Promise<IHttpResult<T> | undefined> {
    const response = await this.baseHttp<T>({
      microservice,
      url,
      headers,
      method: 'delete'
    })
    return response
  }

  async put<T>(microservice: keyof TMicroservice, url: string, data: object = {}, headers?: object | undefined): Promise<IHttpResult<T> | undefined> {
    const response = await this.baseHttp<T>({
      microservice,
      url,
      data,
      headers,
      method: 'put'
    })
    return response
  }

  async patch<T>(microservice: keyof TMicroservice, url: string, data: object = {}, headers?: object | undefined): Promise<IHttpResult<T> | undefined> {
    const response = await this.baseHttp<T>({
      microservice,
      url,
      data,
      headers,
      method: 'patch'
    })
    return response
  }

  async baseHttp<T>(baseHttp: BaseHttp): Promise<IHttpResult<T> | undefined> {
    const loaderAnimation = new LoaderAnimation()
    try {
      const token = constants.xToken()
      const { showLoader } = baseHttp.optionsFetch ?? {}
      baseHttp.headers = { ...baseHttp.headers,["x-token"]: token}
      if (!showLoader) loaderAnimation.showAfter(500)
      const microservice = this.microservices.get(baseHttp.microservice)
      if(microservice == undefined) {
        return
      } 
      const result = await microservice.request(baseHttp)
      loaderAnimation.hide()
      return result.data as IHttpResult<T>
    } catch (error: unknown) {
      console.log(error)
      loaderAnimation.hide()
      if (baseHttp.optionsFetch?.notShowErrors) return
      if (error instanceof AxiosError) {
        const response = error.response
        const errorMsg = response?.data?.message ?? this.errorMsg
        toast.error(errorMsg)
        return
      }
      console.log("klkl")
      Toast.error(this.errorMsg)
    }
  }
}