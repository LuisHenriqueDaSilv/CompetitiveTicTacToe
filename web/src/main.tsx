import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { GameContextProvider } from "./contexts/gameContext.tsx"
import { AuthenticationContextProvider } from "./contexts/authenticationContext"
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthenticationContextProvider>
      <GameContextProvider>
        <App />
      </GameContextProvider>
    </AuthenticationContextProvider>
  </React.StrictMode>,
)
