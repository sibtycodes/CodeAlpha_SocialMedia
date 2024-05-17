import prismadb from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

//`Get comments by post Id
export async function GET(req:NextRequest) {
    try {
        //`Get the postId by url last part
        
        const body =  req.url
        const postId = body.split("/").pop() //split the url and get the last part

        // await prismadb.comments.deleteMany()
        
        const Comments = await prismadb.comments.findMany({
            where:{
                postId
            }
        })
        if(Comments.length ==0) return NextResponse.json({nocomments:"No Comments Yet"})
       

        //`Now we will return the comments
        return NextResponse.json(Comments)
    } catch (error) {
        console.log(error,"comment route error")
        return NextResponse.json({error:"Internal Error"})
    }
}
