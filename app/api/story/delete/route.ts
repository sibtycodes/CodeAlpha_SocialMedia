import prismadb from "@/lib/prismadb"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest) {
    try {
          

        const {storyId,userId} = await req.json()
        
        const user = await prismadb.user.findUnique({
            where:{
                id:userId
            }
        })
        if(!user) return NextResponse.json({error:"Id invalid"})

        console.log(storyId,userId)

        
        

        const story = await prismadb.stories.delete({
           where:{
            id:storyId,

           }
        })

        

        
        

        return NextResponse.json("Story Deleted")
    } catch (error) {
        console.log(error,"Story Access")
        return NextResponse.json({error})
    }
}