import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import DataTable from "../components/DataTable";
import useModalStore from "../store/ModalStore";
import useAuthStore from "../store/AuthStore";
import usePropertyStore from "../store/PropertyStore";

const Rooms = ({ onDashboard }) => {
  const { openModal } = useModalStore();
  const { activeProperty } = usePropertyStore();
  const queryClient = useQueryClient();

  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore(({ user }) => user);
  const propertyId =
    role === "superadmin" ? activeProperty?.id : user?.property_id;

  // Fetch rooms
  const fetchRooms = async () => {
    if (!token || !propertyId) return [];
    const res = await axios.get("http://localhost:5000/rooms", {
      headers: { Authorization: `Bearer ${token}` },
      params: { property_id: propertyId },
    });
    return res.data.rooms;
  };

  const {
    data: rooms = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rooms", propertyId],
    queryFn: fetchRooms,
    enabled: !!token && !!propertyId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:5000/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["rooms", propertyId]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      mutate(id);
    }
  };

  // Table columns
  const columns = [
    { header: 'Room ID', accessor: 'id'},
    { header: "Property ID", accessor: "property_id" },
    { header: "Room No.", accessor: "room_number" },
    { header: "Floor", accessor: "floor" },
  ];

  // Table actions
  const actions = [
          {
            label: "Edit",
            onClick: (row) => openModal("rooms", row),
            className: "text-blue-600",
          },
          {
            label: isPending ? "Deleting..." : "Delete",
            onClick: (row) => handleDelete(row.id),
            className: "text-red-600",
            disabled: isPending,
          },
        ]

  return (
    <DataTable
      title="Rooms"
      data={rooms}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      isError={isError}
      onAdd={!onDashboard ? () => openModal("rooms") : undefined}
    />
  );
};

export default Rooms;
