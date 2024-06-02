import { AxiosPromise, AxiosResponse } from 'axios'
import { ReactNode } from 'react'
import { FormProps } from 'react-router-dom'

export interface SignupParamInterface {
  username: string,
  email: string,
  password: string
}
export interface ValidateParamInterface {
  email: string,
  code: string
}
export interface AuthencationContextValuesInterface {
  login: () => void,
  logout: () => void,
  authenticated: boolean,
  fetchPlayerData: (token: string) => void,
  signup: (param: unknown) => AxiosPromise,
  validateEmail: (param: ValidateParamInterface) => AxiosPromise,
  playerInfos: PlayerInterface | null,
  saveJwt: (token: string) => void,
  loadingAuthentication: boolean
}

export interface PlayerInterface {
  username: string,
  wins: number,
  games: number
}

export interface socketContextProviderParamsInterface {
  children: ReactNode
}
export interface socketContextProviderValuesInterface {
  inGame: boolean,
  setGamemode: (mode: "multiplayer" | "algoritmo") => void,
  gamemode: "multiplayer" | "algoritmo",
  gamedata: string[],
  findGame: () => void,
  submitMove: (GameId: number) => void,
  isMyTurn: boolean
}
export interface playerInterface {
  type: "player" | "algorithm",
  id: number | null,
  username: string | null
}
export interface gameInfosInterface {
  mode: "multiplayer" | "algoritmo",
  o_player: playerInterface | null,
  x_player: playerInterface | null,
  id: string,
  current: "x" | "o",
}
export interface newGameDataInterface {
  data: "",
  gameInfos: gameInfosInterface
}
export interface newMoveDataInterface {
  new_data: ""
}
export interface endGameEventInterface {
  result: "win" | "tie",
  winner: "x" | "o" | ""
}

export interface FormPropsInterface extends FormProps {
  title: string,
  buttonLabel: string,
  inputs: {
    name: string,
    type?: string,
    placeHolder: string,
    icon: string,
    footer: JSX.Element,
    maxLength?: number
  }[]
  footer: JSX.Element,
  submitAction: (datas: { [key: string]: string }) => AxiosPromise,
  sucessCallback: (props: AxiosResponse) => void
}

export interface AuthenticationFormHandle {
  data: { [key: string]: string };
};