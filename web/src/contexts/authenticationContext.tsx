import { ReactNode, createContext, useState } from "react"
import { axiosClient } from "../services/axios"
import { AxiosPromise } from "axios"
import boardRouter from './boardRouter'

interface SignupParamInterface {
  username: string,
  email: string,
  password: string
}
interface ValidateParamInterface {
  email: string,
  code: string
}
interface AuthencationContextValuesInterface {
  login: () => void,
  logout: () => void,
  getJwt: () => string | null,
  authenticated: boolean,
  fetchPlayerData: (token: string) => void,
  signup: (param: SignupParamInterface) => AxiosPromise,
  validateEmail: (param:ValidateParamInterface) => AxiosPromise
}

interface PlayerInterface {
  username: string,
  wins: number,
  games: number
}


export const AuthenticationContext = createContext({} as AuthencationContextValuesInterface)

export function AuthenticationContextProvider({children}: {children:ReactNode}) {

  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [userInfos, setUserinfos] = useState<PlayerInterface>()

  function login() {
  }

  function logout() {
  }

  async function fetchPlayerData(token:string){
    axiosClient.get("/autenticado/jogador", {headers: {
      Authorization: `bearer ${token}`
    }}).then((response) => {
      setAuthenticated(true)
      setUserinfos({
        games: 0,
        username: response.data.username,
        wins: 0
      })
      console.log(response)
    }).catch((error) => {
      if(error.response && error.response.status == 401){
        boardRouter.navigate("/criar-conta")
      }
      alert('Erro de autenticação')
    })
  }

  async function signup({email, password, username}:SignupParamInterface) {
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    formData.append("username", username)
    return axiosClient.post("/autenticacao/registro", formData)
  }

  async function validateEmail({email, code}:ValidateParamInterface){
    const formData = new FormData()
    formData.append("email", email)
    formData.append("code", code)
    return axiosClient.post("/autenticacao/validar", formData)
  }

  function getJwt() {
    return null
  }


  return (
    <AuthenticationContext.Provider value={{
      authenticated,
      getJwt,
      login,
      logout,
      signup,
      validateEmail,
      fetchPlayerData
    }}>
      {children}
    </AuthenticationContext.Provider>
  )
}