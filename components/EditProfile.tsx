"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Profile } from "@/components/UserProfile";
import { useQuery } from "@tanstack/react-query";
import ProfilePicUpload from "@/components/UI/ProfilePicUpload";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useScreenLoading, userStore } from "@/store/store";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Poppins, Raleway } from "next/font/google";

import { Input, Paper } from "@mui/material";
import ScreenOff from "@/components/UI/ScreenOff";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const font2 = Raleway({ weight: ["400"], subsets: ["latin"] });

// const schema = z.object({
//     fullname: z.string().nonempty({ message: "Full name is required" }).min(3, { message: "Fullname must be at least 3 characters" }).max(25, { message: "Fullname must be at most 25 characters" }),
//     username: z.string().nonempty({ message: "Username is required" }).min(3, { message: "Username must be at least 3 characters" }).max(25, { message: "Username must be at most 25 characters" }),
//     password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(20, { message: "Password must be at most 20 characters" }),
//   });

const fullnameSchema = z.object({
  fullname: z
    .string()
    .nonempty({ message: "Full name is required" })
    .min(3, { message: "Fullname must be at least 3 characters" })
    .max(25, { message: "Fullname must be at most 25 characters" }),
});
const usernameSchema = z.object({
  username: z
    .string()
    .nonempty({ message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(25, { message: "Username must be at most 25 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username should not contain symbols" })
    
    
});
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(20, { message: "Password must be at most 20 characters" }),
});

type FullnameFormValues = {
  fullname: string;
};

type UsernameFormValues = {
  username: string;
};

type PasswordFormValues = {
  password: string;
};

