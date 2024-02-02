import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import api from '../../../utils/callApi'
// import type { RootState } from '../../../store'
import type { GameStateProps, StockProps } from './state'
import initialState from './state'
import { useWeb3Context } from '../../../hooks/web3Context'

export const gameSlice = createSlice({
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  name: 'game',
  reducers: {
    decrement: (state: GameStateProps, action: PayloadAction<string>) => {
      if (state.stock[action.payload as keyof StockProps] === 0) {
        return
      }
      state.stock[action.payload as keyof StockProps] -= 1
    },
    increment: (state: GameStateProps, action: PayloadAction<string>) => {
      state.stock[action.payload as keyof StockProps] += 1
    },
    setGameStatus: (state: GameStateProps, action: PayloadAction<number>) => {
      state.gameState = action.payload
    },
    setGameTurn: (state: GameStateProps) => {
      state.turn = !state.turn
    },
    setInventoryStatus: (
      state: GameStateProps,
      action: PayloadAction<boolean>,
    ) => {
      state.inventoryOpened = action.payload
    },
    setCharacterStatus: (
      state: GameStateProps,
      action: PayloadAction<boolean>,
    ) => {
      state.characterOpened = action.payload
    },
    setAddress: (state: GameStateProps, action: PayloadAction<string>) => {
      state.address = action.payload
    },
    addExp: (
      state: GameStateProps,
      action: PayloadAction<Number>,
    ) => {
      const address = state.address
      const res = api(`user/add/exp`, 'post', {
        walletAddress: address,
        amount: action.payload,
      })
    },
    setSecondTurn: (state: GameStateProps) => {
      state.secondTurn = 1
    },
    addTurn: (state: GameStateProps) => {
      if (state.secondTurn !== 0)
        state.secondTurn = Math.floor((state.secondTurn + 1) % 3)
      if (state.thirdTurn !== 0)
        state.thirdTurn = Math.floor((state.thirdTurn + 1) % 4)
    },
    setThirdTurn: (state: GameStateProps) => {
      state.thirdTurn = 1
    },
    setTurnFormat: (state: GameStateProps) => {
      state.thirdTurn = 0
      state.secondTurn = 0
    },
  },
})

export const {
  setAddress,
  setGameStatus,
  setGameTurn,
  setTurnFormat,
  setInventoryStatus,
  setCharacterStatus,
  increment,
  decrement,
  addExp,
  addTurn,
  setSecondTurn,
  setThirdTurn,
} = gameSlice.actions

export default gameSlice.reducer
