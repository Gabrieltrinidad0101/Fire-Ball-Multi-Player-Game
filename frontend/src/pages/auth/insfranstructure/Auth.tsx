import { ChangeEvent, useState } from 'react'
import Background from '../../../components/Background'
import AuthCss from './Auth.module.css'
import IPlayer from '../../../share/domain/player'
import { Authentication } from '../application/auth'
import { Toast, customFecth } from '../../../share/insfranstructure/dependencies'
import {  Link, useNavigate } from 'react-router-dom'
export default function Auth({auth}: {auth: boolean}) {
  const [player,setPlayer] = useState<IPlayer>({name: "",password: "",id: 0,victories: 0})
  const navigate = useNavigate()
  const onChange = (e: ChangeEvent<HTMLInputElement>)=>{
    const {name,value} = e.target
    setPlayer(()=>({...player,[name]: value}))
  }

  const redirect = ()=>{
    navigate("/home")
  }

  const onClick = (e: React.MouseEvent<HTMLInputElement>)=>{
    e.preventDefault()
    Authentication(player,customFecth,Toast,auth, redirect)
  }

  return (
      <Background>
        <div className={AuthCss.signin}>
          <div className={AuthCss.content}>
            <div>
              <h1 className={AuthCss.title}>FIRE BALL</h1>
              <img src="./OIG-removebg.png" className={AuthCss.logo} />
            </div>
            <div className={AuthCss.form}>
              <div className={AuthCss.inputBox}>
                <input type="text" name="name" maxLength={12} required onChange={onChange} /> <i>Name</i>
              </div>
              <div className={AuthCss.inputBox}>
                <input type="password" name='password' required onChange={onChange} /> <i>Password</i>
              </div>
              <div className={AuthCss.links}>
                <Link to={auth ? "/Register" : "/Login"} >{auth ? "Register" : "Login"}</Link>
              </div>
              <div className={AuthCss.inputBox}>
                <input type="submit" value={!auth ? "Register" : "Login"} onClick={onClick} />
              </div>
            </div>
          </div>
        </div>
      </Background>
  )
}
