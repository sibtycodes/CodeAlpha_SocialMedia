'use client'
import { options } from '@/app/api/auth/[...nextauth]/options'
import EditProfile from '@/components/EditProfile'
import ButtonEditProfile from '@/components/UI/ButtonEditProfile'
import ScreenOff from '@/components/UI/ScreenOff'
import { Avatar, Typography, Grid, Divider, Skeleton, Box } from '@mui/material'

import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import React from 'react'

type User = {
    id: string,
    email: string,
    username: string,

    fullname: string,
    bio: string,
    birthday: string,
    profilePics: string[],
    birthDate: string,
    token: string

}

function page() {
    const session = useSession()
    const user = session?.data?.user
    const updateFunction = session?.update
    return (
        <main className=' contentSide lg:ml-auto'>
            <ScreenOff />
            {
                //` if user is defined then show the edit profile page 
                user ? <section>

                    <section className='flex gap-x-3 p-4 pt-5'>




                        <Avatar src={user.profilePics[0]} alt="User Avatar" className='h-24 w-24' >{ }</Avatar>




                        <Grid container >

                            <Grid item xs={12} md={6} >
                                <Typography variant="h5" className=' opacity-90 font-serif'>{user.fullname}</Typography>
                                <Typography className=" text-xs opacity-50">@{user.username}</Typography>



                                <article className='mt-3 flex justify-start items-center'  >


                                </article >


                            </Grid>

                        </Grid>
                    </section>


                    <Divider />


                    <EditProfile />
                </section> : <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ margin: 1 }}>
                            {
                                <Skeleton variant="circular" width={100} height={100}>
                                    <Avatar />
                                </Skeleton>
                            }
                        </Box>
                        <Box sx={{ width: "100%" }}>
                            {
                                <>
                                    <Skeleton width="35%" height={15}>
                                        <Typography>.</Typography>
                                    </Skeleton>
                                    <Skeleton width="30%" height={12}>
                                        <Typography>.</Typography>
                                    </Skeleton>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexWrap: "wrap",

                                            gap: 3,
                                            mt: 1,
                                        }}
                                    >
                                        <Skeleton width="40%" height={30}>
                                            <Typography>.</Typography>
                                        </Skeleton>
                                        <Skeleton width="40%" height={30}>
                                            <Typography>.</Typography>
                                        </Skeleton>
                                    </Box>
                                </>
                            }
                        </Box>
                    </Box>



                </>
            }
        </main>
    )
}

export default page