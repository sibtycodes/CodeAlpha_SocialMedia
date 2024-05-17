import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export async function POST(req:Request){
    
    try {
        console.log("api sign in call received");
        
        //get email, password
        const {email,password} = await req.json()
        
        //check if user exists, if not, give response to client with msg
        const user_with_email = await prismadb.user.findFirst({
            where:{
                email
            },
            
        })

        if(!user_with_email) return NextResponse.json({error:"User with this email does not exist"})

        //check if password is correct by comparing the stored hash password and given password

        const isPassCorrect = await bcrypt.compare(password,user_with_email.password)
       

        if(!isPassCorrect) return NextResponse.json({error:"Password is incorrect"})

        //if password is correct, create a jwt token and send it to client
        const token = jwt.sign({id:user_with_email.id},process.env.NEXTAUTH_SECRET as string)
        

        return NextResponse.json({user_with_email,token})
         


    } catch (error) {
        console.log(error,"sign in route");
        return NextResponse.json({error:"Something went wrong",})
        
    }
}










