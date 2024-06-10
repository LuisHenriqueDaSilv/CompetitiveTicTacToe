import { createContext, useContext, useEffect, useState } from 'react'
import socketClient from '../services/socket'
import boardRouter from './boardRouter'

import { AuthenticationContext } from './authenticationContext'
import {
  gameContextProviderValuesInterface,
  gameContextProviderParamsInterface,
  gameInterface,
  endGameEventInterface
} from "../@types"

export const GameContext = createContext({} as gameContextProviderValuesInterface)

export function GameContextProvider({ children }: gameContextProviderParamsInterface) {

  const {
    getJwt,
    authenticated
  } = useContext(AuthenticationContext)

  const [inGame, setInGame] = useState<boolean>(false)
  const [gamemode, setGamemode] = useState<"multiplayer" | "algoritmo">("algoritmo")
  const [isFindingGame, setIsFindingGame] = useState<boolean>(false)
  const [gamedata, setGamedata] = useState<string[]>([])
  const [game, setGame] = useState<gameInterface | null>(null)
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true)

  function findGame() {
    setIsFindingGame(true);
    socketClient.emit("searching_new_game", { gamemode })
  }

  function submitMove(position: number) {
    if (!inGame || !game) { return alert("Algo de inesperado ocorreu") }
    socketClient.emit("move", { gameId: game.game_infos.id, position })

    const gameDataClone = [...gamedata]
    gameDataClone[position] = game.game_infos.current
    setGamedata(gameDataClone)
    setIsMyTurn(false)
  }

  useEffect(() => {


    function onNewMove(data: gameInterface) {
      setTimeout(() => {
        setGamedata(data.data.split(""))
        setGame(data)
        setIsMyTurn(true)
        if(data.game_infos.result){ 
          setTimeout(() => {
            if (data.game_infos.result == "win") { alert(`Temos um vencedor! Parabens, ${data.game_infos.winner}`) }
            if (data.game_infos.result == "tie") { alert("Temos um empate. Boa sorte na próxima!") }
            setInGame(false)
            setGamedata([])
            setGame(null)
            boardRouter.navigate("/encontrar-partida")
          }, 1000)
        }
      }, game?.game_infos.mode == "algoritmo" ? 500 : 0)
    }

    socketClient.on("new_move", onNewMove)
    return () => { socketClient?.off("new_move", onNewMove) }
  }, [game, gamedata])

  useEffect(() => {
    socketClient.connect()
    function onBad(data: string) {
      alert(data)
    }
    function onNewGame(data: gameInterface) {
      setInGame(true)
      setGamedata(data.data.split(""))
      setGame(data)
      setIsFindingGame(false)
      setIsMyTurn(true)
      boardRouter.navigate("/game")
    }
    socketClient.on("bad", onBad)
    socketClient.on("new_game", onNewGame)
    return () => {
      socketClient.off("bad", onBad)
      socketClient.off("new_game", onNewGame)
    }
  }, [])

  useEffect(() => {
    socketClient.disconnect()
    if(authenticated){
      const token = getJwt()
      socketClient.io.opts.query = {
        authentication_jwt: token
      }
      socketClient.connect()
    }else {
      socketClient.connect()
    }
  }, [authenticated])

  return (
    <GameContext.Provider value={{
      inGame,
      gamemode,
      setGamemode,
      gamedata,
      findGame,
      submitMove,
      isMyTurn,
      isFindingGame
    }}>
      {children}
    </GameContext.Provider>
  )
}

