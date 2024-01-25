import { useEffect, useState } from 'react'
import Background from '../../../components/Background'
import HomeCss from './Home.module.css'
import IUser from '../../../share/domian/user'
import { homeApp } from './dependencies'
import IGame from '../../../share/domian/game'
export default function Home() {
  const [players, setPlayers] = useState<Array<IUser>>([])
  const [games, setGames] = useState<Array<IGame>>([])

  const getUsers = async () => {
    setPlayers(await homeApp.getPlayers())
  }

  const getGames = async () => {
    setGames(await homeApp.getGames())
  }

  useEffect(() => {
    getUsers().catch((error: any) => {
      console.log(error)
    })

    getGames()
      .then(()=>{
        console.log(games)
      })
    .catch((error: any) => {
      console.log(error)
    })
  }, [])

  return (
    <Background>
      <div className={HomeCss.container}>
        <div className={HomeCss.card}>
          <div className={HomeCss.cardHeader}>
            <h1 className={HomeCss.title}>Games</h1>
            <button className={HomeCss.newGame}>New Game</button>
          </div>
          <div className={HomeCss.plays}>
            {
              games.map((game) =>
                <div className={HomeCss.play}>
                  <h2>{game.uuid}</h2>
                  <div className={ game.status == 'started' ? HomeCss.isActive : HomeCss.isNotActive}>
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <div className={HomeCss.card}>
          <div className={HomeCss.containerPlayer}>
            <h1 className={HomeCss.title}>Players</h1>
            <div className={HomeCss.users}>
              {
                players.map(player =>
                  <div key={player.id}>
                    <img src={`https://api.dicebear.com/6.x/personas/svg?seed=${player.name}`} alt="" />
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
