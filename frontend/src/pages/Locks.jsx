import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DataTable from "../components/DataTable";
import usePropertyStore from "../store/PropertyStore";
import useAuthStore from "../store/AuthStore";
import axios from "axios";
import useModalStore from "../store/ModalStore";

async function fetchLocks(token, propertyId) {
  const res = await axios.get("http://localhost:5000/locks", {
    headers: { Authorization: `Bearer ${token}` },
    params: { property_id: propertyId },
  });

  return res.data.locks;
}

async function deleteLock(lockId, token) {
  console.log("Lock id:", lockId);
  console.log("token:", token);

  await axios.delete(`http://localhost:5000/locks/${lockId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

const Locks = ({ onDashboard }) => {
  const activeProperty = usePropertyStore((state) => state.activeProperty);
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const openModal = useModalStore(({ openModal }) => openModal);

  const queryClient = useQueryClient();

  const propertyId =
    role === "superadmin"
      ? activeProperty?.id
      : user?.property_id;

  const {
    data: locks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["locks", propertyId],
    queryFn: () => fetchLocks(token, propertyId),
    enabled: !!token && !!propertyId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ lockId, token }) => deleteLock(lockId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["locks", propertyId]);
    },
    onError: (err) => console.log(err),
  });

  function handleDeleteLock(lockId) {
    if (window.confirm("Are you sure you want to delete the lock?")) {
      mutate({ lockId, token });
    }
  }

  const columns = [
    { header: "Lock Id", accessor: "id" },
    { header: "Property Id", accessor: "property_id" },
    { header: "Serial No.", accessor: "serial_number" },
  ];

  const actions =[
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
        ]

  return (
    <DataTable
      title="Locks"
      data={locks}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      isError={isError}
      onAdd={
        !onDashboard
          ? () => openModal("locks")
          : undefined
      }
    />
  );
};

export default Locks;