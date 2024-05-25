import EmailIcon from '../../assets/email.svg'
import PasswordIcon from '../../assets/password.svg'
import UserIcon from '../../assets/user.svg'

import styles from './styles.module.scss'

export default function AuthenticationArea() {
  return (
    <div className={styles.container}>

      <p>registre-se para jogar e competir contra outros jogadores!</p>
      <form>
        <div>
          <input required></input>
          <img src={UserIcon} />
          <span>Por qual nome deseja ser chamado?</span>
          <p>este sera o nome mostrado em suas partidas e rank’s</p>
        </div>
        <div>
          <input required></input>
          <img src={EmailIcon} />
          <span> Qual é o seu email?</span>
          <p> este sera o email utilizado para entrar em seu perfil nos seus próximos acessos</p>
        </div>
        <div>
          <input required></input>
          <img src={PasswordIcon} />
          <span>Crie uma senha</span>
        </div>

        <button>
          registrar-se
        </button>
      </form>
      <p> ou já tem uma conta? <a href="/login">Clique aqui</a></p>
    </div>
  )
}