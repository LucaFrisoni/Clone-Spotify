import { Subscription, UserDetails } from "@/types";
import { User } from "@supabase/auth-helpers-nextjs";
import {
  useSessionContext,
  useUser as useSupaUser,
} from "@supabase/auth-helpers-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
  refreshUserDetails: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  // define un objeto, [la key] = any(cualquier value)
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setisLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  //Tambien la usa el perfil al editarse, para que header y perfil muestren lo nuevo
  const refreshUserDetails = useCallback(async () => {
    const { data, error } = await supabase.from("users").select("*").single();
    if (error) {
      console.error(error);
      return;
    }
    setUserDetails(data as UserDetails);
  }, [supabase]);

  useEffect(() => {
    if (user && !userDetails) {
      setisLoadingData(true);
      refreshUserDetails().finally(() => setisLoadingData(false));
    } else if (!user && !isLoadingUser) {
      setUserDetails(null);
    }
  }, [user, isLoadingUser, userDetails, refreshUserDetails]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription: null,
    refreshUserDetails,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a MyUserContextProvider");
  }
  return context;
};
