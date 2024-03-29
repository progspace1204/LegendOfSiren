import { Grid, TextField /* Tooltip */ } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { showHourMinutes } from '../../utils/timer'

interface Props {
  open: any,
  item: any,
  timer: any,
  setOpen: any,
  setWell: any,
  setRockClaim: any,
}

const RockModal = ({
  open,
  item,
  timer,
  setOpen,
  setWell,
  setRockClaim,
}: Props) => {
  const userModule = useSelector((state: any) => state.userModule)

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false)

  const onRock = () => {
    if(userModule.user.Siren >= 30)
      setWell()
  }

  const onClaim = () => {
      setRockClaim()
  }

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '450px',
    height: '500px',
    background: "url(/assets/images/set.png)",
    backgroundSize: '100% 100%',    
    bgcolor: 'transparent',
    boxShadow: 24,
    p: 4,
    pt: 1,
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="w-[450px]">
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <div
                className='well-back'
                style={{
                  width: '300px',
                  height: '280px',
                  background: "url(/assets/images/well.png)",
                  backgroundSize: 'cover',
                  margin: 'auto',
                  marginTop: '20px',
                }}
              ></div>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  // marginTop: '5px'
                }}
              >
                <h2 className="font-bold text-2xl mb-4 text-white upgrade-label"
                  style={{
                    fontFamily: 'Anime Ace',
                    fontSize: '20px',
                    marginTop: '15px',
                    marginBottom: '0px',
                    textAlign: 'center',
                  }}
                >
                  PRICE: 20 SIREN<br></br>
                  AMOUNT: 30<br></br>
                  TIME: 3 HOURS<br></br>
                </h2>
                <Button
                  // variant="contained"
                  // color="primary"
                  style={{
                    background: "url(/assets/images/roomBtn.png)",
                    backgroundSize: '100% 100%',   
                    fontFamily: 'Anime Ace',  
                    color: 'white',
                    border: 'none',                 
                    width: '130px',
                  }}
                  onClick={(/* e */) => {
                    if (item === 0)
                      onRock()
                    else {
                      onClaim()
                    }
                  }}
                >
                  {item === 0 ? 'Buy' : timer === 0 ? 'CLAIM' : `${showHourMinutes(timer)}`}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  )
}

export default RockModal
