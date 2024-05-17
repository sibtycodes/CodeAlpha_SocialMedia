import ExplorePosts from '@/components/ExplorePosts'
import ScreenOff from '@/components/UI/ScreenOff'
import React from 'react'

type Props = {}

function page({}: Props) {
  return (
    <>
    <ScreenOff/>
    <ExplorePosts/>
    </>
  )
}

export default page