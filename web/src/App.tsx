import styles from './styles/appStyles.module.scss'

// Components:
import GameRouter from "./contexts/gameRouter"
import AsideMenu from './components/AsideMenu'
import { RouterProvider } from 'react-router-dom'


export default function App(){

  return (
    <div className={styles.appWrapper}>
      <div className={styles.appContainer}>
        <div className={styles.board}>

          <header className={styles.boardHeader}>
            <h1>Jogo da velha</h1>
          </header>

          <RouterProvider router={GameRouter}/>

        </div>

        <AsideMenu/>
        
      </div>
    </div>
  )
}
