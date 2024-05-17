'use client'

import React, { useEffect, useState } from 'react'

// type Props = {}

// export default function Sign-up({}: Props) {
//   return (
//     <div>Sign-up</div>
//   )
// }
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm } from 'react-hook-form'

import { Poppins } from 'next/font/google';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useScreenLoading, userStore } from '@/store/store';
import { useRouter } from 'next/navigation';
import ScreenOff from './UI/ScreenOff';





const font2 = Poppins({ weight: ['400'], subsets: ['latin'] })



//set up validation schema
const schema = z.object({
    fullname: z.string().nonempty({ message: "Full name is required" }).min(3, { message: "Fullname must be at least 3 characters" }).max(25, { message: "Fullname must be at most 25 characters" }),
    username: z.string().nonempty({ message: "Username is required" }).min(3, { message: "Username must be at least 3 characters" }).max(25, { message: "Username must be at most 25 characters" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(20, { message: "Password must be at most 20 characters" }),
});

//set types for form
type FormValues = {
    fullname: string;
    username: string;
    email: string;
    password: string;
};


export default function signup() {

    const router = useRouter()

    //create form
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullname: "",
            username: "",
            email: "",
            password: "",
        },
    });
    const { register, handleSubmit, formState: { errors } } = form;

    //get submit btn loading state
    const { btnLoading, setBtnLoading } = userStore()






    const onSubmit = (data: FormValues) => {



        //loading toast
        const loadingtoast = toast.loading('Creating your account...')

        //set btn disable
        setBtnLoading(true)


        axios.post('/api/authentication/signup', data)
            .then(res => {
                toast.remove(loadingtoast)
                if (res.data.error) {
                    toast.error(res.data.error)

                }
                else {
                    toast.success('Account created successfully')
                    console.log(res.data)
                    form.reset()
                    router.push("/signin")


                }
            })
            .then(() => {
                setBtnLoading(false)

            })
    };

    return (
        <>
            <ScreenOff />

           <section className=' lg:grid lg:grid-cols-2 lg:max-h-[80vh] lg:place-content-center'>
                <img src="/signup.png" className=' mx-auto hidden lg:block max-h-[79vh]' alt="" />
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
    
                        {/* Sign In Image */}
                        <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
                            <LockOutlinedIcon />
                        </Avatar>
    
    
                        <Typography component="h1" className={`${font2.className}`} variant="h5">
                            Sign up
                        </Typography>
    
                        {/* The Input and Submit Box */}
    
                        <form noValidate onSubmit={handleSubmit(onSubmit)} className='py-5'>
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
                                        id="email"
                                        label="Email Address"
                                        type='email'
    
                                        autoComplete="off"
                                        {...register("email", { required: "Email is required" })}
                                        error={errors.email ? true : false}
                                        helperText={errors.email ? errors.email?.message : null}
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
                                {/* <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox value="allowExtraEmails" color="primary" />}
                            label="I want to receive inspiration, marketing promotions and updates via email."
                        />
                    </Grid> */}
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
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/signin" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
    
                    </Box>
                    {/* <Copyright sx={{ mt: 5 }} /> */}
                </Container>
           </section>

        </>

    );
}

function SignUp() {
    throw new Error('Function not implemented.');
}
