import { ReactNode, createContext, useEffect, useState } from 'react'

import socketClient from '../services/socket'

interface socketContextProviderParamsInterface {
  children: ReactNode
}
interface socketContextProviderValuesInterface {
  inGame: boolean,
  setGamemode: (mode: "multiplayer" | "algoritmo") => void,
  gamemode: "multiplayer" | "algoritmo",
  gamedata: string[],
  findGame: () => void,
  submitMove: (GameId: number) => void,
  isMyTurn: boolean
}

interface gameInfosInterface {
  id: number,
  mode: "multiplayer" | "algoritmo",
  oponent: {
    type: "player" | "algorithm",
    id: number | null,
    username: string | null
  }
}

interface newGameDataInterface {
  data: "",
  gameInfos: gameInfosInterface
}

interface newMoveDataInterface {
  new_data: ""
}

export const GameSocketContext = createContext({} as socketContextProviderValuesInterface)

export function GameSocketProvider({ children }: socketContextProviderParamsInterface) {
  const [isConnected, setIsConnected] = useState<boolean>(socketClient.connected);
  const [inGame, setInGame] = useState<boolean>(false)
  const [gamemode, setGamemode] = useState<"multiplayer" | "algoritmo">("algoritmo")
  const [findingGame, setFindingGame] = useState<boolean>(false)
  const [gamedata, setGamedata] = useState<string[]>([])
  const [gameInfos, setGameInfos] = useState<gameInfosInterface>()
  const [isMyTurn, setIsMyTurn] = useState<boolean>(true)
  const [socket, setSocket] = useState<any>()

  function findGame() {
    setFindingGame(true);
    socketClient.emit("searching_new_game", {
      gamemode
    })
  }
  function submitMove(position: number) {

    if (!inGame || !gameInfos) {
      return alert("Algo de inesperado ocorreu")
    }
    socketClient.emit("move", {
      gameId: gameInfos.id,
      position
    })

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
      }, gameInfos?.mode == "algoritmo" ? 1000 : 0)
    }

    socket?.on("new_move", onNewMove)
    return () => {
      socket?.off("new_move", onNewMove)
    }
  }, [gameInfos, gamedata, socket])

  useEffect(() => {

    socketClient.connect()
    setSocket(socketClient)

    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    function onBad(data: string) {
      alert(data)
    }
    function onNewGame(data: newGameDataInterface) {
      setInGame(true)
      setGamedata(data.data.split(""))
      setGameInfos(data.gameInfos)
      setFindingGame(false)
    }

    socketClient.on("connect", onConnect)
    socketClient.on("disconnect", onDisconnect)
    socketClient.on("bad", onBad)
    socketClient.on("new_game", onNewGame)

    return () => {
      socketClient.off("connect", onConnect)
      socketClient.off("disconnect", onDisconnect)
      socketClient.off("bad", onBad)
      socketClient.off("new_game", onNewGame)
    }
  }, [])

  return (
    <GameSocketContext.Provider value={{
      inGame,
      gamemode,
      setGamemode,
      gamedata,
      findGame,
      submitMove,
      isMyTurn
    }}>
      {children}
    </GameSocketContext.Provider>
  )
}

