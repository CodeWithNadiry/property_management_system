import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../components/DataTable";
import useModalStore from "../store/ModalStore";
import usePropertyStore from "../store/PropertyStore";
import useAuthStore from "../store/AuthStore";
import { deleteUser, getAllUsers } from "../api/users.service";

const Users = ({ onDashboard }) => {
  const { openModal } = useModalStore();
  const { activeProperty } = usePropertyStore();
  const queryClient = useQueryClient();

  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore(({ user }) => user);
  const propertyId =
    role === "superadmin" ? activeProperty?.id : user?.property_id;

  const isAdmin = role === "admin" || role === "superadmin";

  const fetchUsers = async () => {
    if (!token || !propertyId) return [];
    return await getAllUsers(propertyId);
  };

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", propertyId],
    queryFn: fetchUsers,
    enabled: !!token && !!propertyId, // “Run query ONLY if BOTH token and propertyId exist”
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      return await deleteUser(userId);
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries(["users", propertyId]);
      if (message) {
        alert(message);
      }
    },
    onError: (err) => {
      console.log(err.response?.data?.message);
    },
  });

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const formattedUsers = users.map((u) => ({
    ...u,
    is_active: u.is_active ? "Active" : "Inactive",
  }));

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "is_active" },
  ];

  const actions = isAdmin
    ? [
        {
          label: "Edit",
          onClick: (user) => openModal("users", user),
          className: "text-blue-600",
        },
        {
          label: deleteUserMutation.isPending ? "Deleting..." : "Delete",
          onClick: (user) => handleDeleteUser(user.id),
          className: "text-red-600",
          disabled: deleteUserMutation.isPending,
        },
      ]
    : [];

  return (
    <DataTable
      title="Users"
      data={formattedUsers}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      isError={isError}
      onAdd={isAdmin && !onDashboard ? () => openModal("users") : undefined}
    />
  );
};

export default Users;
