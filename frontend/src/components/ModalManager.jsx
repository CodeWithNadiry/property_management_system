import Modal from "./Modal";
import useModalStore from "../store/ModalStore";

import UserForm from "../forms/UserForm";
import PropertyForm from "../forms/PropertyForm";
import RoomForm from "../forms/RoomForm";
import LockForm from "../forms/LockForm";
import RoomLockForm from "../forms/RoomLockForm";
import ReservationForm from "../forms/ReservationForm";

const ModalManager = () => {
  const { modalType, modalData, closeModal } = useModalStore();

  if (!modalType) return null;

  let content = null;

  switch (modalType) {
    case "users":
      content = <UserForm data={modalData} />;
      break;

    case "properties":
      content = <PropertyForm data={modalData} />;
      break;

    case "rooms":
      content = <RoomForm data={modalData} />;
      break;

    case "locks":
      content = <LockForm data={modalData} />;
      break;

    case "connections":
      content = <RoomLockForm data={modalData} />;
      break;

    case 'reservations':
      content = <ReservationForm data={modalData} />;
      break;

    default:
      content = null;
  }

  return (
    <Modal open={!!modalType} closeModal={closeModal}>
      {content}
    </Modal>
  );
};

export default ModalManager;
