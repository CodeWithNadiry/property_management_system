import { useActionState, useEffect, useState } from "react";
import { reservationSchema } from "../schemas/reservatin.schema";
import Input from "../components/Input";
import Button from "../components/Button";
import useModalStore from "../store/ModalStore";
import axios from "axios";
import usePropertyStore from "../store/PropertyStore";
import useAuthStore from "../store/AuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { createReservation, updateReservation } from "../api/reservations.service";

async function createReservationAction(
  prevState,
  formData,
  propertyId,
  isEdit,
  reservationId,
  queryClient,
  closeModal,
) {
  
  console.log("previous state:", prevState);
  const data = Object.fromEntries(formData);

  const result = reservationSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.issues.map((err) => err.message),
      enteredValues: data,
    };
  }

  try {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      room_id: Number(data.room_id),
      check_in: data.check_in,
      check_out: data.check_out,
    };

    console.log("property id:", propertyId);

    if (isEdit) {
      await updateReservation(reservationId, payload, propertyId)
    } else {
      await createReservation(payload, propertyId)
    }

    queryClient.invalidateQueries(["reservations"]);
    closeModal();

    return { errors: null, enteredValues: {} };
  } catch (error) {
    console.log("Error:", error);
    return {
      errors: error,
      enteredValues: data,
    };
  }
}

const ReservationForm = ({ data }) => {
  const { closeModal } = useModalStore();
  const { activeProperty } = usePropertyStore();
  const { user, role } = useAuthStore();
  const queryClient = useQueryClient();

  const propertyId =
    role === "superadmin" ? activeProperty?.id : user?.property_id;

  const isEdit = !!data;

  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const [formState, formAction] = useActionState(
    (prevState, formData) =>
      createReservationAction(
        prevState,
        formData,
        propertyId,
        isEdit,
        data?.id,
        queryClient,
        closeModal,
      ),
    {
      errors: null,
      enteredValues: {},
    },
  );

  async function handleCheckAvailability(e) {
    e.preventDefault();

    const formData = new FormData(e.target.form);
    const values = Object.fromEntries(formData);

    if (!values.check_in || !values.check_out) {
      alert("Please select check-in and check-out dates");
      return;
    }

    try {
      setLoadingRooms(true);

      const res = await axios.get("http://localhost:5000/rooms/available", {
        params: {
          check_in: values.check_in,
          check_out: values.check_out,
          property_id: propertyId,
        },
      });

      setAvailableRooms(res.data.availableRooms);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRooms(false);
    }
  }

  useEffect(() => {
    if (data?.room_id) {
      setSelectedRoomId(String(data.room_id));
    }
  }, [data]);
  return (
    <form action={formAction} className="space-y-4">
      <h2 className="text-xl font-bold text-center">
        {isEdit ? "Update Reservation" : "Create Reservation"}
      </h2>

      {formState.errors && (
        <ul className="text-red-500">
          {formState.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}

      <Input
        label="Guest Name"
        type="text"
        name="name"
        defaultValue={formState.enteredValues?.name ?? data?.name ?? ""}
        placeholder="Enter guest name"
      />

      <Input
        label="Email"
        type="email"
        name="email"
        defaultValue={formState.enteredValues?.email ?? data?.email ?? ""}
        placeholder="Enter email"
      />

      <Input
        label="Phone"
        type="text"
        name="phone"
        defaultValue={formState.enteredValues?.phone ?? data?.phone ?? ""}
        placeholder="Enter phone"
      />

      <Input
        label="Check-in Date"
        type="date"
        name="check_in"
        defaultValue={
          formState.enteredValues?.check_in ??
          (data?.check_in ? data.check_in.split("T")[0] : "") ??
          ""
        }
      />

      <Input
        label="Check-out Date"
        type="date"
        name="check_out"
        defaultValue={
          formState.enteredValues?.check_out ??
          (data?.check_out ? data.check_out.split("T")[0] : "") ??
          ""
        }
      />

      <Button type="button" onClick={handleCheckAvailability}>
        Check Availability
      </Button>

      {loadingRooms && <p>Loading available rooms...</p>}

      {availableRooms.length > 0 && (
        <div className="flex flex-col gap-2">
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="cursor-pointer"
          >
            <option value="">Select a room</option>

            {availableRooms.map((room) => (
              <option key={room.id} value={room.id}>
                {`Room ${room.room_number} | Floor ${room.floor} | ${room.UnitGroup?.type} | Rs ${room.UnitGroup?.price_per_night}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <input type="hidden" name="room_id" value={selectedRoomId} />

      <div className="flex gap-4">
        <Button type="submit" disabled={!selectedRoomId}>
          {isEdit ? "Update Reservation" : "Create Reservation"}
        </Button>

        <Button type="button" variant="danger" onClick={closeModal}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ReservationForm;
