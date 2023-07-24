"use client";

import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import usePlaylistModal from "@/hooks/createPlaylistModal";

const PlaylistModal = () => {
  const playlistModal = usePlaylistModal();
  const [isLoading, setIsLoading] = useState(false);
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      playlistModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];

      if (!imageFile || !user) {
        toast.error("Missing fields");
        return;
      }

      const uniqueID = uniqid();

      // Upload image
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from("playlistImg")
          .upload(`image-${values.name}-${uniqueID}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

      if (imageError) {
        setIsLoading(false);
        return toast.error("Failed image upload");
      }
      // Playlist Table
      const { error: supabaseError } = await supabaseClient
        .from("playlist")
        .insert({
          user_id: user.id,
          name: values.name,
          imgPlayList_path: imageData.path,
        });

      if (supabaseError) {
        setIsLoading(false);

        return toast.error("Failed PlayList Table");
      }

      router.refresh();
      setIsLoading(false);
      toast.success("PlayList Created!");
      reset();
      playlistModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
     
    }
  };

  return (
    <Modal
      title="Create a Playlist"
      description="Add your favorites songs to your own customize playlist"
      isOpen={playlistModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="name"
          disabled={isLoading}
          {...register("name", { required: true })}
          placeholder="Playlist Name"
        />
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            placeholder="test"
            disabled={isLoading}
            type="file"
            accept="image/*"
            id="image"
            {...register("image", { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default PlaylistModal;
