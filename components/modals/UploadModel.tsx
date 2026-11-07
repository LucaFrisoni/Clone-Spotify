"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import useUploadModal from "@/hooks/zustand/useUploadModal";
import Modal from "./Modal";
import UploadFileForm from "./UploadFileForm";
import TrackSearch from "./TrackSearch";

type View = "file" | "search";

//Cada vista aclara que audio termina en la biblioteca: la cancion entera o un preview
const VIEWS: { id: View; label: string; badge: string; description: string }[] = [
  { id: "file", label: "Upload file", badge: "Full song", description: "Upload your own mp3. The whole song will play." },
  { id: "search", label: "Search online", badge: "30s preview", description: "Find any song online. Only a 30-second preview is added." },
];

const ViewTabs: React.FC<{ view: View; onChange: (view: View) => void }> = ({ view, onChange }) => (
  <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-neutral-900 p-1" role="tablist">
    {VIEWS.map(({ id, label, badge }) => (
      <button
        key={id}
        role="tab"
        aria-selected={view === id}
        onClick={() => onChange(id)}
        className={twMerge(
          "flex flex-col items-center rounded-full py-1.5 text-sm font-semibold leading-tight text-neutral-400 transition hover:text-white",
          view === id && "bg-white text-black hover:text-black"
        )}
      >
        {label}
        <span className={twMerge("text-[11px] font-medium", view === id ? "text-neutral-600" : "text-neutral-500")}>{badge}</span>
      </button>
    ))}
  </div>
);

const UploadModal = () => {
  const uploadModal = useUploadModal();
  const [view, setView] = useState<View>("file");
  const description = VIEWS.find(({ id }) => id === view)!.description;

  const onChange = (open: boolean) => {
    if (!open) {
      uploadModal.onClose();
    }
  };

  return (
    <Modal title="Add a song" description={description} isOpen={uploadModal.isOpen} onChange={onChange}>
      <ViewTabs view={view} onChange={setView} />
      {view === "file" ? <UploadFileForm onDone={uploadModal.onClose} /> : <TrackSearch />}
    </Modal>
  );
};

export default UploadModal;
