import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../store/AuthStore";
import usePropertyStore from "../store/PropertyStore";
import useModalStore from "../store/ModalStore";
import { formattedPrice } from "../utils/formattedPrice";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import { formattedDate } from "../utils/formattedDate";
import { getAllReservations } from "../api/reservations.service";

async function fetchReservations( propertyId) {
  if (!propertyId) return [];
  return await getAllReservations(propertyId)
}

const Reservations = () => {
  const navigate = useNavigate();
  const { activeProperty } = usePropertyStore();
  const { token, role, user } = useAuthStore();
  const openModal = useModalStore((state) => state.openModal);
  const propertyId = role === "staff" ? user?.property_id : activeProperty?.id;

  const {
    data: reservations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reservations", propertyId],
    queryFn: () => fetchReservations(propertyId),
    enabled: !!token && !!propertyId,
  });

  const reservation = reservations[0];

  console.log("Reservation data:", reservation);
  const columns = [
    { header: "Reservation ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    {header: 'Check in', accessor: 'check_in'},
    {header: 'Check Out', accessor: 'check_out'},
    { header: "Status", accessor: "status" },
    { header: "Amount", accessor: "total_price" },
  ];

  const actions = [
    {
      label: "View Details",
      onClick: (row) => navigate(`${row.id}`),
      className: "text-blue-500",
    },
  ];

  return (
    <DataTable
      title="Reservations"
      data={reservations.map((r) => ({
        ...r,
        status: r.status.replace("_", " "),
        check_in: formattedDate(r.check_in),
        check_out: formattedDate(r.check_out),
        total_price: formattedPrice.format(r.total_price),
      }))}
      columns={columns}
      actions={actions}
      isLoading={isLoading}
      isError={isError}
      onAdd={() => openModal("reservations")}
      />
    );
  };
  
  export default Reservations;
  
  // resulting array: 
  // with this ::: data={reservations.map((r) => ({
  //       ...r,
  //       status: r.status.replace("_", " "),
  //       total_price: formattedPrice.format(r.total_price),
  //     }))}

  
  // [
  // { id: 1, name: "John Doe", status: "checked in", total_price: "$1,000.00" },
  // { id: 2, name: "Jane Smith", status: "pending payment", total_price: "$500.00" }
  // ]