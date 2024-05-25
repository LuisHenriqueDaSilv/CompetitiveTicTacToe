import { createContext, useEffect, useState } from "react"

interface authencationContextValues {
  login: () => void,
  logout: () => void
  getJwt: () => string | null,
  authenticated: boolean
}

export const AuthenticationContext = createContext({

} as authencationContextValues)

export function AuthenticationContextProvider(){

  const [authenticated, setAuthenticated] = useState<boolean>(false)

  
  function login(){
    
  }
  
  function logout(){
    
  }
  
  function getJwt(){
    return null
  }

  useEffect(() => {

  }, [])

  return (
    <AuthenticationContext.Provider value={{
      authenticated,
      getJwt,
      login,
      logout,
    }}>

    </AuthenticationContext.Provider>
  )
}