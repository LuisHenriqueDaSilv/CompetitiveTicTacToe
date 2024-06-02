import { FormEvent, useImperativeHandle, useState, forwardRef } from "react";
import { FormPropsInterface, AuthenticationFormHandle } from "../../@types"
import LoadingSpinner from "../LoadingSpinner";
import styles from './styles.module.scss'

export default forwardRef<AuthenticationFormHandle, FormPropsInterface>((props, ref) => {

  useImperativeHandle(ref, () => ({ data: inputsValues }))

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [inputsValues, setInputsValues] = useState<{ [key: string]: string; }>({})

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    await props.submitAction(inputsValues)
      .then(props.sucessCallback)
      .catch((error:any) => {
        if (error.response && error.response.status == 400) {
          setError(error.response.data.detail)
          return
        }
        setError("algo de inesperado ocorreu, tente novamente mais tarde")
      })
    setIsLoading(false)
  }

  function handleInput(name: string, event: FormEvent<HTMLInputElement>) {
    const newinputsValues = { ...inputsValues }
    newinputsValues[name] = (event.target as HTMLTextAreaElement).value
    setInputsValues(newinputsValues)
  }

  return (
    <div className={styles.container}>
      <p>{props.title}</p>
      {error ? (<p className={styles.errorMessage}>{error}</p>) : null}
      <form onSubmit={handleFormSubmit}>
        {props.inputs.map((field, index) => {
          return (
            <div key={index}>
              <input
                maxLength={field.maxLength}
                type={field.type}
                required
                onInput={(data) => { handleInput(field.name, data) }}
                value={inputsValues[field.name]}
              />
              <img src={field.icon} />
              <span>{field.placeHolder}</span>
              {field.footer}
            </div>
          )
        })}
        <button className={styles.submitButton} disabled={isLoading} type="submit">
          {isLoading ? (<LoadingSpinner />) : (<>{props.buttonLabel}</>)}
        </button>
      </form>
      {props.footer}
    </div>
  )

})