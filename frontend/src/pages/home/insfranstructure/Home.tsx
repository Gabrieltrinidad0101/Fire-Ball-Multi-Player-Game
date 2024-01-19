import { useEffect, useState } from 'react'
import Background from '../../../components/Background'
import HomeCss from './Home.module.css'
import IUser from '../../../share/domian/user'
import { homeApp } from './dependencies'
export default function Home() {
  const [players,setPlayers] = useState<Array<IUser>>([])

  const getUsers = async ()=>{
    if(players.length > 0) return
    setPlayers(await homeApp.getPlayer())
  }

  useEffect(()=>{
    getUsers().catch((error: any)=>{
      console.log(error)
    })
  },[])

  return (
    <Background>
      <div className={HomeCss.container}>
        <div className={HomeCss.card}>
          <h1 className={HomeCss.title}>Games</h1>
          {/* <div className={HomeCss.plays}>
            {
              Array(50).fill(0).map(_=>
              <div className={HomeCss.play}>
                <h2>26666366646464</h2>
                <div className={HomeCss.isActive}>
                </div>
              </div>
                )
            }
          </div> */}
        </div>
        <div className={HomeCss.card}>
          <div className={HomeCss.containerPlayer}>
            <h1 className={HomeCss.title}>Users</h1>
            <div className={HomeCss.containerInput}>
              <input type="text" />
            </div>
            <div className={HomeCss.users}>
              {
                players.map(player=>
                  <div key={player.id}>
                    <img src="https://api.dicebear.com/6.x/initials/svg?seed=peppe" alt="" />
                    <h1>{player.name}</h1>
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
