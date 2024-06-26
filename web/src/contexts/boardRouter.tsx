import { createBrowserRouter } from "react-router-dom";
import SignupArea from '../components/SignupArea'
import GameBoard from '../components/GameBoard'
import FindGameMenu from "../components/FindGameMenu";
import ValidateArea from "../components/ValidateArea"
import LoginArea from "../components/LoginArea";
import RequestChangePasswordArea from "../components/RequestChangePasswordArea";
import ChangePasswordArea from '../components/ChangePasswordArea'

export default createBrowserRouter([
  { path: "/encontrar-partida", Component: FindGameMenu },
  { path: "/recuperar-acesso", Component: RequestChangePasswordArea },
  { path: "/recuperar-acesso/nova-senha", Component: ChangePasswordArea },
  { path: '/criar-conta', Component: SignupArea },
  { path: '/validar', Component: ValidateArea },
  { path: '/game', Component: GameBoard },
  { path: '/login', Component: LoginArea },
  { path: "/", Component: FindGameMenu }
])