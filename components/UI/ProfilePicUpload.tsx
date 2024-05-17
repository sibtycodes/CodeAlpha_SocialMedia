'use client'
import React, { useState } from 'react'
import { Button, Card, Input } from "@mui/material"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from '@/firebase.config'
import { Poppins } from 'next/font/google'
import { ImageIcon, UploadCloudIcon } from 'lucide-react'
import LinearProgressLabel from '@/components/UI/LinearProgressLabel'
import { queryData } from '../UserProfile'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from "js-cookie"
import jwt from 'jsonwebtoken'
import { toast } from 'react-hot-toast'
import { useSession } from 'next-auth/react'

const font1 = Poppins({ subsets: ['latin'], weight: ['400'] })



function ProfilePicUpload() {

   

   const session = useSession()
   const userid = session.data?.user.id
   const update = session.update
    

    

    

    
    const [isUploading, setIsUploading] = useState(false)
    const [progressUpload, setProgressUpload] = useState(0)
    const [removeUpload, setremoveUpload] = useState<boolean>(false)

    //create state for the file
    const [imageFile, setImageFile] = useState<File | null>(null)

    //create funtion when new image is uploaded
    const handleImageSelect = (event: any) => {

        setremoveUpload(false)

        //acess the file
        const file = event.target.files[0]
        const { name, size, type } = file

        //set the file to the state
        setImageFile(file)


    }

    //create function to upload the image
    const handleImageUpload = () => {
        //check if the file is not null
        if (imageFile) {

            //Set Uploading
            setIsUploading(true)

            //create a reference to the storage
            const storageRef = ref(storage, `profile/${imageFile.name}`)

            //create a task to upload the file
            const uploadTask = uploadBytesResumable(storageRef, imageFile)

            // Keep track of the upload interval
            let uploadInterval: NodeJS.Timeout | undefined;

            //snapshot is an object that contains information about the current state of the upload.
            uploadTask.on('state_changed', (snapshot) => {

                //The progress variable calculates the percentage of progress based on the ratio of bytes transferred to the total bytes.

                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                // clearInterval(uploadInterval) is used to stop any previous interval that might be running. This is important to avoid conflicts and ensure that there's only one interval running at a time.
                clearInterval(uploadInterval);

                //A new interval is started using setInterval that updates the progress smoothly by gradually increasing it until it reaches the current progress value.
                uploadInterval = setInterval(() => {
                    // Increment the progress smoothly until it reaches the current progress
                    setProgressUpload((prevProgress) => {
                        const increment = 2; //The increment value controls the speed at which the progress increases

                        //Math.min returns smallest number b/w prevProgress + increment and progress
                        //e.g if prevProgress is 10 and increment is 2 and progress is 50 then Math.min will return 12
                        const nextProgress = Math.min(prevProgress + increment, progress);

                        //Now if prevprogress + increment is 50 and progress is 50 then Math.min will clear the interval and store 50 in progress Upload
                        if (nextProgress === progress) {
                            clearInterval(uploadInterval); // Stop the interval when progress is reached
                        }
                        return nextProgress; //stored in progressUpload
                    });
                }, 10); // Update every 10 milliseconds (you can adjust this value)






            },

                //handle error
                (error) => {
                    console.log(error)
                },


                //On complete, get the download URL from uploadTask and setUploading to false

                () => {


                    setremoveUpload(true)
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {




                            //Set Uploading to false
                            setIsUploading(false);

                            

                            console.log('File available at', downloadURL);
                            
                            //send axios post request to upload profile pic
                            axios.post("/api/profile/setPic", { downloadURL, userid})
                                .then((res) => {
                                    
                                    //!update the session 
                                    update({profilePics:[downloadURL,...session.data?.user.profilePics as string[]]})
                                    

                                    
                                    
                                    console.log(res.data.profilePics)
                                    if(res.data.error){
                                        toast.error(res.data.error)
                                    }
                                    toast.success("Profile Pic Uploaded Successfully")
                                    
                                    
                                    
                                })
                                

                        })
                        .catch((error) => {
                            console.log("Download URL Error:", error);
                        });
                });


        }
    }
    return (
        <main className='p-3 mt-10 '>
            {/* Section for file upload */}
            <section className='p-2 space-y-5'>
                {/* <h1 className={`${font1.className} text-3xl`}>{userProfilePics?"Upload Profile Picture":"Edit Profile Picture"}</h1> */}

                <Card variant="outlined" className='space-y-5   p-5'>
                    


                    {
                        //?ImagePreview -If image is uploaded then show image otherwise show icon

                        !imageFile ?
                            <section className='h-40 w-40 mx-auto sm:h-52 sm:w-52 lg:h-72 lg:w-72 bg-slate-100 grid place-content-center rounded-full'>
                                

                                {/* If pics are available then show the latest pic */}

                                {session.data?.user.profilePics ?
                                <img className=' h-40 w-40 mx-auto sm:h-52 sm:w-52 lg:h-72 lg:w-72  object-cover rounded-full '  alt="" src={ session.data.user?.profilePics[0] as string} />:
                                <ImageIcon size={30} className='animate-pulse ' />
                            }


                            </section>
                            : <img className=' h-40 w-40 mx-auto sm:h-52 sm:w-52 lg:h-72 lg:w-72  object-cover rounded-full ' src={imageFile ? URL.createObjectURL(imageFile) : ''} alt="" />
                            
                            
                    }

                   

                    {//! ImageUpload,Select,Remove
                    }
                    <section className=' justify-evenly grid grid-cols-2 sm:grid-cols-3 grid-rows-2 sm:grid-rows-1   w-full gap-4 '>
                        <label className={` ${isUploading ? "opacity-50 pointer-events-none" : " pointer-events-auto opacity-100"} bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded cursor-pointer col-span-2 sm:col-span-1`}>
                            Select File
                            <input type="file" disabled={isUploading} accept="" className="hidden" onChange={(event) => { handleImageSelect(event) }} />
                        </label>

                        {/* UploadButton */}
                        <Button disabled={imageFile === null || isUploading || removeUpload} variant="outlined" color="primary" onClick={handleImageUpload}>Upload</Button>

                        {/* RemoveButton */}
                        <Button disabled={imageFile === null || isUploading  || removeUpload} variant="outlined" color="secondary" onClick={() => setImageFile(null)}>Remove</Button>
                    </section>


                    <LinearProgressLabel isUploading={isUploading} progress={progressUpload} />





                </Card>

            </section>
        </main>
    )
}

export default ProfilePicUpload