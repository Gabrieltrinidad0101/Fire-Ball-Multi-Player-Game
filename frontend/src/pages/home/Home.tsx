import Background from '../../components/Background'
import HomeCss from './Home.module.css'
export default function Home() {
  return (
    <Background>
      <div className={HomeCss.container}>
        <div className={HomeCss.card}>
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
        <div className={HomeCss.card}></div>
      </div>
    </Background>
  )
}
