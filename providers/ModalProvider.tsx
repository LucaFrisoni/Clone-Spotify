"use client";
import AuthModal from "@/components/AuthModal";
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
    </div>
  );
};

export default ModalProvider;
