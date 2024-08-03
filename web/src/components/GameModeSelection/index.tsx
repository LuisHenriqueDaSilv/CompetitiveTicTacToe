import { useContext } from 'react'
import styles from './styles.module.scss'

import { GameContext } from '../../contexts/gameContext'
import boardRouter from '../../contexts/boardRouter'
import {AuthenticationContext} from '../../contexts/authenticationContext'

export default function GameModeSelection() {

  const { setGamemode, gamemode } = useContext(GameContext)
  const { authenticated } = useContext(AuthenticationContext)

  function handleChangeGameMode(nextGamemode: "algoritmo" | "multiplayer") {
    setGamemode(nextGamemode)
    boardRouter.navigate("/encontrar-partida")
  }

  return (
    <section className={styles.gameModeSection}>
      <h1>modo de jogo</h1>
      <button
        id={gamemode == 'multiplayer' ? styles.selectedModeButton : ""}
        onClick={() => handleChangeGameMode('multiplayer')}
        disabled={!authenticated}
      >
        multijogador
        {
          !authenticated? <span>(Autentique-se para desbloquear este modo)</span>:null
        }
      </button>
      <button
        id={gamemode == 'algoritmo' ? styles.selectedModeButton : ""}
        onClick={() => handleChangeGameMode('algoritmo')}
      >
        algoritmo
      </button>
    </section>
  )
}