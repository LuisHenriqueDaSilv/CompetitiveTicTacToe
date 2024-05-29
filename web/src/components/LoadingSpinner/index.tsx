import LoadingIcon from  "../../assets/loading.svg"

import styles from './styles.module.scss'

export default function LoadingSpinner(){
  return (
    <img className={styles.loadingImage} src={LoadingIcon} alt="carregando"/>
  )
}