import NextAuth from "next-auth"


declare module "next-auth" {
    interface Session {
        //set user 
        user: {
            id: string,
            email: string,
            username: string,
            followers: string[],
            following: string[],

            fullname: string,
            bio: string,
            birthday: string,
            profilePics: string[],
            birthDate: string,
            token: string,
            error?: any

        }
    }
    interface DefaultUser {
        id:string,
        email:string,
        username:string,
        followers:string[],
        following:string[],
        
        fullname:string,
        bio:string,
        birthday:string,
        profilePics:string[],
        birthDate:string,
        token:string,
        error?:any
    }

}