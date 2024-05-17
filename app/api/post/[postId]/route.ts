import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{postId:string}}) {
    try {
        //`Get the post with id ${req.pathParams.postId}`
        const postId = params.postId
        console.log(postId,"post id");
        
        
        
        
        const post = await prismadb.post.findUnique({
            where:{
                id:postId
            },
            include:{
                likes:true,
                comments:true
            }
        })
        if(!post) return NextResponse.json({error:"Post Not Found"})
        console.log(post)
        return NextResponse.json(post)
        


    } catch (error) {
        console.log(error,"error in get post");
        
        return NextResponse.json({error:"Internal Server Error"})
    }
}