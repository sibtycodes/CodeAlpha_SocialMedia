import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import prismadb from "@/lib/prismadb";

// export async function GET(req: NextRequest) {
//   try {
//     //` Get the current logged in user and its following list
//     const session = await getServerSession(options);
//     const loggedUserId = session?.user.id;
//     const user = await prismadb.user.findUnique({
//       where: {
//         id: loggedUserId,
//       },
//       select: {
//         following: true,
//       },
//     });

//     const userFollowingList = user?.following;
//     console.log(userFollowingList);

//     if (!userFollowingList)
//       return NextResponse.json({ message: "No Following", status: 404 });

//     //`Now we find all posts and show only that are not following posts
//     const ExplorePosts = await prismadb.post.findMany({
//       where: {
//         userId: {
//           notIn: [...userFollowingList, loggedUserId as string], //!not own or following
//         },
//       },
//       include: {
//         likes: true,
//         comments: true,
//       },
//     });
//     console.log(ExplorePosts, "ExplorePosts");

//     return NextResponse.json(ExplorePosts || null);
//   } catch (error) {
//     console.log("Error in ExplorePosts", error);
//     return NextResponse.json({ error: "Internal Error", details: error });
//   }
// }
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    //Get the following list of user

    const loggedUser = await prismadb.user.findUnique({
      where: { id: userId },
      select: { following: true },
    });

    if (!loggedUser)
      return NextResponse.json({ error: "User Not Found or Incorrect Id" });

    const followingList = loggedUser.following;
    const idsToNotInclude = [...followingList, userId]; //own id + following

    const posts = await prismadb.post.findMany({
      where: {
        userId: {
          notIn: idsToNotInclude,
        },
      },
      include: {
        likes: true,
        comments: true,
      },
    });

    if (!posts) return NextResponse.json({ error: "No posts found" });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({
      error: "Something went wrong ",
      details: error,
    });
  }
}
