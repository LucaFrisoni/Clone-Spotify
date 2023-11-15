"use client";
import { useUser } from "@/hooks/useUser";
import useEditProfileModal from "@/hooks/zustand/useEditProfileModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import Modal from "./Modal";
import Input from "../Input";
import Button from "../Button";
import useGetProfileInformation from "@/hooks/api/useGetProfileInformation";

const EditProfileModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const editProfileModal = useEditProfileModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();

  const profileInfo = useGetProfileInformation(user?.id);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      username: profileInfo?.profile?.user_name || "",
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      editProfileModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      if (!values.username && !values.image) {
        return toast.error("You must enter an username or an image");
      }
      if (values.username.length > 16) {
        return toast.error("Username cannot be longer than 16 characters");
      }
      const specialCharacterCount = (values.username.match(/[^\w]/g) || []).length;

      if (specialCharacterCount > 2) {
        return toast.error("Username must contain a maximum of 2 special characters");
      }
      setIsLoading(true);

      const imageFile = values.image?.[0];

      const uniqueID = uniqid();

      // Upload image
      if (imageFile && !values.username) {
        const { data: imageData, error: imageError } =
          await supabaseClient.storage
            .from("avatarimg")
            .upload(`image-${uniqueID}`, imageFile, {
              cacheControl: "3600",
              upsert: false,
            });

        if (imageError) {
          setIsLoading(false);
          return toast.error("Failed image upload");
        }
        const { error: supabaseError } = await supabaseClient
          .from("users")
          .update({
            user_name: profileInfo?.profile?.user_name || "",
            avatar_url: imageData.path,
          })
          .eq("id", user?.id);

        if (supabaseError) {
          return toast.error(`Superbase error ${supabaseError.message}`);
        }
      } else if (imageFile && values.username) {
        const { data: imageData, error: imageError } =
          await supabaseClient.storage
            .from("avatarimg")
            .upload(`image-${uniqueID}`, imageFile, {
              cacheControl: "3600",
              upsert: false,
            });

        if (imageError) {
          setIsLoading(false);
          return toast.error("Failed image upload");
        }
        const { error: supabaseError } = await supabaseClient
          .from("users")
          .update({
            user_name: values.username,
            avatar_url: imageData.path,
          })
          .eq("id", user?.id);

        if (supabaseError) {
          return toast.error(`Superbase error ${supabaseError.message}`);
        }
      } else {
        const { error: supabaseError } = await supabaseClient
          .from("users")
          .update({
            user_name: values.username,
          })
          .eq("id", user?.id);

        if (supabaseError) {
          return toast.error(`Superbase error ${supabaseError.message}`);
        }
      }

      // Create record

      router.refresh();
      setIsLoading(false);
      toast.success("User edit complete!");
      reset();
      editProfileModal.fetchUser();
      editProfileModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  //Hacer que se sincroinize el valor de la imagen actual del usuario

  return (
    <Modal
      title="Edit Profile"
      description="Change your photo and username"
      isOpen={editProfileModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <div>
          <div className="pb-1">Username</div>

          <Input
            id="username"
            disabled={isLoading}
            {...register("username")}
            placeholder={profileInfo?.profile?.user_name}
          />
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            placeholder="test"
            disabled={isLoading}
            type="file"
            accept="image/*"
            id="image"
            {...register("image")}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Edit
        </Button>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
