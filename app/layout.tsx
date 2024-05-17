import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'

import { Toaster } from "react-hot-toast"
import ReactQueryProvider from '@/ReactQueryProvider'
import SimpleBackdrop from '@/components/UI/ScreenLoading'
import NextAuthProvider from '@/NextAuthProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Sidebar from "@/components/Sidebar"

import BottomNavFinal from '@/components/UI/BottomNavFinal'
import { EdgeStoreProvider } from '@/lib/edgestore'
import NavbarServer from '@/components/NavbarServer'



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: ' ~ Syed Sibtain Ali Shah',
  description: 'SibtyMedia - Post,Like,Comment and Make Friends',


}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body className={inter.className}>

        <ReactQueryProvider>
          <NextAuthProvider>

            <Sidebar />
            <NavbarServer />
            <Toaster position="top-center" toastOptions={{
              style: {
                marginTop: '4rem',
              }
            }} />

            <SimpleBackdrop />
            <EdgeStoreProvider>
              {children}
              <section className=' min-h-[50px] w-full'></section>
            </EdgeStoreProvider>
            {/* <BottomNavFinal /> */}
          </NextAuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />


        </ReactQueryProvider>
      </body>
    </html>
  )
}
