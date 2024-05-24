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
interface playerInterface {
  type: "player" | "algorithm",
  id: number | null,
  username: string | null
}
interface gameInfosInterface {
  mode: "multiplayer" | "algoritmo",
  o_player: playerInterface | null,
  x_player : playerInterface | null,
  id: string,
  current: "x" | "o",
}
interface newGameDataInterface {
  data: "",
  gameInfos: gameInfosInterface
}
interface newMoveDataInterface {
  new_data: ""
}
interface endGameEventInterface {
  result: "win"|"tie",
  winner: "x"|"o"|""
}

export const GameSocketContext = createContext({} as socketContextProviderValuesInterface)

export function GameSocketProvider({ children }: socketContextProviderParamsInterface) {
  const [isConnected, setIsConnected] = useState<boolean>(socketClient.connected);
  const [inGame, setInGame] = useState<boolean>(false)
  const [gamemode, setGamemode] = useState<"multiplayer" | "algoritmo">("algoritmo")
  const [findingGame, setFindingGame] = useState<boolean>(false)
  const [gamedata, setGamedata] = useState<string[]>([])
  const [gameInfos, setGameInfos] = useState<gameInfosInterface|null>(null)
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
    function onEndGame(data: endGameEventInterface) {
      if (data.result == "win"){
        alert(`Temos um vencedor! E ele é: ${data.winner}`)
      }
      setInGame(false)
      setGamedata([])
      setGameInfos(null)
    }
    
    socketClient.on("connect", onConnect)
    socketClient.on("disconnect", onDisconnect)
    socketClient.on("bad", onBad)
    socketClient.on("new_game", onNewGame)
    socketClient.on("end_game", onEndGame)

    return () => {
      socketClient.off("connect", onConnect)
      socketClient.off("disconnect", onDisconnect)
      socketClient.off("bad", onBad)
      socketClient.off("new_game", onNewGame)
      socketClient.off("end_game", onEndGame)
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

