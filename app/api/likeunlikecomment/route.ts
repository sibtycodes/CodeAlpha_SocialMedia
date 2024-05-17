import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { isLiked, commentId, commentlikerId } = await req.json();

    const comment = await prismadb.comments.findUnique({
      where: { id: commentId },
    });
    let likes = comment?.likes;

    let updatedLikes;
    if (isLiked) {
      updatedLikes = likes?.filter((id) => id != commentlikerId);
    } else {
      likes?.push(commentlikerId);
      updatedLikes = likes;
    }

    const commentFinal = await prismadb.comments.update({
      where: { id: commentId },
      data: {
        likes: updatedLikes,
      },
    });
    return NextResponse.json({ message: "success",commentFinal });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      error: "Internal Server Error",
      details: error,
    });
  }
}
