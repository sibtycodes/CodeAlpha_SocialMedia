"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Post, Like } from "@prisma/client";
import { Button, Grid, Skeleton } from "@mui/material";
import { type } from "os";
import { MessageCircleIcon, ThumbsUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";


type Props = {
  userid: string;
};


export type UserPosts = Post & {
  likes: Like[],
  comments: string[],
}

function UserPosts({ userid }: Props) {

  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["userPosts", userid],
    queryFn: async (): Promise<UserPosts[]> => {
      return axios.post(`/api/userPosts`, { userid }).then((res) => res.data);
    },
  });
  return (
    <>
      {isLoading ? (
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {Array.from(new Array(9)).map((item, index) => (
            <Grid item xs={4} key={index}>
              <Skeleton className=" lg:w-[250px]" variant="rectangular" sx={{ height: "25vw" ,} } />
            </Grid>
          ))}
        </Grid>
      ) : (
        data?.length == 0 ? <section>
          <h1 className="font-bold font-mono text-center text-2xl opacity-30">NO POSTS YET</h1>

        </section> :
          <Grid container spacing={1} sx={{ mt: 1 }} className="mx-auto">
            {data?.map((post) => (


              <Grid key={post.id} item xs={4} className="relative group rounded-md ">
                <Link href={`/post/${post.id}`} >
                  <img src={post.pictures[0] as string} className="shadow-black shadow-sm lg:w-[250px] hover:brightness-[0.4] cursor-pointer aspect-square  object-cover" alt="" />
                  <section className="group-hover:visible invisible  pointer-events-none absolute top-0 right-0 w-full h-full text-white flex justify-center items-center">
                    <div className=" mx-1 space-y-2">
                      <p className="flex justify-center items-center">{post.likes.length}<ThumbsUpIcon size={20} /></p>
                      <p className="flex justify-center items-center">{post.comments.length}<MessageCircleIcon size={20} /></p>
                    </div>
                    {/* <Button onClick={()=>{
                          console.log("button  ")
                          router.push(`/post/${post.id}`)
                        }} variant="outlined" className=" z-50 bg-white text-black ">View</Button> */}

                  </section>
                  </Link>
              </Grid>
             

      ))}
    </Grid >
        
      )
}
    </>
  );
}

export default UserPosts;
