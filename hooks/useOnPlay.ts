import { Song } from "@/types";
import usePlayer from "./zustand/usePlayer";
import useAuthModal from "./zustand/useAuthModal";
import { useUser } from "./useUser";

const useOnPlay = (songs:Song[]) =>{
const player = usePlayer()
const authModel= useAuthModal()
const {user} = useUser()

const onPlay = (id:string) =>{
    if(!user){
        return authModel.onOpen()
    }
    player.setId(id)
    player.setIds(songs.map((song)=> song.id))
}

return onPlay
}

export default useOnPlay