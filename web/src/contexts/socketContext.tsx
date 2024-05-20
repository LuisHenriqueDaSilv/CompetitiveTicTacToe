import {ReactNode, createContext, useEffect, useState } from 'react'

import socketClient from '../services/socket'

interface socketContextProviderParams {
  children: ReactNode
}
interface socketContextProviderValues {
  test: string
}

export const SocketioContext = createContext({} as socketContextProviderValues)

export function SocketContextProvider({children}:socketContextProviderParams){
  const [isConnected, setIsConnected] = useState<boolean>(socketClient.connected);


  useEffect(() => {
    socketClient.connect()
    console.log('effect')
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMessage(data:any) {
      console.log(data)
    }

    socketClient.on('connect', onConnect);
    socketClient.on('disconnect', onDisconnect);
    socketClient.on('message', onMessage);

    return () => {
      socketClient.off('connect', onConnect);
      socketClient.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <SocketioContext.Provider value={{
      test:"test"
    }}>
      {children}
    </SocketioContext.Provider>
  )
}

