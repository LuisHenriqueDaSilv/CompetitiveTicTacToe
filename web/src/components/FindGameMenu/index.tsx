import { useContext } from "react"
import { GameSocketContext } from "../../contexts/gameSocketContext"
import { AuthenticationContext } from "../../contexts/authenticationContext"
import { useNavigate } from "react-router"

import styles from './styles.module.scss'

export default function FindMatchMenu() {

  const navigate = useNavigate() 

  const {
    gamemode,
    findGame
  } = useContext(GameSocketContext)

  const {
    authenticated
  } = useContext(AuthenticationContext)

  if(!authenticated && gamemode == "multiplayer"){
    navigate("/criar-conta")
    return null
  }

  return (
    <div
      className={styles.container}
    >
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
      <button onClick={findGame}>Iniciar partida</button>
    </div>
  )
}