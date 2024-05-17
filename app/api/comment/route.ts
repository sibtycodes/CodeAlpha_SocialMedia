import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    //`Get the postId,commenterId,comment,commenterName,commenterPic
    const { postId, commenterId, comment, commenterName, commenterPic } =
      await req.json();
    if (!postId || !commenterId || !comment || !commenterName || !commenterPic)
      return NextResponse.json({
        error: "Invalid Request , Data not complete",
      });
    console.log(postId, commenterId, comment, commenterName, commenterPic);

    //`Now we will create the comment
    const commentData = await prismadb.comments.create({
      data: {
        postId,
        commenterName,
        commenterPic,
        commenterId,
        comment,
      },
    });
    return NextResponse.json(commentData);
  } catch (error) {
    console.log(error, "comment route error");
    return NextResponse.json({ error: "Internal Error" });
  }
}
