import {
  LuLayoutDashboard,
  LuBuilding,
  LuDoorOpen,
  LuLock,
  LuUsers,
  LuCalendarCheck,
  LuLink,
} from "react-icons/lu";
import BaseLayout from "./BaseLayout";
import ModalManager from "../components/ModalManager";
import useAuthStore from "../store/AuthStore";

const links = [
  { label: "Dashboard", to: "dashboard", icon: LuLayoutDashboard },
  { label: "Reservations", to: "reservations", icon: LuCalendarCheck },
  { label: "Properties", to: "properties", icon: LuBuilding },
  { label: "Rooms", to: "rooms", icon: LuDoorOpen },
  { label: "Locks", to: "locks", icon: LuLock },
  { label: "Users", to: "users", icon: LuUsers },
  { label: "Connections", to: "connections", icon: LuLink },
];

const AdminLayout = () => {
  const { role } = useAuthStore();

  const filteredLinks =
    role === "admin"
      ? links.filter((link) => link.label !== "Properties")
      : links;

  return (
    <>
      <BaseLayout links={filteredLinks} />
      <ModalManager />
    </>
  );
};

export default AdminLayout;
