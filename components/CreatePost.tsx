"use client";
import {
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Paper,
  TextField,
  TextareaAutosize,
  Accordion,
} from "@mui/material";
import {
  CrossIcon,
  ExpandIcon,
  ImageIcon,
  RemoveFormattingIcon,
} from "lucide-react";
import { MdCancel } from "react-icons/md";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { storage } from "@/firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import { error } from "console";

type Props = {};

function CreatePost({}: Props) {
  const session = useSession();
  
  const userId = session?.data?.user.id;
  const username = session.data?.user.username;
  const fullname = session.data?.user.fullname;
  

  const [uploadingPost, setUploadingPost] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[] | null>([]);
  const [TextFieldValue, setTextFieldValue] = useState("");
  const [downloadURLList,setdownloadURLList] = useState<string[]>([])

  //`handleImageSelect` is used to handle the image selection from the user

  function handleImageSelect(event: any) {
    const file = event.target.files[0];
    console.log(file);

    //If the file size if greater than 10MB then show a toast
    if (file && file.size > 10000000) {
      toast.error("File size should be less than 10MB");
      setFile(null);
    } else {
      setFile(file);
    }
  }
  //`We create same select function for multiple files
  function handleImagesSelect(event:any){
    const allFiles = event.target.files 
    setFiles(allFiles)
  }

  function SubmitPost(){
    if(files == null ) return

    setUploadingPost(true);

    const loadingToast = toast.loading("Creating Post...");

    //`Loop over files and post each file
    for (const file of files) {
      const storageRef = ref(storage,`posts/${username}/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef,file)

      uploadTask.on("state_changed",
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes )*100
        console.log(`progress of ${file.name} is ${progress}`);
        
      },
      (error)=>{
        toast.error(`Error in uploading ${file.name} file`)
        console.log(error)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          //`In the state of dowload URL add the download URl
          setdownloadURLList(downloadURLList=>[...downloadURLList ,downloadURL])
        })
      }


      )
    }
  }
  function postSubmit() {
    //Set uploading true
    setUploadingPost(true);
    //Show loading toast
    const loadingToast = toast.loading("Creating Post...");

    //`The image will be uploaded to firebase and link will be saved to imageLink
    if (file) {
      const storageRef = ref(storage, `posts/${username}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      //when task is completed save the download url
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");

          // setFile(null);
          // setTextFieldValue("");
        },
        (error) => {
          // Handle unsuccessful uploads
          toast.error("Error in uploading");
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);

            //`Now send the data to  server
            axios
              .post("/api/post", {
                downloadURL,
                TextFieldValue,
                userId,
                username,
                fullname,
                profile:session.data?.user.profilePics[0]

              })
              .then((res) => {
                if (res.data.error) {
                  console.log(res.data.error);
                  toast.remove(loadingToast);
                  toast.error("Error in Creating Post");
                } else {
                  console.log(res.data);
                  toast.remove(loadingToast);
                  toast.success("Post Created Successfully");
                  setFile(null);
                  setTextFieldValue("");
                }
                setUploadingPost(false);
              });
          });
        }
      );
    }
  }

  return (
    <main className="w-full px-2 text-center pt-4">
      {/* Create a post section in which their is image option text area and user pic by side and create post button */}

      <Paper className="  mx-auto w-[80vw] md:w-[50vw] lg:w-[37vw]   flex-col flex justify-between p-3 ">
        <section className="flex flex-row  flex-wrap w-full flex-1 px-2 text-center gap-2 my-1">
          <Avatar className="w-14 h-14 " src={session.data?.user.profilePics[0]} />
          <TextField
            className="font-mono basis-3/4 sm:basis-[80%] h-20"
            value={TextFieldValue}
            placeholder="Whats on your mind?"
            multiline
            maxRows={2}
            onChange={(event) => {
              setTextFieldValue(event.target.value);
            }}
          />
        </section>
        <section className="lg:flex-row lg:gap-3 flex flex-col">
          <Accordion className="lg:basis-5/6">
            <AccordionSummary
              expandIcon={<ExpandIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <section className="  flex justify-start items-center my-1 opacity-75 p-2 bg-blue-100 ">
                <button className="UploadButton">
                  <label
                    htmlFor="file"
                    onClick={() => {}}
                    className=" flex text-sm font-mono cursor-pointer"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Select Image
                  </label>
                  <input
                    type="file"
                    id="file"
                    className="hidden"
                    onChange={(event) => {
                      handleImageSelect(event);
                    }}
                  />
                </button>
              </section>
            </AccordionSummary>
            <AccordionDetails>
              <section
                className={`${
                  !file && " w-44"
                } h-64 w-64 bg-slate-300 mx-auto relative`}
              >
                <MdCancel
                  className={`${
                    !file && "hidden"
                  } bg-white rounded-xl h-6 w-6 absolute top-0 right-0 cursor-pointer`}
                  onClick={() => {
                    setFile(null);
                  }}
                />

                <img
                  src={file ? URL.createObjectURL(file) : "/imgtemp.png"}
                  alt=""
                  className={` bg-white w-full h-full `}
                />
              </section>
            </AccordionDetails>
          </Accordion>

          <button
            disabled={!file || TextFieldValue.length == 0 || uploadingPost}
            className={`${
              (!file || TextFieldValue.length == 0 || uploadingPost) &&
              " pointer-events-none opacity-30"
            } block mx-auto p-2 w-3/4 md:w-1/2 lg:w-1/4 h-10 justify-end items-end rounded-xl text-xl font-semibold font-mono bg-blue-500 my-3 text-white`}
            onClick={postSubmit}
          >
            CREATE POST
          </button>
        </section>
      </Paper>
    </main>
  );
}

export default CreatePost;
