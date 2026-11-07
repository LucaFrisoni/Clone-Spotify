// Signs the user out and clears everything tied to their session.

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import usePlayer from "./zustand/usePlayer";
import useLikedSongs from "./zustand/useLikedSongs";

const useLogout = () => {
  const client = useSupabaseClient();
  const router = useRouter();
  const resetPlayer = usePlayer((state) => state.reset);
  const resetLikes = useLikedSongs((state) => state.reset);

  return async () => {
    const { error } = await client.auth.signOut();
    if (error) {
      return toast.error(error.message);
    }

    resetPlayer();
    resetLikes();
    router.push("/");
    router.refresh();
    toast.success("Logged out!");
  };
};

export default useLogout;
