import { useContext, useRef } from 'react'
import { useNavigate } from 'react-router'
import { GameContext } from '../../contexts/gameContext'
import { AuthenticationContext } from '../../contexts/authenticationContext'
import { AuthenticationFormHandle } from '../../@types'
import AuthenticationForm from '../AuthenticationForm'

import EmailIcon from '../../assets/email.svg'
import PasswordIcon from '../../assets/password.svg'
import UserIcon from '../../assets/user.svg'
import styles from './styles.module.scss'

export default function SignupArea() {

  const navigate = useNavigate()
  const { signup } = useContext(AuthenticationContext)
  const { gamemode } = useContext(GameContext)

  const formRef = useRef<AuthenticationFormHandle>(null)

  if (gamemode == "algoritmo") {
    navigate("/encontrar-partida")
    return
  }

  return (
    <AuthenticationForm
      title="registre-se para jogar e competir contra outros jogadores!"
      buttonLabel='registre-se'
      footer={
        <p className={styles.formFooter}> ou já tem uma conta? <button onClick={() => { navigate("/login") }}>Clique aqui</button></p>
      }
      inputs={[
        {
          footer: <p className={styles.inputFooter}>este sera o nome mostrado em suas partidas e rankings</p>,
          icon: UserIcon,
          name: "username",
          placeHolder: "por qual nome deseja ser chamado?",
          maxLength: 10
        },
        {
          footer: <p className={styles.inputFooter}>este sera o email utilizado para entrar em seu perfil nos próximos acessos</p>,
          icon: EmailIcon,
          name: "email",
          placeHolder: "qual é o seu email?",
          maxLength: 320
        },
        {
          footer: <p className={styles.inputFooter}><button>esqueceu sua senha?</button></p>,
          icon: PasswordIcon,
          name: "password",
          type: "password",
          placeHolder: "digite uma senha para proteger seu perfil",
          maxLength: 50
        },
      ]}
      submitAction={signup}
      ref={formRef}
      sucessCallback={() => { navigate("/validar", { state: { email: formRef.current?.data.email } }) }}
    />
  )
}