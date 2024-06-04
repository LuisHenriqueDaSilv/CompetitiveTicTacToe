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

  async function handleSucessLogin(response: HandleSucessLoginInterface) {
    const jwtToken = response.data.token
    saveJwt(jwtToken)
    await fetchPlayerData(jwtToken)
    navigate("/encontrar-partida")
  }
  return (
    <AuthenticationForm
      title="Bem-vindo de volta ao Jogo da Velha Competitivo!"
      description="Faça login na sua conta para continuar desafiando outros jogadores e aprimorar suas habilidades no clássico jogo da velha.      "
      buttonLabel="entrar"
      footer={
        <p className={styles.formFooter}>
          Se você ainda não tem uma conta,<br />
          clique <button onClick={() => { navigate("/criar-conta") }}>aqui</button> para se registrar e comece a jogar!
        </p>
      }
      submitAction={login}
      sucessCallback={handleSucessLogin}
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
          type: "password",
          name: "password",
          placeHolder: "senha",
          maxLength: 10
        },
      ]}
    />
  )
}