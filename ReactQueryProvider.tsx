'use client'
import React from 'react'
import {QueryClient,QueryClientProvider as Provider} from "@tanstack/react-query"

type Props = {
    children: React.ReactNode
}
const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      staleTime: 1000 * 60 * 1,//1 minute
    }
  }
})

function ReactQueryProvider({children}: Props) {
  return (
    <>
    <Provider client={queryClient}>
      {children}
    </Provider>
    </>
  )
}

export default ReactQueryProvider