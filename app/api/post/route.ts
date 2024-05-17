import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { downloadURL, TextFieldValue, userId, username, fullname,profile } =
      await req.json();
    console.log(
      "Call received",
      downloadURL,
      TextFieldValue,
      userId,
      username,
      fullname,
      profile
    );

    const storedPost = await prismadb.post.create({
      data: {
        username: username,
        profile: profile,
        content: TextFieldValue,
        pictures: [downloadURL],
        fullname: fullname,
        userId: userId,

      },
    });
    console.log(storedPost);
    return NextResponse.json({ storedPost }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      
    );
  }
}
