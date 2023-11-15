import { create } from "zustand";

interface EditProfileModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  fetchUser: () => void;
}

const useEditProfileModal = create<EditProfileModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  fetchUser: () => {}
}));

export default useEditProfileModal;
