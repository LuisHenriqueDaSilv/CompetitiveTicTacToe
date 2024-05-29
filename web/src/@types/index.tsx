import {AxiosPromise} from 'axios'
import {ReactNode} from 'react'

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
  getJwt: () => string | null,
  authenticated: boolean,
  fetchPlayerData: (token: string) => void,
  signup: (param: SignupParamInterface) => AxiosPromise,
  validateEmail: (param:ValidateParamInterface) => AxiosPromise,
  playerInfos: PlayerInterface|null
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
  x_player : playerInterface | null,
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
  result: "win"|"tie",
  winner: "x"|"o"|""
}