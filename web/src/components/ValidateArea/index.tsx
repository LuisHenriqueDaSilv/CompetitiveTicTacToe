import { FormEvent, KeyboardEvent, useContext, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router"

import { AuthenticationContext } from "../../contexts/authenticationContext"
import LoadingSpinner from "../LoadingSpinner"
import styles from "./styles.module.scss"

export default function ValidateArea() {

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  const { validateEmail, fetchPlayerData, saveJwt } = useContext(AuthenticationContext)
  const { state } = useLocation()
  const navigate = useNavigate()

  const [validationCode, setValidationCode] = useState<string[]>(["", "", "", ""])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    const inputValue = event.key
    const newCodeData = [...validationCode]
    const validKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    switch (event.key) {
      case "Backspace":
        if (validationCode[index] == "" && index > 0) {
          // @ts-ignore
          inputRefs[index - 1].current.focus()
        }
        newCodeData[index] = ""
        break
      case "ArrowLeft":
        // @ts-ignore
        if (index > 0) { inputRefs[index - 1].current.focus() }
        break;
      case "ArrowRight":
        // @ts-ignore
        if (index < 3) { inputRefs[index + 1].current.focus() }
        break
      default:
        if (validKeys.indexOf(inputValue) != -1) {
          newCodeData[index] = inputValue
          // @ts-ignore
          if (index < 3) { inputRefs[index + 1].current.focus() }
        }
    }
    setValidationCode(newCodeData)
  }

  async function handleValidateFormSubmit(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    validateEmail({
      code: validationCode.join(""),
      email: state.email
    }).then(async (response) => {
      const jwt = response.data.authentication.token
      await fetchPlayerData(jwt)
      saveJwt(jwt)
      setIsLoading(false)
      navigate("/encontrar-partida")

    }).catch((error) => {
      setIsLoading(false)
      if (error.response && error.response.status == 400) {
        setError(error.response.data.detail)
        return
      }
      setError("algo de inesperado ocorreu, tente novamente mais tarde")
    })
  }

  if (!state) {
    navigate("/")
    return
  }

  return (
    <div className={styles.container}>
      <h2>Só mais uma etapa!</h2>
      <p>
        Estamos empolgados em tê-lo conosco. Para garantir a segurança da sua conta e completar o seu registro, precisamos
        que você valide seu perfil inserindo o código de validação de 4 dígitos que foi enviado para o seu email.
      </p>
      {
        error ? (<p className={styles.errorMessage}>{error}</p>) : null
      }
      <form onSubmit={handleValidateFormSubmit}>
        <div>
          {
            validationCode.map((codeField, index) => {
              return (
                <input
                  className={styles.fakeInput}
                  onKeyDown={(event) => { handleKeyDown(event, index) }}
                  required
                  value={codeField}
                  ref={inputRefs[index]}
                />
              )
            })
          }
        </div>
        <button type="submit">
          {isLoading ? (<LoadingSpinner />) : <>validar</>}
        </button>
      </form>
      <div className={styles.resendCode}>
      <p>
        Se você não recebeu o email de validação, verifique sua pasta de spam ou lixo eletrônico. 
        Caso não encontre, clique <button><span>aqui</span></button> para reenviar o código de validação.
      </p>
      </div>
      <footer>
        Obrigado por se registrar no Jogo da Velha Competitivo! Esperamos que você aproveite seu tempo jogando com a gente e se divirta muito.
      </footer>
    </div>
  )
}