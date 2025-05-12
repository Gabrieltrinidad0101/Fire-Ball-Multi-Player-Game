import { useEffect, useState } from 'react'
import { customFecth } from './dependencies'
import { Outlet, useNavigate } from 'react-router-dom'
import IPlayer from '../domain/player'
import APIURL from '../application/Api'
import { isNullEmptyUndefinedOrNan } from '../application/isNullEmptyUndifinedOrNan'


export const AuthenticationProvider = (): JSX.Element => {
  const navigation = useNavigate()
  const [auth,setAuth] = useState(true)

  const verifyAuthentication = async (): Promise<boolean> => {
    try {
      const result = await customFecth.get<IPlayer>("player",APIURL.verifyAccount,{
        notShowError: true
      })
      const noHasAccount = result?.message?.id === undefined || isNullEmptyUndefinedOrNan(result?.message?.id) || result?.message?.id <= 0
      setAuth(noHasAccount)
      localStorage.setItem("playerId",result?.message?.id.toString() ?? "0")
      return noHasAccount 
    } catch (error) {
      console.log(error)
    }
    return true
  }

  useEffect(() => {
    verifyAuthentication()
      .then((nohasAccount) => {
        if (nohasAccount) navigation('/register')
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  return auth ? <></> : <Outlet />
}
