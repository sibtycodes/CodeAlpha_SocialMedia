'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import {BsThreeDotsVertical} from "react-icons/bs"
import { UsersIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useScreenLoading } from '@/store/store';

export default function DropdownNext({ userid,setOpen }: { userid: string,setOpen:any }) {
    //! Getting screen loading
    const {setscreenLoading} = useScreenLoading()


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter()
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <BsThreeDotsVertical/>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={()=>{
            setscreenLoading(true)
            router.push(`/user/${userid}`)
            setOpen(false)
            handleClose()
        }}>Visit Profile <UsersIcon size={19} className='mx-1'/> </MenuItem>


       
        
      </Menu>
    </div>
  );
}
