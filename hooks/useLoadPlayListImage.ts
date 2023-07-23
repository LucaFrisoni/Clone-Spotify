import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadPlayListImage = (img: string) => {
  const supabaseClient = useSupabaseClient();

  if (!img) {
    return null;
  }

  const { data: imageData } = supabaseClient.storage
    .from("playlistImg")
    .getPublicUrl(img);
  if (imageData) {
    return imageData.publicUrl;
  }
  return null;
};

export default useLoadPlayListImage;
