"use client";
import useAuthModal from "@/hooks/zustand/useAuthModal";
import useLikedSongs from "@/hooks/zustand/useLikedSongs";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikedButtonProps {
  songId: string;
  size?: number;
}

const LikedButton: React.FC<LikedButtonProps> = ({ songId, size = 25 }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();

  const authModal = useAuthModal();
  const { user } = useUser();

  const loadLikes = useLikedSongs((state) => state.load);
  const toggleLike = useLikedSongs((state) => state.toggle);
  const hasLike = useLikedSongs((state) => state.ids.has(String(songId)));
  const isLiked = Boolean(user) && hasLike;

  useEffect(() => {
    if (user?.id) {
      loadLikes(supabaseClient, user.id).catch((error) => toast.error(error.message));
    }
  }, [loadLikes, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    try {
      await toggleLike(supabaseClient, user.id, songId);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <button
        aria-label={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
        onClick={handleLike}
        className=" hover:opacity-75 transition active:scale-95"
      >
        <Icon color={isLiked ? "#22c55e" : "white"} size={size} />
      </button>
    </div>
  );
};

export default LikedButton;
