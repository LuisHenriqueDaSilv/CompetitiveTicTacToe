import { useContext } from "react";
import { useNavigate } from "react-router";

import AuthenticationForm from "../AuthenticationForm";
import { AuthenticationContext } from "../../contexts/authenticationContext";
import { HandleSucessLoginInterface } from "../../@types";

import styles from './styles.module.scss'

import EmailIcon from '../../assets/email.svg'
import PasswordIcon from '../../assets/password.svg'

export default function LoginArea() {
  const navigate = useNavigate()

  const { login, fetchPlayerData, saveJwt } = useContext(AuthenticationContext)

  async function handleSucessLogin(response:HandleSucessLoginInterface){
    const jwtToken = response.data.token
    saveJwt(jwtToken)
    await fetchPlayerData(jwtToken)
    navigate("/encontrar-partida")
  }
  return (
    <AuthenticationForm
      buttonLabel="entrar"
      footer={
        <p className={styles.formFooter}> ainda não tem uma conta? <button onClick={() => { navigate("/criar-conta") }}>registre-se</button></p>
      }
      submitAction={login}
      sucessCallback={handleSucessLogin}
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
          type:"password",
          name: "password",
          placeHolder: "senha",
          maxLength: 10
        },
      ]}
    />
  )
}