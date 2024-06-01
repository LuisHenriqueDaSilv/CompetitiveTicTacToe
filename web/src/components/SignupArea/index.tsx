import { FormEvent, useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import { GameContext } from '../../contexts/gameContext'
import { AuthenticationContext } from '../../contexts/authenticationContext'
import EmailIcon from '../../assets/email.svg'
import PasswordIcon from '../../assets/password.svg'
import UserIcon from '../../assets/user.svg'
import LoadingSpinner from '../LoadingSpinner'
import styles from './styles.module.scss'

export default function SignupArea() {

  const navigate = useNavigate()
  const { signup } = useContext(AuthenticationContext)
  const { gamemode } = useContext(GameContext)

  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string | null>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function handleSignupFormSubmit(event: FormEvent) {
    event.preventDefault()

    setError(null)
    setIsLoading(true)

    if (!username || !email || !username) setError("preencha todos os campos para criar seu perfil")

    signup({ email, password, username }).then(() => {
      setIsLoading(false)
      navigate("/validar", { state: { email } })
    }).catch((error) => {
      setIsLoading(false)
      if (error.response && error.response.status == 400) {
        if (error.response.data.detail == "já existe um processo de validação com este email, verifique sua caixa de entrada") {
          navigate("/validar", { state: { email } })
          return
        }
        setError(error.response.data.detail)
        return
      }
      setError("algo de inesperado ocorreu, tente novamente mais tarde")
    })
  }

  if (gamemode == "algoritmo") return navigate("/encontrar-partida")

  return (
    <div className={styles.container}>
      <p>registre-se para jogar e competir contra outros jogadores!</p>
      {
        error ? (<p className={styles.errorMessage}>{error}</p>) : null
      }
      <form onSubmit={handleSignupFormSubmit}>
        <div>
          <input
            maxLength={10}
            required
            //@ts-ignore
            onInput={(event) => { setUsername(event.target.value) }}
            value={username}
          />
          <img src={UserIcon} />
          <span>Por qual nome deseja ser chamado?</span>
          <p>este sera o nome mostrado em suas partidas e rank’s</p>
        </div>
        <div>
          <input
            required
            //@ts-ignore
            onInput={(event) => { setEmail(event.target.value) }}
            value={email}
          />
          <img src={EmailIcon} />
          <span> Qual é o seu email?</span>
          <p> este sera o email utilizado para entrar em seu perfil nos próximos acessos</p>
        </div>
        <div>
          <input
            maxLength={50}
            required
            type='password'
            //@ts-ignore
            onInput={(event) => { setPassword(event.target.value) }}
            value={password}
          />
          <img src={PasswordIcon} />
          <span>Crie uma senha</span>
        </div>
        <button disabled={isLoading} type="submit">
          {isLoading ? (<LoadingSpinner />) : (<>registrar-se</>)}
        </button>
      </form>
      <p> ou já tem uma conta? <a href="/login">Clique aqui</a></p>
    </div>
  )
}