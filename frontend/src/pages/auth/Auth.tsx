import Background from '../../components/Background'
import AuthCss from './Auth.module.css'
export default function Auth() {
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
                <input type="text" required /> <i>Username</i>
              </div>
              <div className={AuthCss.inputBox}>
                <input type="password" required /> <i>Password</i>
              </div>
              <div className={AuthCss.links}> <a href="#">Signup</a>
              </div>
              <div className={AuthCss.inputBox}>
                <input type="submit" value="Login" />
              </div>
            </div>
          </div>
        </div>
      </Background>
  )
}
