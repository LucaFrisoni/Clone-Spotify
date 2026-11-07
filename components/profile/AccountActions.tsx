"use client";
// Account details with the edit profile and log out buttons.

import React from "react";
import { FiLogOut } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import useLogout from "@/hooks/useLogout";
import useEditProfileModal from "@/hooks/zustand/useEditProfileModal";
import Button from "../Button";

interface AccountActionsProps {
  email?: string;
  provider?: string;
}

const AccountActions: React.FC<AccountActionsProps> = ({ email, provider }) => {
  const logout = useLogout();
  const openEditor = useEditProfileModal((state) => state.onOpen);

  return (
    <section className=" flex flex-col gap-y-4 rounded-lg bg-neutral-800/60 p-5">
      <div>
        <h2 className=" text-white text-xl font-semibold">Account</h2>
        <p className=" mt-1 truncate text-sm text-neutral-400">
          {email}
          {provider && provider !== "email" && <span className=" capitalize"> · {provider}</span>}
        </p>
      </div>
      <div className=" flex flex-col sm:flex-row gap-3">
        <Button onClick={openEditor} className=" flex w-full sm:w-auto items-center justify-center gap-x-2 border-neutral-500 bg-transparent px-6 py-2 text-white hover:border-white hover:opacity-100">
          <MdEdit /> Edit profile
        </Button>
        <Button onClick={logout} className=" flex w-full sm:w-auto items-center justify-center gap-x-2 bg-white px-6 py-2">
          <FiLogOut /> Log out
        </Button>
      </div>
    </section>
  );
};

export default AccountActions;
