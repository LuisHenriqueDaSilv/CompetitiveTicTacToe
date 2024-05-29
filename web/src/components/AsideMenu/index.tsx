import { useContext } from 'react'

import TrophyIcon from '../../assets/trophy.svg'
import ExitIcon from '../../assets/exit.svg'
import EditIcon from '../../assets/edit.svg'
import PlayIcon from '../../assets/play.svg'

import { GameSocketContext } from '../../contexts/gameSocketContext'
import { AuthenticationContext } from '../../contexts/authenticationContext'
import boardRouter from '../../contexts/boardRouter'

import styles from './styles.module.scss'


export default function AsideMenu() {

  const {
    gamemode,
    setGamemode
  } = useContext(GameSocketContext)
  const { authenticated } = useContext(AuthenticationContext)

  function handleChangeGameMode(nextGamemode: "algoritmo" | "multiplayer") {
    if (nextGamemode != gamemode) {
      setGamemode(nextGamemode)
      boardRouter.navigate("/encontrar-partida")
    }
  }

  return (
    <aside className={styles.menuContainer}>
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

      <section className={styles.rankingsSection}>
        <h1>ranking</h1>
        <div className={styles.rankings}>
          {(() => {
            const components = []
            for (let i = 0; i < 10; i++) {
              components.push(
                <div key={i} className={styles.ranking}>
                  <p>{i + 1}°</p>
                  <p>xxxxxxx</p>
                  <div>
                    <p>99999</p>
                    <img src={TrophyIcon} />
                  </div>
                </div>
              )
            }
            return components
          })()}
        </div>
      </section>

      <section className={styles.userSection}>
        {
          authenticated ? (
            <>
              <div className={styles.userName}>
                <h1>LuisSilva</h1>
                <button>
                  <img src={EditIcon} alt="editar" />
                </button>
                <button>
                  <img src={ExitIcon} alt="sair" />
                </button>
              </div>

              <div className={styles.info}>
                <img src={TrophyIcon} />
                <p>vitórias multiplayer</p>
                <span>15</span>
              </div>
              <div className={styles.info}>
                <img src={PlayIcon} />
                <p>partidas multiplayer</p>
                <span>15</span>
              </div>
            </>

          ) : null
        }
      </section>
    </aside>
  )
}