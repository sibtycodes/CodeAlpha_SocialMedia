'use client'
import { useScreenLoading } from '@/store/store'
import React, { useEffect } from 'react'

type Props = {}

function ScreenOff({}: Props) {

    const { setscreenLoading } = useScreenLoading()
    useEffect(() => {
        setscreenLoading(false)
    },[])
  return (
    null
  )
}

export default ScreenOff