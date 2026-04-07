import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../components/DataTable";
import useAuthStore from "../store/AuthStore";
import useModalStore from "../store/ModalStore";
import usePropertyStore from "../store/PropertyStore";
import { deleteConnection, getAllConnections } from "../api/connection.service";
const Connections = () => {
  console.log('connections.jsx is running')
  const { token, role, user } = useAuthStore();
  const { openModal } = useModalStore();
  const queryClient = useQueryClient();
  const { activeProperty } = usePropertyStore();

  const propertyId =
    role === "superadmin" ? activeProperty?.id : user?.property_id;

  // Fetch room-lock connections
  const fetchConnections = async () => {
    if (!token || !propertyId) return [];
    return await getAllConnections(propertyId)
  };

  const {
    data: connections = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["roomLocks", propertyId],
    queryFn: fetchConnections,
    enabled: !!token && !!propertyId,
  });

  // Mutation to unassign a lock
  const unassignMutation = useMutation({
    mutationFn: async (lockId) => {
     return await deleteConnection(lockId)
    },
    onSuccess: () => queryClient.invalidateQueries(["roomLocks", propertyId]),
  });

  const handleUnassign = (lockId) => {
    if (window.confirm("Are you sure you want to unassign this lock?")) {
      unassignMutation.mutate(lockId);
    }
  };

  // Columns for DataTable
  const columns = [
    { header: "Room ID", accessor: "room_id" },
    { header: "Lock ID", accessor: "lock_id" },
    { header: "Property ID", accessor: "property_id" },
  ];

  // Actions for DataTable
  const actions = [
    {
      label: "Edit",
      onClick: (row) => openModal("connections", row),
      className: "text-blue-600",
    },
    {
      label: "Unassign",
      onClick: (row) => handleUnassign(row.lock_id),
      disabled: unassignMutation.isPending,
      className: "text-red-600",
    },
  ];

  return (
    <DataTable
      title="Room-Lock Connections"
      data={connections}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      isError={isError}
      onAdd={() => openModal("connections")}
    />
  );
};

export default Connections;
