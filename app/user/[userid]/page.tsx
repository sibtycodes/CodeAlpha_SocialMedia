
import React from 'react'

import UserProfile from '@/components/UserProfile'

type Props = {
    params: {
        userid: string
    }
}

function page({ params }: Props) {
  const { userid } = params
    return (
        <main className='  p-3  '>
            <UserProfile userid={userid} />
        </main>
    )
}

export default page