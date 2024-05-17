'use client'
import React, { use, useEffect, useLayoutEffect, useState } from 'react'

import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import type { Profile } from './UserProfile';
import { AppBar, Toolbar, IconButton, Typography, Button, Badge, Avatar } from "@mui/material";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';

import Link from 'next/link';
import { BellIcon, ChevronsLeftRightIcon, EditIcon, HomeIcon, InfoIcon, LogInIcon, MenuIcon, MessageCircleIcon, PencilIcon, SidebarCloseIcon, SignalIcon, User2Icon } from 'lucide-react';
import { Love_Light, Lovers_Quarrel, Poppins, Raleway, Sofia, } from 'next/font/google';
import { useScreenLoading, userStore } from '@/store/store';
import Logout from './UI/Logout';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ClassNames } from '@emotion/react';

import { useSession } from 'next-auth/react';
import SearchProfile from './SearchProfile';



const font1 = Raleway({ weight: ['600'], subsets: ['latin'] })
const font2 = Poppins({ weight: ['400'], subsets: ['latin'] })

//for drawer
type Anchor = 'top' | 'left' | 'bottom' | 'right';


function Navbar() {
  const router = useRouter()

  const { data: session } = useSession()


  if (session) {




    //set the access token in the cookie
    if (!Cookies.get("accessToken")) {
      Cookies.set("accessToken", session.user.token)
    }

  }



  //` For sign in sign up
  const [isMounted, setIsMounted] = useState(false)
  useLayoutEffect(() => {
    setTimeout(() => {
      setIsMounted(true)
    }, 5000)
  }, [])






  //getting current path
  const currentPath = usePathname()

  //getting screen loading
  const { setscreenLoading } = useScreenLoading()


  //When clicked to navigate to another path
  function handleLinkClick(path: string) {
    if (currentPath !== path && currentPath !== "/signin") {
      setscreenLoading(true)
    }
  }

  // for drawer mobile view
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  //Drawer toggle
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };
  //Mobile Sidebar
  const list = (anchor: Anchor) => (
    <Box
      className="pt-10"
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"

      onKeyDown={toggleDrawer(anchor, false)}
    >

      <ChevronsLeftRightIcon className='absolute top-2 right-4 cursor-pointer' onClick={toggleDrawer(anchor, false)} />

      <List>
        <ListItem>
          <Link
            onClick={() => { handleLinkClick('/'); toggleDrawer(anchor, false) }}
            className='flex items-center'
            href='/'
            passHref
          >
            <HomeIcon size={17} />
            Home
          </Link>
        </ListItem>

        <ListItem>
          <Link
            onClick={() => { handleLinkClick('/explore'); toggleDrawer(anchor, false) }}
            className='flex items-center'
            href='/explore'
            passHref
          >
            <InfoIcon size={17} />
            Explore
          </Link>
        </ListItem>



        <Divider />
        {session == undefined && (
          <>
            <ListItem>
              <Link
                onClick={() => {
                  toggleDrawer(anchor, false)
                  handleLinkClick('/signup')


                }}
                className='flex items-center'
                href='/signup'
              >
                <PencilIcon size={17} />
                Sign Up
              </Link>
            </ListItem>

            <ListItem>
              <Link
                onClick={() => {
                  handleLinkClick('/signin')
                  toggleDrawer(anchor, false)
                }}
                className='flex items-center'
                href='/signin'
              >
                <LogInIcon size={17} />
                Log In
              </Link>
            </ListItem>
            <Divider />

          </>
        )}
        <ListItem className=' pt-4'>
          <Link
            onClick={() => {
              handleLinkClick('/profile')
              toggleDrawer(anchor, false)
            }}
            className='flex items-center'
            href='/profile'
          >
            <User2Icon size={17} />
            Profile
          </Link>
        </ListItem>
        <ListItem className=' pb-4'>
          <Link
            onClick={() => {
              handleLinkClick('/profile/edit')
              toggleDrawer(anchor, false)
            }}
            className='flex items-center'
            href='/profile/edit'
          >
            <EditIcon size={17} />
            Edit Profile
          </Link>
        </ListItem>



        <Divider />
        <ListItem className=' py-3'>
          <Link
            onClick={() => {
              handleLinkClick('/messaging')
              toggleDrawer(anchor, false)
            }}
            className='flex items-center'
            href='/messaging'
          >
            <MessageCircleIcon size={17} />
            Messages
          </Link>
        </ListItem>

        <Divider />
        <ListItem>
          {
            session && <Logout />
          }
        </ListItem>


      </List>

    </Box>
  )


  return (
    <>
      <AppBar position="static" className=' sticky lg:z-[99] z-10  top-0  bg-[#1976d2]' variant="elevation">
        <Toolbar>
          {
            //! This is WebApp Logo/Name 
          }
          <img className='   w-16' src="/s2.png" alt="" />

          <h4 className={`${font1.className} text-3xl cursor-pointer flex-grow`} >
            <Link onClick={() => {
              if (currentPath !== "/" && currentPath !== "/signin")
                setscreenLoading(true)

            }} href={"/"}>

              <span className={`${font1.className} `}>ibty</span>
            </Link>
          </h4>

          {
            //` This is navbar for large and medium screens

          }
          <>
            {
          /* <nav className={`${font2.className} shadow-none font-light text-sm  p-0  hidden   space-x-4   md:flex lg:hidden    flex-row     z-[100] `}>



            <Link onClick={() => {
              if (currentPath !== "/" && currentPath !== "/signin")
                setscreenLoading(true)
            }} className='flex  items-center' href="/" passHref>
              <HomeIcon size={12} className='mr-1' />
              Home
            </Link>

            <Link onClick={() => {
              if (currentPath !== "/explore")
                setscreenLoading(true)
            }} className='flex  items-center' href="/explore" passHref>
              <InfoIcon size={12} className='mr-1' /> Explore
            </Link>

            <div className='flex  items-center'>
              <BellIcon size={12} className='mr-1' />
              Notifications
            </div>

            
            {(isMounted && session == undefined) && <>
              <Link onClick={() => {
                if (currentPath !== "/signup")
                  setscreenLoading(true)
              }} className='flex  items-center' href="/signup">
                <PencilIcon size={12} className='mr-1' />
                Sign Up
              </Link>
              <Link onClick={() => {
                if (currentPath !== "/signin")
                  setscreenLoading(true)
              }} className='flex  items-center' href="/signin">
                <LogInIcon size={12} className='mr-1' />
                Log In
              </Link>
            </>}

          </nav> */}</>




          { //` This is Profile Pic Avatar and Logout Button
            session && <section className='flex justify-center items-center space-x-5 mx-5'>
              <div className="hidden md:block"><Logout /></div>

              <Avatar className=' cursor-pointer' onClick={() => {
                if (currentPath !== `/profile`)
                  setscreenLoading(true)
                router.push("/profile")
              }} src={session.user.profilePics[0]}></Avatar>


            </section>
          }

          {

            //! This is mobile Drawer/ Navbar 
          }

          <div className='lg:hidden'>
            {(['right'] as const).map((anchor) => (
              <React.Fragment key={anchor}>
                <button className='grid place-content-center' onClick={toggleDrawer(anchor, true)}><MenuIcon className=' block lg:hidden' /></button>
                <Drawer
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                >
                  {list(anchor)}
                </Drawer>
              </React.Fragment>
            ))}
          </div>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Navbar