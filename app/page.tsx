
import CreatePost from '@/components/CreatePost'
import HomePosts from '@/components/HomePosts'
import ScreenOff from '@/components/UI/ScreenOff'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { options } from './api/auth/[...nextauth]/options'

export default async function Home() {
  const session =await getServerSession(options)
  const userId = session?.user.id
  return (
    <main className="">
      
      <ScreenOff/>
      {/* <Stories userId={userId as string}/> */}
      <CreatePost/>
      <HomePosts/>
      

      
    </main>
  )
}
