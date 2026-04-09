import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useModalStore from "../store/ModalStore";
import useAuthStore from "../store/AuthStore";
import DataTable from "../components/DataTable";
import { deleteProperty, getAllProperties } from "../api/property.service";

async function fetchProperties() {
  return await getAllProperties();
}

const Properties = () => {
  const { openModal } = useModalStore();
  const { token, role } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: properties = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProperties(),
    enabled: !!token,
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId) => {
      return await deleteProperty(propertyId);
    },
    onSuccess: (message) => {
      alert(message);
      queryClient.invalidateQueries(["properties"]);
    },
    onError(error) {
      alert("Error: " + error.response?.data?.message);
    },
  });

  const handleDeleteProperty = (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deletePropertyMutation.mutate(propertyId);
    }
  };

  if (isLoading) return <span>Loading properties...</span>;
  if (isError) return <span>Error loading properties</span>;

  const columns = [
    { header: "property Id", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Created At", accessor: "created_at" },
  ];

  const actions =
    role !== "staff"
      ? [
          {
            label: "Edit",
            onClick: (row) => openModal("properties", row),
            className: "text-blue-600",
          },
          {
            label: "Delete",
            onClick: (row) => handleDeleteProperty(row.id),
            className: "text-red-600",
            disabled: deletePropertyMutation.isPending,
          },
        ]
      : [];
  return (
    <DataTable
      title="Properties"
      data={properties}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      isError={isError}
      onAdd={role !== "staff" ? () => openModal("properties") : undefined}
    />
  );
};

export default Properties;
