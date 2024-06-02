import { createBrowserRouter } from "react-router-dom";
import SignupArea from './SignupArea'
import GameBoard from './GameBoard'
import FindGameMenu from "./FindGameMenu";
import ValidateArea from "./ValidateArea"

export default createBrowserRouter([
  { path: "/encontrar-partida", Component: FindGameMenu },
  { path: '/criar-conta', Component: SignupArea },
  { path: '/validar', Component: ValidateArea },
  { path: '/game', Component: GameBoard },
  { path: "/", Component: FindGameMenu }
])