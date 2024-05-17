"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import { Poppins, Qahiri } from "next/font/google";
import { useSession } from "next-auth/react";

import { followersPromise } from "./Followers";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DropdownNext from "./DropdownNext";
import { Avatar, Skeleton } from "@mui/material";

const font2 = Qahiri({ weight: ["400"], subsets: ["latin"] });
const font1 = Poppins({ weight: ["400"], subsets: ["latin"] });

export default function Following({ userid }: { userid: string }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //`Get loggedin userid from sessiondata
  const session = useSession();
  const loggedUserId = session.data?.user.id;

  //`Run the query to get followers of userid

  const { data: listFollowing, isLoading } = useQuery({
    queryKey: ["following", userid],
    queryFn: (): Promise<followersPromise> => {
      return axios.put("/api/getFollowers", { userid }).then((res) => {
        if (res.data.error) {
          console.log("Error folllowers", res.data.error);
          return null;
        }
        console.log({ followingList: res.data });
        return res.data;
      });
    },
  });

  return (
    <div>
      <Button onClick={handleOpen}>
        Following(
        {isLoading ? (
          <span className=" animate-ping">*</span>
        ) : (
          listFollowing?.length
        )}
        )
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <section
          style={{
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
  p-8  sm:p-12 h-[80vh] `}
        >
          <h6
            className={`${font2.className}  p-3 text-center rounded-2xl  text-6xl font-bold`}
          >
            Following
          </h6>
          <section className="mt-2 h-[50vh] overflow-y-scroll">
            {isLoading ? (
              [1, 2, 3].map((no) => (
                <section className="flex my-4 space-x-5  items-center" key={no}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <div className="flex flex-col gap-2">
                    <Skeleton variant="rectangular" width={100} height={10} />
                    <Skeleton variant="rectangular" width={120} height={10} />
                  </div>
                </section>
              ))
            ) : (
              <>
                {listFollowing?.map((following, index) => {
                  //! Display Avatar And Username
                  return (
                    <section
                      key={index}
                      className="flex px-1 py-3 w-full  justify-between "
                    >
                      <div className="flex space-x-3">
                        <Avatar src={following?.profilePics[0] as any} />
                        <section className="flex flex-col">
                          <Typography variant="caption">
                            @{following.username}
                          </Typography>
                          <Typography
                            variant="inherit"
                            className={`${font1.className}`}
                          >
                            {following.fullname}
                          </Typography>
                        </section>
                      </div>

                      <section
                        className={`${
                          loggedUserId === following.id ? "hidden" : "block"
                        }`}
                      >
                        <DropdownNext userid={following.id} setOpen={setOpen} />
                      </section>
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
