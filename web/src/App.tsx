import MedalIcon from './assets/medal.svg'
import TrophyIcon from './assets/trophy.svg'
import ExitIcon from './assets/exit.svg'
import EditIcon from './assets/edit.svg'
import PlayIcon from './assets/play.svg'
// import  from './assets/.svg'

import styles from './styles/appStyles.module.scss'


export default function App(){

  const gameData = ['x','0',' ',' ',' ',' ',' ',' ',' ',]

  return (
    <div className={styles.appWrapper}>
      <div className={styles.appContainer}>
        <div className={styles.board}>

          <header className={styles.boardHeader}>
            <h1>Jogo da velha</h1>
          </header>

          <div className={styles.gameContainer}>

            <aside className={styles.playersInfosContainer}>
              <section className={styles.playerInfos}>
                <p>xxxxxxxxxx</p>
                <div>
                  <p>xx</p>
                  <img src={MedalIcon}/>
                </div>
              </section>
              <span>VS</span>
              <section className={styles.playerInfos}>
                <p>xxxxxxxxxx</p>
                <div>
                  <p>xx</p>
                  <img src={MedalIcon}/>
                </div>
              </section>
            </aside>

            <div className={styles.game}>
              {
                gameData.map((field, index) => {
                  const firstColumnIndex = [0, 3, 6]
                  const lastColumnIndex = [2, 5, 8]
                  const firstRowIndex = [0, 1, 2]
                  const lastRowIndex = [6, 7, 8]
                  return (
                    <button 
                      className={`
                        ${firstRowIndex.includes(index)? styles.firstRowButton:""}
                        ${lastColumnIndex.includes(index)? styles.lastColumnButton:""}
                        ${lastRowIndex.includes(index)? styles.lastRowButton:""}
                        ${firstColumnIndex.includes(index)? styles.firstColumnButton:""}
                      `}
                    >
                      {field != ' '? (
                        <img src={field == 'x'? "/cross.png":"/circle.png"}/>
                      ): null}
                    </button>
                  )
                })
              }

            </div>

          </div>
        </div>

        <aside className={styles.menu}>
          <section className={styles.gameModeSection}>
            <h1>modo de jogo</h1>
            <button>
              multijogador
            </button>
            <button id={styles.selectedModeButton}>
              algoritmo
            </button>
          </section>

          <section className={styles.rankingsSection}>
            <h1>ranking</h1>
            <div className={styles.rankings}>
              {(() => {
                const components = []
                for(let i=0; i<10; i++){
                  components.push(
                    <div key={i} className={styles.ranking}>
                      <p>{i+1}°</p>
                      <p>xxxxxxx</p>
                      <div>
                        <p>99999</p>
                        <img src={TrophyIcon}/>
                      </div>
                    </div>
                  )
                }
                return components
              })()}
            </div>
          </section>

          <section className={styles.userSection}>
            <div className={styles.userName}>
              <h1>LuisSilva</h1>
              <button>
                <img src={EditIcon} alt="editar"/>
              </button> 
              <button>
                <img src={ExitIcon} alt="sair"/>
              </button> 
            </div>

            <div className={styles.info}> 
              <img src={TrophyIcon}/>
              <p>vitórias multiplayer</p>
              <span>15</span>
            </div>
            <div className={styles.info}> 
              <img src={PlayIcon}/>
              <p>partidas multiplayer</p>
              <span>15</span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

// import MedalIcon from './assets/medal.svg'
// import TrophyIcon from './assets/trophy.svg'
// import ExitIcon from './assets/exit.svg'
// import EditIcon from './assets/edit.svg'
// import PlayIcon from './assets/play.svg'


// import './styles/global.css'
// import styles from './styles/appStyles.module.scss'

// export default function App() {
//   const gameBoard = [
//     ' ', ' ', ' ',
//     'O', 'X', ' ',
//     ' ', ' ', ' '
//   ]

//   return (
//     <div className={styles.appWrapper}>

//       <main className={styles.appContainer}>

//         <main className={styles.board}>

//           <header>
//             <h1>Jogo da velha</h1>
//           </header>

//           <div className={styles.gameBoard}>

//             <aside className={styles.playersContainer}>
//               <section className={styles.player}>
//                 <h1 className={styles.playerName}>xxxxxxxxxxx</h1>
//                 <div className={styles.playerWins}>
//                   <h1>xxxx</h1>
//                   <img src={MedalIcon} alt="vitórias" />
//                 </div>
//               </section>

//               <label>VS</label>

//               <section className={styles.player}>
//                 <h1 className={styles.playerName}>xxxxxxxxxxx</h1>
//                 <div className={styles.playerWins}>
//                   <h1>xxxx</h1>
//                   <img src={MedalIcon} alt="vitórias" />
//                 </div>
//               </section>
//             </aside>
              

//             <div className={styles.game}>
//               {
//                 gameBoard.map((field, index) => {
//                   return (
//                     <button
//                       key={index}
//                       className={
//                         `
//                     ${index < 3 ? styles.firstRowButtonButtons : index > 5 ? styles.lastRowButtonButtons : ""}
//                     ${index % 3 == 0 ? styles.firstColumnButtonButtons : [2, 5, 8].includes(index) ? styles.lastColumnButtonButtons : ""}
//                     `
//                       }
//                     >
//                       {
//                         field != ' ' ? (<img src={field == 'X' ? "/cross.png" : "/circle.png"} />) : null
//                       }
//                     </button>
//                   )
//                 })
//               }
//             </div>
//           </div>

//         </main>

//         <aside className={styles.menu}>
//           <section className={styles.gameModeSelector}>
//             <h1>modo de jogo</h1>
//             <button>multiplayer</button>
//             <button id={styles.currentOptionButton}>contra algoritmo</button>
//           </section>

//           <section className={styles.rankingWrapper}>
//             <h1>ranking</h1>
//             <div className={styles.rankingsContainer}>
//               {(() => {
//                 const elements = [] as any
//                 for (let i = 0; i <= 10; i++) {
//                   elements.push(
//                     <div className={styles.ranking}>
//                       <div className={styles.userInfos}>
//                         <label>{i}°</label>
//                         <p>xxxxxxx</p>
//                       </div>
//                       <div>
//                         <h1>999</h1>
//                         <img src={TrophyIcon} alt="Vitórias" />
//                       </div>
//                     </div>
//                   )
//                 }
//                 return elements;
//               })()}
//             </div>
//             <button>ver mais</button>
//           </section>

//           <section className={styles.userContainer}>
//             <header>
//               <h1>LuisSilva</h1>
//               <button>
//                 <img src={EditIcon} alt="editar" />
//                 <label>editar</label>
//               </button>
//               <button>
//                 <img src={ExitIcon} alt="sair" />
//                 <label>sair</label>
//               </button>
//             </header>

//             <div className={styles.userInfosContainer}>
//               <div className={styles.userInfo}>
//                 <img src={TrophyIcon} alt="Vitórias" />
//                 <p>vitórias online</p>
//                 <span>15</span>
//               </div>
//               <div className={styles.userInfo}>
//                 <img src={PlayIcon} alt="partidas" />
//                 <p>partidas online</p>
//                 <span>15</span>
//               </div>
//             </div>
//           </section>

//         </aside>

//       </main>
//     </div>
//   )
// }