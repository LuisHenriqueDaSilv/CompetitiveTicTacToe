import RakingSection from '../RankingMenuSection'
import UserSection from '../UserMenuSection'
import GameModeMenu from '../GameModeMenuSection'

import styles from './styles.module.scss'

export default function AsideMenu() {

  return (
    <aside className={styles.menuContainer}>

      <GameModeMenu/>
      <RakingSection/>
      <UserSection/>

    </aside>
  )
}