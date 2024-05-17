import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        //! We check if the user is authenticated
        const token = req.headers.get("accessToken");
        
        if(!token){
            return NextResponse.json({error:"No token found"});
        }

        //getting the followerId and followedId
        const {followerId,followedId} = await req.json();

        //find the follower to put its details{id} in the followers array of followed user
        const follower = await prismadb.user.findUnique({ //!this returns {id}
            where:{
                id:followerId
            },
            //`only include id
            select:{
                id:true,
                following:true
                
            }
        })
        if(!follower){
            return NextResponse.json({error:"No follower found"});
        }
        console.log("Follower found",follower);
        

        //find the followed to put its details{id} in the following array of follower
        const followed = await prismadb.user.findUnique({ //! this returns {id}
            where:{
                id:followedId
            },
            select:{
                id:true,
                followers:true
                
            }
        })
        if(!followed){
            return NextResponse.json({error:"No followed found"});
        }
        console.log("Followed found",followed);

        //! We will update the followers array of followed person 
        const followedUpdated = await prismadb.user.update({
            where:{
                id:followedId

            },
            data:{
                followers:[followerId,...followed.followers]
            }
        })
        
        //!We will update the following array of follower 
        const followerUpdated = await prismadb.user.update({
            where:{
                id:followerId
            },
            data:{
                following:[followedId,...follower.following]
            }
        })
        

        return NextResponse.json({message:`Following`,followerUpdated,followedUpdated});

        
    } catch (error) {
        console.log(error,"Follow");
        
    }
}




export async function PUT(req:NextRequest) {
    try {
        //! We check if the user is authenticated
        const token = req.headers.get("accessToken");
        
        if(!token){
            return NextResponse.json({error:"No token found"});
        }

        //getting the followerId and followedId
        const {followerId,followedId} = await req.json();

         

        //`Get the followed id and select only followers list
        const followed_User = await prismadb.user.findUnique({
            where:{
                id:followedId
            },
            select:{
                followers:true
            }
        })

        //  We deleted the followerId from the followers list
        const newFollowers =  followed_User?.followers.filter(follower=>follower!==followerId)


        

        //`update with new followers list
       const updatedFollowed= await prismadb.user.update({
            where:{
                id:followedId
            },
            data:{
                followers:newFollowers 
            }
        })
        
        

        //! Get the following list from the follower 
        const following_User = await prismadb.user.findUnique({
            where:{
                id:followerId
            },
            select:{
                following:true
            }
        })

        //? Delete the followedId from the following list
        const newFollowing = following_User?.following.filter(followingUserId=>followingUserId!==followedId)
        

       const updatedFollower =  await prismadb.user.update({
            where:{
                id:followerId
            },
            data:{
                following:newFollowing
            }
        })

        

        return NextResponse.json({message:`Unfollowed`,updatedFollower,updatedFollowed})

        
    } catch (error) {
        console.log(error,"UnFollow");
        
    }
}