import { useEffect, useState } from 'react'
import TrophyIcon from '../../assets/trophy.svg'

import styles from './styles.module.scss'
import { axiosClient } from '../../services/axios'

export default function RakingSection() {

  const [ranking, setRanking] = useState<{ username: string, wins: number }[]>([])

  async function fetchRanking() {
    await axiosClient.get('/ranking').then((response) => {
      setRanking(response.data.ranking)
    }).catch(() => {
      alert("Algo de inesperado ocorreu enquanto buscavamos o rank")
    })
  }

  useEffect(() => {
    fetchRanking()
  }, [])

  return (
    <section className={styles.rankingsSection}>
      <h1>ranking</h1>
      <div className={styles.rankings}>
        {(() => {
          const components = []
          for (let i = 0; i < 10; i++) {
            const username = ranking[i]? ranking[i].username:""
            const wins = ranking[i]? ranking[i].wins:""
            components.push(
              <div key={i} className={styles.ranking}>
                <p>{i + 1}°</p>
                <p>{username}</p>
                <div>
                  <p>{wins}</p>
                  <img src={TrophyIcon} />
                </div>
              </div>
            )
          }
          return components
        })()}
      </div>
    </section>
  )

}