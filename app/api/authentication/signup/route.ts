//make route for signup

import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {

        //get user data from request
        const { fullname,username , email, password } = await req.json();


        //find if user already exists
        const user = await prismadb.user.findFirst({
            where: { email: email,username },
        })

        //if user already exists, return error
        if (user) {
            return NextResponse.json({ error: "User with this email already exists" })
        }

        const usernameExists = await prismadb.user.findFirst({
            where: { username },
        })
        if (usernameExists) {
            return NextResponse.json({ error: "User with this username already exists" })
        }
        //hashing the password using bcrypt
        
        const hashedPassword = await  bcrypt.hash(password,10)





        const createdUser = await prismadb.user.create({
            data: {
                fullname,
                username,
                email,
                password:hashedPassword,
                bio:"",
                birthDate:"",
            }
        })

        return NextResponse.json({ successfullyCreated: createdUser })


    } catch (error) {
        console.log(error, "sign-up route error");

    }
}