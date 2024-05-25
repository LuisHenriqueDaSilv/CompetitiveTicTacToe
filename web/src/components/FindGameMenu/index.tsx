import { useContext } from "react"
import { GameSocketContext } from "../../contexts/gameSocketContext"
import { AuthenticationContext } from "../../contexts/authenticationContext"

import styles from './styles.module.scss'
import AuthenticationArea from "../AuthenticationArea"

export default function FindMatchMenu() {

  const {
    gamemode,
    findGame
  } = useContext(GameSocketContext)

  const {
    authenticated
  } = useContext(AuthenticationContext)

  return (
    <div
      className={styles.container}
      id={gamemode == "multiplayer" ? styles.fullContainer : ""}
    >
      {
        ((gamemode == "algoritmo") || (gamemode == "multiplayer" && authenticated)) ? (
          <>
            {
              gamemode == "algoritmo" ? (
                <>
                  <p>Inicie uma partida contra nosso algoritmo clicando no botão abaixo</p>
                  <span>(Partidas contra o algoritmo não contam para o rank)</span>
                </>
              ) : (
                <p>compita contra outros jogadores pelo rank!</p>
              )
            }
            <button onClick={findGame}>Buscar partida</button>
          </>
        ) : <AuthenticationArea />
      }
    </div>
  )
}