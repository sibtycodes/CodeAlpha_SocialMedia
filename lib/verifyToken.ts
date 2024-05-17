import jwt from 'jsonwebtoken'

export function verifyToken(token:string){
    try {
        const decoded = jwt.verify(token,process.env.NEXTAUTH_SECRET as string)
        return decoded
    } catch (error) {
        console.log(error,"verify token");
        return null
    }
}