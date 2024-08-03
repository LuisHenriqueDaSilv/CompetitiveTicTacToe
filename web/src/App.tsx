import BoardRouter from "./contexts/boardRouter"
import { RouterProvider } from 'react-router-dom'

import Raking from './components/Ranking'
import UserInfos from './components/UserInfos'
import GameModeSelection from './components/GameModeSelection'

import styles from './styles/appStyles.module.scss'
import sideBarStyles from './styles/sideBarStyles.module.scss'

export default function App() {
  return (
    <div className={styles.appWrapper}>
      <div className={styles.appContainer}>
        <div className={styles.board}>
          <header className={styles.boardHeader}>
            <h1>Jogo da velha</h1>
          </header>
          <RouterProvider router={BoardRouter} />
        </div>

        <aside className={sideBarStyles.menuContainer}>
          <GameModeSelection/>
          <Raking/>
          <UserInfos/>
        </aside>

      </div>
    </div>
  )
}
