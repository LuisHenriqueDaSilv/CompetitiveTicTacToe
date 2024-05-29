import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import './styles/global.css'

import { GameSocketProvider } from "./contexts/gameSocketContext"
import { AuthenticationContextProvider } from "./contexts/authenticationContext"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthenticationContextProvider>
      <GameSocketProvider>
        <App />
      </GameSocketProvider>
    </AuthenticationContextProvider>
  </React.StrictMode>,
)
