import { ReactNode, createContext, useState } from "react"
import { axiosClient } from "../services/axios"
import boardRouter from './boardRouter'

import {
  AuthencationContextValuesInterface,
  PlayerInterface,
  SignupParamInterface,
  ValidateParamInterface
} from '../@types'

export const AuthenticationContext = createContext({} as AuthencationContextValuesInterface)
export function AuthenticationContextProvider({ children }: { children: ReactNode }) {

  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [playerInfos, setUserinfos] = useState<PlayerInterface | null>(null)

  function login() {
  }

  function logout() {
  }

  async function fetchPlayerData(token: string) {
    axiosClient.get("/autenticado/jogador", {
      headers: {
        Authorization: `bearer ${token}`
      }
    }).then((response) => {
      setAuthenticated(true)
      setUserinfos({
        games: 0,
        username: response.data.username,
        wins: 0
      })
    }).catch((error) => {
      if (error.response && error.response.status == 401) {
        boardRouter.navigate("/criar-conta")
      }
      setAuthenticated(false)
    })
  }
  async function signup({ email, password, username }: SignupParamInterface) {
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    formData.append("username", username)
    return axiosClient.post("/autenticacao/registro", formData)
  }
  async function validateEmail({ email, code }: ValidateParamInterface) {
    const formData = new FormData()
    formData.append("email", email)
    formData.append("code", code)
    return axiosClient.post("/autenticacao/validar", formData)
  }

  function getJwt() {
    return null
  }

  return (
    <AuthenticationContext.Provider
      value={{
        authenticated,
        getJwt,
        login,
        logout,
        signup,
        validateEmail,
        fetchPlayerData,
        playerInfos
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}