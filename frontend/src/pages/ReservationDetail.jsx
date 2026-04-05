import { useParams, Link } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import usePropertyStore from "../store/PropertyStore";
import {
  MdEmail,
  MdPhone,
  MdCalendarToday,
  MdTag,
  MdAccessTime,
  MdCheckCircle,
  MdArrowForward,
} from "react-icons/md";
import { formattedDate } from "../utils/formattedDate";
import { formattedPrice } from "../utils/formattedPrice";
import useModalStore from "../store/ModalStore";

const BASE_URL = "http://localhost:5000";

async function fetchReservation(id, token, propertyId) {
  const res = await axios.get(`${BASE_URL}/reservations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { property_id: propertyId },
  });
  return res.data.reservation;
}

async function cancelReservationApi(id, token) {
  const res = await axios.patch(
    `${BASE_URL}/reservations/${id}/cancel`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
}

async function checkInApi(id, token) {
  const res = await axios.post(
    `${BASE_URL}/reservations/front_desk_check_in`,
    { reservation_id: id },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data; // <-- important: return data for onSuccess
}

async function checkOutApi(id, token) {
  const res = await axios.post(
    `${BASE_URL}/reservations/${id}/check_out`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
}

async function noShowApi(id, token) {
  const res = await axios.post(
    `${BASE_URL}/reservations/${id}/noshow`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
}

function nightsBetween(checkIn, checkOut) {
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

const statusStyles = {
  pending: "bg-orange-100 text-orange-700",
  confirmed: "bg-green-100 text-green-700",
  checked_in: "bg-yellow-100 text-yellow-700",
  checked_out: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-600",
  noshow: "bg-gray-100 text-gray-600",
};

const statusLabel = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
  noshow: "No Show",
};

function ReservationDetail() {
  const { id } = useParams();
  const { role, token, user } = useAuthStore();
  const { activeProperty } = usePropertyStore();
  const { openModal } = useModalStore();
  const queryClient = useQueryClient();

  const propertyId = role === "staff" ? user?.property_id : activeProperty?.id;

  const basePath =
    role === "superadmin"
      ? "/super-admin/reservations"
      : role === "admin"
        ? "/admin/reservations"
        : "/reservations";

  const {
    data: r,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reservations", id],
    queryFn: () => fetchReservation(id, token, propertyId),
    enabled: !!token && !!propertyId,
  });

  const { mutate: cancelMutate, isPending: isCancelling } = useMutation({
    mutationFn: () => cancelReservationApi(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["reservations", id] });
    },
    onError(error) {
      alert(`Error: ${error?.response?.data?.message || error.message}`)
    }
  });

  const { mutate: checkInMutate, isLoading: isCheckingIn } = useMutation({
    mutationFn: () => checkInApi(id, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["reservations", id]);
      alert(`✅ Guest checked in successfully!\nPasscode: ${data.passcode}`);
    },
    onError: (error) => {
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    },
  });

  const { mutate: checkOutMutate, isPending: isCheckingOut } = useMutation({
    mutationFn: () => checkOutApi(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["reservations", id] });
    },
  });

  const { mutate: noShowMutate } = useMutation({
    mutationFn: () => noShowApi(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["reservations", propertyId]);
      queryClient.invalidateQueries(["reservations", id]);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-(--dark-blue) rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !r) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <p className="text-red-500 font-semibold">
          Failed to load reservation.
        </p>
        <Link
          to={basePath}
          className="text-sm text-(--dark-blue) hover:underline"
        >
          Back to Reservations
        </Link>
      </div>
    );
  }

  const nights = nightsBetween(r.check_in, r.check_out);
  const ratePerNight = parseFloat(r.total_price) / nights;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h2 className="font-bold text-2xl md:text-3xl text-(--dark-blue)">
            Reservation Details
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <Link to={basePath} className="text-(--dark-gray) hover:underline">
              Reservations
            </Link>
            <span className="text-(--dark-gray)">/</span>
            <span className="text-(--dark-blue) font-medium">
              Reservation #{id}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyles[r.status] ?? "bg-gray-100 text-gray-600"}`}
          >
            <MdCheckCircle size={13} />
            {statusLabel[r.status] ?? r.status}
          </span>

          {(r.status === "pending" || r.status === "confirmed") && (
            <button
              onClick={() => checkInMutate()}
              disabled={isCheckingIn}
              className="text-sm px-4 py-2 rounded-lg border border-green-400 text-green-700 hover:bg-green-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingIn ? "Checking in..." : "Check In"}
            </button>
          )}


          {/* {r.status === "pending" && (
            <button
              onClick={() => cancelMutate()}
              className="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )} */}

          {r.status === "confirmed" && (
            <>
              <button
                onClick={() => openModal("reservations", r)}
                className="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => cancelMutate()}
                disabled={isCancelling}
                className="text-sm px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? "Cancelling..." : "Cancel"}
              </button>
              <button
                onClick={() => noShowMutate()}
                className="text-sm px-4 py-2 rounded-lg border border-red-300 text-gray-700 hover:bg-red-50 transition-colors cursor-pointer"
              >
                No Show
              </button>
            </>
          )}

          {r.status === "checked_in" && (
            <button
              onClick={() => checkOutMutate()}
              disabled={isCheckingOut}
              className="text-sm px-4 py-2 rounded-lg border border-yellow-400 text-yellow-700 hover:bg-yellow-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? "Checking out..." : "Check Out"}
            </button>
          )}
        </div>
      </div>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guest Information */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
          <h3 className="text-xs font-semibold text-(--dark-gray) uppercase tracking-wider">
            Guest Information
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-100 text-(--dark-blue) font-semibold text-base flex items-center justify-center shrink-0">
              {r.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-(--dark-blue) text-sm">
                {r.name}
              </p>
              <p className="text-xs text-(--dark-gray)">Guest</p>
            </div>
          </div>
          <hr className="border-gray-100" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm">
              <MdEmail size={15} className="text-(--dark-gray) shrink-0" />
              <span className="text-(--dark-gray)">Email</span>
              <span className="ml-auto text-(--dark-blue) font-medium truncate">
                {r.email}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MdPhone size={15} className="text-(--dark-gray) shrink-0" />
              <span className="text-(--dark-gray)">Phone</span>
              <span className="ml-auto text-(--dark-blue) font-medium">
                {r.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Stay Details */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
          <h3 className="text-xs font-semibold text-(--dark-gray) uppercase tracking-wider">
            Stay Details
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-(--dark-gray) mb-1">Check-in</p>
              <p className="text-sm font-semibold text-(--dark-blue)">
                {formattedDate(r.check_in)}
              </p>
            </div>
            <MdArrowForward size={16} className="text-(--dark-gray) shrink-0" />
            <div className="flex-1 bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-(--dark-gray) mb-1">Check-out</p>
              <p className="text-sm font-semibold text-(--dark-blue)">
                {formattedDate(r.check_out)}
              </p>
            </div>
          </div>
          <hr className="border-gray-100" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-(--dark-gray)">
                <MdCalendarToday size={14} />
                <span>Duration</span>
              </div>
              <span className="font-semibold text-(--dark-blue)">
                {nights} nights
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-(--dark-gray)">
                <MdTag size={14} />
                <span>Room</span>
              </div>
              <span className="font-semibold text-(--dark-blue)">
                Room #{r.room_id}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-(--dark-gray)">
                <MdTag size={14} />
                <span>Property</span>
              </div>
              <span className="font-semibold text-(--dark-blue)">
                Property #{r.property_id}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
          <h3 className="text-xs font-semibold text-(--dark-gray) uppercase tracking-wider">
            Payment Summary
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-(--dark-gray)">Rate per night</span>
              <span className="text-(--dark-blue)">
                {formattedPrice.format(ratePerNight)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-(--dark-gray)">Nights</span>
              <span className="text-(--dark-blue)">{nights}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-(--dark-blue)">
                Total
              </span>
              <span className="text-lg font-bold text-(--dark-blue)">
                {formattedPrice.format(parseFloat(r.total_price))}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Metadata */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
          <h3 className="text-xs font-semibold text-(--dark-gray) uppercase tracking-wider">
            Booking Metadata
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2 text-(--dark-gray)">
                <MdTag size={14} />
                <span>Reservation ID</span>
              </div>
              <span className="font-semibold text-(--dark-blue)">#{r.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2 text-(--dark-gray)">
                <MdAccessTime size={14} />
                <span>Created on</span>
              </div>
              <span className="font-semibold text-(--dark-blue)">
                {formattedDate(r.created_at)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-(--dark-gray)">
                <MdCheckCircle size={14} />
                <span>Status</span>
              </div>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[r.status] ?? "bg-gray-100 text-gray-600"}`}
              >
                {statusLabel[r.status] ?? r.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationDetail;
