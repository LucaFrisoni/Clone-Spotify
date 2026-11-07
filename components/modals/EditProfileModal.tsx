"use client";
import { useUser } from "@/hooks/useUser";
import useEditProfileModal from "@/hooks/zustand/useEditProfileModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import Modal from "./Modal";
import Input from "../Input";
import Button from "../Button";
import Avatar from "../Avatar";
import useProfile from "@/hooks/useProfile";
import { validateUsername } from "@/lib/profile";

const uploadAvatar = async (client: SupabaseClient, file: File) => {
  const { data, error } = await client.storage
    .from("avatarimg")
    .upload(`image-${uniqid()}`, file, { cacheControl: "3600", upsert: false });
  if (error) {
    throw new Error("Failed image upload");
  }
  return data.path;
};

const buildChanges = async (client: SupabaseClient, values: FieldValues) => {
  const changes: Record<string, string> = {};
  const username = values.username?.trim();
  const imageFile: File | undefined = values.image?.[0];

  if (username) changes.user_name = username;
  if (imageFile) changes.avatar_url = await uploadAvatar(client, imageFile);
  return changes;
};

const EditProfileModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const editProfileModal = useEditProfileModal();
  const supabaseClient = useSupabaseClient();
  const { user, refreshUserDetails } = useUser();
  const { name, avatar } = useProfile();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: { username: "", image: null },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      editProfileModal.onClose();
    }
  };

  const saveChanges = async (values: FieldValues) => {
    const changes = await buildChanges(supabaseClient, values);
    const { error } = await supabaseClient.from("users").update(changes).eq("id", user?.id);
    if (error) {
      throw new Error(`Supabase error ${error.message}`);
    }
    await refreshUserDetails();
    router.refresh();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const username = values.username?.trim() ?? "";
    if (!username && !values.image?.[0]) {
      return toast.error("You must enter an username or an image");
    }
    const problem = validateUsername(username);
    if (problem) {
      return toast.error(problem);
    }

    setIsLoading(true);
    try {
      await saveChanges(values);
      toast.success("Profile updated!");
      reset();
      editProfileModal.onClose();
    } catch (error: any) {
      toast.error(error.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Profile details"
      description="Change your photo and username"
      isOpen={editProfileModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <div className="flex justify-center">
          <Avatar src={avatar} name={name} size={112} className=" h-28 w-28 shadow-xl" />
        </div>
        <div>
          <div className="pb-1">Username</div>
          <Input id="username" disabled={isLoading} {...register("username")} placeholder={name} />
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input disabled={isLoading} type="file" accept="image/*" id="image" {...register("image")} />
        </div>
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
