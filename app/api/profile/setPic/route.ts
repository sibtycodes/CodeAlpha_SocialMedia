import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    
    try {
        // get profile pic and user id

        const {downloadURL, userid} = await req.json();

        // Retrieve the existing user profile
        const existingUser = await prismadb.user.findUnique({
            where: {
                id: userid
            }
        });
        
        
        if(!existingUser) return NextResponse.json({error:"User not found"})

        const user = await prismadb.user.update({
            where:{
                id:userid
            },
            data:{
                //push the download Url to profile pic array
                profilePics:[downloadURL,...existingUser.profilePics]
                
            }
        })

        return NextResponse.json(user)

    } catch (error) {
        console.log(error,"profilepic");
        NextResponse.json({error:"Internal Error"})
    }


}