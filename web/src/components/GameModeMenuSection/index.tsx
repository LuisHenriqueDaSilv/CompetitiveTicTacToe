import { useContext } from 'react'
import styles from './styles.module.scss'

import { GameContext } from '../../contexts/gameContext'
import boardRouter from '../../contexts/boardRouter'

export default function GameModeMenu() {

  const { setGamemode, gamemode } = useContext(GameContext)

  function handleChangeGameMode(nextGamemode: "algoritmo" | "multiplayer") {
    if (nextGamemode == gamemode) return
    setGamemode(nextGamemode)
    boardRouter.navigate("/encontrar-partida")
  }

  return (
    <section className={styles.gameModeSection}>
      <h1>modo de jogo</h1>
      <button
        id={gamemode == 'multiplayer' ? styles.selectedModeButton : ""}
        onClick={() => handleChangeGameMode('multiplayer')}
      >
        multijogador
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