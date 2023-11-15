"use client";

import Header from "@/components/Header";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import defaultUser from "../../assets/abstract-user-flat-1.png";

import { FaEdit } from "react-icons/fa";
import { ActionToolTip } from "@/components/ActionTooltip";
import { useSessionContext } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";

import useEditProfileModal from "@/hooks/zustand/useEditProfileModal";

import { ClipLoader } from "react-spinners";

const Account = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();

  //----------------------|Logica para el user de Normal|---------------------------------------------------//
  const uploadModal = useEditProfileModal();
  const [avatar_url2, setAvatar_url2] = useState<string | null>(null);
  const [user_name2, setUser_name2] = useState("");

  const imageNormal = avatar_url2 ? avatar_url2 : defaultUser;


  useEffect(() => {
    if (!user) {
      return; // Asegúrate de que haya un usuario antes de hacer la consulta
    }

    const fetchUser = async () => {
      const { data, error } = await supabaseClient
        .from("users")
        .select("avatar_url, user_name")
        .eq("id", user.id)
        .single();

      if (error) {
        return toast.error(error.message);
      }

      if (data.avatar_url) {
        const { data: imageData } = supabaseClient.storage
          .from("avatarimg")
          .getPublicUrl(data.avatar_url);
        setAvatar_url2(imageData.publicUrl);
      } else {
        setAvatar_url2(null);
      }

      setUser_name2(data.user_name);
      setIsLoading(false);
    };
    uploadModal.fetchUser = fetchUser;

    fetchUser();
  }, [supabaseClient, user]);

  //----------------------|Logica para el user de Github|---------------------------------------------------//

  const userMetadata = user?.user_metadata;
  const [avatar_url, setAvatar_url] = useState("");
  const [user_name, setUser_name] = useState("");

  useEffect(() => {
    if (userMetadata) {
      const { avatar_url, user_name } = userMetadata;
      setAvatar_url(avatar_url);
      setUser_name(user_name);
    }
  }, [userMetadata]);

  //----------------------|EditModal|---------------------------------------------------//

  const handleEdit = () => {
    return uploadModal.onOpen();
  };

  return (
    <Header>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <ClipLoader color="lightblue" size={80} />
        </div>
      ) : (
        <>
          {/* Mobile Responsive */}
          <div className="sm:hidden flex p-4 justify-start flex-col">
            {avatar_url ? (
              <>
                <Image
                  className=" rounded-full mr-6"
                  src={avatar_url}
                  width={300}
                  height={300}
                  alt="github-image"
                />
                <div className="flex flex-col mt-10">
                  <span className=" text-slate-200">Perfil</span>
                  <h1 className="md:text-4xl lg:text-6xl xl:text-8xl font-extrabold">
                    {user_name}
                  </h1>
                </div>
              </>
            ) : (
              <>
                <Image
                  className=" rounded-full mr-6 bg-white"
                  src={imageNormal}
                  width={300}
                  height={300}
                  alt="profile-image"
                  style={{ objectFit: "cover", width: 300, height: 300 }}
                />
                <div className="flex flex-col mt-10">
                  <span className=" text-slate-200 flex items-center">
                    Perfil
                    <ActionToolTip label="Edit" side="top">
                      <span className=" cursor-pointer ml-1 p-3 mb-0.5 text-slate-200">
                        <FaEdit onClick={handleEdit} />
                      </span>
                    </ActionToolTip>
                  </span>

                  <h1 className=" text-4xl font-extrabold">{user_name2}</h1>
                </div>
              </>
            )}
          </div>
          {/* Mobile Responsive */}

          <div className="hidden sm:flex flex-col lg:flex-row p-4 justify-start">
            {avatar_url ? (
              <>
                <Image
                  className=" rounded-full mr-6"
                  src={avatar_url}
                  width={300}
                  height={300}
                  alt="github-image"
                />
                <div className="flex flex-col mt-10 max-w-[100vw] overflow-hidden break-words">
                  <span className=" text-slate-200">Perfil</span>
                  <h1 className="text-4xl lg:text-5xl xl:text-8xl font-extrabold">
                    {user_name}
                  </h1>
                </div>
              </>
            ) : (
              <>
                <Image
                  className=" rounded-full mr-6 bg-white"
                  src={imageNormal}
                  width={300}
                  height={300}
                  alt="profile-image"
                  style={{ objectFit: "cover", width: 300, height: 300 }}
                />
                <div className="flex flex-col mt-10 max-w-[100vw] overflow-hidden break-words">
                  <span className=" text-slate-200 flex items-center">
                    Perfil
                    <ActionToolTip label="Edit" side="top">
                      <span className=" cursor-pointer ml-1 p-3 mb-0.5 text-slate-200">
                        <FaEdit onClick={handleEdit} />
                      </span>
                    </ActionToolTip>
                  </span>

                  <div>
                    <h1 className=" text-4xl lg:text-5xl xl:text-8xl font-extrabold  ">
                      {user_name2}
                    </h1>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Header>
  );
};

export default Account;
