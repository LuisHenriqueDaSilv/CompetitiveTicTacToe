import AuthenticationForm from "../AuthenticationForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";

import { AuthenticationContext } from "../../contexts/authenticationContext";
import {AuthenticationFormHandle} from '../../@types'
import PasswordIcon from '../../assets/password.svg'

export default function ChangePasswordArea(){

  const navigate = useNavigate()
  const formRef = useRef<AuthenticationFormHandle>(null)

  const {changePassword} = useContext(AuthenticationContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [token, setToken] = useState<string>("")
  
  function changePasswordWithInjectedToken(){
    const newFormFields = {
      ...formRef.current?.data,
      validation_token: token
    }
    return changePassword(newFormFields);
  } 

  function handleSucessChangePassword(){
    alert("Senha atualizado com sucesso!")
    navigate("/login")
  }

  useEffect(() => {
    const searchParamsToken = searchParams.get("token")
    setToken(searchParamsToken || "")
    setSearchParams("")
  }, [])

  return (
    <AuthenticationForm 
      buttonLabel="Atualizar senha"
      description={`Para concluir a recuperação da sua conta, por favor, crie uma nova senha. A senha deve ser segura e fácil de lembrar. Após inserir e confirmar a nova senha, clique em "Atualizar Senha" para finalizar o processo.`}
      title="recuperação de conta"
      ref={formRef}
      footer={(<></>)}
      submitAction={changePasswordWithInjectedToken}
      sucessCallback={handleSucessChangePassword}
      inputs={[
        {
          icon: PasswordIcon,
          name: "new_password",
          placeHolder: "Sua nova senha",
          type: "password"
        }
      ]}
    />
  )

}