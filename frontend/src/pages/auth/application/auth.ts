import { isEmptyNullOrUndefined } from '../../../../../share/application/isEmptyNullUndefiner'
import type IUser from '../../../../../share/domain/user'
import APIURL from '../../../share/application/Api'
import { type IAuthentication } from '../domian/IAuthenticaction'

const isInvalidUser = (user: IUser): string | undefined => {
  if (isEmptyNullOrUndefined(user.email, user.password)) return 'All The Inputs Are Required'
  if (user.typeAuthentication === 'Login') return
  if (isEmptyNullOrUndefined(user.name, user.cellPhone)) return 'All The Inputs Are Required'
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!pattern.test(user.email)) {
    return 'Valid email'
  }
}

const Auth = async (authenticaction: IAuthentication): Promise<void> => {
  try {
    const isInvalid = isInvalidUser(authenticaction.user)
    if (isInvalid !== undefined) {
      authenticaction.toast.error(isInvalid); return
    }
    const httpResult = await authenticaction.customFecth.post<string>(APIURL.authentication, authenticaction.user)
    if (httpResult == null) return
    localStorage.setItem('token', httpResult.message ?? '')
    authenticaction.toast.sucess(`Welcome ${authenticaction.user.name ?? ''}`)
    authenticaction.navigation?.('/home')
    authenticaction.setUser(authenticaction.user)
  } catch (error) {
    authenticaction.toast.error('Internal error try later')
  }
}

export { Auth }
