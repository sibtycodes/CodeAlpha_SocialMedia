'use client'
import { Button, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useScreenLoading, userStore } from '@/store/store'
import { LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';


type Props = {}

function Logout({ }: Props) {

  //get screen loading
  const { screenloading, setscreenLoading } = useScreenLoading()





  const router = useRouter()

  const handleLogout = async () => {


    setscreenLoading(true)




    try {

      signOut()
        .then(() => {
          

          Cookies.remove("accessToken")
          Cookies.remove("userData")
          //toast success
          toast.success('Logout Successfull')
          handleClose()
        })

    } catch (error) {
      console.log(error);
      //toast error
      toast.error('Logout Failed')
      setscreenLoading(false)

    }


  }

  const [open, setOpen] = useState(false)


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  return (

    <div>
      <button className='text-xs' onClick={handleClickOpen}>
        LOGOUT
      </button>
      <Dialog

        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" className='flex items-center gap-3'>
          <LogOut />Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleLogout} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>


  )
}

export default Logout