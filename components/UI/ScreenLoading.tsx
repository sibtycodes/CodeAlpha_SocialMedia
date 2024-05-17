'use client'
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { useScreenLoading } from '@/store/store';

export default function SimpleBackdrop() {
  
    const {screenloading,setscreenLoading} = useScreenLoading()
 
  return (
    <div>
      
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={screenloading}
        
      >
        <div className="newloader"></div> 
         </Backdrop>
    </div>
  );
}