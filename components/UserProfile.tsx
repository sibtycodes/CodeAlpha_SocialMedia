"use client";
// import {Button} from "@nextui-org/react";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import axios from "axios";
import LoadingProfile from "./LoadingProfile";
import { useQuery } from "@tanstack/react-query";
import ProfilePicUpload from "./UI/ProfilePicUpload";
import ScreenOff from "./UI/ScreenOff";
import { useQueryClient } from "@tanstack/react-query";

import {
  Avatar,
  Typography,
  Tabs,
  Tab,
  Divider,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Icon,
  Box,
} from "@mui/material";
import { Love_Light, Poppins } from "next/font/google";
import {
  MinusIcon,
  PlusSquareIcon,
  RemoveFormattingIcon,
  UnfoldHorizontal,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useScreenLoading } from "@/store/store";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Following from "./Following";
import Followers from "./Followers";
import SnackBar from "./SnackBar";
import { RiUserUnfollowFill } from "react-icons/ri";
import UserPosts from "./UserPosts";
import SendMessage from "./Chatroom/SendMessage";

const font1 = Love_Light({ weight: ["400"], subsets: ["latin"] });
const font2 = Poppins({ weight: ["400"], subsets: ["latin"] });

export type Profile = {
  id: string;
  fullname: string;
  userame: string;
  email: string;
  password: string;
  bio: string;
  birthDate: string;
  profilePics: string[] | undefined;
  followers: string[];
  following: string[];
};
export type queryData = {
  user: Profile;
  status?: number;
  message: string;
  sameUser: boolean;
  followed?: boolean;
};

function UserProfile({ userid }: { userid: string }) {
  //`Query Client
  const queryClient = useQueryClient();

  //!State for following
  const [following, setfollowing] = useState(false);

  //` Get logged in user id
  const { data } = useSession();
  const loggedUserId = data?.user.id;
  const loggedUserName = data?.user.username;


  const router = useRouter();

  //get the token from the cookie
  const token = Cookies.get("accessToken");

  // useQuery to get the user profile data if userid is correct

  const {
    isLoading: ProfileLoading,

    data: UserData,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: (): Promise<queryData> => {
      return axios.post(`/api/profile`, { userid, token }).then((res) => {
        console.log(res.data);
        if (res.data.sameUser) {
          setscreenLoading(true);
          router.push("/profile");
        }
        if (res.data.followed) {
          setfollowing(true);
        }

        return res.data;
      });
    },
  });

  const { setscreenLoading } = useScreenLoading();

  //! Function for following
  function onFollow() {
    setfollowing(true);
    toast.success("Follwed", {
      duration: 500,
    });
    axios
      .post(
        "/api/follow",
        { followerId: loggedUserId, followedId: userid },
        {
          headers: {
            accessToken: token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.error) {
          toast.error(res.data.error);
          setfollowing(false);
        }
        //! refetch the query in other component followers and following
        queryClient.invalidateQueries(["followers"]);
        queryClient.invalidateQueries(["following"]);
      });
  }
  function onUnFollow() {
    setfollowing(false);
    toast.success("Unfollwed", {
      duration: 500,
    });
    axios
      .put(
        "/api/follow",
        { followerId: loggedUserId, followedId: userid },
        {
          headers: {
            accessToken: token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.error) {
          toast.error(res.data.error);
          setfollowing(true);
        }
        //! refetch the query in other component followers and following
        queryClient.invalidateQueries(["followers"]);
        queryClient.invalidateQueries(["following"]);
      });
  }

  return (
    <div className=" contentSide lg:ml-auto">
      <ScreenOff />
      {/* if query is done and response of same user is null it means the id is not valid */}
      {ProfileLoading ? (
        <>
          <LoadingProfile />
        </>
      ) : (
        <>
          {UserData && UserData?.user == null && UserData.sameUser !== true  ? (
            <section className="p-7 flex justify-center flex-col items-center">
              <Paper
                elevation={10}
                className="w-full h-96 flex justify-start p-10 flex-col items-center"
              >
                <Avatar></Avatar>

                <Typography
                  className={` text-center text-2xl sm:text-4xl md:text-6xl ${font1.className}`}
                >
                  { UserData.status !== 500?"User not found":"Server Error"}
                </Typography>
                <Typography
                  className={` text-center text-xs opacity-70 lg:text-lg 3xl ${font2.className}`}
                >
                  { UserData.status !== 500 && "Check User Id"}
                </Typography>
              </Paper>
            </section>
          ) : UserData?.sameUser == true ? (
            <></>
          ) : (
            <React.Fragment>
              {
                //!Make the profile section of the user
                <section>
                  <section className="flex gap-x-3 p-2">
                    {UserData?.user?.profilePics == undefined ||
                    UserData?.user?.profilePics?.length === 0 ? (
                      <Avatar src="/" alt="User Avatar" className="h-28 w-28">
                        {UserData?.user.fullname.charAt(0)}
                      </Avatar>
                    ) : (
                      <img
                        src={UserData?.user?.profilePics[0]}
                        className="h-28 w-28 rounded-full"
                      />
                    )}

                    <Grid container>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h5">
                          {UserData?.user?.fullname}
                        </Typography>

                        <article className=" space-x-2">
                          {/* <Button
                            variant="outlined"
                            className="text-xs"
                            color="primary"
                            onClick={()=>{
                              router.push(``)
                            }}
                          >
                            Message
                          </Button> */}

                          {/* userid contains the user whose profile is this */}
                         <SendMessage receiverId={userid} />

                          {!following ? (
                            <Button
                              variant="contained"
                              className=" text-black hover:text-white text-[10px] space-x-1"
                              color="primary"
                              onClick={onFollow}
                            >
                              Follow

                              <PlusSquareIcon size={10} className="ml-1" />
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              className=" text-black hover:text-white text-[10px] space-x-1"
                              color="primary"
                              onClick={onUnFollow}
                            >
                              Unfollow
                              <RiUserUnfollowFill  className="ml-1 h-3 w-3" />
                            </Button>
                            
                          )}
                          {/* <SnackBar message={`UNFOLLOWED ${!ProfileLoading && UserData?.user.fullname.toUpperCase()}`}/> */}
                        </article>
                      </Grid>
                      {/* <Grid
                        item
                        lg={12}
                        className=" hidden md:flex md:text-3xl font-bold justify-center items-center  border-l-2 border-blue-600 md:px-5"
                      >
                        <Followers userid={userid} />
                        <Following userid={userid} />
                      </Grid> */}
                    </Grid>
                  </section>

                  <Divider />
                  <section className=" border-x-8 border-blue-800 p-5 mx-2 flex items-center">
                    <Followers userid={userid} />
                    <Following userid={userid} />
                  </section>

                  <Divider />

                  <Typography variant="h6" className={`${font2.className}  m-4 text-2xl lg:text-4xl  text-center `}>Posts</Typography>
                  {/* Display recent posts */}
                  
                  <UserPosts userid={userid} />
                </section>
              }
            </React.Fragment>
          )}
        </>
      )}
    </div>
  );
}

export default UserProfile;
