import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

const Image = styled("img")({
  width: "100%",
});

type Props = {};

function LoadingProfile({}: Props) {
  return (
    <main className="min-h-screen">
      <div>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ margin: 1 }}>
            {
              <Skeleton variant="circular" width={100} height={100}>
                <Avatar />
              </Skeleton>
            }
          </Box>
          <Box sx={{ width: "100%" }}>
            {
              <>
                <Skeleton width="35%" height={15}>
                  <Typography>.</Typography>
                </Skeleton>
                <Skeleton width="30%" height={12}>
                  <Typography>.</Typography>
                </Skeleton>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",

                    gap: 3,
                    mt: 1,
                  }}
                >
                  <Skeleton width="40%" height={30}>
                    <Typography>.</Typography>
                  </Skeleton>
                  <Skeleton width="40%" height={30}>
                    <Typography>.</Typography>
                  </Skeleton>
                </Box>
              </>
            }
          </Box>
        </Box>

        <Skeleton
          height={150}
          sx={{
            borderLeft: "8px solid #006bb3",
            borderRight: "8px solid #006bb3",
            mx: 1,
          }}
          width="100%"
        >
          <div style={{ paddingTop: "57%" }} />
        </Skeleton>

        {/* {making grid box for posts} in each row their will be 3 columns */}
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {Array.from(new Array(3)).map((item, index) => (
            <Grid item xs={4} key={index}>
              <Skeleton variant="rectangular" sx={{height:"25vw"}} />
            </Grid>
          ))}
        </Grid>
      </div>
    </main>
  );
}

export default LoadingProfile;
