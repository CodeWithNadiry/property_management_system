import {
  LuCalendarCheck,
  LuDoorOpen,
  LuLayoutDashboard,
  LuLink,
  LuLock,
} from "react-icons/lu";
import BaseLayout from "./BaseLayout";
import ModalManager from "../components/ModalManager";

const links = [
  { label: "Dashboard", to: "dashboard", icon: LuLayoutDashboard },
  { label: "Reservations", to: "reservations", icon: LuCalendarCheck },
  { label: "Rooms", to: "rooms", icon: LuDoorOpen },
  { label: "Locks", to: "locks", icon: LuLock },
  { label: "Connections", to: "connections", icon: LuLink },
];
const StaffLayout = () => {
  return (
    <>
      <BaseLayout links={links} />
      <ModalManager />
    </>
  );
};

export default StaffLayout;
