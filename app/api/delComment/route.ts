import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        //`Get the postId by url last part
        
      const {commentId} = await req.json()
        console.log(commentId);
        if(!commentId) return NextResponse.json({error:"No comment Id"})
        // const FindComm = await prismadb.comments.findUnique({
        //     where:{
        //         id:commentId

        //     }
        // })
        const DelComment = await prismadb.comments.delete({
            where:{
                id:commentId
            }
        })
        return NextResponse.json({commentId,DelComment})
       

      
    } catch (error) {
        console.log(error,"comment del route error")
        return NextResponse.json({error:"Internal Error"})
    }
}