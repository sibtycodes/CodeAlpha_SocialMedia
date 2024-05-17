import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        
        //Get the current userId

        const {userId} = await req.json()

        //Find the list of user following that have uploaded stories

        const followingObj = await prismadb.user.findUnique({
            where:{
                id:userId
            },
            select:{
                following:true
            }
        })
        const followingList = followingObj?.following
        if(!followingList || followingList.length ==0) return NextResponse.json({error:"No Following",nofollowing:true})

        //?Now we have array of ids , we need to get the story of each id

        const stories =await Promise.all(followingList?.map(async followingId=>{
            const storyOfUser = await  prismadb.stories.findFirst({
                where:{
                    userId:followingId
                }
            }) //This return a story object
            console.log("Stories details except profile",storyOfUser)

            //And if their is no story for this id skip to the next id
            if(!storyOfUser) return ;

            //We also need picture of each user
            const profile = await prismadb.user.findFirst({
                where:{
                    id:followingId
                },
                select:{
                    profilePics:true
                }
            })
            const profilePic = profile?.profilePics[0]
            
            return {
                ...storyOfUser,
                userProfile:profilePic
            }
        }))
        console.log("Stories in all stories api",stories)

        if(!stories) return  NextResponse.json({error:"No Stories",noStories:true})
        console.log(stories)
        return NextResponse.json(stories)

    } catch (error) {
        console.log(error,"All Stories");
        return NextResponse.json({error:"Internal Error",details:error})
    }
}