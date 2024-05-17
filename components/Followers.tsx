"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Skeleton } from "@mui/material";
import {
  Aguafina_Script,
  Coda,
  Cute_Font,
  Kablammo,
  Loved_by_the_King,
  Poppins,
  Qahiri,
  Sahitya,
} from "next/font/google";
import DropdownNext from "./DropdownNext";
import { useSession } from "next-auth/react";
import { number } from "zod";

const font2 = Qahiri({ weight: ["400"], subsets: ["latin"] });
const font1 = Poppins({ weight: ["400"], subsets: ["latin"] });

type FollowerObject = {
  id: string;
  username: string;
  fullname: string;
  profilePics: String[];
};
export type followersPromise = FollowerObject[];

export default function Followers({ userid }: { userid: string }) {
  //`Get loggedin userid from sessiondata
  const session = useSession();
  const loggedUserId = session.data?.user.id;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //`Run the query to get followers of userid

  const { data: listFollowers, isLoading } = useQuery({
    queryKey: ["followers", userid],
    queryFn: (): Promise<followersPromise> => {
      return axios.post("/api/getFollowers", { userid }).then((res) => {
        if (res.data.error) {
          console.log("Error folllowers", res.data.error);
          return null;
        }
        console.log({ followersList: res.data });
        return res.data;
      });
    },
  });

  return (
    <div>
      <Button variant="text" onClick={handleOpen}>
        Followers ({isLoading ? <span className=" animate-ping">*</span> : listFollowers?.length})
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <section style={{
          backgroundImage: "url('/frame1.jpg')",
          backgroundSize: "cover",
        }}
          className={` absolute
  top-1/2
  left-1/2
  transform -translate-x-1/2 -translate-y-1/2
   w-full sm:w-[500px]
  bg-white
  shadow-24
  p-8 sm:p-12 h-[80vh] ]`}
        >
          <h6
            className={`${font2.className}  p-3 text-center rounded-2xl  text-6xl font-bold`}
          >
            Followers
          </h6>
          <section className="mt-2 h-[50vh] overflow-y-scroll ">
            {isLoading ? (
             <div className=" ">
              { [1, 2, 3,4,5,6,7].map(number=>(
                <section className="flex my-4 space-x-5  items-center" key={number}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <div className="flex flex-col gap-2">
                    <Skeleton variant="rectangular" width={100} height={10} />
                    <Skeleton variant="rectangular" width={120} height={10} />
                  </div>
                </section>
               ))}
                
               
             </div>
              
            ) : (
              <>
                {listFollowers?.map((follower, index) => {
                  //! Display Avatar And Username
                  return (
                    <section
                      key={index}
                      className="flex px-1 py-3 w-full  justify-between "
                    >
                      <section className="flex space-x-3">
                        <Avatar src={follower?.profilePics[0] as any}></Avatar>
                        <section className="flex flex-col">
                          <Typography variant="caption">
                            @{follower?.username}
                          </Typography>
                          <Typography
                            variant="inherit"
                            className={`${font1.className}`}
                          >
                            {follower?.fullname}
                          </Typography>
                        </section>
                      </section>

                      <article
                        className={`${
                          loggedUserId === follower.id ? "hidden" : "block"
                        }`}
                      >
                        <DropdownNext userid={follower.id} setOpen={setOpen} />
                      </article>
                    </section>
                  );
                })}
              </>
            )}
          </section>
        </section>
      </Modal>
    </div>
  );
}
