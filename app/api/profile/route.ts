import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest,NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import jwt from "jsonwebtoken";

export async function POST(req:NextRequest) {
    
    try {
        //get the user id from the request
        const {userid,token} = await  req.json(); 
         //find the user in the database
         const  user =  await prismadb.user.findUnique({
            where:{
                id:userid
            }
        }) 
        //if no user is found, return a 404
        if(!user){
            return NextResponse.json({status:404,error:"User not found - the id is not valid",user:null,sameUser:null})
        }
        //if their is no token it means no one logged in then simply return the user
        if(!token){
           return NextResponse.json({status:200,user,message:"User found - no one logged in ",sameUser:null})
        }
        //if their is a token, it means someone is logged in - now if ssame user is logged in then redirect to the profile page
        //`handle if throws error
        
        const decoded =  jwt.verify(token,process.env.NEXTAUTH_SECRET as string)
        if(!decoded){
            return NextResponse.json({status:404,error:"User found - the id is not valid",user,sameUser:null})
        }
        //get the logged user id from the decoded token
        const {id:loggedinid} = decoded as {id:string}

        

        //`Check if the logged in person follows the user
        const userFollowers = await prismadb.user.findUnique({
            where:{
                id:userid
            },
            select:{
                followers:true,
                
            }
        })
        console.log("The user followers are ",userFollowers);
        //` Check if current user has the loggeduserid in followers list
        
        const filter = userFollowers?.followers?.filter((follower)=>follower === loggedinid) 
        console.log("The filter is ",filter);
        
        

       
        

        
        



        
        if(loggedinid === userid){
            //if the user is same, return the user
            return NextResponse.json({sameUser:true})

        }else{
            //if the user is not same 
            return NextResponse.json({status:200,user,message:"User found - but not logged in",sameUser:false,followed:(filter &&filter?.length >0)?true:false})
        }
        

       


        
        
        
        

   
        
        
    } catch (error) {
        console.log(error);
        
        return  NextResponse.json({message:"Internal server error - Try Logging In Again",user:null,status:500,sameUser:undefined})
        
    }
    


}
