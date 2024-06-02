import { useContext } from "react"
import { GameContext } from "../../../contexts/gameContext"
import { AuthenticationContext } from "../../../contexts/authenticationContext"
import { useNavigate } from "react-router"
import styles from './styles.module.scss'

export default function FindGameMenu() {

  const navigate = useNavigate() 
  const { gamemode, findGame} = useContext(GameContext)
  const {authenticated} = useContext(AuthenticationContext)

  if(!authenticated && gamemode == "multiplayer"){
    navigate("/criar-conta")
    return
  } 

  return (
    <div className={styles.container}>
      {
        gamemode == "algoritmo" ? (
          <>
            <p>Inicie uma partida contra nosso algoritmo clicando no botão abaixo</p>
            <span>(Partidas contra o algoritmo não contam para o rank)</span>
          </>
        ) : ( <p>hora de testar suas habilidades jogando contra outros jogadores reais!</p>)
      }
      <button onClick={findGame}>Iniciar partida</button>
    </div>
  )
}