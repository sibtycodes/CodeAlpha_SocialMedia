"use client"
import { chatdb } from '@/firebase.config'

import { Avatar, Button, Input } from '@mui/material'

import axios from 'axios'
import { arrayUnion, collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { LoaderIcon, MessageCircleIcon, Send, User2Icon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Days_One, Federant, Holtwood_One_SC, Josefin_Sans, } from 'next/font/google'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
    roomId: string,
    currentProfile: string,
    otherProfile: string
}
const fontMsg1 = Holtwood_One_SC({ subsets: ['latin'], weight: ['400'] })
const fontMsg = Josefin_Sans({ subsets: ['latin'], weight: ['400'] })

function NewMessagesWithInput({ roomId, currentProfile, otherProfile }: Props) {
    const user = useSession()
    const uid = user.data?.user.id
    const uname = user.data?.user.username

    const [input, setInput] = useState("")

    //!For msg sending
    const [sendingMSG, setsendingMSG] = useState(false)

    //!Reference to firestore

    const refToChatApp = collection(chatdb, "chats")

    const [incomingMessages, setincomingMessages] = useState<any[]>([])
    //!use effect to get chats from firestore
    useEffect(() => {

        if (uid) {
            console.log(uid)
            //find the room 
            const dbQuery = query(refToChatApp, where("chatroomId", "==", roomId), orderBy("createdAt"))

            const unsub = onSnapshot(dbQuery, (snapshot) => {
                let messages: any = [];
                snapshot.forEach(doc => {
                    messages.push({ ...doc.data(), id: doc.id }) //get data and id from firestore
                    console.log({ uid, doc: doc.data() })

                    //` Mark the message as read by the current user if it was sent to them
                    //`Make sure the tab is active
                    if ((document.visibilityState === "visible"|| document.hasFocus()) && doc.data().senderId != uid) {

                        markAsRead(doc.id);

                    }
                })

                //!Set msgs
                setincomingMessages(messages)
                //!SCROLL into view demo scroll elem 
                demoScrollElem.current.scrollIntoView({ behavior: "smooth" })




            })

            return () => {
                unsub()
            }
        }
    }, [uid])

    useEffect(() => {
        //`In case the msg is received in bg, and receiver switches to tab after sometime
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' || document.hasFocus()) {
                incomingMessages.forEach(message => {
                    if (message.senderId != uid && !message.readBy.includes(uid)) {
                        markAsRead(message.id);
                    }
                });
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleVisibilityChange);
        window.addEventListener('focus', handleVisibilityChange);
        return () => {
           
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleVisibilityChange);
            window.removeEventListener('focus', handleVisibilityChange);
        };

    }, [incomingMessages])

    //!For scrolling ref on new msg
    const demoScrollElem = useRef<any>()

    //!When the new msg will arrive in incoming msgs we will scroll to last
    useEffect(() => {
        if (demoScrollElem.current) {
            demoScrollElem.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [incomingMessages]);

    const markAsRead = (messageId: string) => {
        // Check if uid is defined
        if (!uid) {
            console.error("User ID is undefined");
            return;
        }

        // Get the chats collection ref of our firestore chat db 
        const collRef = collection(chatdb, "chats")

        // Get the msg with messageId
        let msgRef = doc(collRef, messageId)

        // Update the read status by adding the id of current user
        updateDoc(msgRef, {
            readBy: arrayUnion(uid)
        })
    };


    const sendMessage = async () => {
        //`Set the sending msg to true
        setsendingMSG(true)

        //`Send the msg to the server
        const res = await axios.post("/api/message", { text: input as string, roomId, senderId: uid, senderName: uname })


        if (res.data.error) toast.error(res.data.error)
        else {
            // toast.success("Sent")
            setInput("")
        }

        //`Set the sending msg to false
        setsendingMSG(false)

    };

    // console.log(incomingMessages.filter(ms => ms.senderName == uname))
    // useEffect(() => {
    //     incomingMessages &&console.log(dateToString(incomingMessages[2]?.createdAt.toDate()))
    // }, [incomingMessages])

    //!Create a function that takes in new Date and return a string with format like 12:39 12/12/21


    return (
        <>
            <section className=' h-[60vh] relative  flex flex-col overflow-scroll sm:px-5 md:px-9 bg-slate-100'>
                {
                    incomingMessages.map((message: { senderName: string, text: string, id: string, createdAt: any, readBy: string[] }) =>
                        <section key={message.id} className={`  bg-white shadow-md p-3 rounded-xl ${message.senderName == uname ? "  ml-auto mr-2  w-[44%] " : "  mr-auto ml-2  w-[44%]"} my-3`}>

                            <p className={`  text-xs italic flex ${message.senderName == uname && "justify-end"}  items-center opacity-80`} >
                                <Avatar src={message.senderName == uname ? currentProfile : otherProfile} className={` w-8 h-8 `} />
                                <p className=' font-mono mx-1'>{message.senderName}</p>
                               
                                
                            </p>

                            <p className={`${fontMsg.className} `} >{message.text}</p>

                            <p className='text-xs italic flex justify-end items-center opacity-70' >{dateToString2(message?.createdAt?.toDate())}</p>

                            {/* If this is sender'msg only then show the seen or sent status */}
                            {message.senderName == uname &&
                                <p className='text-xs italic flex justify-end items-center opacity-70' >{message?.readBy[0] ? "Seen" : "Sent"}</p>}

                        </section>
                    )
                }
                <div ref={demoScrollElem}></div>

            </section>


            <section className=' flex mt-4  justify-between bg-white rounded-xl p-3 w-full border border-black'>
                <Input disabled={sendingMSG} onChange={(event) => { setInput(event.target.value) }} className='px-3 sm:px-5 p-1 basis-[60%] sm:basis-3/4' value={input} placeholder='Your Message...' />
                <Button disabled={sendingMSG} variant="outlined" className=' ' onClick={sendMessage}><span className=' mr-2'>Send</span> {sendingMSG ? <LoaderIcon className=' animate-spin' /> : <Send />}</Button>

            </section>
        </>
    )
}

function dateToString2(date: Date) {
    // If the date is null or undefined, return null
    if (!date) return null

    // Get the minutes part of the date, and pad it with a zero if it's less than 10
    const minutes = date.getMinutes().toString().padStart(2, '0');
    // Format the date as "hours:minutes day/month/year"
    let finalDate = `${date.getHours()}:${minutes} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    // Get the current date and time
    const now = new Date();
    // Calculate the difference between the current time and the input date in minutes
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

    // If the difference is less than 1 minute, set finalDate to "Just now"
    if (diffInMinutes < 1) {
        finalDate = "Just now";
    }
    // If the difference is less than 60 minutes, set finalDate to "X minutes ago"
    else if (diffInMinutes < 60) {
        finalDate = `${diffInMinutes} minutes ago`;
    }
    // If the difference is less than 10 hours, set finalDate to "X hours ago"
    else if (diffInMinutes < 60 * 10) {
        const diffInHours = Math.floor(diffInMinutes / 60);
        finalDate = `${diffInHours} hour(s) ago`;
    }
    // If the difference is less than 24 hours (but more than 10 hours), set finalDate to "hours:minutes"
    else if (diffInMinutes < 60 * 24) {
        finalDate = `${date.getHours()}:${minutes}`
    }

    // Return the final date string
    return finalDate;
}
export default NewMessagesWithInput