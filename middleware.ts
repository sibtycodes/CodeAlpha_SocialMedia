export { default } from "next-auth/middleware"
 

export const config = {
  matcher: ['/',"/user/:path*","/post/:id*","/profile","/profile/edit","/explore","/messaging/:id*"],
}