'use client'
import React, { useLayoutEffect, useState } from 'react'
import { Cabin, Laila, Love_Ya_Like_A_Sister, Qahiri } from "next/font/google";
import { Post } from '@prisma/client';
import { Avatar, Button, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useScreenLoading } from '@/store/store';
import { formatCustomDate } from './ExplorePosts';
import { UserPosts } from './UserPosts';
import Comments from './Comments';
import { ThumbsUpIcon } from 'lucide-react';
import { RiH1, RiThumbUpFill } from 'react-icons/ri';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
const font1 = Laila({ subsets: ["latin"], weight: ["700"] });
const font2 = Cabin({ subsets: ["latin"], weight: ["400"] });
const font3 = Love_Ya_Like_A_Sister({ subsets: ["latin"], weight: ["400"] });
const font4 = Qahiri({ subsets: ["latin"], weight: ["400"] });
type Props = {

  postId: string,
  post: UserPosts
}

function PostFromProfile({ postId, post }: Props) {


  const [Post, setPost] = useState<undefined | UserPosts>()
  useLayoutEffect(() => { setPost(post) }, [])

  const session = useSession()
  const user = session?.data?.user

  const router = useRouter()
  const { setscreenLoading } = useScreenLoading()

  const [liking, setliking] = useState(false)
  async function likePost(postId: string, userId: string, likerName: string, likerPic: string) {
    
    setliking(true)

    //`Check if the user has already liked the post if yes then unlike it else like it`
    
    const LikeCheck = Post?.likes.some(like=>like.userId == userId)
    if(LikeCheck){
      setPost((prev) => {
        if (prev) {
          return{
            ...prev,
            likes:prev.likes.filter(like=>like.userId !== userId)
          }
        }
      
    })
  }  
    else{
      setPost((prev) => {
        if (prev) {
          return {
            ...prev,
            likes: [
              ...prev.likes,
              {
                id:Math.random().toString(),
                createdAt: new Date(),
                updatedAt: new Date(),
                likerName,
                likerPic,
                postId,
                userId,
              },
            ],
          };
        } else {
          return prev;
        }
      });
    }

    const response = await axios.post("/api/like", { postId, userId, likerName, likerPic })
    if (response.data.message) {
      toast.success(response.data.message)

    }
    else if(response.data.error){
      toast.error(response.data.error)
      setPost(post)
    }
    setliking(false)
  }

  return (
    <>
      
        <Paper

          className="my-2 p-3 w-[80vw] md:w-[40vw] lg:w-[30vw] mx-auto "
        >
          <section className="grid grid-cols-2 grid-rows-2 w-fit  ">
            <Avatar
              src={post.profile}
              className=" row-span-2  aspect-square cursor-pointer"
              onClick={() => {
                setscreenLoading(true);
                router.push(`/user/${post.userId}`);
              }}
            />

            <Typography variant="body1" className={`${font1.className}`}>
              {post.fullname}
            </Typography>
            <Typography variant="body2" className=" opacity-70 font-mono">
              @{post.username}
            </Typography>
          </section>
          <article>
            <p className=" text-xs opacity-70 ">
              Created - {formatCustomDate(post.createdAt.toLocaleString())}
            </p>
            <p className={`${font2.className} mt-1 border-t-2 py-2 `}>
              {post.content}
            </p>
          </article>
          <section className="   w-full aspect-square mx-auto rounded-lg  bg-slate-300">
            <img
              src={post.pictures[0]}
              alt={`${post.fullname}s Post Image`}
              className="w-full h-full object-cover"
            />
          </section>


          { Post &&
            <React.Fragment>

              <section
                className={`${font3.className} text-purple-700 opacity-70 bg-slate-50 p-1 my-1`}
              >
                <p>
                  {Post.likes.length == 0
                    ? "No likes yet"
                    : Post.likes.length == 1
                      ? `Liked by ${Post.likes[0].likerName}`
                      : Post.likes.length == 2 ? `Liked by ${Post.likes[0].likerName} and ${Post.likes[1].likerName}` : `Liked by ${Post.likes[0].likerName} and others`
                  }
                </p>
              </section>
              <section className="ButtonSection mt-2 flex">
                <Button
                    disabled={liking}
                  onClick={() =>
                    likePost(
                      Post.id,
                      user?.id as string,
                      user?.username as string,
                      user?.profilePics[0] as string
                    )
                  }
                  variant="outlined"
                  color={"secondary"}
                  className={`mx-1 text-sm flex justify-center items-center `}
                >
                  {Post.likes.some((like) => like.userId == user?.id) ? <RiThumbUpFill className=" h-5 w-5" /> : <ThumbsUpIcon size={20} />}
                  {Post && <p>{Post.likes.length}</p>}
                </Button>


                <Comments commentsLength={Post.comments.length} postId={post.id} />





              </section>
            </React.Fragment>

          }
        </Paper>


      
    </>
  )
}

export default PostFromProfile