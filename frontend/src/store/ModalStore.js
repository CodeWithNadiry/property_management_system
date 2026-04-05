import { create } from "zustand";

const useModalStore = create((set) => ({
  modalType: null,
  modalData: null,

  openModal: (type, data = null) => {
    set({
      modalType: type,
      modalData: data,
    });
  },

  closeModal: () => {
    set({
      modalType: null,
      modalData: null,
    });
  },
}));

export default useModalStore;