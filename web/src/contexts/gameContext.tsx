import { createContext, useEffect, useState } from 'react'
import socketClient from '../services/socket'
import boardRouter from '../components/Board/router'

import {
  socketContextProviderParamsInterface,
  socketContextProviderValuesInterface,
  gameInfosInterface,
  newGameDataInterface,
  endGameEventInterface,
  newMoveDataInterface
} from "../@types"

export const GameContext = createContext({} as socketContextProviderValuesInterface)

export function GameContextProvider({ children }: socketContextProviderParamsInterface) {

  const [inGame, setInGame] = useState<boolean>(false)
  const [gamemode, setGamemode] = useState<"multiplayer" | "algoritmo">("algoritmo")
  const [findingGame, setFindingGame] = useState<boolean>(false)
  const [gamedata, setGamedata] = useState<string[]>([])
  const [gameInfos, setGameInfos] = useState<gameInfosInterface | null>(null)
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true)
  const [socket, setSocket] = useState<any>()

  function findGame() {
    setFindingGame(true);
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

    socket?.on("new_move", onNewMove)
    return () => { socket?.off("new_move", onNewMove) }
  }, [gameInfos, gamedata, socket])

  useEffect(() => {
    socketClient.connect()
    setSocket(socketClient)
    function onBad(data: string) {
      alert(data)
    }
    function onNewGame(data: newGameDataInterface) {
      setInGame(true)
      setGamedata(data.data.split(""))
      setGameInfos(data.gameInfos)
      setFindingGame(false)
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

  return (
    <GameContext.Provider value={{
      inGame,
      gamemode,
      setGamemode,
      gamedata,
      findGame,
      submitMove,
      isMyTurn
    }}>
      {children}
    </GameContext.Provider>
  )
}

