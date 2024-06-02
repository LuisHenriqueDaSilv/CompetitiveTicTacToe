import { useContext } from "react";
import { useNavigate } from "react-router";

import AuthenticationForm from "../AuthenticationForm";
import { AuthenticationContext } from "../../contexts/authenticationContext";
import styles from './styles.module.scss'

import EmailIcon from '../../assets/email.svg'
import PasswordIcon from '../../assets/password.svg'

export default function LoginArea(){
  const navigate = useNavigate()

  const {login} = useContext(AuthenticationContext)
  return (
    <AuthenticationForm
      buttonLabel="entrar"
      footer={
        <p className={styles.formFooter}> ou já tem uma conta? <button onClick={() => { navigate("/criar-conta") }}>Clique aqui</button></p>
      }
      submitAction={login}
      sucessCallback={() => {alert("Sucesso")}}
      title="Bem vindo de volta!"
      inputs={[
        {
          footer: <p className={styles.inputFooter}>este deve ser o mesmo email utilizado no momento de registro do perfil</p>,
          icon: EmailIcon,
          name: "email",
          placeHolder: "email",
          maxLength: 320
        },
        {
          footer: <p className={styles.inputFooter}><button>esqueceu sua senha?</button></p>,
          icon: PasswordIcon,
          name: "password",
          placeHolder: "senha",
          maxLength: 10
        },
      ]}
    />
  )
}