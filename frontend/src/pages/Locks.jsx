import DataTable from "../components/DataTable";
import usePropertyStore from "../store/PropertyStore";
import useAuthStore from "../store/AuthStore";
import useModalStore from "../store/ModalStore";
import { useAction } from "../hooks/useAction";
import { useList } from "../hooks/useList";
import { deleteLock as deleteLockApi, getAllLocks } from "../api/locks.service";

async function fetchLocks(propertyId) {
  const data = await getAllLocks(propertyId);
  return data.locks;
}

async function deleteLock(id) {
  const data = await deleteLockApi(id);
  return data.message;
}

const Locks = ({ onDashboard }) => {
  const activeProperty = usePropertyStore((state) => state.activeProperty);
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const openModal = useModalStore(({ openModal }) => openModal);

  const propertyId =
    role === "superadmin" ? activeProperty?.id : user?.property_id;

  const {
    data: locks = [],
    isLoading,
    isError,
  } = useList({
    key: "locks",
    propertyId,
    fn: () => fetchLocks(propertyId),
    token,
  });
  const { mutate, isPending } = useAction({
    key: "locks",
    fn: deleteLock,
    propertyId,
  });

  function handleDeleteLock(id) {
    if (window.confirm("Are you sure you want to delete the lock?")) {
      mutate(id);
    }
  }

  const columns = [
    { header: "Lock Id", accessor: "id" },
    { header: "Property Id", accessor: "property_id" },
    { header: "Serial No.", accessor: "serial_number" },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: (row) => openModal("locks", row),
      className: "text-blue-600",
    },
    {
      label: "Delete",
      onClick: (row) => handleDeleteLock(row.id),
      disabled: isPending,
      className: "text-red-600",
    },
  ];

  return (
    <DataTable
      title="Locks"
      data={locks}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      isError={isError}
      onAdd={!onDashboard ? () => openModal("locks") : undefined}
    />
  );
};

export default Locks;
