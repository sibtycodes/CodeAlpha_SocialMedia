import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import prismadb from "@/lib/prismadb";

// export async function GET(req:NextRequest) {
//     try {
//         //` Get the current logged in user and its following list
//         const session = await getServerSession(options)
//         const loggedUserId = session?.user.id
//         const user = await prismadb.user.findUnique({
//           where:{
//             id:loggedUserId
//           },
//           select:{
//             following:true
//           }
//         })

//         const userFollowingList = user?.following
//         console.log(userFollowingList);

//         if(!userFollowingList) return NextResponse.json({message:"No Following",status:404})
//         // await prismadb.post.deleteMany() ////USED TO Delete all posts

//         //`In userFollowingList ,For each folllowing Id we get all the posts of that id
//         const allPosts =  await Promise.all(userFollowingList.map(async (followingId) => {
//             const postList = await prismadb.post.findMany({
//               where: {
//                 userId: followingId
//               },
//               include:{
//                 likes:true,
//                 comments:true,
//               }

//             });
//             return postList;
//           }));
//           //`allPosts is an array of array of posts ,turn into a single array of posts and make them array elements random
//         const Posts = allPosts.flat()

//         // const shuffledPostList = fisherYatesShuffle(Posts)

//         return NextResponse.json(Posts, {status: 200})
//     } catch (error) {
//         return NextResponse.json({error:"Internal Error"})
//     }
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

  const followingListIds = loggedUser.following;

  const posts = await prismadb.post.findMany({
    where: {
      userId: {
        in: followingListIds,
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
  return NextResponse.json({ error: "Something went wrong ",details:error });
}
}
