// Gives the signed-in user's display name and photo URL, shared by the header and profile.

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { resolveProfile } from "@/lib/profile";
import { useUser } from "./useUser";

const useProfile = () => {
  const client = useSupabaseClient();
  const { user, userDetails } = useUser();
  const profile = resolveProfile(userDetails, user);

  const avatar = profile.avatarPath
    ? client.storage.from("avatarimg").getPublicUrl(profile.avatarPath).data.publicUrl
    : profile.avatarUrl;

  return { user, name: profile.name, avatar };
};

export default useProfile;
