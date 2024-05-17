import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req:NextRequest) {
    try {
        //` We get the token from headers and verify them

        const token = req.headers.get("accessToken");
        console.log("Token",token);
        
        if(!token){
            return NextResponse.json({error:"No token found"});
        }
        // const verified = jwt.verify(token,process.env.NEXTAUTH_SECRET as string);
        // if(!verified){
        //     return NextResponse.json({error:"Invalid token"});
        // }





        //! we can either get fullname or username or password
        const {fullname,username,password,userid} = await req.json();
        console.log("fullname",fullname);
        



        //? If no userid is provided then we can return an error
        if(!userid){
            return NextResponse.json({error:"userid is required"});
        }
        const user = await prismadb.user.findUnique({
            where:{
                id:userid
            }
        })
        //? If no user is found then we can return an error
        if(!user){
            return NextResponse.json({error:"No user found with this userid"});
        }

        //` We can check if they are defined and then update the fullname or username or password

        if(fullname){
            await prismadb.user.update({
                where:{
                    id:userid
                },
                data:{
                    fullname
                }
            })
            return NextResponse.json({message:`Fullname updated successfully to ${fullname}`});
        }
        if(username){
            //! Check If UserName is Already taken
            const userCheck  = await prismadb.user.findUnique({
                where:{
                    username
                }
            })
            if(userCheck){
                return NextResponse.json({error:"Username is already taken"});
            }
            await prismadb.user.update({
                where:{
                    id:userid
                },
                data:{
                    username
                }
            })
            return NextResponse.json({message:`Username updated successfully to @${username}`});
        }
        if(password){
            const hashedPassword = await bcrypt.hash(password,10);
            await prismadb.user.update({
                where:{
                    id:userid
                },
                data:{
                    password:hashedPassword
                }
            })
            return NextResponse.json({message:`password updated successfully.`});
        }
    

    } catch (error) {
        console.log(error,"error in editUser route");
        NextResponse.json({error:"Something went wrong"});
        
    }
}