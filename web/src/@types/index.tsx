import { AxiosPromise, AxiosResponse } from 'axios'
import { ReactNode } from 'react'

export interface SignupParamInterface {
  username: string,
  email: string,
  password: string
}

export interface LoginParamInterface {
  email: string,
  password: string
}
export interface ValidateParamInterface {
  email: string,
  code: string
}

export interface requestChangePasswordParamInterface{
  email: string
}

export interface ChangePasswordParamInterface {
  new_password: string,
  validation_token: string
}

export interface AuthencationContextValuesInterface {
  login: (param: unknown) => AxiosPromise,
  logout: () => void,
  authenticated: boolean,
  fetchPlayerData: (token: string) => void,
  signup: (param: unknown) => AxiosPromise,
  validateEmail: (param: ValidateParamInterface) => AxiosPromise,
  playerInfos: PlayerInterface | null,
  saveJwt: (token: string) => void,
  loadingAuthentication: boolean,
  requestChangePassword: (param: unknown) => AxiosPromise,
  resendValidationCode: (email: string) => AxiosPromise,
  changePassword: (param: unknown) => AxiosPromise,
  getJwt: () => String
}

export interface PlayerInterface {
  username: string,
  wins: number,
  games: number
}

export interface gameContextProviderParamsInterface {
  children: ReactNode
}
export interface gameContextProviderValuesInterface {
  inGame: boolean,
  setGamemode: (mode: "multiplayer" | "algoritmo") => void,
  gamemode: "multiplayer" | "algoritmo",
  gamedata: string[],
  findGame: () => void,
  submitMove: (GameId: number) => void,
  isMyTurn: boolean,
  isFindingGame: boolean,
  game: gameInterface|null
}
export interface playerInterface {
  type: "player" | "algorithm",
  id: number | null,
  username: string | null
}
export interface gameInterface {
  data:string,
  infos: {
    mode:"multiplayer" | "algoritmo",
    result: false | "tie" | "win" | "giveup",
    winner: null|"x"|"o"
    id:string,
    current: "x" | "o",
    o_player: {
      username: String|null,
      id: number|null
    },
    x_player: {
      username: String|null,
      id: number|null
    }
  }
}

export interface FormPropsInterface {
  title: string,
  buttonLabel: string,
  description: string,
  inputs: {
    name: string,
    type?: string,
    placeHolder: string,
    icon: string,
    footer?: JSX.Element,
    maxLength?: number
  }[]
  footer: JSX.Element,
  submitAction: (datas: { [key: string]: string }) => AxiosPromise,
  sucessCallback: (props: AxiosResponse) => void
}

export interface AuthenticationFormHandle {
  data: { [key: string]: string }
};

export interface HandleSucessLoginInterface extends AxiosResponse {
  data: {
    token: string,
    exp: string
  }
}

export interface StyledFooterProps {
  className: "inputFooter"|"formFooter",
  children: ReactNode
}