"use client";
// First view of the add song modal: upload your own mp3 and cover image.

import uniqid from "uniqid";
import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Input from "../Input";
import Button from "../Button";

const uploadFile = async (client: SupabaseClient, bucket: string, name: string, file: File) => {
  const { data, error } = await client.storage
    .from(bucket)
    .upload(name, file, { cacheControl: "3600", upsert: false });
  if (error) {
    throw new Error(`Failed ${bucket === "songs" ? "song" : "image"} upload`);
  }
  return data.path;
};

const createSong = async (client: SupabaseClient, userId: string, values: FieldValues) => {
  const uniqueID = uniqid();
  // Upload both files at the same time
  const [songPath, imagePath] = await Promise.all([
    uploadFile(client, "songs", `song-${values.title}-${uniqueID}`, values.song[0]),
    uploadFile(client, "images", `image-${values.title}-${uniqueID}`, values.image[0]),
  ]);

  const { error } = await client.from("songs").insert({
    user_id: userId,
    tilte: values.title,
    author: values.author,
    image_path: imagePath,
    song_path: songPath,
  });
  if (error) {
    throw new Error(`Supabase error ${error.message}`);
  }
};

const UploadFileForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [isLoading, setIsLoading] = useState(false);
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: { author: "", title: "", song: null, image: null },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    if (!values.image?.[0] || !values.song?.[0] || !user) {
      return toast.error("Missing fields");
    }
    setIsLoading(true);
    try {
      await createSong(supabaseClient, user.id, values);
      router.refresh();
      toast.success("Song created!");
      reset();
      onDone();
    } catch (error: any) {
      toast.error(error.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
      <Input id="title" disabled={isLoading} {...register("title", { required: true })} placeholder="Song title" />
      <Input id="author" disabled={isLoading} {...register("author", { required: true })} placeholder="Song author" />
      <div>
        <div className="pb-1">Select a song file</div>
        <Input disabled={isLoading} type="file" accept=".mp3" id="song" {...register("song", { required: true })} />
      </div>
      <div>
        <div className="pb-1">Select an image</div>
        <Input disabled={isLoading} type="file" accept="image/*" id="image" {...register("image", { required: true })} />
      </div>
      <Button disabled={isLoading} type="submit">
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </form>
  );
};

export default UploadFileForm;
