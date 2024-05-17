
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { ImageIcon, SearchCheckIcon, SearchIcon, User2Icon } from 'lucide-react';
import { Avatar, CircularProgress, Input } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { User } from '@prisma/client';
import { Cabin_Condensed, Coda, Lovers_Quarrel, Monda, Open_Sans, Poppins } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import { useScreenLoading } from '@/store/store';
import { useSession } from 'next-auth/react';
type Anchor = 'top' | 'left' | 'bottom' | 'right';

type Props = {}

type UserProfileResult = User & {
  postLength?: number | string
}

const font1 = Cabin_Condensed({ weight: ['400'], subsets: ['latin'] })
const font2 = Poppins({ weight: ['400'], subsets: ['latin'] })
const font4 = Monda({ weight: ['400'], subsets: ['latin'] })
const fontsearch = Open_Sans({ weight: ['400'], subsets: ['latin'] })

function SearchProfile({ }: Props) {

  //Get session


  const { setscreenLoading } = useScreenLoading()
  const router = useRouter()
  const pathName = usePathname()
  //`Input state
  const [searchedKeywords, setsearchedKeywords] = useState("")
  const [profileResult, setprofileResult] = useState([])

  //`Result loading state

  const [resultLoading, setresultLoading] = useState(false)






  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  const list = (anchor: Anchor) => (
    <Box
      className=" min-h-[80vh]  flex-grow   p-5 md:p-9"
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
    // onClick={toggleDrawer(anchor, false)}
    // onKeyDown={toggleDrawer(anchor, false)}
    >
      <section className='flex justify-center h-10'>
        <Input onChange={(event) => {
          setsearchedKeywords(event.target.value)
        }} value={searchedKeywords} className='sm:w-1/2 w-[80%] px-2 ' placeholder='Search...' />
        <SearchIcon className=' h-10 cursor-pointer' onClick={handlesearchProfile} />
      </section>

      {/* The result of search */}
      <article className='mt-3 p-4 border-l-4 border-black border-opacity-20 min-h-[70vh]'>

        {
          //`Loading if true else show posts
          resultLoading ?
            <section className=' grid place-content-center h-[50vh]'>
              <div className="loader"></div>

            </section>
            :

            //`The list of profiles based on search
            profileResult.map((profile: UserProfileResult) =>
              <section key={profile.id} className=' text-sm sm:text-base rounded-xl bg-blue-50 p-2 flex items-center justify-between space-x-2 my-2'>
                <section className=' grid grid-cols-5 '>
                  <aside className=' flex  items-center  col-span-3 '>
                    <Avatar onClick={() => {
                      setState({ ...state, ["bottom"]: false });
                      if (pathName !== `/user/${profile.id}`) setscreenLoading(true);
                      router.push(`/user/${profile.id}`)
                      router.refresh()


                    }} className=' cursor-pointer' src={profile.profilePics[0]} />
                    <div className=' w-10 ml-1'>
                      <p className={`${font2.className}`}>{profile.fullname}</p>
                      <p className={`${font1.className} `}>@{profile.username}</p>
                    </div>
                  </aside>
                  <aside className=' flex justify-evenly sm:gap-5 '>
                    <div className=' opacity-60 flex items-center'>
                      <ImageIcon />
                      <p className={`${font4.className} flex`}>{profile.postLength}<span className='sm:block hidden'>{profile.postLength == 1 ? "Post" : "Posts"}</span></p>
                    </div>
                    <div className='  opacity-60 flex justify-center items-center'>
                      <User2Icon />
                      <p className={`${font4.className} flex  text-sm`}>{profile.followers.length}<span className=' hidden sm:inline-block'>{profile.followers.length == 1 ? "Follower" : "Followers"}</span></p>
                    </div>
                  </aside>
                </section>

              </section>)

        }
      </article>
    </Box>
  );

  function handlesearchProfile() {

    //`set loading true
    setresultLoading(true)

    console.log(searchedKeywords)

    axios.post("/api/searchprofile", { searchedKeywords: searchedKeywords })
      .then((res) => {
        if (res.data.error) {
          console.log(res.data.error)
        }
        else if (res.data.users) {
          console.log(res.data.users)
          setprofileResult(res.data.users)

        }
      })
      .then(() => {
        setresultLoading(false)
      })

  }

  return (
    <>

      <button className=' opacity-80 my-4 p-4 w-[80vw]  md:w-[50vw] lg:w-[37vw]  lg: h-1/4 sm:mx-auto  md:mx-5 space-x-2 flex justify-between text-white sm:text-lg font-bold  items-center   bg-gradient-conic from-[#120f49]   to-[#1976d2] drop-shadow-md shadow-black  bg-opacity-80 rounded-xl ' onClick={toggleDrawer("bottom", true)}><span className={`${fontsearch.className}`}>Search User</span><SearchIcon className='h-5 w-5' /></button>
      <Drawer

        className=''
        anchor={"bottom"}
        open={state["bottom"]}
        onClose={toggleDrawer("bottom", false)}
      >
        <section className=' lg:flex'>
          <aside className='hidden lg:flex flex-col justify-center items-center'>
            <img src="/search.png" className=' aspect-square h-[38vh] ' alt="" />
            <img src="/search2.png" className=' aspect-square h-[38vh]' alt="" />
          </aside>
          {list("bottom")}
        </section>

      </Drawer>


    </>
  );
}

export default SearchProfile