import {useContext} from 'react'
import {GameSocketContext} from './contexts/gameSocketContext'

import GameBoard from './components/GameBoard'

// Icons:
import TrophyIcon from './assets/trophy.svg'
import ExitIcon from './assets/exit.svg'
import EditIcon from './assets/edit.svg'
import PlayIcon from './assets/play.svg'

import styles from './styles/appStyles.module.scss'
import FindGameMenu from './components/FindGameMenu'


export default function App(){

  const {
    inGame,
    gamemode,
    setGamemode
  } = useContext(GameSocketContext)


  return (
    <div className={styles.appWrapper}>
      <div className={styles.appContainer}>
        <div className={styles.board}>

          <header className={styles.boardHeader}>
            <h1>Jogo da velha</h1>
          </header>

          {
            inGame? <GameBoard/>:<FindGameMenu/>
          }

        </div>
          

        <aside className={styles.menu}>
          <section className={styles.gameModeSection}>
            <h1>modo de jogo</h1>
            <button 
              id={gamemode=='multiplayer'? styles.selectedModeButton:""} 
              onClick={() => setGamemode('multiplayer')}
            >
              multijogador
            </button>
            <button 
              id={gamemode=='algoritmo'? styles.selectedModeButton:""} 
              onClick={() => setGamemode('algoritmo')}
            >
              algoritmo
            </button>
          </section>

          <section className={styles.rankingsSection}>
            <h1>ranking</h1>
            <div className={styles.rankings}>
              {(() => {
                const components = []
                for(let i=0; i<10; i++){
                  components.push(
                    <div key={i} className={styles.ranking}>
                      <p>{i+1}°</p>
                      <p>xxxxxxx</p>
                      <div>
                        <p>99999</p>
                        <img src={TrophyIcon}/>
                      </div>
                    </div>
                  )
                }
                return components
              })()}
            </div>
          </section>

          <section className={styles.userSection}>
            <div className={styles.userName}>
              <h1>LuisSilva</h1>
              <button>
                <img src={EditIcon} alt="editar"/>
              </button> 
              <button>
                <img src={ExitIcon} alt="sair"/>
              </button> 
            </div>

            <div className={styles.info}> 
              <img src={TrophyIcon}/>
              <p>vitórias multiplayer</p>
              <span>15</span>
            </div>
            <div className={styles.info}> 
              <img src={PlayIcon}/>
              <p>partidas multiplayer</p>
              <span>15</span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
