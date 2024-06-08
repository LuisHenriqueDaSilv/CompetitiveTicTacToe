import { createContext, useContext, useEffect, useState } from 'react'
import {Socket} from 'socket.io-client'
import socketClient from '../services/socket'
import boardRouter from './boardRouter'

import { AuthenticationContext } from './authenticationContext'
import {
  gameContextProviderValuesInterface,
  gameContextProviderParamsInterface,
  gameInfosInterface,
  newGameDataInterface,
  endGameEventInterface,
  newMoveDataInterface
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
  const [gameInfos, setGameInfos] = useState<gameInfosInterface | null>(null)
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true)

  function findGame() {
    setIsFindingGame(true);
    socketClient.emit("searching_new_game", { gamemode })
  }

  function submitMove(position: number) {
    if (!inGame || !gameInfos) { return alert("Algo de inesperado ocorreu") }
    socketClient.emit("move", { gameId: gameInfos.id, position })

    const gameDataClone = [...gamedata]
    gameDataClone[position] = "x"
    setGamedata(gameDataClone)
    setIsMyTurn(false)
  }

  useEffect(() => {

    function onNewMove(data: newMoveDataInterface) {
      setTimeout(() => {
        setGamedata(data.new_data.split(""))
        setIsMyTurn(true)
      }, gameInfos?.mode == "algoritmo" ? 500 : 0)
    }

    socketClient.on("new_move", onNewMove)
    return () => { socketClient?.off("new_move", onNewMove) }
  }, [gameInfos, gamedata])

  useEffect(() => {
    socketClient.connect()
    function onBad(data: string) {
      alert(data)
    }
    function onNewGame(data: newGameDataInterface) {
      setInGame(true)
      setGamedata(data.data.split(""))
      setGameInfos(data.gameInfos)
      setIsFindingGame(false)
      setIsMyTurn(true)
      boardRouter.navigate("/game")
    }
    function onEndGame(data: endGameEventInterface) {
      setTimeout(() => {
        if (data.result == "win") { alert(`Temos um vencedor! Parabens, ${data.winner}`) }
        if (data.result == "tie") { alert("Temos um empate. Boa sorte na próxima!") }
        setInGame(false)
        setGamedata([])
        setGameInfos(null)
        boardRouter.navigate("/encontrar-partida")
      }, 1000)
    }

    socketClient.on("bad", onBad)
    socketClient.on("new_game", onNewGame)
    socketClient.on("end_game", onEndGame)

    return () => {
      socketClient.off("bad", onBad)
      socketClient.off("new_game", onNewGame)
      socketClient.off("end_game", onEndGame)
    }
  }, [])

  useEffect(() => {
    console.log("teste")
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

