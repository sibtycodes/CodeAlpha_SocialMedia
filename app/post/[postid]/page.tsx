import PostFromProfile from '@/components/PostFromProfile'
import { UserPosts } from '@/components/UserPosts';
import prismadb from '@/lib/prismadb'
import axios from 'axios'
import { Qahiri } from 'next/font/google';
import React from 'react'

const font4 = Qahiri({ subsets: ["latin"], weight: ["400"] });

type Props = {
  params: {
    postid: string
  }
}

async function page({ params }: Props) {

  const postId = params.postid
  console.log(postId);


 
  const post = await prismadb.post.findUnique({
    where:{
        id:postId
    },
    include:{
        likes:true,
        comments:true
    }
})

  post && console.log(`\n Posts \n  \n ..\n`,post)


  return (
    <>
      {post ? <PostFromProfile postId={postId} post={post as any} />
      :
      
            <section className="h-96 w-ful flex justify-center items-center  mb-10">
                <section className=" relative w-full h-96 opacity-70 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: 'url("/note.png")' }}>
                    <h1 className={`${font4.className} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  absolute text-5xl font-bold opacity-50 text-yellow-600 stroke-black stroke-1 `}>Post Not Found </h1>

                </section>

            </section>}
    </>
  )
}

export default page