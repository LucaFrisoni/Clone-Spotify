import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

interface Profile {
  user_name: string;
}

const useGetProfileInformation = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>();
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) {
      return;
    }
    setIsLoading(true);

    const fetchProfile = async () => {
      const { data, error } = await supabaseClient
        .from("users")
        .select("user_name")
        .eq("id", id)
        .single();

      if (error) {
        return toast.error(error.message);
      }

      setProfile(data);
      setIsLoading(false);
    };
    fetchProfile();
  }, [id, supabaseClient]);

  return useMemo(
    () => ({
      isLoading,
      profile,
    }),
    [isLoading, profile]
  );
};
export default useGetProfileInformation;
