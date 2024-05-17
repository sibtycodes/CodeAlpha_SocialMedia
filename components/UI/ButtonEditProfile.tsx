'use client'
import { useScreenLoading } from '@/store/store'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {}

function ButtonEditProfile({}: Props) {
    
    const {setscreenLoading} = useScreenLoading()
    const router = useRouter()
    return (
    <>
    <Button onClick={()=>{
        setscreenLoading(true)
        router.push("/profile/edit")
    }} variant="outlined" className='text-xs' color="primary">Edit Profile</Button>
    </>
  )
}

export default ButtonEditProfile