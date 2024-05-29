import { FormEvent, KeyboardEvent, useContext, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router"

import styles from './styles.module.scss'
import { AuthenticationContext } from "../../contexts/authenticationContext"
import LoadingSpinner from "../LoadingSpinner"

export default function ValidateArea() {

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  const { validateEmail, fetchPlayerData } = useContext(AuthenticationContext)
  const { state } = useLocation()
  const navigate = useNavigate()

  const [validationCode, setValidationCode] = useState<string[]>(["", "", "", ""])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    const inputValue = event.key
    const newCodeData = [...validationCode]
    const validKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    if (event.key == "Backspace") {
      newCodeData[index] = ""
      if (index > 0) {
        // @ts-ignore
        inputRefs[index - 1].current.focus()
      }
    } else {
      if (validKeys.indexOf(inputValue) != -1) {
        newCodeData[index] = inputValue
        if (index < 3) {
          // @ts-ignore
          inputRefs[index + 1].current.focus()
        }
      }
    }
    setValidationCode(newCodeData)
  }

  async function handleValidateFormSubmit(event: FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    validateEmail({ code: validationCode.join(""), email: state.email }).then(async (response) => {
      alert("Seja bem vindo, agora você pode jogar normalmente!")
      console.log(response.data.authentication.token)
      await fetchPlayerData(response.data.authentication.token)
      setIsLoading(false)
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
    alert("Erro de validação")
    navigate("/")
    return
  }
  return (
    <div className={styles.container}>
      <h2>Só mais uma etapa!</h2>
      <p>antes de iniciar os jogos é necessário validar que o email informado é realmente seu! para isso, verifique sua caixa de entrada de email e informe o código de segurança enviado (Lembre-se de chegar a caixa de spam)</p>
      {
        error ? (<p className={styles.errorMessage}>{error}</p>) : null
      }
      <form onSubmit={handleValidateFormSubmit}>
        <div>
          {
            validationCode.map((codeField, index) => {
              return (
                <input
                  onKeyDown={(event) => { handleKeyDown(event, index) }}
                  required={true}
                  value={codeField}
                  ref={inputRefs[index]}
                />
              )
            })
          }
        </div>
        <button type="submit">
          {isLoading? (<LoadingSpinner/>):<>validar</>}
        </button>
      </form>
      <button>não recebeu o código? <span>reenviar</span></button>
    </div>
  )
}