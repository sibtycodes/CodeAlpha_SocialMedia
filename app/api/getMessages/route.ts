import prismadb from "@/lib/prismadb";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    //`Get the chatrooms in this api ,logged user can either 
    const chatrooms = await prismadb.chatroom.findMany({
      where: {
        OR: [
          { senderID: userId },
          { receiverID: userId }, 
        ]
      },
   });

   if(!chatrooms) return NextResponse.json({message:"No Chatrooms",chatrooms:false})

   console.log(chatrooms)

    //Now in new chatrooms i want chatroom id , otherUser Id
    const roomAndOtherUser = chatrooms.map(room=>{
      return {
        chatRoomid:room.id,
        otherUserId:room.senderID==userId?room.receiverID:room.senderID
      }
    })
    const otherUserIds = roomAndOtherUser.map(room=>room.otherUserId) as string[]

    

    const otheUserDetails = await prismadb.user.findMany({
      where:{
        id:{
          in:otherUserIds
        }
      },
      select:{
        username:true,
        fullname:true,
        profilePics:true,
        id:true,

      }
    })

    const room_user_details = roomAndOtherUser.map(room=>{
      //we got the same user by matching id
      let userDetail = otheUserDetails.find(user=>user.id === room.otherUserId)
      //now add this detail with roomId and otherUser id
      return{
        ...room,
        ...userDetail
      }
    })

    console.log({room_user_details})


    

    return NextResponse.json(room_user_details);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
