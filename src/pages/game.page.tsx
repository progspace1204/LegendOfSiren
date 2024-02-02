import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { setGameStatus } from '../common/state/game/reducer'
import { ButtonComponent } from '../components/button.component'
import { GameHeaderComponent } from '../components/game-header.component'
import { useWeb3Context } from '../hooks/web3Context'
import { global } from '../common/global'
import store from '../store'
import InforModal from '../components/Header/InforModal'
import { getResources } from '../store/user/actions'
import { onShowAlert } from '../store/utiles/actions'
interface HeaderProps {
  showAccount: any
  setShowAccount: Function
  onStart: any
  onAttack: any
  onInventory: any
  onCharacter: any
}
export const GamePage = ({ showAccount, setShowAccount, onStart, onAttack, onInventory, onCharacter }: HeaderProps) => {
  // const battle = phaserGame.scene.keys.battle as Battle
  // const game = phaserGame.scene.keys.game as Game
  // const { onStart, onAttack, onInventory, onCharacter } = props

  const gameState = useSelector((state: any) => state.app.game.gameState)
  const turn = useSelector((state: any) => state.app.game.turn)
  const secondTurn = useSelector((state: any) => state.app.game.secondTurn)
  const thirdTurn = useSelector((state: any) => state.app.game.thirdTurn)

  const inventoryOpened = useSelector(
    (state: any) => state.app.game.inventoryOpened,
  )
  const characterOpened = useSelector(
    (state: any) => state.app.game.characterOpened,
  )
  const location = useLocation()
  const ref = new URLSearchParams(location.search).get('ref')  
  global.ref = (`${ref?.toString()}`)

  const start = () => {
    if (!connected) {      
      return;
    }
    if (global.energy < 10) {
      alert('Your energy is less than 10. Please charge energy')
      return
    }
    store.dispatch(setGameStatus(1))
    onStart()
  }
  // const connectWallet = () => {}
  const normalAttack = () => {
    if (!connected) {
      return;
    }
    onAttack(1)
  }
  const secondAttack = () => {
    if (!connected) {
      return;
    }
    onAttack(2)
  }
  const thirdAttack = () => {
    if (!connected) {
      return;
    }
    onAttack(3)
  }
  const inventory = () => {
    if (!connected) {
      return;
    }
    onInventory()
  }

  const character = () => {
    if (!connected) {
      return;
    }
    onCharacter()
  }
  const dispatch = useDispatch<any>()
  // const [openAccount, setOpenAccount] = useState(showAccount)
  const [show, setShow] = useState(false)
  const handleOpenAccount = (flag: boolean) => {
    setShowAccount(false)
  }
  const { connected, chainID, address, connect } = useWeb3Context()
  useEffect(() => {
    if (connected && address !== '') {
      setShow(true)
      dispatch(
        getResources(address, ref, (res: any) => {
          if (!res.success) {
            dispatch(onShowAlert(res.message, 'info'))
          }
        }),
      )
    } else {
    }
  }, [chainID, connected, address])

  return (
    <div className="relative w-full">
      <div className="grid h-full">
        <div className="flex h-full flex-1 flex-col p-8 min-w-[1024px]">
        <InforModal
          openAccount={showAccount}
          setOpenAccount={handleOpenAccount}
        />

          {gameState === 0 && (
            <div className="d-flex flex h-full flex-1 flex-col justify-center">
              {!inventoryOpened && !characterOpened && (
                <div>
                  <div className="mb-4 text-white">
                    <h2 className="mb-4 text-6xl font-bold shadow-black drop-shadow-xl">
                      <span className="text-pink-500">Legends </span>
                      of Siren
                    </h2>
                    <h3 className="text-4xl min-w-[400]">
                      Digital P2E Game Platform
                    </h3>
                  </div>
                </div>
              )}
              {!inventoryOpened && !characterOpened && (
                <div className="btn-group">
                  <div className="btn-wrapper">
                    <ButtonComponent onClick={start}>PLAY PVE</ButtonComponent>
                  </div>
                  <div className="btn-wrapper">
                    <ButtonComponent onClick={start}>PLAY PVP</ButtonComponent>
                  </div>
                  <div className="btn-wrapper">
                    <ButtonComponent onClick={inventory}>INVENTORY</ButtonComponent>
                  </div>
                  <div className="btn-wrapper">
                    <ButtonComponent onClick={character}>CHARACTER</ButtonComponent>
                  </div>
                  <div className="btn-wrapper">
                    <Link to="/land" className="button muted-button">
                      <ButtonComponent>LAND</ButtonComponent>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
          {gameState === 1 && (
            <>
              <GameHeaderComponent />
              {!turn && (
                <div className="absolute bottom-0 right-0 gap-2 p-4">
                  {/* <AttackButton /> */}
                  <button onClick={() => {
                    if (thirdTurn === 0) {
                      thirdAttack()
                    }
                  }}
                  style={{
                    position: 'absolute',
                    right: '200px',
                    bottom: '50px',
                  }}>
                    <div className="w-[160px]">
                      {thirdTurn === 0 && (
                        <img src="assets/images/btn_attack_2.png" />
                      )}
                      {thirdTurn !== 0 && (
                        <img src="assets/images/btn_attack_2_d.png" />
                      )}
                      {thirdTurn !== 0 && (
                        <h1
                        style={{
                          position: 'absolute',
                          fontSize: '60px',
                          fontFamily: 'Anime Ace',
                          color: '#ffffff',
                          left: '20px',
                          top: '20px',
                        }}>{`${5 - thirdTurn}T`}</h1>
                      )}
                    </div>
                  </button>
                  <button onClick={() => {
                    if (secondTurn === 0) {
                      secondAttack()
                    }
                  }}
                  style={{
                    position: 'absolute',
                    right: '90px',
                    bottom: '210px',
                  }}>
                    <div className="w-[160px]">
                      {secondTurn === 0 && (
                        <img src="assets/images/btn_attack_3.png" />
                      )}
                      {secondTurn !== 0 && (
                        <img src="assets/images/btn_attack_3_d.png" />
                      )}
                      {secondTurn !== 0 && (
                        <h1
                        style={{
                          position: 'absolute',
                          fontSize: '60px',
                          fontFamily: 'Anime Ace',
                          color: '#ffffff',
                          left: '20px',
                          top: '20px',
                        }}>{`${4 - secondTurn}T`}</h1>
                      )}
                    </div>
                  </button>
                  <button onClick={normalAttack}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    bottom: '50px',
                  }}>
                    <div className="w-[129px]">
                      <img src="assets/images/btn_attack.png" />
                    </div>
                  </button>
                  {/* <button onClick={attack}>
                    <div className='w-[160px]'>
                      <img src="assets/images/arrow.png" />
                    </div>
                  </button>
                  <button onClick={attack}>
                    <div className='w-[160px]'>
                      <img src="assets/images/magic.png" />
                    </div>
                  </button> */}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
