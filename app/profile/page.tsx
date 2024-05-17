import ScreenOff from "@/components/UI/ScreenOff";
import { Avatar, Button, Divider, Typography, Grid } from "@mui/material";
import { PlusSquareIcon } from "lucide-react";
import Cookies from "js-cookie";
import React from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import ButtonEditProfile from "@/components/UI/ButtonEditProfile";

import Following from "@/components/Following";
import Followers from "@/components/Followers";
import UserPosts from "@/components/UserPosts";
import { Poppins } from "next/font/google";


const font1 = Poppins({ weight: ["800"], subsets: ["latin"] }); 


type User = {
  id: string;
  email: string;
  username: string;

  fullname: string;
  bio: string;
  birthday: string;
  profilePics: string[];
  birthDate: string;
  token: string;
};

async function page() {
  //get the session for server side from next-auth

  const { user } = (await getServerSession(options)) as { user: User };
  if (user) {
    console.log(user);
  }

  return (
    <>
      <ScreenOff />

      <section className=" contentSide lg:ml-auto overflow-x-hidden">
        <section className="flex gap-x-3  justify-start p-2 ">
          <Avatar
            src={user.profilePics[0]}
            alt="User Avatar"
            className="h-28 w-28"
          />

          <section>
            <Typography variant="h5">{user.fullname}</Typography>
            <Typography className=" text-xs opacity-50">
              @{user.username}
            </Typography>

            <article className="mt-3 flex justify-start items-center">
              <ButtonEditProfile />
            </article>
          </section>

          {
            //! Follower / Following
          }
        </section>

        <Divider />
        <section className=" border-x-8 border-blue-800 p-5 mx-2 flex items-center">
          <Followers userid={user.id} />
          <Following userid={user.id} />
        </section>

        <Divider />

        <Typography variant="h6" className={`${font1.className}  m-4 text-2xl lg:text-4xl  text-center `}>Posts</Typography>
        {/* Display recent posts */}
        <UserPosts userid={user.id} />
      </section>
    </>
  );
}

export default page;
