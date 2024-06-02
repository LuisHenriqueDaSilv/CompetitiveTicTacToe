import { useContext } from "react"
import { GameContext } from "../../contexts/gameContext"
import styles from './styles.module.scss'
import MedalIcon from '../../assets/medal.svg'

export default function GameBoard() {

  const { gamedata, submitMove, isMyTurn } = useContext(GameContext)

  return (
    <div className={styles.container}>
      <aside className={styles.playersInfosContainer}>
        <section className={styles.playerInfos}>
          <p>xxxxxxxxxx</p>
          <div>
            <p>xx</p>
            <img src={MedalIcon} />
          </div>
        </section>
        <span>VS</span>
        <section className={styles.playerInfos}>
          <p>xxxxxxxxxx</p>
          <div>
            <p>xx</p>
            <img src={MedalIcon} />
          </div>
        </section>
      </aside>
      <div className={styles.game}>
        {
          gamedata.map((field, index) => {
            const firstColumnIndex = [0, 3, 6]
            const lastColumnIndex = [2, 5, 8]
            const firstRowIndex = [0, 1, 2]
            const lastRowIndex = [6, 7, 8]
            return (
              <button
                key={index}
                disabled={!isMyTurn || field != " "}
                className={`
                  ${firstRowIndex.includes(index) ? styles.firstRowButton : ""}
                  ${lastColumnIndex.includes(index) ? styles.lastColumnButton : ""}
                  ${lastRowIndex.includes(index) ? styles.lastRowButton : ""}
                  ${firstColumnIndex.includes(index) ? styles.firstColumnButton : ""}
                `}
                onClick={() => { submitMove(index) }}
              >
                {field != ' ' ? (<img src={field == 'x' ? "/cross.png" : "/circle.png"} />) : null
                }
              </button>
            )
          })
        }
      </div>
    </div>
  )
}