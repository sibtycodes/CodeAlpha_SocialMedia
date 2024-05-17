'use client'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Cabin, Laila, Love_Ya_Like_A_Sister, Qahiri } from 'next/font/google';
import React, { useState } from 'react'
import { Avatar, Button, CircularProgress, Input, SwipeableDrawer } from '@mui/material';
import { useSession } from 'next-auth/react';
import { Heart, MessageCircle, MessageCircleIcon } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
// import { Comments } from '@prisma/client';
import { VscSend } from "react-icons/vsc";
import toast from 'react-hot-toast';
import DelComment from './UI/DelComment';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

type Props = {
    commentsLength: number,
    postId: string,
}
type CommentsModified = {
    id: string;
    likes: string[]
    commenterName: string;
    commenterId: string;
    postId: string;
    comment: string;
    commenterPic: string;
    createdAt?: Date;
    updatedAt?: Date;
    temporary?: boolean
}

type Anchor = 'bottom' //For now it only accepts bottom
const font1 = Laila({ subsets: ["latin"], weight: ["500"] });
const font1b = Laila({ subsets: ["latin"], weight: ["700"] });
const font2 = Cabin({ subsets: ["latin"], weight: ["400"] });
const font3 = Love_Ya_Like_A_Sister({ subsets: ["latin"], weight: ["400"] });
const font4 = Qahiri({ subsets: ["latin"], weight: ["400"] });


