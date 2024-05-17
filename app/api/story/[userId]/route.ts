import prismadb from "@/lib/prismadb"
import {type NextRequest, NextResponse } from "next/server"
export async function GET(req:NextRequest) {
    try {
        //Getting the userId,Story Images

        



        const userId = req.url.split('/').pop()
        
        const user = await prismadb.user.findUnique({
            where:{
                id:userId
            }
        })
        if(!user) return NextResponse.json({error:"Id invalid"})

        console.log(userId)

        
        

        const story = await prismadb.stories.findFirst({
           where:{
            userId
           }
        })

        

        
        if(!story) return NextResponse.json({error:"No Story Found"})
        const Story = {
            ...story,
            username:user.username,
            userProfile:user.profilePics[0]
        }
        console.log(Story)

        return NextResponse.json(Story)
    } catch (error) {
        console.log(error,"Story Access")
        return NextResponse.json({error})
    }
}
