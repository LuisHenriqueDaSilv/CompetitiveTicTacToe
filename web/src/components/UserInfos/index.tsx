import { useContext } from 'react'

import styles from './styles.module.scss'
import LoadingSpinner from '../LoadingSpinner'
import { AuthenticationContext } from '../../contexts/authenticationContext'

import EditIcon from '../../assets/edit.svg'
import TrophyIcon from '../../assets/trophy.svg'
import ExitIcon from '../../assets/exit.svg'
import PlayIcon from '../../assets/play.svg'

export default function UserSection() {

  const {
    loadingAuthentication,
    authenticated,
    playerInfos,
    logout
  } = useContext(AuthenticationContext)

  function handleLogout() {
    const confirmation = confirm(`Deseja sair do seu perfil?`)
    if (!confirmation) { return }
    logout()
  }

  return (
    <section className={styles.userSection}>
      {
        loadingAuthentication ? (<LoadingSpinner />) : (
          authenticated ? (
            <>
              <div className={styles.userName}>
                <h1>{playerInfos?.username}</h1>
                <button>
                  <img src={EditIcon} alt="editar" />
                </button>
                <button onClick={handleLogout}>
                  <img src={ExitIcon} alt="sair" />
                </button>
              </div>

              <div className={styles.info}>
                <img src={TrophyIcon} />
                <p>vitórias multiplayer</p>
                <span>{playerInfos?.wins}</span>
              </div>
              <div className={styles.info}>
                <img src={PlayIcon} />
                <p>partidas multiplayer</p>
                <span>{playerInfos?.games}</span>
              </div>
            </>
          ) : (
            <>
              <p>entre ou crie uma conta para aproveitar toda a experiência do Jogo Da Velha Competitivo</p>
              <div className={styles.authContainer}>
                <a href="/login"><button>entrar</button></a>
                <a href="/criar-conta"><button>criar conta</button></a>
              </div>
            </>
          )
        )
      }
    </section>
  )
}