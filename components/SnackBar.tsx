'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { CheckCheckIcon, TicketIcon } from 'lucide-react';
import {SlUserUnfollow} from 'react-icons/sl';


type Props = {
    message:string
}

function SnackBar({message}: Props) {
    const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      {/* <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button> */}
      {message?.charAt(0)=='F'?<CheckCheckIcon/>:<SlUserUnfollow/>}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      
    </React.Fragment>
  );
  return (
    <div>
      <Button onClick={handleClick}></Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </div>
  )
}

export default SnackBar