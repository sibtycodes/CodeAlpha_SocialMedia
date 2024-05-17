'use client'
import prismadb from '@/lib/prismadb'
import { Button } from '@mui/material'
import React from 'react'

import axios from 'axios'
import toast from 'react-hot-toast'
import { redirect, useRouter } from 'next/navigation'
import { useScreenLoading } from '@/store/store'
import { useSession } from 'next-auth/react'

type Props = {
    receiverId: string
}

function SendMessage({ receiverId }: Props) {
    const router = useRouter()
    const { setscreenLoading } = useScreenLoading()
    const currentUser = useSession()
    const userID = currentUser.data?.user.id
    return (
        <Button variant="outlined" onClick={async () => {
            // const loading = toast.loading("Creating room...")
            setscreenLoading(true)

            //!Api will create a room if not already created - then return the room.Id
            const res = await axios.post("/api/createRoom", { senderId: userID, receiverId: receiverId })
            // toast.remove(loading)
            console.log(res.data)
            if (res.data.error) {
                toast.error(res.data.error)
                setscreenLoading(false)
            }
            if (res.data.roomId) {
                
                router.push(`/messaging/${res.data.roomId}`)
            }
        }}>Message</Button>
    )
}

export default SendMessage




