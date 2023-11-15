"use client";
import AuthModal from "@/components/modals/AuthModal";
import EditProfileModal from "@/components/modals/EditProfileModal";
import PlaylistModal from "@/components/modals/PlaylistModal";
import UploadModel from "@/components/modals/UploadModel";

import React, { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <AuthModal />
      <UploadModel />
      <PlaylistModal />
      <EditProfileModal />
    </div>
  );
};

export default ModalProvider;
