import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import prismadb from "@/lib/prismadb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const options: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {

        //If the username is used instead of email:
        
        let userWithEmailOrUN

        if(credentials?.email.includes('@')){
          let  email = credentials.email
          userWithEmailOrUN = await prismadb.user.findFirst({
            where: {
              email,
            },
          });
        }
        else{
          //its a username
          let username = credentials?.email
          userWithEmailOrUN = await prismadb.user.findFirst({
            where:{
              username
            }
          })
        }
        const password = credentials?.password;
        //check if user exists, if not, give response to client with msg
        
        console.log({userWithEmailOrUN,email:credentials?.email})
        if (!userWithEmailOrUN)
          throw new Error("User does not exist");

        //check if password is correct by comparing the stored hash password and given password

        const isPassCorrect = await bcrypt.compare(
          password as string,
          userWithEmailOrUN.password
        );
        if (!isPassCorrect) throw new Error("Password is incorrect");

        //if password is correct, create a jwt token and send it to client
        const token = jwt.sign(
          { id: userWithEmailOrUN.id },
          process.env.NEXTAUTH_SECRET as string
        );

        //`userData contains the token and userWithEmailOrUN

        const finalUserData: any = {
          ...userWithEmailOrUN,
          token,
        };
        // console.log("The final user data is ", finalUserData);

        return finalUserData;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        // session is the data that is returned from the update() function
        //! When ever the update function is called we will change the session here

        //...token function contains the details as we previously passed 
        token = { ...token, ...session };
        console.log(token);
      }

      return { ...token, ...user }; //` user has all the details returned from credentials authorize
    },
    async session({ session, token }) {
      // console.log("......Token in async session.........",token);
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

/*
First check email pass then return details with token ....access the details in jwt callback and send details and token as 
token object....Now finally we can access that object in session callback and send the details as session in our frontend application
*/