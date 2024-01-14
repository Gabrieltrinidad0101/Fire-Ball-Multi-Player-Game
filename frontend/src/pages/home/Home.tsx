import Background from '../../components/Background'
import HomeCss from './Home.module.css'
export default function Home() {
  return (
    <Background>
      <div className={HomeCss.container}>
        <div className={HomeCss.card}>
          <h1 className={HomeCss.title}>Games</h1>
          <div className={HomeCss.plays}>
            {
              Array(50).fill(0).map(_=>
              <div className={HomeCss.play}>
                <h2>26666366646464</h2>
                <div className={HomeCss.isActive}>
                </div>
              </div>
                )
            }
          </div>
        </div>
        <div className={HomeCss.card}>
          <div className={HomeCss.containerPlayer}>
            <h1 className={HomeCss.title}>Users</h1>
            <div className={HomeCss.containerInput}>
              <input type="text" />
            </div>
            <div className={HomeCss.users}>
              {
                Array(50).fill(0).map(_=>
                  <div>
                    <img src="https://api.dicebear.com/6.x/initials/svg?seed=peppe" alt="" />
                    <h1>Name</h1>
                  </div>
                  )
              }
              
          </div>
          </div>
        </div>
      </div>
    </Background>
  )
}
