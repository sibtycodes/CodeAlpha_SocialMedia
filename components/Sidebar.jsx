import { getServerSession } from 'next-auth'
import { options } from "@/app/api/auth/[...nextauth]/options"
import SideBarClient from "./SideBarLargeScreen"

async function Sidebar() {

    const session = await getServerSession(options)
    console.log(session)
    if(!session) return null
    else return  <SideBarClient />

}

export default Sidebar