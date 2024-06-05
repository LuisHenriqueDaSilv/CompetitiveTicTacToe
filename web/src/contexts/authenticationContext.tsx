import { ReactNode, createContext, useEffect, useState } from "react"
import { axiosClient } from "../services/axios"
import { useCookies } from 'react-cookie'
import boardRouter from './boardRouter'

import {
  AuthencationContextValuesInterface,
  requestChangePasswordParamInterface,
  LoginParamInterface,
  PlayerInterface,
  SignupParamInterface,
  ValidateParamInterface,
} from '../@types'

export const AuthenticationContext = createContext({} as AuthencationContextValuesInterface)
export function AuthenticationContextProvider({ children }: { children: ReactNode }) {

  const [cookies, setCookies] = useCookies()

  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [playerInfos, setPlayerInfos] = useState<PlayerInterface | null>(null)
  const [loadingAuthentication, setLoadingAuthentication] = useState<boolean>(false)

  function login(data: unknown) {
    const {email, password} = data as LoginParamInterface
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    return axiosClient.post("/autenticacao/login", formData)
  }

  function logout() {
    setCookies("authorization_token", "")
    setAuthenticated(false)
    setPlayerInfos(null)
    boardRouter.navigate("/")
  }

  function requestChangePassword(data:unknown){
    const hostname =  window.location.origin
    console.log(hostname)
    const {email} = data as requestChangePasswordParamInterface
    const formData = new FormData()
    formData.append("email", email)
    formData.append("redirect_url", `${hostname}/recuperar-acesso/nova-senha`)
    return axiosClient.post("/autenticacao/alterar-senha", formData)
  } 

  function saveJwt(token: string) {
    setCookies("authorization_token", token)
  }

  async function fetchPlayerData(token: string) {
    setLoadingAuthentication(true)
    await axiosClient.get("/autenticado/jogador", {
      headers: {
        Authorization: `bearer ${token}`
      }
    }).then((response) => {
      setPlayerInfos({
        games: 0,
        username: response.data.username,
        wins: 0
      })
      setAuthenticated(true)
    }).catch((error) => {
      if (error.response && error.response.status == 401) { logout() }
      setAuthenticated(false)
    })
    setLoadingAuthentication(false)

  }
  async function signup(values: unknown) {
    const { email, password, username } = values as SignupParamInterface
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

  useEffect(() => {
    const jwt = cookies["authorization_token"]
    if (!jwt) { return }
    fetchPlayerData(jwt)
  }, [])

  return (
    <AuthenticationContext.Provider
      value={{
        authenticated,
        login,
        logout,
        signup,
        validateEmail,
        fetchPlayerData,
        playerInfos,
        saveJwt,
        loadingAuthentication,
        requestChangePassword
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}