export interface Withdraw {
  _id: string
  walletAddress: string
  amount: string
  txId: string
  createdAt: string
  updatedAt: string
}

export interface LoginInfo {
  Siren: Number
  resource: Number
  eggs: Number
  premium: any
  opendPlace: any
  stakedDiamond: any
  stakedBirds: any
  miningModule: any
  miningRequest: Number
  goldMine: any
  goldMineRequest: Number
  uraniumMine: any
  uraniumMineRequest: Number
  powerMine: any
  powerMineRequest: Number
  withdrawLimit: Number
  lastWithdraw: any
  userRef: string
  referrals: Number
  earned: Number
  discord: string
  withdraws: Withdraw[]
  wall: Number
}

export interface LoginState {
  user: LoginInfo
}

export const GET_RESOURCES_SUCCESS = 'GET_RESOURCES_SUCCESS'
export const RESOURCE_CHANGE_SUCCESS = 'RESOURCE_CHANGE_SUCCESS'

export const SWAP_RESOURCES_SUCCESS = 'SWAP_RESOURCES_SUCCESS'
export const SWAP_EGGS_SUCCESS = 'SWAP_EGGS_SUCCESS'
export const STAKE_DIAMOND_SUCCESS = 'STAKE_DIAMOND_SUCCESS'
export const STAKE_BIRD_SUCCESS = 'STAKE_BIRD_SUCCESS'
export const CLAIM_DIAMOND_SUCCESS = 'CLAIM_DIAMOND_SUCCESS'
export const CLAIM_BIRD_SUCCESS = 'CLAIM_BIRD_SUCCESS'
export const GET_WITHDRAW_AMOUNT = 'GET_WITHDRAW_AMOUNT'
export const ERROR = 'ERROR'

interface getResources {
  type: typeof GET_RESOURCES_SUCCESS
  payload: {
    data: any
  }
}

interface changeSuccess {
  type: typeof RESOURCE_CHANGE_SUCCESS
  payload: {
    data: any
  }
}

export type ActionTypes = getResources | changeSuccess
