"use client";
import AuthModal from "@/components/AuthModal";
import PlaylistModal from "@/components/PlaylistModal";
import UploadModel from "@/components/UploadModel";

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
      <UploadModel/>
      <PlaylistModal/>
    </div>
  );
};

export default ModalProvider;
