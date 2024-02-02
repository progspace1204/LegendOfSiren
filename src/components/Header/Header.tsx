// import { chainData } from "../../hooks/data";
// import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Box, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
// import ExchangeModal from "./ExchangeModal";
import { useDispatch, useSelector } from 'react-redux'
import {
  Link,
  /* Navigate, NavLink, */ useNavigate,
  useSearchParams,
} from 'react-router-dom'

import {
  /* changeNetwork, */ getTransaction /* , sendToken */,
} from '../../hooks/hook'
import { useWeb3Context } from '../../hooks/web3Context'
import { /* buyPremium,  */ getResources } from '../../store/user/actions'
// import { ADMIN_WALLET_ADDRESS, chainId, PREMIUM_COST } from "../../hook/constants";
import { onShowAlert } from '../../store/utiles/actions'
import { checkPremium } from '../../utils/checkPremium'
import { /* formatDecimal,  */ shortAddress } from '../../utils/tools'
import AccountIcon from '../AccountIcon/AccountIcon'
import PreniumModal from '../Modal/PremiumModal'

import styles from './Header.module.scss'
import HeaderModal from './HeaderModal'
import { ClientRequest } from 'http'
import InforModal from './InforModal'

interface HeaderProps {
  showAccount: any
  setShowAccount: any
}

const Header = ({ showAccount, setShowAccount }: HeaderProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const ref = searchParams.get('ref')

  const dispatch = useDispatch<any>()
  const userModule = useSelector((state: any) => state.userModule)

  const [openAccount, setOpenAccount] = useState(showAccount)
  const [openPremium, setOpenPremium] = useState(false)

  const [ispremium, setIsPremium] = useState(false)
  const [leftDay, setLeftDay] = useState(0)
  const [show, setShow] = useState(false)

  const { connected, chainID, address, connect } = useWeb3Context()

  const handleOpenAccount = (flag: boolean) => {
    setOpenAccount(flag)
    setShowAccount(false)
  }

  const setOpenedAccount = () => {
    setOpenAccount(true)
  }
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

  useEffect(() => {
    // let date = new Date();

    // let expiredTime = new Date(userModule.user.premium);
    // // let curTime = new Date();
    // expiredTime.setMonth( expiredTime.getMonth() + 1 );

    // console.log(expiredTime, date);

    // let curSec = date.getTime() + date.getTimezoneOffset()*60*1000;
    // let endSec = expiredTime.getTime();

    // if(endSec > curSec) {
    //   setIsPremium(true);
    //   setLeftDay(Math.floor((endSec-curSec)/1000/86400));
    // } else {
    //   setIsPremium(false);
    // }
    const res = checkPremium(userModule.user.premium)
    setIsPremium(res.isPremium)
    setLeftDay(res.leftDay)
  }, [userModule.user.premium])

  // const getTxData = async () => {
  //   const data = await getTransaction();

  //   console.log(data.logs[0]);
  // }

  const getPremium = async () => {
    setOpenPremium(true)
    // try{
    //   dispatch(onShowAlert("Pease wait while confirming", "info"));
    //   let transaction = await sendToken(address, ADMIN_WALLET_ADDRESS[chainId], PREMIUM_COST);
    //   dispatch(buyPremium(address, PREMIUM_COST, transaction.transactionHash, (res:any)=>{
    //     if(res.success) {
    //       dispatch(onShowAlert("Buy permium successfully", "success"));
    //     } else {
    //       dispatch(onShowAlert("Faild in buying premium", "warning"));
    //     }
    //   }));
    // } catch(e){
    //   console.log(e);
    // }
  }

  return (
    <header>
      <Box className={styles.contents}>
        <InforModal
          openAccount={openAccount}
          setOpenAccount={handleOpenAccount}
        />
        <PreniumModal open={openPremium} setOpen={setOpenPremium} />

        <Box
          className={styles.Siren}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {!ispremium && (
            // <Button
            //   variant="contained"
            //   color="secondary"
            //   onClick={getPremium}            
            //   sx={{ minWidth: 'auto', mr: 1 }}
            // >
            //   Premium
            // </Button>            
            <button
              onClick={getPremium}
              style={{
                background: 'url(/images/but_style1.png)',                
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: 170,
                height:35,
                marginRight:10,
              }}
            >
              Premium
            </button>
          )}
          {ispremium && (
            <p
              style={{
                whiteSpace: 'nowrap',
                marginRight: '8px',
                fontWeight: 700,
                fontSize: '18px',
              }}
            >{`${leftDay} Days`}</p>
          )}

          {show && (
            // <Box className={styles.detail}>
            //   {/* <Box className={styles.balance}>{balance}</Box> */}
            //   <Button
            //     variant="contained"
            //     color="success"
            //     onClick={
            //       (/* e */) => {
            //         setOpenAccount(true)
            //       }
            //     }
            //   >
            //     <span>{shortAddress(address)}</span>
            //     <span style={{ display: 'flex', alignItems: 'center' }}>
            //       <AccountIcon address={address} size={18} />
            //     </span>
            //   </Button>
            // </Box>
            <button
              onClick={setOpenedAccount}
              style={{
                background: 'url(/images/but_style1.png)',                
                width: 170,
                height:35,
              }}
              className={`px-6 py-1 font-semibold text-white shadow-sm`}
            >
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span>{shortAddress(address)}</span>
              <AccountIcon address={address} size={18} />
            </span>
            </button>
            )}

          {/* {!show && (
            <Button
              variant="contained"
              color="error"
              sx={{ zIndex: 1 }}
              onClick={
                () => {
                  connect()
                }
              }
            >
              {' '}
              Connect wallet{' '}
            </Button>
          )} */}
          <p
            className={styles.resource}
            style={{ background: 'url(/images/but_style1.png)', width: 170, height: 35, marginLeft: '8px' }}
          >
            {/* <MonetizationOnIcon/> */}
            <img
              alt=""
              style={{ width: '25px', marginRight: '10px' }}
              src="/images/res_Siren.png"
            />
            {`Siren: ${userModule.user.Siren}`}
          </p>
          <p
            className={styles.resource}
            style={{ background: 'url(/images/but_style1.png)', width: 170, height: 35, marginLeft: '8px' }}
          >
            {/* <WidgetsIcon/> */}
            <img
              alt=""
              style={{ width: '25px', marginRight: '10px' }}
              src="/images/res_res.png"
            />
            {`Water: ${userModule.user.resource}`}
          </p>
          <p
            className={styles.resource}
            style={{ background: 'url(/images/but_style1.png)', width: 170, height: 35, marginLeft: '8px' }}
          >
           {/* <EggIcon/> */}
            <img
              alt=""
              style={{ width: '20px', marginRight: '10px' }}
              src="/images/res_egg.png"
            />
            {`Eggs: ${userModule.user.eggs}`}
          </p>
        </Box>
        <Box
          className={styles.Siren}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Link to="/" className="button muted-button">
            <button
              style={{
                background: 'url(/images/but_style2.png)',                
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: 116,
                height:35,
              }}
            >
              Back
            </button>
          </Link>
        </Box>
      </Box>
    </header>
  )
}

export default Header
