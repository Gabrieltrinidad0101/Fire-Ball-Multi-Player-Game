import React, { useEffect, useState, useContext } from 'react'
import { customFecth } from './dependencies'
import type IHttpResult from '../../../../share/domain/httpResult'
import type IUser from '../../../../share/domain/user'
import type IUserState from '../domian/user'
import { Outlet, useNavigate } from 'react-router-dom'
import { isEmptyNullOrUndefined } from '../../../../share/application/isEmptyNullUndefiner'

const userInitialState: IUser = {
  name: '',
  password: '',
  typeAuthentication: 'Login',
  rol: 'user',
  _id: '',
  email: '',
  cellPhone: ''
}

const AuthContext = React.createContext<IUserState>({
  user: userInitialState,
  setUser: (user: IUser) => user
})

const AuthenticationProvider = (): JSX.Element => {
  const [user, setUser] = useState<IUser>(userInitialState)
  const navigation = useNavigate()

  const verifyAuthentication = async (): Promise<boolean> => {
    try {
      const result = await customFecth.get<IHttpResult<IUser>>('/user/verifyAuthentication')
      if (result?.message === undefined || isEmptyNullOrUndefined(result?.message)) return true
      setUser(result.message)
      return false
    } catch (error) {
      console.log(error)
    }
    return true
  }

  useEffect(() => {
    verifyAuthentication()
      .then((noHasAccount) => {
        if (noHasAccount) navigation('/register')
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const containerSetUser = (user: IUser): void => {
    setUser((prevUser: IUser | undefined) => ({ ...prevUser, ...user }))
  }
  return <AuthContext.Provider value={{ user, setUser: containerSetUser }} >{
    isEmptyNullOrUndefined(user?._id) ? <></> : <Outlet />
  }</AuthContext.Provider>
}
export const useUserContext = (): IUserState => {
  return useContext<IUserState>(AuthContext)
}

export { AuthContext, AuthenticationProvider }
