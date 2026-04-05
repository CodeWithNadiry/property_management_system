import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
const Modal = ({ open, children, closeModal }) => {
  const dialogRef = useRef();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);
  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={closeModal}
      className="m-auto p-0 backdrop:bg-black/60 backdrop:blur-sm rounded-2xl  border-white/10 shadow-2xl w-full max-w-md"
    >
      <div className="p-6">{children}</div>
    </dialog>,
    document.getElementById("modal"),
  );
};

export default Modal;
