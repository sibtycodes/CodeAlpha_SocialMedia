import {create} from 'zustand'
import {devtools,persist} from "zustand/middleware"



interface UserState {
    isloggedin: boolean | null,
    setLoginStatus: (status:boolean) => void,
    user: {
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
    }
    setUserId: (id:string) => void,
    btnLoading:boolean,
    setBtnLoading: (status:boolean) => void,
  }

export const userStore = create<UserState>(set=>({
    isloggedin: null,
    setLoginStatus: (status:boolean)=>set({isloggedin: status}),
    user: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    },
    setUserId: (id:string)=>set(state=>({
        user: {
            ...state.user,
            id: id
        }
    })),
   btnLoading:false,
   setBtnLoading:(status:boolean)=>set({btnLoading:status})

}))

interface ScreenLoadingState {
    screenloading:boolean,
    setscreenLoading:(status:boolean)=>void
}

export const useScreenLoading =create<ScreenLoadingState>(set=>({
    screenloading:false,
    setscreenLoading:(status:boolean)=>set({screenloading:status})
}))