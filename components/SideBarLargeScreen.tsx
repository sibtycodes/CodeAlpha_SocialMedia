'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import Divider from '@mui/material/Divider';

import { BellIcon, ChevronsLeftRightIcon, HomeIcon, InfoIcon, LogInIcon, MenuIcon, PencilIcon, SeparatorHorizontal, Settings2Icon, SidebarCloseIcon, SignalIcon, User2Icon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScreenLoading } from '@/store/store';
import { useSession } from 'next-auth/react';
import { Toolbar } from '@mui/material';
import { RiMessage2Line } from 'react-icons/ri';
const drawerWidth = 240;

export default function SideBarClient() {











    //getting current path
    const currentPath = usePathname()

    //getting screen loading
    const { setscreenLoading } = useScreenLoading()
    return (
        <Box className=" hidden lg:flex h-[80vh] absolute z-0 pt-20 w-64" >
            {/* <CssBaseline /> */}

            <Drawer
                className=' '
                sx={{
                    padding: 20,
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >

                <img className=' mt-10 opacity-70' src="/s.png" alt="" />


                <nav className=' pt-2 px-4 text-lg space-y-4 z-0'>

                    <Link onClick={() => {
                        if (currentPath !== "/" && currentPath !== "/signin")
                            setscreenLoading(true)
                    }} className='flex  items-center' href="/" passHref>
                        <HomeIcon size={17} className='mr-1' />
                        Home
                    </Link>

                    <Link onClick={() => {
                        if (currentPath !== "/explore")
                            setscreenLoading(true)
                    }} className='flex  items-center' href="/explore" passHref>
                        <InfoIcon size={17} className='mr-1' /> Explore
                    </Link>
                    <Divider />

                    <Link onClick={() => {
                        if (currentPath !== "/profile")
                            setscreenLoading(true)
                    }} className='flex  items-center' href="/profile" passHref>
                        <User2Icon size={17} className='mr-1' /> Profile
                    </Link>
                    <Link onClick={() => {
                        if (currentPath !== "/profile/edit")
                            setscreenLoading(true)
                    }} className='flex  items-center' href="/profile/edit" passHref>
                        <Settings2Icon size={17} className='mr-1' /> Edit Profile
                    </Link>

                    <Divider />
                    <Link onClick={() => {
                        if (currentPath !== "/messaging")
                            setscreenLoading(true)
                    }} className='flex  items-center pb-2' href="/messaging" passHref>
                        <RiMessage2Line size={17} className='mr-1' /> Messages
                    </Link>
                </nav>






                <Divider />

            </Drawer>

        </Box>
    );
}