function Comments({ commentsLength, postId }: Props) {

    const [btnDisabled, setBtnDisabled] = useState(false);
    const [importComments, setImportComments] = useState<boolean>(false)
    //for submitting comment



    const session = useSession();
    const user = session?.data?.user;

    const [commentsLengthState, setCommentsLengthState] = useState(commentsLength);

    const queryClient = useQueryClient()

    const { data: CommentsList, isLoading, isFetched } = useQuery({
        queryKey: ["comments", postId],
        queryFn: async (): Promise<CommentsModified[]> => {
            return axios.get(`/api/comment/${postId}`).then((res) => {
                // console.log("comments", res.data);
                if (res.data.nocomments) {
                    return [];
                }
                else {
                    return res.data;
                }
            })
        },
        enabled: importComments


    })

    const [TextFieldValue, setTextFieldValue] = useState("");
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
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
    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: 'auto' }}
            role="presentation"


            className=" h-[70vh]  flex flex-col "
        >

            <h2 className={`${font1b.className} text-2xl md:text-3xl p-4 font-bold text-blue-700 text-center `}>Comments</h2>



            <Divider />

            {/* Comments List */}
            <section className=" flex-grow lg:px-10 p-4    overflow-y-scroll snap-mandatory snap-y" style={{ scrollPadding: '3rem' }}>
                {(isLoading || !isFetched) ? <>
                    <section className=' grid place-content-center min-h-[20vh]'>
                        <CircularProgress />
                    </section>
                </> : CommentsList && CommentsList.length > 0 ? CommentsList?.map((comment) => {

                    const isTemporary: boolean = comment.temporary || false;
                    return (
                        <div key={comment.commenterName + Math.random().toString()} className={` rounded-xl my-3 p-3 flex lg:w-2/3 mx-auto justify-between items-center space-x-4 border-b-2 shadow-2xl ${isTemporary ? " opacity-50 " : "opacity-100"} `}>

                            <article className=' flex space-x-2'>
                                <Avatar src={comment.commenterPic} />
                                <section className=''>
                                    <h2 className={`${font3.className} opacity-70 text-sm `}>@{comment.commenterName} </h2>
                                    <p className={`${font1.className} font-bold `}>{comment.comment}</p>

                                </section>
                            </article>
                            <section className=''>
                                {/*! if user's own comment then del otherwise heart */}
                                {user?.id == comment.commenterId ?
                                    <DelComment setCommentsLengthState={setCommentsLengthState} commentId={comment.id} postId={comment.postId} /> :
                                    <section className=' flex flex-col justify-center items-center'>
                                        {
                                            user &&

                                            (comment.likes.includes(user?.id) ?
                                                <BsHeartFill className=' w-5 cursor-pointer' onClick={() => LikeUnlikeComment(comment.likes.includes(user?.id), comment.id, comment.postId)} />
                                                :
                                                <BsHeart className=' w-5 cursor-pointer' onClick={() => LikeUnlikeComment(comment.likes.includes(user?.id), comment.id, comment.postId)} />
                                            )
                                        }
                                        <span className=' text-center text-sm'>{comment?.likes?.length}</span>

                                    </section>
                                }
                            </section>


                        </div>
                    )
                }) :
                    <section className=' grid place-content-center h-full opacity-60'>
                        <h1 className=' text-center'>No Comments Yet</h1>
                        <MessageCircle size={100} className='lg:ml-5 ml-3' />

                    </section>

                }
            </section>

            {/* Add Comments */}
            <section className="  lg:mx-auto lg:w-2/3 flex left-0 bottom-0 space-x-1 p-3  items-center">

                <Avatar className="aspect-square h-full" src={session?.data?.user.profilePics[0]} />
                <Input className=" px-2 text-sm flex-grow   " placeholder="Add a comment" value={TextFieldValue}
                    onChange={(event) => {
                        setTextFieldValue(event.target.value);
                    }} />
                <Button disabled={btnDisabled} onClick={handleAddComment} className="text-sm" variant="outlined" color="secondary"><VscSend /></Button>
            </section>

        </Box>
    );

    async function LikeUnlikeComment(isLiked: boolean, commentId: string, postId: string) {

        console.log(isLiked, commentId, postId, user?.id)
    
        // Optimistic UI update using mutateAsync
       
    
        // Trigger the mutation
        try {
            await mutateLikeOfComment({ isLiked, commentId, commentlikerId: user?.id });
        } catch (error) {
            console.error("Error liking/unliking comment:", error);
        }
    }
    const { mutateAsync: mutateLikeOfComment } = useMutation({

        mutationFn: async (variables: { isLiked: boolean, commentId: string, commentlikerId: string | undefined }) => {
            const { isLiked, commentId, commentlikerId } = variables;
            const res = await axios.post("/api/likeunlikecomment", { isLiked, commentId, commentlikerId });
            const data = res.data;

            if (data.error) {
                toast.error("Couldn't like comment."); // Return error for handling
                return new Error("Could not like")
            }
            console.log(data)
            return data; // Return the updated data from the API
        },
        onMutate: async (variables) => {
            const { isLiked, commentId, commentlikerId } = variables; // Access variables here
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(['comments', postId]);

            // Snapshot the previous value
            const previousComments = queryClient.getQueryData(['comments', postId]);

            // Optimistically update the comments
            queryClient.setQueryData(['comments', postId], (comments: any) => {
                console.log(comments);

                let updatedComments = comments.map((com: any) => {
                    if (com.id === commentId) {
                        if (isLiked) {
                            let index = com.likes.indexOf(user?.id);
                            if (index > -1) {
                                com.likes.splice(index, 1);
                            }
                        } else {
                            com.likes.push(user?.id);
                        }
                    }
                    return com;
                });

                console.log(updatedComments);
                return updatedComments;
            });

            // Return a context object with the snapshotted value
            return { previousComments };
        },
        // Rollback on error
        onError: (err, variables, context) => {
            toast.error("Couldn't like comment.");
            queryClient.setQueryData(['comments', postId], context?.previousComments);
        },
        
    });


    async function handleAddComment() {
        if (postId && user?.id && TextFieldValue.trim() !== "" && user?.username && user?.profilePics[0]) {
            setBtnDisabled(true);

            await mutateAsync()

        }

        else {
            toast.error("Details Missing")
        }

    }
    const { mutateAsync } = useMutation({
        mutationFn: async () => {
            const res = await axios.post("/api/comment", { postId: postId, commenterId: user?.id, comment: TextFieldValue, commenterName: user?.username, commenterPic: user?.profilePics[0] })


            res.data.error && toast.error("Error Commenting" + res.data.error)
            !res.data.error && toast.success("Comment Added")

        },
        onMutate: () => {
            setCommentsLengthState(prev => prev + 1)

            //`Now push the new comment
            queryClient.setQueryData(['comments', postId], (comments: any) => {
                const updatedComments = [
                    { postId: postId, commenterId: user?.id, comment: TextFieldValue, commenterName: user?.username, commenterPic: user?.profilePics[0], temporary: true }, ...comments]
                //?ABOVE temporary is a property we assigned to distinguish b/w temp and permanent comment
                return updatedComments
            })

        },
        onError: () => {
            setCommentsLengthState(prev => prev - 1)
        },
        onSuccess: () => {
            setTextFieldValue("")
        },
        onSettled: () => {

            setBtnDisabled(false);
            queryClient.refetchQueries(["comments", postId])
        }
    })


    return (
        <>
            <Button
                onClick={(event) => {
                    toggleDrawer('bottom', true)(event);
                    setImportComments(true); // fetch comments when button is clicked
                }}
                variant="outlined"
                color="secondary"
                className="mx-1 text-sm flex justify-center items-center "
            >
                <MessageCircleIcon size={20} />
                <p>{commentsLengthState}</p>
            </Button>

            <SwipeableDrawer

                anchor={'bottom'}
                open={state['bottom']}
                onClose={toggleDrawer('bottom', false)}
                onOpen={toggleDrawer('bottom', true)}
            >
                {list('bottom')}
            </SwipeableDrawer>
        </>
    )
}

export default Comments
