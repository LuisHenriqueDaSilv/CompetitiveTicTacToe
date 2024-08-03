import { createBrowserRouter } from "react-router-dom";
import SignupForm from '../components/SignupForm'
import GameBoard from '../components/GameBoard'
import FindGameScreen from "../components/FindGameScreen";
import SignupValidationForm from "../components/SignupValidationForm"
import LoginForm from "../components/LoginForm";
import RequestChangePasswordForm from "../components/RequestChangePasswordForm";
import ChangePasswordForm from '../components/ChangePasswordForm'

export default createBrowserRouter([
  { path: "/encontrar-partida", Component: FindGameScreen },
  { path: "/recuperar-acesso", Component: RequestChangePasswordForm },
  { path: "/recuperar-acesso/nova-senha", Component: ChangePasswordForm },
  { path: '/criar-conta', Component: SignupForm },
  { path: '/validar', Component: SignupValidationForm },
  { path: '/game', Component: GameBoard },
  { path: '/login', Component: LoginForm },
  { path: "/", Component: FindGameScreen }
])