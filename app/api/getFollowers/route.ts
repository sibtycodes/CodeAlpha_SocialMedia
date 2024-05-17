import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
//!Followers
export async function POST(req: Request) {
  try {
    //! Get the users id
    const { userid } = await req.json();

    if (!userid) {
      return NextResponse.json({ error: "No user id provided" });
    }

    //Now we will get the followers list of the user
    const User = await prismadb.user.findUnique({
      where: {
        id: userid,
      },
      select: {
        followers: true, //`This Array Returns the ids of the followers
      },
    });

    //Based on Id we will get the user's  ProfilePics,UserNames,FullName,Id

    //!For each string in User.followers we will get the user's profile using the id with prismadb
    if (User?.followers && Array.isArray(User?.followers)) {
      const followersWithDetails = await Promise.all(
        User?.followers.map(async (follower) => {
          const user = await prismadb.user.findUnique({
            where: {
              id: follower,
            },
            select: {
              id: true,
              username: true,
              fullname: true,
              profilePics: true,
            },
          });
          return user;
        })
      );

      // console.log(followersWithDetails, "followersWithDetails");
      return NextResponse.json(followersWithDetails);
    }


  } catch (error) {
    console.log(error, "follower");
    return NextResponse.json({ error });
  }
}

//!Following
export async function PUT(req: Request) {
  try {
    //! Get the users id
    const { userid } = await req.json();

    if (!userid) {
      return NextResponse.json({ error: "No user id provided" });
    }
    //! We will get the following list of the Follower User
    const User = await prismadb.user.findUnique({
      where: {
        id: userid,
      },
      select: {
        following: true,
      },
    });

    //!For each string in User.following we will get the user's profile using the id with prismadb
    if(User?.following && Array.isArray(User?.following)){
        const followingWithDetails = await  Promise.all(User?.following.map(async (following) => {
            const user = await prismadb.user.findUnique({
              where: {
                id: following,
              },
              select: {
                id: true,
                username: true,
                fullname: true,
                profilePics: true,
              },
            });
            return user;
          }))
            // console.log(followingWithDetails, "followingWithDetails");
          return NextResponse.json(followingWithDetails);
          
    }

   
  } catch (error) {
    console.log(error, "follower");
    return NextResponse.json({ error });
  }
}
