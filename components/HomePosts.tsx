"use client";
import { Updater, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { UserPosts } from "./UserPosts";
import { Avatar, Grid, Paper, Typography, Button } from "@mui/material";
import { Cabin, Laila, Love_Ya_Like_A_Sister, Qahiri } from "next/font/google";
import { MessageCircleIcon, ThumbsUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useScreenLoading } from "@/store/store";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { RiThumbUpFill } from "react-icons/ri";
import HomeExLoading from "./UI/HomeExLoading";
import Comments from "./Comments";

const font1 = Laila({ subsets: ["latin"], weight: ["400"] });
const font2 = Cabin({ subsets: ["latin"], weight: ["400"] });
const font2b = Cabin({ subsets: ["latin"], weight: ["700"] });
const font3 = Love_Ya_Like_A_Sister({ subsets: ["latin"], weight: ["400"] });
const font4 = Qahiri({ subsets: ["latin"], weight: ["400"] });

function HomePosts() {
  const session = useSession();
  const user = session?.data?.user;

  const queryClient = useQueryClient();

  const { setscreenLoading } = useScreenLoading();

  const router = useRouter();

  const { data: Posts, isLoading ,isFetched} = useQuery({
    queryKey: ["homePosts"],
    queryFn: async (): Promise<UserPosts[]> => {
      return axios.post("/api/homePosts",{userId:user?.id})
      .then((res) => {
        //Check if the user has liked the post by checking the likes array
        if(res.data.error) return []

        return res.data;
      });
    },
    enabled:!!user
  });

  //?Main Function to Like Posts
  async function likePost(
    postId: string,
    userId: string,
    likerName: string,
    likerPic: string
  ) {

    if (postId && userId && likerName ) {
      await likePostMutation.mutateAsync({
        postId,
        userId,
        likerName,
        likerPic:likerPic?likerPic:"",
      });
    }
    else{
      toast.error("Proper Profile Details Missing...")
    }
  }


  //`Mutation function to like/unlike a post , 
  const likePostMutation = useMutation(
    //`The first part is function for backend api call to change data in database
    async ({ postId, userId, likerName, likerPic }: { postId: string, userId: string, likerName: string, likerPic: string }) => {
      // Send a POST request to the API to like/unlike the post
      const response = await axios.post("/api/like", { postId, userId, likerName, likerPic })
      if (response.data.message) {
        toast.success(response.data.message)
      }

    },

    {//`On mutate is for the client side changes - to increase or decrease like count
      onMutate: async ({ postId }) => { //`the post if is extracted from variables object

        // Optimistically update the like count and status in the cache
        queryClient.setQueryData(["homePosts"], (data: any) => {
          if (!data) return data;

          //` Map through each post in the data to find the one being liked/unliked
          const updatedPosts = data.map((post: UserPosts) => {
            if (post.id === postId) {
              // Check if the user has already liked this post
              const isLiked = post.likes.filter((like) => like.userId == user?.id);
              console.log("isLiked", isLiked);
              // Update the post's likes array based on whether the user is liking or unliking
              return {
                //`Add previous properties of post like postId,userId,username,profilePic etc and update Likes array
                ...post,
                likes: isLiked.length > 0
                  //`If liked then remove the like from likes array of the post
                  ? post.likes.filter((like) => like.userId !== user?.id)
                  //`If not liked then with previous post likes add this new like in
                  : [
                    ...post.likes,
                    {
                      userId: user?.id,
                      likerName: user?.username,
                      likerPic: user?.profilePics[0],
                    },
                  ], // Add the user's like
              };
            }
            return post;
          });
          console.log("Here is the data", updatedPosts);




          return updatedPosts;
        });
      },
      onError: (error) => {
        // Handle errors that may occur during liking/unliking
        console.error("Error liking/unliking post:", error);
      },
    }
  );

  const NoPosts = ()=><section className="h-96 w-ful flex justify-center items-center ">
  <section className=" relative w-full h-96 opacity-70 bg-contain bg-no-repeat bg-center" style={{backgroundImage:'url("/note.png")'}}>
  <h1 className={`${font4.className} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  absolute text-5xl font-bold opacity-50 text-yellow-600 stroke-black stroke-1 `}>No Posts </h1>

  </section>

</section>

  return (
    <main className="my-3 p-2">
      {isLoading ? (
        <HomeExLoading/>
      ) :isFetched&&(!Posts || Posts?.length == 0) ? (
        <NoPosts/>
        
      ) : (
        <div className="grid grid-cols-1 gap-2">
          { Array.isArray(Posts) && Posts?.map((post) => (
            <Paper
              key={post.id}
              className="my-2 p-3 w-[80vw] md:w-[50vw] lg:w-[37vw] mx-auto "
            >
              <section className="grid grid-cols-2 grid-rows-2 w-fit  ">
                <Avatar
                  src={post.profile}
                  className=" row-span-2  aspect-square cursor-pointer"
                  onClick={() => {
                    setscreenLoading(true);
                    router.push(`/user/${post.userId}`);
                  }}
                />

                <Typography variant="body1" className={`${font1.className}`}>
                  {post.fullname}
                </Typography>
                <Typography variant="body2" className=" opacity-70 font-mono">
                  @{post.username}
                </Typography>
              </section>
              <article>
                <p className=" text-xs opacity-70 ">
                  Created - {formatCustomDate(post.createdAt.toLocaleString())}
                </p>
                <p className={`${font2.className} mt-1 border-t-2 py-2 `}>
                  {post.content}
                </p>
              </article>
              <section className="   w-full aspect-square mx-auto rounded-lg  bg-slate-300">
                <img
                  src={post.pictures[0]}
                  alt={`${post.fullname}s Post Image`}
                  className="w-full h-full object-cover"
                />
              </section>
              <section
                className={`${font3.className} text-purple-700 opacity-70 bg-slate-50 p-1 my-1`}
              >
                <p>
                  {post.likes.length == 0
                    ? "No likes yet"
                    : post.likes.length == 1
                      ? `Liked by ${post.likes[0].likerName}`
                      : post.likes.length == 2 ? `Liked by ${post.likes[0].likerName} and ${post.likes[1].likerName}` : `Liked by ${post.likes[0].likerName} and others`
                  }
                </p>
              </section>
              <section className="ButtonSection mt-2 flex">
                <Button
                  disabled={likePostMutation.isLoading}
                  onClick={() =>
                    likePost(
                      post.id,
                      user?.id as string,
                      user?.username as string,
                      user?.profilePics[0] as string
                    )
                  }
                  variant="outlined"
                  color={"secondary"}
                  className={`mx-1 text-sm flex justify-center items-center `}
                >
                  {post.likes.some((like) => like.userId == user?.id) ? <RiThumbUpFill className=" h-5 w-5" /> : <ThumbsUpIcon size={20} />}
                  <p>{post.likes.length}</p>
                </Button>
                <Comments commentsLength={post.comments.length} postId={post.id}/>
              </section>
            </Paper>
          ))}
        </div>
      )}
    </main>
  );
}

export default HomePosts;

function formatCustomDate(inputDate: any) {
  const date = new Date(inputDate);

  // Extract the time components
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const numberedHours = String(Number(hours) + 5);

  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  // Extract the date components
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Add 1 to account for 0-based indexing
  const year = date.getUTCFullYear() % 100; // Get the last two digits of the year

  // Create the formatted date and time string
  const formattedDate = `${numberedHours}:${minutes} ${day}/${month}/${year}`;

  return formattedDate;
}
