import { AppBar } from '@mui/material'
import React from 'react'
import Navbar from './Navbar'

type Props = {}

function NavbarServer({}: Props) {
  return (
    // <AppBar position="static" className=' sticky lg:z-[99] z-50  min-h-[20px] min-w-full  top-0  bg-[#1976d2]'  variant="elevation">
    //     <Navbar/>
    // </AppBar>
    <div className='sticky lg:z-[99] z-50  sm:min-h-[64px] min-h-[56px] min-w-full  top-0  bg-[#1976d2]'  >
        <Navbar/>
    </div>
  )
}

export default NavbarServer