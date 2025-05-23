import type IPlayer from '../../../share/domain/player'
import APIURL from '../../../share/application/Api'
import ICustomFecth from '../../../share/domain/customFecth'
import IToast from '../../../share/domain/IToast'

const Authentication = async (player: IPlayer,customFecth: ICustomFecth,toast: IToast,auth: boolean, navigation: () => void): Promise<void> => {
  try {
    const httpResult = await customFecth.post<string>("player", auth ? APIURL.login : APIURL.register ,player)
    if (httpResult == null) return
    localStorage.setItem('x-token', httpResult.message ?? '')
    navigation?.()
  } catch (error) {
    toast.error('Internal error try later')
  }
}

export { Authentication }
