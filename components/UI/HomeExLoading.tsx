import { Avatar, Button, Divider, Paper, Skeleton, Typography } from '@mui/material';
// import { Avatar } from '@nextui-org/react';
import React from 'react'

type Props = {}

function HomeExLoading({ }: Props) {
    return (
        <div className="grid grid-cols-1 gap-2">
            {[1, 2, 3].map((post) => (
                <Paper
                    key={post}
                    className="my-2 p-3 w-[80vw] md:w-[50vw] lg:w-[37vw] mx-auto "
                >
                    <section className="grid grid-cols-3 gap-2 grid-rows-2 w-[50%]  ">
                        <Avatar
                            src=""
                            className=" row-span-2   aspect-square cursor-pointer  "

                        />
                        <Skeleton  className=' h-3 col-span-2'>

                        </Skeleton>
                        <Skeleton  className='h-2 col-span-2 w-3/4'>

                        </Skeleton>

                        
                    </section>
                    <article className='mt-1'>
                        <Skeleton className='ml-1 my-3 h-2 w-1/4 w opacity-30'>

                        </Skeleton>
                        <Divider/>
                        <Skeleton  className={`h-1 mt-1 border-t-2 py-1 `}>

                        </Skeleton>
                        <Skeleton className={` h-1 w-1/2  border-t-2 py-1 `}>

                        </Skeleton>
                    </article>
                    <Skeleton className="   w-full aspect-square  mx-auto   bg-slate-300">

                    </Skeleton>
                    <Skeleton
                        className={` text-purple-700 opacity-70 bg-slate-50 p-1 my-1`}
                    >
                        
                    </Skeleton>
                    {/* <section className="ButtonSection mt-2 flex">
                        <Button

                            variant="outlined"
                            color={"secondary"}
                            className={`mx-1 text-sm flex justify-center items-center `}
                        >

                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            className="mx-1 text-sm flex justify-center items-center "
                        >

                        </Button>
                    </section> */}
                </Paper>
            ))}
        </div>
    )
}

export default HomeExLoading