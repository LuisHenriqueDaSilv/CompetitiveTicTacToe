import { useContext, useRef } from 'react'
import { useNavigate } from 'react-router'

import { GameContext } from '../../contexts/gameContext'
import { AuthenticationContext } from '../../contexts/authenticationContext'
import { AuthenticationFormHandle } from '../../@types'
import AuthenticationForm from '../AuthenticationForm'
import StyledFooter from '../StyledFooter'

import EmailIcon from '../../assets/email.svg'
import PasswordIcon from '../../assets/password.svg'
import UserIcon from '../../assets/user.svg'

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
      title="Bem-vindo ao Jogo da Velha Competitivo!"
      description="Estamos entusiasmados em tê-lo conosco. Crie sua conta para começar a desafiar outros jogadores e mostrar suas habilidades no clássico jogo da velha."
      buttonLabel='registre-se'
      footer={
        <StyledFooter className="formFooter"> Se você já possui uma conta 
        clique  <button onClick={() => { navigate("/login") }}>aqui</button> aqui para fazer login.</StyledFooter>
      }
      inputs={[
        {
          footer: <StyledFooter className="inputFooter">este sera o nome mostrado em suas partidas e rankings</StyledFooter>,
          icon: UserIcon,
          name: "username",
          placeHolder: "por qual nome deseja ser chamado?",
          maxLength: 10
        },
        {
          footer: <StyledFooter className="inputFooter">este sera o email utilizado para entrar em seu perfil nos próximos acessos</StyledFooter>,
          icon: EmailIcon,
          name: "email",
          placeHolder: "qual é o seu email?",
          maxLength: 320
        },
        {
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