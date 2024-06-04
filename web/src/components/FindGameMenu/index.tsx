import { useContext } from "react"
import { useNavigate } from "react-router"

import { GameContext } from "../../contexts/gameContext"
import { AuthenticationContext } from "../../contexts/authenticationContext"
import styles from './styles.module.scss'
import LoadingSpinner from "../LoadingSpinner"

export default function FindGameMenu() {

  const navigate = useNavigate()
  const { gamemode, findGame, isFindingGame } = useContext(GameContext)
  const { authenticated } = useContext(AuthenticationContext)

  if (!authenticated && gamemode == "multiplayer") {
    navigate("/criar-conta")
    return
  }

  return (
    <div className={styles.container}>
      {
        isFindingGame ? (
          <>
            <p> Procurando partida </p>
            <div className={styles.loadingGameIcon}>
              <LoadingSpinner />
            </div>
          </>
        ) : (
          gamemode == "algoritmo" ? (
            <>
              <div>
                <h1>
                  Bem-vindo ao modo de treinamento do Jogo da Velha Competitivo!
                </h1>
                <p>
                  Pronto para testar suas habilidades? Desafie nosso algoritmo em uma partida emocionante de jogo da velha.
                  Nosso algoritmo é projetado para proporcionar uma competição justa e desafiadora, independentemente do
                  seu nível de habilidade.
                </p>
              </div>
              <div className={styles.tutorialContainer}>
                <h1> Como jogar:</h1>
                <p>1°: Clique no botão "Iniciar Partida" abaixo para começar um novo jogo.</p>
                <p>2°: Você será o X e o algoritmo será o O.</p>
                <p>3°: Clique em qualquer quadrado vazio no tabuleiro para fazer sua jogada.</p>
                <p>4°: O algoritmo responderá automaticamente com a jogada dele.</p>
                <p>5°: O jogo termina quando você ou o algoritmo fizer uma linha de três símbolos iguais,
                  ou quando todas as casas estiverem preenchidas, resultando em um empate.</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h1>
                  Bem-vindo ao modo online do Jogo da Velha Competitivo!
                </h1>
                <p>
                  Está pronto para desafiar outros jogadores? Inicie uma partida de jogo da velha e mostre suas habilidades
                  estratégicas contra um oponente real. Nossa plataforma conecta você a outros jogadores de forma rápida e fácil.
                </p>
              </div>
              <div className={styles.tutorialContainer}>
                <h1> Como jogar:</h1>
                <p>1°: Clique no botão "Iniciar Partida" abaixo para começar um novo jogo.</p>
                <p>2°: Aguarde enquanto encontramos um oponente para você.</p>
                <p>3°: Você será o X ou o O, dependendo da ordem de entrada no jogo.</p>
                <p>4°: Clique em qualquer quadrado vazio no tabuleiro para fazer sua jogada.</p>
                <p>5°: Aguarde seu oponente fazer a jogada dele.</p>
                <p>6°: O jogo termina quando você ou o seu oponente fizer uma linha de três símbolos iguais, ou quando todas as casas estiverem preenchidas, resultando em um empate.</p>
              </div>
            </>
          )
        )
      }
      <button onClick={findGame}>{isFindingGame ? "cancelar" : "iniciar partida"}</button>
    </div>
  )
}