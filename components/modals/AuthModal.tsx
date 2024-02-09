"use client";
import React, { useEffect } from "react";
import Modal from "./Modal";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/zustand/useAuthModal";

const AuthModal = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const { onClose, isOpen } = useAuthModal();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  
  //Ver lo de si hay un codigo en la url, hacer logica de cambiar contraseña
  // useEffect(() => {
  //   supabaseClient.auth.onAuthStateChange(async (event, session) => {
  //     console.log("Event =>", event);

  //     if (event == "PASSWORD_RECOVERY") {
  //       const newPassword = prompt(
  //         "What would you like your new password to be?"
  //       );

  //       const { data, error } = await supabaseClient.auth.updateUser({
  //         //@ts-ignore
  //         password: newPassword,
  //       });

  //       if (data) alert("Password updated successfully!");
  //       if (error) alert("There was an error updating your password.");
  //     }
  //   });
  // }, []);

  const onSuccess = (event: any, session: any) => {
    router.push("https://clone-spotify-57tq6zvxd-lucafrisoni.vercel.app/");
  };

  return (
    <Modal
      title="Welcome back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth
        theme="dark"
        providers={["github"]}
        magicLink
        redirectTo="https://clone-spotify-57tq6zvxd-lucafrisoni.vercel.app/"
        
        supabaseClient={supabaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#404040",
                brandAccent: "#22c55e",
              },
            },
          },
        }}
      />
    </Modal>
  );
};

export default AuthModal;
