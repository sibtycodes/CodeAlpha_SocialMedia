'use client'
import * as React from 'react';
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
import { Poppins } from 'next/font/google';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios'; import { toast } from 'react-hot-toast';


import { useRouter } from 'next/navigation';
import { useScreenLoading, userStore } from '@/store/store';
import ScreenOff from './UI/ScreenOff';


import { signIn } from "next-auth/react"


const font2 = Poppins({ weight: ['400'], subsets: ['latin'] })

//schema for form
const schema = z.object({
  email: z.string().min(3),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(50, { message: "Password must be less than 50 characters" })

})




export default function SignIn() {


  //loading button state
  const { btnLoading, setBtnLoading, } = userStore()
  //loading screen state
  const { screenloading, setscreenLoading } = useScreenLoading()




  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: ""
    }
  })
  //get handle submit, register, and errors from form
  const { handleSubmit, register, formState: { errors } } = form

  async function onSubmit(formData: { email: String, password: String }) {

    //btn disable
    setBtnLoading(true)

    //loading sign in
    const loading_signin = toast.loading("Signing in...")

    //` We will send {error} object on error from nextauth then if error is true we will show error message to user
    // ! If their is no error we will redirect to "/"

    signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
      callbackUrl: "/"

    })
      .then((callback) => {
        console.log(callback, "callback");

        if (callback?.error) {
          toast.error(callback.error)
          toast.remove(loading_signin)
        } else {
          toast.success("Signed in successfully")
          toast.remove(loading_signin)
          setscreenLoading(true)
          window.location.assign("/")
          form.reset()
        }
      })
      .catch((error) => {
        toast.error(error)
        toast.remove(loading_signin)
      })
      .finally(() => {
        setBtnLoading(false)
      })












  }



  return (
    <>
      <ScreenOff />

      <section className=' grid lg:grid-cols-2 place-content-center '>
        {/* <img src="/login.jfif" alt="" className=' hidden lg:block' /> */}
        <video src="/log.mp4" loop autoPlay className=' mx-auto max-h-[80vh] hidden lg:block'></video>
      
      <Container className=' mx-auto' component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address or Username"
              {...register("email", { required: "Email or Username is required" })}
              autoComplete="off"
              autoFocus
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              {...register("password", { required: "Password is required" })}
              label="Password"
              type="password"
              id="password"
              autoComplete="off"
              helperText={errors.password?.message}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}


            <Button
              disabled={btnLoading}
              className={`${font2.className} text-black hover:text-white`}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
      </section>

    </>
  );
}