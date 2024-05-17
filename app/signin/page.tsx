import SignIn from '@/components/Sign-in'
import { getServerSession } from 'next-auth'
import React from 'react'
import { options } from '../api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'

type Props = {}

async function page({}: Props) {
  //! if logged in then redirect to home - get session from nextauth

    const session = await  getServerSession(options)
    if(session){
        redirect("/")
    }

  return (
    <SignIn/>
  )
}

export default page