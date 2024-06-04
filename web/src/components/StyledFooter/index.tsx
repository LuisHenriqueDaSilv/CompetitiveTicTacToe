
import "./styles.scss"

import { StyledFooterProps } from '../../@types'

/**
* Apenas um componente para evitar repetição de código de estilização do footer dos formulários de autenticação
*/
export default function FormFooter({
  className,
  children,
}: StyledFooterProps) {
  return <p className={className}>
    {children}
  </p>
}