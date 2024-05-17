import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

//? This route is for liking the post
export async function POST(req: NextRequest) {
  try {
    //` We will get the postId,userId, likerName,likerPic
    const { postId, userId, likerName, likerPic } = await req.json();

    //If the like is already present then we will unlike
    const findLike = await prismadb.like.findFirst({
      where: {
        postId,
        userId,
      },
    });
    if (findLike)
    {
      await prismadb.like.delete({
        where: {
          id: findLike.id,
        },
      })
      return NextResponse.json({ message: "Unliked" });
    }
    

    //If like is not present then we will create the like
    const like = await prismadb.like.create({
      data: {
        postId,
        likerName,
        likerPic:likerPic?likerPic:"/s.png",
        userId,
      },
    });
    return NextResponse.json({ message: "Liked Successfully", like });
  } catch (error) {
    console.log(error, "like route error");

    return NextResponse.json({ error: "Internal Error   " });
  }
}
