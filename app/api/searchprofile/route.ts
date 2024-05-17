import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        //`Get the searched keywords

        const {searchedKeywords} =await req.json();
        console.log(searchedKeywords,"searchedKeywords");

        //`fIND the user that has either fullname or username that contains the searched keywords
        const usersResult = await prismadb.user.findMany({
            where:{
                OR:[
                    {
                        username:{
                            contains:searchedKeywords,
                            mode:"insensitive"
                        }
                    },
                    {
                        fullname:{
                            contains:searchedKeywords,
                            mode:"insensitive"
                        }
                    }
                ]
            },
            include:{
                posts:true
            }
        })

        if(!usersResult) return NextResponse.json({error:"No User Found"})
        console.log(usersResult,"users");
       
        const finalUsers = usersResult.map(user=>{
            return {
                ...user,
                postLength:user.posts.length,
                posts:undefined
            }
        })

        return NextResponse.json({users:finalUsers})


    } catch (error) {
        console.log(error,"error in searchprofile route");
        return NextResponse.json({error:"error in searchprofile route"})
        
    }
}