import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    //`Get user id from params
    const {userid} = await req.json()
    console.log(userid,"Call received");
    if(!userid) return NextResponse.json({error:"User id not found"},{status:404})
    
    
    const allPosts = await prismadb.post.findMany({
        where:{
            userId: userid
        },
        include:{
          likes:true,
          comments:true
        }
    })
    console.log(allPosts);
    
    return NextResponse.json(allPosts, { status: 200 });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