function EditProfile() {
  //`update session function
  const { update, data } = useSession();
  const userid = data?.user.id;
  const accessToken = data?.user.token;

  //? state management

  const { setscreenLoading } = useScreenLoading();
  const { btnLoading } = userStore();

  //` Now we will create  three forms with useForm from react-hook-form
  const fullnameform = useForm<z.infer<typeof fullnameSchema>>({
    resolver: zodResolver(fullnameSchema),
    defaultValues: {
      fullname: "",
    },
  });

  const usernameform = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });
  const passwordform = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  //` Now we will destruct the register,handleSubmit,error function from the useForm hook

  const {
    register: usernameRegister,
    handleSubmit: usernameHandleSubmit,
    formState: { errors: usernameErrors },
  } = usernameform;
  const {
    register: fullnameRegister,
    handleSubmit: fullnameHandleSubmit,
    formState: { errors: fullnameErrors },
  } = fullnameform;
  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    formState: { errors: passwordErrors },
  } = passwordform;

  //!  Functions for fullname, username, password
  function onSubmit(formData: FullnameFormValues) {
    let updating = toast.loading("Updating") 
    const { fullname } = formData;
    axios
      .post(
        "/api/editUser",
        { fullname, userid },
        {
          headers: {
            accessToken: accessToken,
          },
        }
      )
      .then((res) => {
        toast.dismiss(updating)
        if (res.data.error) {
          toast.error(res.data.error);
        } else {
          update({ fullname });
          toast.success(res.data.message);
        }
      });
  }

  function onUsernameSubmit(formData: UsernameFormValues) {
    let updating = toast.loading("Updating...") 
    // Handle the username form submission
    const { username } = formData;
    axios
      .post(
        "/api/editUser",
        { username, userid },
        {
          headers: {
            accessToken: accessToken,
          },
        }
      )
      .then((res) => {
        toast.dismiss(updating)
        if (res.data.error) {
          toast.error(res.data.error);
        } else {
          update({ username });
          toast.success(res.data.message);
        }
      });
  }

  function onPasswordSubmit(formData: PasswordFormValues) {
    let updating = toast.loading("Updating") 
    // Handle the password form submission
    const { password } = formData;
    axios
      .post(
        "/api/editUser",
        { password, userid },
        {
          headers: {
            accessToken: accessToken,
          },
        }
      )
      .then((res) => {
        toast.dismiss(updating)
        if (res.data.error) {
          toast.error(res.data.error);
        } else {
          update({ password });
          toast.success(res.data.message);
        }
      });
  }

  return (
    <>
      <ScreenOff />

      <section>
        {
          //show the edit
          <section className="md:bg-white rounded-xl shadow-lg shadow-black md:w-[90%] mx-auto pt-3 mt-3 ">
            <section className="mt-9 grid place-content-center ">
              <h4 className={`text-4xl  font-medium font-mono`}>
                Edit Profile
              </h4>
            </section>

            <section className="mx-auto md:grid md:grid-cols-2 ">
              {/*Fullname Form */}
              <form
                noValidate
                className="py-3 mx-7"
                onSubmit={fullnameHandleSubmit(onSubmit)}
              >
                <TextField
                  autoComplete="off"
                  required
                  fullWidth
                  id="fullname"
                  label="Fullname"
                  autoFocus
                  {...fullnameRegister("fullname", {
                    required: "FullName is required",
                  })}
                  helperText={
                    fullnameErrors.fullname
                      ? fullnameErrors.fullname?.message
                      : null
                  }
                />

                <Button
                  disabled={btnLoading}
                  className={`${font2.className} block mx-auto w-1/3   text-black hover:text-white`}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>
              </form>

              {/* Username form */}
              <form
                noValidate
                className="py-3 mx-7"
                onSubmit={usernameHandleSubmit(onUsernameSubmit)}
              >
                <TextField
                  autoComplete="off"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  {...usernameRegister("username", {
                    required: "Username is required",
                  })}
                  helperText={
                    usernameErrors.username
                      ? usernameErrors.username?.message
                      : null
                  }
                />

                <Button
                  disabled={btnLoading}
                  className={`${font2.className} block mx-auto w-1/3   text-black hover:text-white`}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>
              </form>

              {/* Password form */}
              <form
                noValidate
                className="py-3 mx-7 col-span-2"
                onSubmit={passwordHandleSubmit(onPasswordSubmit)}
              >
                <TextField
                  autoComplete="off"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  autoFocus
                  {...passwordRegister("password", {
                    required: "Password is required",
                  })}
                  helperText={
                    passwordErrors.password
                      ? passwordErrors.password?.message
                      : null
                  }
                />

                <Button
                  disabled={btnLoading}
                  className={`${font2.className} block mx-auto w-1/3   text-black hover:text-white`}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>
              </form>
            </section>

            <ProfilePicUpload />
            {/* <Button onClick={()=>{
                                update({fullname:"Sibty shah"})
                            }}>Change Fullname</Button> */}
          </section>
        }
      </section>
    </>
  );
}

export default EditProfile;

/* <form noValidate className='py-5 mx-10' onSubmit={handleSubmit(onSubmit)}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="off"

                                            required
                                            fullWidth
                                            id="fullname"
                                            label="Fullname"
                                            autoFocus
                                            {...register("fullname", { required: "FullName is required" })}
                                            helperText={errors.fullname ? errors.fullname?.message : null}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="username"
                                            label="UserName"

                                            autoComplete="off"
                                            {...register("username", { required: "Username is required" })}
                                            helperText={errors.username ? errors.username?.message : null}

                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth

                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="off"
                                            {...register("password", { required: "Password is required", })}
                                            helperText={errors.password ? errors.password?.message : null}
                                        />
                                    </Grid>

                                </Grid>
                                <Button
                                    disabled={btnLoading}
                                    className={`${font2.className} text-black hover:text-white`}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                // onClick={(e)=>{handleSubmit(e)}}
                                >
                                    Submit Changes
                                </Button>

                            </form> */

//! Form creation
// const form = useForm<z.infer<typeof schema>>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//         fullname: "",
//         username: "",
//         password: "",

//     },
// });
// const { register, handleSubmit, formState: { errors } } = form;

// //` onsubmit function for fullname, username, password
// function onSubmit(formData:FormValues){
//     const {fullname,password,username} = formData
//     update({fullname,username})
// }
