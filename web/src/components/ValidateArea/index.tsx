import { FormEvent, KeyboardEvent, useContext, useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useLocation, useNavigate } from "react-router"

import { AuthenticationContext } from "../../contexts/authenticationContext"
import LoadingSpinner from "../LoadingSpinner"
import styles from "./styles.module.scss"

export default function ValidateArea() {

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  const { validateEmail, fetchPlayerData, saveJwt, resendValidationCode } = useContext(AuthenticationContext)
  const { state } = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [email, setEmail] = useState<string>("")

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

  async function handleClickResendValidationCode(){
    setIsLoading(true)
    await resendValidationCode(state.email).then(() => {
      alert("A mensagem de validação foi reenviada para o seu e-mail. Por favor, verifique sua caixa de entrada e spam e siga as instruções para validar sua conta.")
    }).catch((error) => {
      setIsLoading(false)
      if (error.response && error.response.status == 400) {
        setError(error.response.data.detail)
        return
      }
      setError("algo de inesperado ocorreu, tente novamente mais tarde")
    })
    setIsLoading(false)
  }

  async function handleValidateFormSubmit(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    await validateEmail({
      code: validationCode.join(""),
      email: email
    }).then(async (response) => {
      const jwt = response.data.authentication.token
      await fetchPlayerData(jwt)
      saveJwt(jwt)
      navigate("/encontrar-partida")
    }).catch((error) => {
      if (error.response && error.response.status == 400) {
        setError(error.response.data.detail)
        return
      }
      setError("algo de inesperado ocorreu, tente novamente mais tarde")
    })

    setIsLoading(false)

  }

  useEffect(() => {
    const searchParamsCode = searchParams.get("code")
    const searchParamsEmail = searchParams.get("email")
    if(state) {
      setEmail(state.email)
    } else if (searchParamsEmail && searchParamsCode){
      setEmail(searchParamsEmail)
      setValidationCode(searchParamsCode.split(""))
      setSearchParams("")
    } else {
      navigate("/")
      return
    }

  }, [])


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
        Caso não encontre, clique <button onClick={handleClickResendValidationCode}><span>aqui</span></button> para reenviar o código de validação.
      </p>
      </div>
      <footer>
        Obrigado por se registrar no Jogo da Velha Competitivo! Esperamos que você aproveite seu tempo jogando com a gente e se divirta muito.
      </footer>
    </div>
  )
}