import { useContext, useRef } from 'react'
import { useNavigate } from 'react-router'

import AuthenticationForm from '../AuthenticationForm'
import StyledFooter from '../StyledFooter'
import { AuthenticationContext } from '../../contexts/authenticationContext'
import {AuthenticationFormHandle} from '../../@types'

import EmailIcon from '../../assets/email.svg'

export default function RequestChangePasswordArea() {

  const formRef = useRef<AuthenticationFormHandle>(null)
  const navigate = useNavigate()
  const { requestChangePassword } = useContext(AuthenticationContext)

  function handleSucessRequestPassword(){
    alert(`Um email com instruções para redefinir sua senha foi enviado para ${formRef.current?.data.email}. Por favor, verifique sua caixa de entrada e pasta de spam e prossiga com a recuperação por lá.`)
    navigate("/encontrar-partida")
  }

  return (
    <AuthenticationForm
      title='Recuperação de Senha'
      description='Esqueceu sua senha? Não se preocupe, estamos aqui para ajudar você a recuperar o acesso à sua conta.'
      buttonLabel='recuperar acesso'
      submitAction={requestChangePassword}
      sucessCallback={handleSucessRequestPassword}
      ref={formRef}
      footer={
        <StyledFooter className='formFooter'>
          alguns minutos após a solicitação você receberá um email nosso com um link para redefinir sua senha.
        </StyledFooter>
      }
      inputs={[
        {
          footer: (<StyledFooter className='inputFooter'>
            você receberá um email com um link para redefinir sua senha nele.
          </StyledFooter>),
          icon: EmailIcon,
          name: "email",
          placeHolder: "email vinculado ao seu perfil",
          maxLength: 350
        }
      ]}
    />
  )
}