import { useContext } from "react"
import { GameSocketContext } from "../../contexts/gameSocketContext"

import styles from './styles.module.scss'

export default function FindMatchMenu (){

  const {
    gamemode,
    findMatch
  } = useContext(GameSocketContext)

  return (
    <div className={styles.container}>
      {
        gamemode == "multiplayer"? (null):(
          <p>Conecte-se a uma partida no modo {gamemode}!</p>
        )
      }
      <button onClick={findMatch}>Buscar partida</button>
    </div>
  )
}