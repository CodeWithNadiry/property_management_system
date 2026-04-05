import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useModalStore from "../store/ModalStore";
import useAuthStore from "../store/AuthStore";
import DataTable from "../components/DataTable";

async function fetchProperties(token) {
  const response = await axios.get("http://localhost:5000/properties", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.properties;
}

const Properties = () => {
  const { openModal } = useModalStore();
  const { token, role } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading, isError } = useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProperties(token),
    enabled: !!token,
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId) => {
      await axios.delete(`http://localhost:5000/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
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
    {header: 'property Id', accessor: 'id'},
    {header: 'Name', accessor: 'name'},
    {header: 'Created At', accessor: 'created_at'}
  ]

  const actions = role !== 'staff' ? [
    {
      label: 'Edit', onClick: (row) => openModal('properties', row), className: 'text-blue-600'
    },
    {
      label: 'Delete', onClick: (row) => handleDeleteProperty(row.id), className: 'text-red-600', disabled: deletePropertyMutation.isPending
    }
  ]: [

  ]
  return (
    <DataTable title='Properties' data={properties} columns={columns} actions={actions} isLoading={isLoading} isError={isError} onAdd={role !== 'staff' ? () => openModal('properties'): undefined} />
  );
};

export default Properties;