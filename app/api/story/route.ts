import prismadb from "@/lib/prismadb"
import {type NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest) {
    try {
        //Getting the userId,Story Images

       


        const {userId,storyImages} = await  req.json()

        
        const user = await prismadb.user.findUnique({
            where:{
                id:userId
            }
        })
        if(!user) return NextResponse.json({error:"User Id is invalid"})

       // await prismadb.stories.deleteMany()

        const story = await prismadb.stories.create({
            data:{
                userId,
                userName:user.username,
                caption:"",
                pictures:storyImages

            }
        })

        return NextResponse.json({msg:"Story Created",story})
    } catch (error) {
        console.log(error,"Story Creation")
        NextResponse.json({error})
    }
}
