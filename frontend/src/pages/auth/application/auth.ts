import type IUser from '../../../share/domian/user'
import APIURL from '../../../share/application/Api'
import ICustomFecth from '../../../share/domian/customFecth'
import IToast from '../../../share/domian/IToast'

const Authentication = async (user: IUser,customFecth: ICustomFecth,toast: IToast, navigation: () => void): Promise<void> => {
  try {
    debugger
    const httpResult = await customFecth.post<string>(APIURL.authentication,user)
    if (httpResult == null) return
    localStorage.setItem('token', httpResult.message ?? '')
    navigation?.()
  } catch (error) {
    toast.error('Internal error try later')
  }
}

export { Authentication }
