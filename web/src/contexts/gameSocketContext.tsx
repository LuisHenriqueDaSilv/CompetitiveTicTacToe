import { ReactNode, createContext, useEffect, useState } from 'react'

import socketClient from '../services/socket'

interface socketContextProviderParamsInterface {
  children: ReactNode
}
interface socketContextProviderValuesInterface {
  inMatch: boolean,
  setMatchmode: (mode: "multiplayer" | "algoritmo") => void,
  matchmode: "multiplayer" | "algoritmo",
  matchdata: string[],
  findMatch: () => void,
  submitMove: (matchId: number) => void
}

interface matchInfosInterface {
  id: number,
  mode: "multiplayer" | "algoritmo",
  oponent: {
    type: "player" | "algorithm",
    id: number | null,
    username: string | null
  }
}

interface newMatchDataInterface {
  data: "",
  matchInfos: matchInfosInterface
}

export const GameSocketContext = createContext({} as socketContextProviderValuesInterface)

export function GameSocketProvider({ children }: socketContextProviderParamsInterface) {
  const [isConnected, setIsConnected] = useState<boolean>(socketClient.connected);
  const [inMatch, setInMatch] = useState<boolean>(false)
  const [matchmode, setMatchmode] = useState<"multiplayer" | "algoritmo">("algoritmo")
  const [findingMatch, setFindingMatch] = useState<boolean>(false)
  const [matchdata, setMatchdata] = useState<string[]>([])
  const [matchInfos, setMatchInfos] = useState<matchInfosInterface>()

  function findMatch() {
    setFindingMatch(true);
    socketClient.emit("searching_new_match", {
      matchmode: matchmode
    })
  }
  function submitMove(position: number) {
    if(!inMatch || !matchInfos){
      return alert("Algo de inesperado ocorreu")
    }
    socketClient.emit("move", {
      matchId: matchInfos.id,
      position
    })
  }

  useEffect(() => {

    socketClient.connect()

    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    function onBad(data: string) {
      alert(data)
    }
    function onNewMatch(data: newMatchDataInterface) {
      setInMatch(true)
      setMatchdata(data.data.split(""))
      setMatchInfos(data.matchInfos)
      setFindingMatch(false)
    }

    socketClient.on("connect", onConnect)
    socketClient.on("disconnect", onDisconnect)
    socketClient.on("bad", onBad)
    socketClient.on("new_match", onNewMatch)

    return () => {
      socketClient.off("connect", onConnect)
      socketClient.off("disconnect", onDisconnect)
      socketClient.off("bad", onBad)
      socketClient.off("new_match", onNewMatch)
    }
  }, [])

  return (
    <GameSocketContext.Provider value={{
      inMatch,
      matchmode,
      setMatchmode,
      matchdata,
      findMatch,
      submitMove
    }}>
      {children}
    </GameSocketContext.Provider>
  )
}

