import { useContext } from "react"
import { useNavigate } from "react-router"

import { GameContext } from "../../contexts/gameContext"
import { AuthenticationContext } from "../../contexts/authenticationContext"
import styles from './styles.module.scss'
import LoadingSpinner from "../LoadingSpinner"

export default function FindGameMenu() {

  const navigate = useNavigate()
  const { gamemode, findGame, isFindingGame } = useContext(GameContext)
  const { authenticated } = useContext(AuthenticationContext)

  if (!authenticated && gamemode == "multiplayer") {
    navigate("/criar-conta")
    return
  }

  return (
    <div className={styles.container}>
      {
        isFindingGame ? (
          <>
            <p> Procurando partida </p>
            <div className={styles.loadingGameIcon}>
              <LoadingSpinner />
            </div>
          </>
        ) : (
          gamemode == "algoritmo" ? (
            <>
              <p>Inicie uma partida contra nosso algoritmo clicando no botão abaixo</p>
              <span>(Partidas contra o algoritmo não contam para o rank)</span>
            </>
          ) : (<p>hora de testar suas habilidades jogando contra outros jogadores reais!</p>)
        )
      }
      <button onClick={findGame}>{isFindingGame? "cancelar":"iniciar partida"}</button>
    </div>
  )
}