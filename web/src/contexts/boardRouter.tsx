import { createBrowserRouter } from "react-router-dom";

import SignupArea from '../components/SignupArea'
import GameBoard from '../components/GameBoard'
import FindGameMenu from "../components/FindGameMenu";
import ValidateArea from "../components/ValidateArea"

export default createBrowserRouter([
  {
    Component: FindGameMenu,
    path: "/encontrar-partida"
  },
  {
    path: '/criar-conta',
    Component: SignupArea
  },
  {
    path: '/validar',
    Component: ValidateArea
  },
  {
    path: '/game',
    Component: GameBoard
  },
  {
    path: "/",
    Component: FindGameMenu
  }

])