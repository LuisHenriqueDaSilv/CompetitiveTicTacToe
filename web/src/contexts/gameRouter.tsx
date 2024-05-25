import { createBrowserRouter } from "react-router-dom";

import AuthenticationArea from '../components/AuthenticationArea'
import GameBoard from '../components/GameBoard'
import FindMatchMenu from "../components/FindGameMenu";

export default createBrowserRouter([
  {
    Component: FindMatchMenu,
    path: "/encontrar-partida"
  },
  {
    path: '/criar-conta',
    Component: AuthenticationArea
  },
  {
    path: '/game',
    Component: GameBoard
  },
  {
    path: "/",
    Component: GameBoard
  }

])