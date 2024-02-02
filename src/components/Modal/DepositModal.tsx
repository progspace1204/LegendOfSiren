import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Grid, TextField /* , Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  ADMIN_WALLET_ADDRESS,
  FEE_WALLET_ADDRESS,
  chainId,
} from '../../hooks/constants'
import { deposit, sendToken } from '../../hooks/hook'
import { useWeb3Context } from '../../hooks/web3Context'
import {
  /* checkWithdrawableReqeust,  */ depositRequest,
  resourceRequest,
  withdrawRequest,
} from '../../store/user/actions'
import { onShowAlert } from '../../store/utiles/actions'
import { checkPremium } from '../../utils/checkPremium'
// import { Withdraw } from "../../store/user/action-types";
// import api from '../../utils/callApi';
import { getBcsPrice, getWithdrewSirenAmount } from '../../utils/user'

interface Props {
  open: boolean
  setOpen: any
  resource: any
  egg: any
  onExchange: any
  onExchangeEgg: any
}

const DepositModal = ({
  open,
  setOpen,
  resource,
  egg,
  onExchange,
  onExchangeEgg,
}: Props) => {
  const { connected, chainID, address, connect } = useWeb3Context()
  const { user } = useSelector((state: any) => state.userModule)
  const dispatch = useDispatch<any>()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [bcsAmount, setBCSAmount] = useState(0)
  const [SirenAmount, setSirenAmount] = useState(0)
  const [withdrawableBcsAmount, setWithdrawableBcsAmount] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      // console.log('user withdraws changed', user.withdraws.length)
      const withdrewSirenAmount = getWithdrewSirenAmount(user.withdraws) // Siren
      console.log(withdrewSirenAmount)
      // const bcsPrice = await getBcsPrice();
      const bcsPrice = 1
      const maxAmount =
        (checkPremium(user.premium).isPremium ? 10 : 5) / bcsPrice
      console.log(`bcs price is ${bcsPrice}`, 'withdrew Siren amount: ', withdrewSirenAmount, ' and withdrawable bcs amount is ', maxAmount)
      setWithdrawableBcsAmount(maxAmount - Math.floor(withdrewSirenAmount / 10))
    })()
  }, [user.withdraws])

  // useEffect(() => {
  //   const timeoutId = setInterval(() => {
  //     onResource()
  //   }, 10000);
  // },[])

  const onChangeAmount = (e: any) => {
    e.preventDefault()

    if (e.target.value < 0) return

    setBCSAmount(e.target.value)
  }

  const onChangeEggAmount = (e: any) => {
    e.preventDefault()

    if (e.target.value < 0) return

    setSirenAmount(e.target.value)
  }

  const onResource = async () => {
    dispatch(
      resourceRequest(
        address,
        (res: any) => {
          handleClose()
          if (res.success) {
            dispatch(onShowAlert('Resource Load successfully', 'success'))
          } else {
            dispatch(onShowAlert('Resource Load faild!', 'warning'))
          }
        },
      ),
    )
  }

  const onDeposit = async () => {
    if (bcsAmount < 5) {
      // alert("minimal withdraw amount is 320BCS");
      return
    }
    dispatch(onShowAlert('Pease wait while confirming', 'info'))
    const transaction = await deposit(
      address,
      ADMIN_WALLET_ADDRESS[chainId],
      bcsAmount,
    )
    // console.log('bcs deposite transaction: ', transaction)
    dispatch(
      depositRequest(
        address,
        bcsAmount,
        transaction.transactionHash,
        (res: any) => {
          handleClose()
          console.log('callback')
          if (res.success) {
            dispatch(onShowAlert('Deposit successfully', 'success'))
          } else {
            dispatch(onShowAlert('Deposit faild!', 'warning'))
          }
        },
      ),
    )
  }

  const onWithdraw = async () => {
    if (SirenAmount < 10) {
      // alert("minimal withdraw amount is 300Siren");
      return
    }

    // const res = await checkWithdrawableReqeust(address, SirenAmount)
    // console.log(res)
    if (withdrawableBcsAmount * 10 <= SirenAmount) {
      dispatch(
        onShowAlert(
          `you can withdraw only ${
            checkPremium(user.premium) ? 10 : 5
          } per day`,
          'warning',
        ),
      )
      return
    }

    dispatch(onShowAlert('Pease wait while confirming', 'info'))

    // const transaction = await sendToken(address, FEE_WALLET_ADDRESS[chainId], 1)
   
    dispatch(
      withdrawRequest(
        address,
        SirenAmount,
        // transaction.transactionHash,
        (res: any) => {
          // console.log('callback')
          handleClose()
          if (res && res?.success) {
            dispatch(onShowAlert('Withdraw successfully', 'success'))
          } else {
            dispatch(onShowAlert(res?.message, 'warning'))
          }
        },
      ),
    )
  }

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: {
    //   xs:200,
    //   md:400,
    // },
    // background: "url(/images/modal-back.png)",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    pt: 1,
    pb: 1,
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="md:w-[500px] xs:w-[300px]">
          <h2 id="parent-modal-title" className="font-bold text-2xl mb-8">
            Deposit and Withdraw
          </h2>
          <p
            style={{
              color: '#879906',
              display: 'flex',
              marginTop: '-12px',
              marginBottom: '12px',
            }}
          >
            <ErrorOutlineIcon /> You can withdraw BCS: 5 a day and 10 if you
            have premium
          </p>

          <Grid container>
            <Grid item xs={12} sm={6} md={6} sx={{ marginBottom: '10px' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  // gap: "20px",
                }}
              >
                <TextField
                  sx={{ mr: 1, textAlign: 'right', borderColor: 'red' }}
                  name="bcs"
                  label="BCS"
                  value={bcsAmount}
                  type="number"
                  onChange={onChangeAmount}
                />
                <p>You will receive {Number(bcsAmount)} Siren</p>
                <Box display="flex" gap={`2px`} sx={{ color: '#879906' }}>
                  <ErrorOutlineIcon />
                  <Typography>Min deposit: 320px</Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={(/* e */) => onDeposit()}
                >
                  Deposit
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6} sx={{ marginBottom: '10px' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <TextField
                  sx={{ mr: 1, textAlign: 'right', borderColor: 'red' }}
                  name="Siren"
                  label="Siren"
                  value={SirenAmount}
                  type="number"
                  onChange={onChangeEggAmount}
                />
                <p>You will receive {Math.floor(SirenAmount / 10)} BCS</p>
                <Box display="flex" sx={{ color: '#879906' }} gap="2px">
                  <ErrorOutlineIcon />
                  <Typography component="p">
                    Availabe : {Math.floor(withdrawableBcsAmount).toString()}{' '}
                    BCS
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={(/* e */) => onWithdraw()}
                >
                  Withdraw
                </Button>
              </Box>
              {/* <Box display="flex" mt={2}>
                <ErrorOutlineIcon sx={{ color: '#879906' }} />
                <Typography sx={{ color: '#879906' }}>
                  withdraw fee is 1 BUSD
                </Typography>
              </Box> */}
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  )
}

export default DepositModal
